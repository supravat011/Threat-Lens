import os
from datetime import timedelta

class Config:
    """Flask application configuration"""
    
    # Base directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "threatlens.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # File upload configuration
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max file size
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'csv', 'log'}
    
    # ML Models configuration
    ML_MODELS_DIR = os.path.join(BASE_DIR, 'ml_models')
    URL_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'url_classifier.pkl')
    FILE_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'file_classifier.pkl')
    LOG_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'log_classifier.pkl')
    
    # CORS configuration
    CORS_ORIGINS = ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080']
    
    # Security configuration
    PASSWORD_MIN_LENGTH = 8
    
    # Alert thresholds
    ALERT_CRITICAL_THRESHOLD = 0.8
    ALERT_MEDIUM_THRESHOLD = 0.6
