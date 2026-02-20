from flask import Blueprint, request, jsonify
from services.url_scanner import URLScanner
from services.file_scanner import FileScanner
from services.log_analyzer import LogAnalyzer
from utils.security import token_required

scan_bp = Blueprint('scan', __name__, url_prefix='/api/scan')

@scan_bp.route('/url', methods=['POST'])
@token_required
def scan_url(current_user_id):
    """Scan a URL for threats"""
    data = request.get_json()
    
    # Validate required fields
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing required field: url'}), 400
    
    url = data['url'].strip()
    
    # Scan URL
    success, message, scan_result = URLScanner.scan_url(current_user_id, url)
    
    if success:
        return jsonify({
            'message': message,
            'scan': scan_result
        }), 200
    else:
        return jsonify({'error': message}), 400

@scan_bp.route('/url/<int:scan_id>', methods=['GET'])
@token_required
def get_url_scan(current_user_id, scan_id):
    """Get specific URL scan details"""
    scan = URLScanner.get_scan_by_id(scan_id, current_user_id)
    
    if scan:
        return jsonify({'scan': scan}), 200
    else:
        return jsonify({'error': 'Scan not found'}), 404

@scan_bp.route('/file', methods=['POST'])
@token_required
def scan_file(current_user_id):
    """Upload and scan a file for malware"""
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Scan file
    success, message, scan_result = FileScanner.scan_file(current_user_id, file)
    
    if success:
        return jsonify({
            'message': message,
            'scan': scan_result
        }), 200
    else:
        return jsonify({'error': message}), 400

@scan_bp.route('/file/<int:scan_id>', methods=['GET'])
@token_required
def get_file_scan(current_user_id, scan_id):
    """Get specific file scan details"""
    scan = FileScanner.get_scan_by_id(scan_id, current_user_id)
    
    if scan:
        return jsonify({'scan': scan}), 200
    else:
        return jsonify({'error': 'Scan not found'}), 404

@scan_bp.route('/log', methods=['POST'])
@token_required
def analyze_log(current_user_id):
    """Upload and analyze a log file"""
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({'error': 'No log file provided'}), 400
    
    file = request.files['file']
    
    # Analyze log
    success, message, analysis_result = LogAnalyzer.analyze_log(current_user_id, file)
    
    if success:
        return jsonify({
            'message': message,
            'analysis': analysis_result
        }), 200
    else:
        return jsonify({'error': message}), 400

@scan_bp.route('/log/<int:analysis_id>', methods=['GET'])
@token_required
def get_log_analysis(current_user_id, analysis_id):
    """Get specific log analysis details"""
    analysis = LogAnalyzer.get_analysis_by_id(analysis_id, current_user_id)
    
    if analysis:
        return jsonify({'analysis': analysis}), 200
    else:
        return jsonify({'error': 'Analysis not found'}), 404
