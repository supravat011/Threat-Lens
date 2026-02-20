import jwt
from datetime import datetime, timedelta
from models import db
from models.user import User
from utils.validators import validate_email, validate_password
from config import Config

class AuthService:
    """Authentication service for user management"""
    
    @staticmethod
    def register_user(username, email, password):
        """
        Register a new user
        
        Returns:
            tuple: (success, message, user_dict or None)
        """
        # Validate email
        if not validate_email(email):
            return False, "Invalid email format", None
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return False, message, None
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return False, "Username already exists", None
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return False, "Email already exists", None
        
        # Create new user
        try:
            user = User(username=username, email=email)
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            return True, "User registered successfully", user.to_dict()
        except Exception as e:
            db.session.rollback()
            return False, f"Registration failed: {str(e)}", None
    
    @staticmethod
    def login_user(email, password):
        """
        Authenticate user and generate JWT token
        
        Returns:
            tuple: (success, message, token or None, user_dict or None)
        """
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return False, "Invalid email or password", None, None
        
        # Check password
        if not user.check_password(password):
            return False, "Invalid email or password", None, None
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate JWT token
        token = AuthService.generate_token(user.id)
        
        return True, "Login successful", token, user.to_dict()
    
    @staticmethod
    def generate_token(user_id):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + Config.JWT_ACCESS_TOKEN_EXPIRES,
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
        return token
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        user = User.query.get(user_id)
        return user.to_dict() if user else None
    
    @staticmethod
    def update_user_profile(user_id, **kwargs):
        """
        Update user profile
        
        Args:
            user_id: User ID
            **kwargs: Fields to update (username, email)
        
        Returns:
            tuple: (success, message, user_dict or None)
        """
        user = User.query.get(user_id)
        
        if not user:
            return False, "User not found", None
        
        try:
            # Update username if provided
            if 'username' in kwargs:
                # Check if username is taken by another user
                existing = User.query.filter_by(username=kwargs['username']).first()
                if existing and existing.id != user_id:
                    return False, "Username already exists", None
                user.username = kwargs['username']
            
            # Update email if provided
            if 'email' in kwargs:
                if not validate_email(kwargs['email']):
                    return False, "Invalid email format", None
                
                # Check if email is taken by another user
                existing = User.query.filter_by(email=kwargs['email']).first()
                if existing and existing.id != user_id:
                    return False, "Email already exists", None
                user.email = kwargs['email']
            
            db.session.commit()
            return True, "Profile updated successfully", user.to_dict()
        
        except Exception as e:
            db.session.rollback()
            return False, f"Update failed: {str(e)}", None
