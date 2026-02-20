from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from utils.security import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields: username, email, password'}), 400
    
    username = data['username'].strip()
    email = data['email'].strip()
    password = data['password']
    
    # Register user
    success, message, user_dict = AuthService.register_user(username, email, password)
    
    if success:
        return jsonify({
            'message': message,
            'user': user_dict
        }), 201
    else:
        return jsonify({'error': message}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    data = request.get_json()
    
    # Validate required fields
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing required fields: email, password'}), 400
    
    email = data['email'].strip()
    password = data['password']
    
    # Authenticate user
    success, message, token, user_dict = AuthService.login_user(email, password)
    
    if success:
        return jsonify({
            'message': message,
            'token': token,
            'user': user_dict
        }), 200
    else:
        return jsonify({'error': message}), 401

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    """Get current user profile"""
    user_dict = AuthService.get_user_by_id(current_user_id)
    
    if user_dict:
        return jsonify({'user': user_dict}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    """Update user profile"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Extract allowed fields
    update_fields = {}
    if 'username' in data:
        update_fields['username'] = data['username'].strip()
    if 'email' in data:
        update_fields['email'] = data['email'].strip()
    
    if not update_fields:
        return jsonify({'error': 'No valid fields to update'}), 400
    
    # Update profile
    success, message, user_dict = AuthService.update_user_profile(current_user_id, **update_fields)
    
    if success:
        return jsonify({
            'message': message,
            'user': user_dict
        }), 200
    else:
        return jsonify({'error': message}), 400

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user_id):
    """Logout user (client-side token removal)"""
    # In a stateless JWT system, logout is handled client-side by removing the token
    # For server-side logout, you would need to implement token blacklisting
    return jsonify({'message': 'Logout successful'}), 200
