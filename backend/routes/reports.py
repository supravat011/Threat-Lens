from flask import Blueprint, request, jsonify
from services.report_generator import ReportGenerator
from utils.security import token_required

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('', methods=['GET'])
@token_required
def get_reports(current_user_id):
    """Get all reports for current user"""
    limit = request.args.get('limit', 20, type=int)
    
    reports = ReportGenerator.get_user_reports(current_user_id, limit)
    
    return jsonify({
        'reports': reports,
        'total': len(reports)
    }), 200

@reports_bp.route('/generate', methods=['POST'])
@token_required
def generate_report(current_user_id):
    """Generate a new report"""
    data = request.get_json() or {}
    
    # Get parameters
    report_type = data.get('report_type', 'summary')  # summary or detailed
    days = data.get('days', 7)  # Number of days to include
    
    # Validate parameters
    if report_type not in ['summary', 'detailed']:
        return jsonify({'error': 'Invalid report_type. Must be "summary" or "detailed"'}), 400
    
    if not isinstance(days, int) or days < 1 or days > 365:
        return jsonify({'error': 'Invalid days. Must be between 1 and 365'}), 400
    
    # Generate report
    success, message, report_dict = ReportGenerator.generate_report(current_user_id, report_type, days)
    
    if success:
        return jsonify({
            'message': message,
            'report': report_dict
        }), 201
    else:
        return jsonify({'error': message}), 400

@reports_bp.route('/<int:report_id>', methods=['GET'])
@token_required
def get_report(current_user_id, report_id):
    """Get specific report"""
    report = ReportGenerator.get_report_by_id(report_id, current_user_id)
    
    if report:
        return jsonify({'report': report}), 200
    else:
        return jsonify({'error': 'Report not found'}), 404

@reports_bp.route('/<int:report_id>/download', methods=['GET'])
@token_required
def download_report(current_user_id, report_id):
    """Download report as JSON"""
    report = ReportGenerator.get_report_by_id(report_id, current_user_id)
    
    if report:
        # Return report data with download headers
        from flask import make_response
        import json
        
        response = make_response(json.dumps(report, indent=2))
        response.headers['Content-Type'] = 'application/json'
        response.headers['Content-Disposition'] = f'attachment; filename=report_{report_id}.json'
        
        return response
    else:
        return jsonify({'error': 'Report not found'}), 404
