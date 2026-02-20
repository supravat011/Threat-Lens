from models import db
from datetime import datetime
import json

class Report(db.Model):
    """Reports model"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    report_type = db.Column(db.String(50), nullable=False)  # summary, detailed
    generated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    data = db.Column(db.Text)  # JSON string of report data
    
    def set_data(self, data_dict):
        """Store report data as JSON string"""
        self.data = json.dumps(data_dict)
    
    def get_data(self):
        """Retrieve report data as dictionary"""
        return json.loads(self.data) if self.data else {}
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'report_type': self.report_type,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'data': self.get_data()
        }
    
    def __repr__(self):
        return f'<Report {self.id}: {self.report_type}>'
