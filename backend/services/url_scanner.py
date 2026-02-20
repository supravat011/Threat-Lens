from models import db
from models.scan import URLScan, ScanHistory
from models.alert import Alert
from utils.feature_extraction import extract_url_features
from utils.validators import validate_url
from ml_models.model_loader import classify_url
from config import Config

class URLScanner:
    """URL scanning and threat detection service"""
    
    @staticmethod
    def scan_url(user_id, url):
        """
        Scan URL for threats
        
        Returns:
            tuple: (success, message, scan_result or None)
        """
        # Validate URL
        if not validate_url(url):
            return False, "Invalid URL format", None
        
        try:
            # Extract features
            features = extract_url_features(url)
            
            # Classify using ML model
            risk_level, confidence_score = classify_url(features)
            
            # Create scan record
            scan = URLScan(
                user_id=user_id,
                url=url,
                risk_level=risk_level,
                confidence_score=confidence_score
            )
            scan.set_features(features)
            
            db.session.add(scan)
            db.session.flush()  # Get scan ID
            
            # Add to scan history
            history = ScanHistory(
                user_id=user_id,
                scan_type='url',
                scan_id=scan.id,
                result=f"URL classified as {risk_level}",
                risk_level=risk_level
            )
            db.session.add(history)
            
            # Generate alert if high risk
            if risk_level == 'malicious' and confidence_score >= Config.ALERT_CRITICAL_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='url',
                    scan_id=scan.id,
                    severity='critical',
                    message=f"Critical threat detected: URL '{url[:50]}...' classified as malicious with {confidence_score:.0%} confidence"
                )
                db.session.add(alert)
            elif risk_level == 'suspicious' and confidence_score >= Config.ALERT_MEDIUM_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='url',
                    scan_id=scan.id,
                    severity='medium',
                    message=f"Suspicious URL detected: '{url[:50]}...' requires attention"
                )
                db.session.add(alert)
            
            db.session.commit()
            
            return True, "URL scanned successfully", scan.to_dict()
        
        except Exception as e:
            db.session.rollback()
            return False, f"Scan failed: {str(e)}", None
    
    @staticmethod
    def get_scan_by_id(scan_id, user_id):
        """Get URL scan by ID"""
        scan = URLScan.query.filter_by(id=scan_id, user_id=user_id).first()
        return scan.to_dict() if scan else None
    
    @staticmethod
    def get_user_scans(user_id, limit=50):
        """Get all URL scans for a user"""
        scans = URLScan.query.filter_by(user_id=user_id)\
            .order_by(URLScan.scan_timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [scan.to_dict() for scan in scans]
