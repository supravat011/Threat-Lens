import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from database.db_init import init_db
from ml_models.model_loader import load_models

# Import blueprints
from routes.auth import auth_bp
from routes.scan import scan_bp
from routes.history import history_bp
from routes.alerts import alerts_bp
from routes.reports import reports_bp

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=config_class.CORS_ORIGINS)
    
    # Create uploads directory if it doesn't exist
    os.makedirs(config_class.UPLOAD_FOLDER, exist_ok=True)
    
    # Initialize database
    with app.app_context():
        init_db(app)
    
    # Load ML models
    load_models()
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(scan_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(reports_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({'error': 'File too large'}), 413
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'ThreatLens API',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'service': 'ThreatLens API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'scan': '/api/scan',
                'history': '/api/history',
                'alerts': '/api/alerts',
                'reports': '/api/reports',
                'health': '/api/health'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    print("\n" + "="*60)
    print("🔒 ThreatLens Backend Server")
    print("="*60)
    print("Server running on: http://localhost:5000")
    print("Frontend CORS allowed from: http://localhost:8080")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
