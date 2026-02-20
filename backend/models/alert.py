from models import db
from datetime import datetime

class Alert(db.Model):
    """Security alerts model"""
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scan_type = db.Column(db.String(20), nullable=False)  # url, file, log
    scan_id = db.Column(db.Integer, nullable=False)
    severity = db.Column(db.String(20), nullable=False, index=True)  # critical, medium, low
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'scan_type': self.scan_type,
            'scan_id': self.scan_id,
            'severity': self.severity,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Alert {self.id}: {self.severity}>'
