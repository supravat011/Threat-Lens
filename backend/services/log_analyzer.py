from models import db
from models.scan import LogAnalysis, ScanHistory
from models.alert import Alert
from utils.feature_extraction import extract_log_patterns
from utils.validators import sanitize_filename
from ml_models.model_loader import classify_log
from config import Config

class LogAnalyzer:
    """Network log analysis service"""
    
    @staticmethod
    def analyze_log(user_id, file):
        """
        Analyze network log file for anomalies
        
        Args:
            user_id: User ID
            file: FileStorage object from Flask
        
        Returns:
            tuple: (success, message, analysis_result or None)
        """
        # Validate file
        if not file or file.filename == '':
            return False, "No file provided", None
        
        try:
            # Read log content
            log_content = file.read()
            log_size = len(log_content)
            
            # Check file size
            if log_size > Config.MAX_CONTENT_LENGTH:
                return False, f"Log file too large. Max size: {Config.MAX_CONTENT_LENGTH / (1024*1024)}MB", None
            
            # Sanitize filename
            filename = sanitize_filename(file.filename)
            
            # Extract patterns
            patterns = extract_log_patterns(log_content)
            
            # Classify using ML model
            anomaly_detected, confidence_score = classify_log(patterns)
            
            # Generate summary
            summary = LogAnalyzer._generate_summary(patterns, anomaly_detected, confidence_score)
            
            # Create analysis record
            analysis = LogAnalysis(
                user_id=user_id,
                log_filename=filename,
                anomaly_detected=anomaly_detected,
                anomaly_summary=summary
            )
            analysis.set_patterns(patterns)
            
            db.session.add(analysis)
            db.session.flush()
            
            # Add to scan history
            history = ScanHistory(
                user_id=user_id,
                scan_type='log',
                scan_id=analysis.id,
                result=f"Log analysis: {'Anomaly detected' if anomaly_detected else 'Normal'}",
                risk_level='malicious' if anomaly_detected else 'safe'
            )
            db.session.add(history)
            
            # Generate alert if anomaly detected
            if anomaly_detected and confidence_score >= Config.ALERT_CRITICAL_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='log',
                    scan_id=analysis.id,
                    severity='critical',
                    message=f"Critical anomaly detected in log '{filename}': {summary}"
                )
                db.session.add(alert)
            elif anomaly_detected and confidence_score >= Config.ALERT_MEDIUM_THRESHOLD:
                alert = Alert(
                    user_id=user_id,
                    scan_type='log',
                    scan_id=analysis.id,
                    severity='medium',
                    message=f"Suspicious activity detected in log '{filename}'"
                )
                db.session.add(alert)
            
            db.session.commit()
            
            return True, "Log analyzed successfully", analysis.to_dict()
        
        except Exception as e:
            db.session.rollback()
            return False, f"Analysis failed: {str(e)}", None
    
    @staticmethod
    def _generate_summary(patterns, anomaly_detected, confidence_score):
        """Generate human-readable summary of log analysis"""
        if not anomaly_detected:
            return "No anomalies detected. Log appears normal."
        
        summary_parts = []
        
        if patterns.get('error_count', 0) > 10:
            summary_parts.append(f"{patterns['error_count']} errors detected")
        
        if patterns.get('suspicious_pattern_count', 0) > 0:
            summary_parts.append(f"{patterns['suspicious_pattern_count']} suspicious patterns found")
        
        if patterns.get('status_4xx_count', 0) > 20:
            summary_parts.append(f"High number of 4xx errors ({patterns['status_4xx_count']})")
        
        if patterns.get('status_5xx_count', 0) > 10:
            summary_parts.append(f"High number of 5xx errors ({patterns['status_5xx_count']})")
        
        if summary_parts:
            return f"Anomaly detected ({confidence_score:.0%} confidence): " + ", ".join(summary_parts)
        else:
            return f"Anomaly detected with {confidence_score:.0%} confidence"
    
    @staticmethod
    def get_analysis_by_id(analysis_id, user_id):
        """Get log analysis by ID"""
        analysis = LogAnalysis.query.filter_by(id=analysis_id, user_id=user_id).first()
        return analysis.to_dict() if analysis else None
    
    @staticmethod
    def get_user_analyses(user_id, limit=50):
        """Get all log analyses for a user"""
        analyses = LogAnalysis.query.filter_by(user_id=user_id)\
            .order_by(LogAnalysis.scan_timestamp.desc())\
            .limit(limit)\
            .all()
        
        return [analysis.to_dict() for analysis in analyses]
