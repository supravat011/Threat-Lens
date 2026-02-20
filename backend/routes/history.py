from flask import Blueprint, request, jsonify
from models.scan import ScanHistory
from utils.security import token_required

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
@token_required
def get_history(current_user_id):
    """Get scan history for current user with optional filters"""
    # Get query parameters
    scan_type = request.args.get('type')  # url, file, log
    risk_level = request.args.get('risk_level')  # safe, suspicious, malicious
    limit = request.args.get('limit', 50, type=int)
    
    # Build query
    query = ScanHistory.query.filter_by(user_id=current_user_id)
    
    # Apply filters
    if scan_type:
        query = query.filter_by(scan_type=scan_type)
    
    if risk_level:
        query = query.filter_by(risk_level=risk_level)
    
    # Get results
    history = query.order_by(ScanHistory.timestamp.desc()).limit(limit).all()
    
    return jsonify({
        'history': [item.to_dict() for item in history],
        'total': len(history)
    }), 200

@history_bp.route('/<int:history_id>', methods=['GET'])
@token_required
def get_history_item(current_user_id, history_id):
    """Get specific history item"""
    item = ScanHistory.query.filter_by(id=history_id, user_id=current_user_id).first()
    
    if item:
        return jsonify({'history': item.to_dict()}), 200
    else:
        return jsonify({'error': 'History item not found'}), 404
