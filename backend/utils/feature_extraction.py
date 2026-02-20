import re
from urllib.parse import urlparse

def extract_url_features(url):
    """
    Extract features from URL for ML classification
    
    Returns:
        dict: Dictionary of URL features
    """
    parsed = urlparse(url)
    
    features = {
        'url_length': len(url),
        'has_https': url.startswith('https://'),
        'domain_length': len(parsed.netloc),
        'path_length': len(parsed.path),
        'special_char_count': sum(1 for c in url if c in ['@', '?', '&', '=', '-', '_', '~', '%']),
        'subdomain_count': len(parsed.netloc.split('.')) - 2 if len(parsed.netloc.split('.')) > 2 else 0,
        'path_depth': len([p for p in parsed.path.split('/') if p]),
        'has_ip_address': bool(re.match(r'\d+\.\d+\.\d+\.\d+', parsed.netloc)),
        'query_length': len(parsed.query) if parsed.query else 0,
        'fragment_length': len(parsed.fragment) if parsed.fragment else 0,
        'suspicious_keywords': sum(1 for keyword in ['login', 'verify', 'account', 'update', 'secure', 'banking'] 
                                   if keyword in url.lower())
    }
    
    return features

def extract_file_features(filename, file_size, file_content):
    """
    Extract features from file for ML classification
    
    Returns:
        dict: Dictionary of file features
    """
    # Get file extension
    extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    # Convert bytes to string for text analysis (if possible)
    try:
        content_str = file_content.decode('utf-8', errors='ignore')
    except:
        content_str = ''
    
    # Suspicious keywords in file content
    suspicious_keywords = [
        'malware', 'virus', 'trojan', 'ransomware', 'exploit',
        'payload', 'shellcode', 'backdoor', 'rootkit', 'keylogger'
    ]
    
    features = {
        'file_size': file_size,
        'extension': extension,
        'filename_length': len(filename),
        'suspicious_keyword_count': sum(1 for keyword in suspicious_keywords 
                                       if keyword in content_str.lower()),
        'has_executable_extension': extension in ['exe', 'bat', 'sh', 'cmd', 'ps1'],
        'content_entropy': calculate_entropy(file_content[:1000]),  # First 1KB
        'special_char_ratio': sum(1 for c in filename if not c.isalnum()) / len(filename) if filename else 0
    }
    
    return features

def calculate_entropy(data):
    """Calculate Shannon entropy of data"""
    if not data:
        return 0
    
    from collections import Counter
    import math
    
    # Count byte frequencies
    counter = Counter(data)
    length = len(data)
    
    # Calculate entropy
    entropy = 0
    for count in counter.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    
    return entropy

def extract_log_patterns(log_content):
    """
    Extract patterns from log file for anomaly detection
    
    Returns:
        dict: Dictionary of log patterns
    """
    try:
        content_str = log_content.decode('utf-8', errors='ignore')
    except:
        content_str = str(log_content)
    
    lines = content_str.split('\n')
    
    # Extract IP addresses
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    ips = re.findall(ip_pattern, content_str)
    
    # Extract HTTP status codes
    status_pattern = r'\b[1-5]\d{2}\b'
    status_codes = re.findall(status_pattern, content_str)
    
    # Count error indicators
    error_keywords = ['error', 'failed', 'denied', 'unauthorized', 'forbidden', 'timeout']
    error_count = sum(1 for line in lines for keyword in error_keywords if keyword in line.lower())
    
    # Detect suspicious patterns
    suspicious_patterns = [
        r'sql.*injection',
        r'<script',
        r'\.\./',
        r'union.*select',
        r'exec\(',
        r'cmd\.exe'
    ]
    
    suspicious_count = sum(1 for pattern in suspicious_patterns 
                          if re.search(pattern, content_str, re.IGNORECASE))
    
    patterns = {
        'total_lines': len(lines),
        'unique_ips': len(set(ips)),
        'total_requests': len(ips),
        'error_count': error_count,
        'suspicious_pattern_count': suspicious_count,
        'status_4xx_count': sum(1 for code in status_codes if code.startswith('4')),
        'status_5xx_count': sum(1 for code in status_codes if code.startswith('5')),
        'avg_line_length': sum(len(line) for line in lines) / len(lines) if lines else 0
    }
    
    return patterns
