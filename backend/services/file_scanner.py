import os
from models import db
from models.scan import FileScan, ScanHistory
from models.alert import Alert
from utils.feature_extraction import extract_file_features
from utils.validators import validate_file_extension, sanitize_filename
from utils.security import generate_file_hash
from ml_models.model_loader import classify_file
from config import Config

class FileScanner:
    """File upload and malware analysis service"""
    
    @staticmethod
    def scan_file(user_id, file):
        """
        Scan uploaded file for malware
        
        Args:
            user_id: User ID
            file: FileStorage object from Flask
        
        Returns:
            tuple: (success, message, scan_result or None)
        """
        # Validate file
        if not file or file.filename == '':
            return False, "No file provided", None
        
        # Validate file extension
        if not validate_file_extension(file.filename):
            allowed = ', '.join(Config.ALLOWED_EXTENSIONS)
            return False, f"Invalid file type. Allowed: {allowed}", None
        
        try:
            # Read file content
            file_content = file.read()
            file_size = len(file_content)
            
            # Check file size
            if file_size > Config.MAX_CONTENT_LENGTH:
                return False, f"File too large. Max size: {Config.MAX_CONTENT_LENGTH / (1024*1024)}MB", None
            
            # Generate file hash
            file_hash = generate_file_hash(file_content)
            
            # Check for duplicate scan
            existing_scan = FileScan.query.filter_by(file_hash=file_hash).first()
            if existing_scan:
                return True, "File already scanned (duplicate detected)", existing_scan.to_dict()
            
            # Sanitize filename
            filename = sanitize_filename(file.filename)
            
            # Extract features
            features = extract_file_features(filename, file_size, file_content)
            
            # Classify using ML model
            risk_level, confidence_score = classify_file(features)
            
            # Save file to uploads directory (optional)
            # file_path = os.path.join(Config.UPLOAD_FOLDER, f"{file_hash}_{filename}")
            # with open(file_path, 'wb') as f:
            #     f.write(file_content)
            
            # Create scan record
            scan = FileScan(
                user_id=user_id,
                filename=filename,
                file_hash=file_hash,
                file_size=file_size,
                file_type=features.get('extension', 'unknown'),
                risk_level=risk_level,
                confidence_score=confidence_score
            )
            scan.set_metadata(features)
            
            db.session.add(scan)
            db.session.flush()
            
            # Add to scan history
            history = ScanHistory(
                user_id=user_id,
                scan_type='file',
                scan_id=scan.id,
                result=f"File '{filename}' classified as {risk_level}",
                risk_level=risk_level
            )
            db.session.add(history)
            
            # Generate alert if high risk
            if risk_level == 'malicious' and confidence_score >= Config.ALERT_CRITICAL_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='file',
                    scan_id=scan.id,
                    severity='critical',
                    message=f"Critical threat detected: File '{filename}' identified as malicious with {confidence_score:.0%} confidence"
                )
                db.session.add(alert)
            elif risk_level == 'suspicious' and confidence_score >= Config.ALERT_MEDIUM_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='file',
                    scan_id=scan.id,
                    severity='medium',
                    message=f"Suspicious file detected: '{filename}' requires review"
                )
                db.session.add(alert)
            
            db.session.commit()
            
            return True, "File scanned successfully", scan.to_dict()
        
        except Exception as e:
            db.session.rollback()
            return False, f"Scan failed: {str(e)}", None
    
    @staticmethod
    def get_scan_by_id(scan_id, user_id):
        """Get file scan by ID"""
        scan = FileScan.query.filter_by(id=scan_id, user_id=user_id).first()
        return scan.to_dict() if scan else None
    
    @staticmethod
    def get_user_scans(user_id, limit=50):
        """Get all file scans for a user"""
        scans = FileScan.query.filter_by(user_id=user_id)\
            .order_by(FileScan.scan_timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [scan.to_dict() for scan in scans]
