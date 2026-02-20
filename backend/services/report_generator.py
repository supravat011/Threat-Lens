from datetime import datetime, timedelta
from models import db
from models.report import Report
from models.scan import URLScan, FileScan, LogAnalysis, ScanHistory
from models.alert import Alert

class ReportGenerator:
    """Report generation service"""
    
    @staticmethod
    def generate_report(user_id, report_type='summary', days=7):
        """
        Generate threat detection report
        
        Args:
            user_id: User ID
            report_type: 'summary' or 'detailed'
            days: Number of days to include in report
        
        Returns:
            tuple: (success, message, report_dict or None)
        """
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Gather statistics
            stats = ReportGenerator._gather_statistics(user_id, start_date, end_date)
            
            # Create report data
            report_data = {
                'report_type': report_type,
                'period': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat(),
                    'days': days
                },
                'statistics': stats,
                'generated_at': datetime.utcnow().isoformat()
            }
            
            # Add detailed information if requested
            if report_type == 'detailed':
                report_data['details'] = ReportGenerator._gather_details(user_id, start_date, end_date)
            
            # Save report
            report = Report(
                user_id=user_id,
                report_type=report_type
            )
            report.set_data(report_data)
            
            db.session.add(report)
            db.session.commit()
            
            return True, "Report generated successfully", report.to_dict()
        
        except Exception as e:
            db.session.rollback()
            return False, f"Report generation failed: {str(e)}", None
    
    @staticmethod
    def _gather_statistics(user_id, start_date, end_date):
        """Gather scan statistics for report"""
        # URL scans
        url_scans = URLScan.query.filter(
            URLScan.user_id == user_id,
            URLScan.scan_timestamp >= start_date,
            URLScan.scan_timestamp <= end_date
        ).all()
        
        # File scans
        file_scans = FileScan.query.filter(
            FileScan.user_id == user_id,
            FileScan.scan_timestamp >= start_date,
            FileScan.scan_timestamp <= end_date
        ).all()
        
        # Log analyses
        log_analyses = LogAnalysis.query.filter(
            LogAnalysis.user_id == user_id,
            LogAnalysis.scan_timestamp >= start_date,
            LogAnalysis.scan_timestamp <= end_date
        ).all()
        
        # Alerts
        alerts = Alert.query.filter(
            Alert.user_id == user_id,
            Alert.created_at >= start_date,
            Alert.created_at <= end_date
        ).all()
        
        # Calculate statistics
        stats = {
            'total_scans': len(url_scans) + len(file_scans) + len(log_analyses),
            'url_scans': {
                'total': len(url_scans),
                'safe': sum(1 for s in url_scans if s.risk_level == 'safe'),
                'suspicious': sum(1 for s in url_scans if s.risk_level == 'suspicious'),
                'malicious': sum(1 for s in url_scans if s.risk_level == 'malicious')
            },
            'file_scans': {
                'total': len(file_scans),
                'safe': sum(1 for s in file_scans if s.risk_level == 'safe'),
                'suspicious': sum(1 for s in file_scans if s.risk_level == 'suspicious'),
                'malicious': sum(1 for s in file_scans if s.risk_level == 'malicious')
            },
            'log_analyses': {
                'total': len(log_analyses),
                'normal': sum(1 for a in log_analyses if not a.anomaly_detected),
                'anomalies': sum(1 for a in log_analyses if a.anomaly_detected)
            },
            'alerts': {
                'total': len(alerts),
                'critical': sum(1 for a in alerts if a.severity == 'critical'),
                'medium': sum(1 for a in alerts if a.severity == 'medium'),
                'low': sum(1 for a in alerts if a.severity == 'low'),
                'unread': sum(1 for a in alerts if not a.is_read)
            },
            'threat_summary': {
                'total_threats': sum(1 for s in url_scans if s.risk_level == 'malicious') +
                                sum(1 for s in file_scans if s.risk_level == 'malicious') +
                                sum(1 for a in log_analyses if a.anomaly_detected),
                'threat_rate': 0  # Will be calculated below
            }
        }
        
        # Calculate threat rate
        if stats['total_scans'] > 0:
            stats['threat_summary']['threat_rate'] = round(
                (stats['threat_summary']['total_threats'] / stats['total_scans']) * 100, 2
            )
        
        return stats
    
    @staticmethod
    def _gather_details(user_id, start_date, end_date):
        """Gather detailed scan information for report"""
        # Get recent high-risk scans
        malicious_urls = URLScan.query.filter(
            URLScan.user_id == user_id,
            URLScan.risk_level == 'malicious',
            URLScan.scan_timestamp >= start_date,
            URLScan.scan_timestamp <= end_date
        ).order_by(URLScan.confidence_score.desc()).limit(10).all()
        
        malicious_files = FileScan.query.filter(
            FileScan.user_id == user_id,
            FileScan.risk_level == 'malicious',
            FileScan.scan_timestamp >= start_date,
            FileScan.scan_timestamp <= end_date
        ).order_by(FileScan.confidence_score.desc()).limit(10).all()
        
        anomalous_logs = LogAnalysis.query.filter(
            LogAnalysis.user_id == user_id,
            LogAnalysis.anomaly_detected == True,
            LogAnalysis.scan_timestamp >= start_date,
            LogAnalysis.scan_timestamp <= end_date
        ).order_by(LogAnalysis.scan_timestamp.desc()).limit(10).all()
        
        details = {
            'high_risk_urls': [
                {
                    'url': scan.url[:100],
                    'confidence': scan.confidence_score,
                    'timestamp': scan.scan_timestamp.isoformat()
                }
                for scan in malicious_urls
            ],
            'high_risk_files': [
                {
                    'filename': scan.filename,
                    'file_hash': scan.file_hash,
                    'confidence': scan.confidence_score,
                    'timestamp': scan.scan_timestamp.isoformat()
                }
                for scan in malicious_files
            ],
            'anomalous_logs': [
                {
                    'filename': analysis.log_filename,
                    'summary': analysis.anomaly_summary,
                    'timestamp': analysis.scan_timestamp.isoformat()
                }
                for analysis in anomalous_logs
            ]
        }
        
        return details
    
    @staticmethod
    def get_report_by_id(report_id, user_id):
        """Get report by ID"""
        report = Report.query.filter_by(id=report_id, user_id=user_id).first()
        return report.to_dict() if report else None
    
    @staticmethod
    def get_user_reports(user_id, limit=20):
        """Get all reports for a user"""
        reports = Report.query.filter_by(user_id=user_id)\
            .order_by(Report.generated_at.desc())\
            .limit(limit)\
            .all()
        
        return [report.to_dict() for report in reports]
