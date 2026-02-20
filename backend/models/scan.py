from models import db
from datetime import datetime
import json

class URLScan(db.Model):
    """URL scan results model"""
    __tablename__ = 'url_scans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    url = db.Column(db.String(2048), nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)  # safe, suspicious, malicious
    confidence_score = db.Column(db.Float, nullable=False)
    scan_timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    features = db.Column(db.Text)  # JSON string of extracted features
    
    def set_features(self, features_dict):
        """Store features as JSON string"""
        self.features = json.dumps(features_dict)
    
    def get_features(self):
        """Retrieve features as dictionary"""
        return json.loads(self.features) if self.features else {}
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'url': self.url,
            'risk_level': self.risk_level,
            'confidence_score': self.confidence_score,
            'scan_timestamp': self.scan_timestamp.isoformat() if self.scan_timestamp else None,
            'features': self.get_features()
        }
    
    def __repr__(self):
        return f'<URLScan {self.id}: {self.url[:50]}>'


class FileScan(db.Model):
    """File scan results model"""
    __tablename__ = 'file_scans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_hash = db.Column(db.String(64), unique=True, nullable=False, index=True)  # SHA-256
    file_size = db.Column(db.Integer, nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    scan_timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    file_metadata = db.Column(db.Text)  # JSON string of file metadata
    
    def set_metadata(self, metadata_dict):
        """Store metadata as JSON string"""
        self.file_metadata = json.dumps(metadata_dict)
    
    def get_metadata(self):
        """Retrieve metadata as dictionary"""
        return json.loads(self.file_metadata) if self.file_metadata else {}
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'file_hash': self.file_hash,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'risk_level': self.risk_level,
            'confidence_score': self.confidence_score,
            'scan_timestamp': self.scan_timestamp.isoformat() if self.scan_timestamp else None,
            'metadata': self.get_metadata()
        }
    
    def __repr__(self):
        return f'<FileScan {self.id}: {self.filename}>'


class LogAnalysis(db.Model):
    """Network log analysis results model"""
    __tablename__ = 'log_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    log_filename = db.Column(db.String(255), nullable=False)
    anomaly_detected = db.Column(db.Boolean, default=False)
    anomaly_summary = db.Column(db.Text)
    scan_timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    patterns = db.Column(db.Text)  # JSON string of detected patterns
    
    def set_patterns(self, patterns_dict):
        """Store patterns as JSON string"""
        self.patterns = json.dumps(patterns_dict)
    
    def get_patterns(self):
        """Retrieve patterns as dictionary"""
        return json.loads(self.patterns) if self.patterns else {}
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'log_filename': self.log_filename,
            'anomaly_detected': self.anomaly_detected,
            'anomaly_summary': self.anomaly_summary,
            'scan_timestamp': self.scan_timestamp.isoformat() if self.scan_timestamp else None,
            'patterns': self.get_patterns()
        }
    
    def __repr__(self):
        return f'<LogAnalysis {self.id}: {self.log_filename}>'


class ScanHistory(db.Model):
    """Unified scan history tracking"""
    __tablename__ = 'scan_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scan_type = db.Column(db.String(20), nullable=False, index=True)  # url, file, log
    scan_id = db.Column(db.Integer, nullable=False)  # ID of the specific scan
    result = db.Column(db.String(255))
    risk_level = db.Column(db.String(20), index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'scan_type': self.scan_type,
            'scan_id': self.scan_id,
            'result': self.result,
            'risk_level': self.risk_level,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
    
    def __repr__(self):
        return f'<ScanHistory {self.id}: {self.scan_type}>'
