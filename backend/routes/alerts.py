from flask import Blueprint, request, jsonify
from models import db
from models.alert import Alert
from utils.security import token_required

alerts_bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

@alerts_bp.route('', methods=['GET'])
@token_required
def get_alerts(current_user_id):
    """Get alerts for current user with optional filters"""
    # Get query parameters
    unread_only = request.args.get('unread', 'false').lower() == 'true'
    severity = request.args.get('severity')  # critical, medium, low
    limit = request.args.get('limit', 50, type=int)
    
    # Build query
    query = Alert.query.filter_by(user_id=current_user_id)
    
    # Apply filters
    if unread_only:
        query = query.filter_by(is_read=False)
    
    if severity:
        query = query.filter_by(severity=severity)
    
    # Get results
    alerts = query.order_by(Alert.created_at.desc()).limit(limit).all()
    
    return jsonify({
        'alerts': [alert.to_dict() for alert in alerts],
        'total': len(alerts),
        'unread_count': sum(1 for a in alerts if not a.is_read)
    }), 200

@alerts_bp.route('/<int:alert_id>', methods=['GET'])
@token_required
def get_alert(current_user_id, alert_id):
    """Get specific alert"""
    alert = Alert.query.filter_by(id=alert_id, user_id=current_user_id).first()
    
    if alert:
        return jsonify({'alert': alert.to_dict()}), 200
    else:
        return jsonify({'error': 'Alert not found'}), 404

@alerts_bp.route('/<int:alert_id>/read', methods=['PUT'])
@token_required
def mark_alert_read(current_user_id, alert_id):
    """Mark alert as read"""
    alert = Alert.query.filter_by(id=alert_id, user_id=current_user_id).first()
    
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    alert.is_read = True
    db.session.commit()
    
    return jsonify({
        'message': 'Alert marked as read',
        'alert': alert.to_dict()
    }), 200

@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
@token_required
def delete_alert(current_user_id, alert_id):
    """Delete an alert"""
    alert = Alert.query.filter_by(id=alert_id, user_id=current_user_id).first()
    
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    db.session.delete(alert)
    db.session.commit()
    
    return jsonify({'message': 'Alert deleted successfully'}), 200

@alerts_bp.route('/mark-all-read', methods=['PUT'])
@token_required
def mark_all_read(current_user_id):
    """Mark all alerts as read for current user"""
    Alert.query.filter_by(user_id=current_user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    
    return jsonify({'message': 'All alerts marked as read'}), 200
