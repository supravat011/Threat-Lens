import re
from config import Config

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    """
    if len(password) < Config.PASSWORD_MIN_LENGTH:
        return False, f"Password must be at least {Config.PASSWORD_MIN_LENGTH} characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is valid"

def validate_url(url):
    """Validate URL format"""
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(pattern, url) is not None

def validate_file_extension(filename):
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    return extension in Config.ALLOWED_EXTENSIONS

def sanitize_filename(filename):
    """Remove potentially dangerous characters from filename"""
    # Remove path separators and other dangerous characters
    filename = re.sub(r'[/\\]', '', filename)
    filename = re.sub(r'[^\w\s.-]', '', filename)
    return filename
