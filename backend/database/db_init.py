from models import db
from models.user import User
from models.scan import URLScan, FileScan, LogAnalysis, ScanHistory
from models.alert import Alert
from models.report import Report

def init_db(app):
    """Initialize database and create all tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")
        
        # Optional: Create a default admin user
        create_default_admin()

def create_default_admin():
    """Create a default admin user if it doesn't exist"""
    admin = User.query.filter_by(username='admin').first()
    
    if not admin:
        admin = User(
            username='admin',
            email='admin@threatlens.com',
            role='admin'
        )
        admin.set_password('Admin@123')  # Change this in production!
        
        db.session.add(admin)
        db.session.commit()
        print("Default admin user created (username: admin, password: Admin@123)")
    else:
        print("Admin user already exists")

def reset_db(app):
    """Drop all tables and recreate them (use with caution!)"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Database reset successfully!")
