import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from config import Config

# Global model storage
_models = {
    'url_classifier': None,
    'file_classifier': None,
    'log_classifier': None
}

def load_models():
    """Load all ML models at startup"""
    global _models
    
    print("Loading ML models...")
    
    # Try to load URL classifier
    try:
        if os.path.exists(Config.URL_MODEL_PATH):
            with open(Config.URL_MODEL_PATH, 'rb') as f:
                _models['url_classifier'] = pickle.load(f)
            print("✓ URL classifier loaded")
        else:
            _models['url_classifier'] = create_placeholder_url_model()
            print("✓ URL classifier placeholder created")
    except Exception as e:
        print(f"⚠ Error loading URL classifier: {e}")
        _models['url_classifier'] = create_placeholder_url_model()
    
    # Try to load file classifier
    try:
        if os.path.exists(Config.FILE_MODEL_PATH):
            with open(Config.FILE_MODEL_PATH, 'rb') as f:
                _models['file_classifier'] = pickle.load(f)
            print("✓ File classifier loaded")
        else:
            _models['file_classifier'] = create_placeholder_file_model()
            print("✓ File classifier placeholder created")
    except Exception as e:
        print(f"⚠ Error loading file classifier: {e}")
        _models['file_classifier'] = create_placeholder_file_model()
    
    # Try to load log classifier
    try:
        if os.path.exists(Config.LOG_MODEL_PATH):
            with open(Config.LOG_MODEL_PATH, 'rb') as f:
                _models['log_classifier'] = pickle.load(f)
            print("✓ Log classifier loaded")
        else:
            _models['log_classifier'] = create_placeholder_log_model()
            print("✓ Log classifier placeholder created")
    except Exception as e:
        print(f"⚠ Error loading log classifier: {e}")
        _models['log_classifier'] = create_placeholder_log_model()
    
    print("All models loaded successfully!\n")

def create_placeholder_url_model():
    """Create a simple rule-based URL classifier"""
    class URLClassifier:
        def predict(self, features):
            """Rule-based URL classification"""
            results = []
            for feature_dict in features:
                # Simple rules for classification
                score = 0
                
                # HTTPS is good
                if feature_dict.get('has_https', False):
                    score += 30
                
                # Short URLs are generally safer
                if feature_dict.get('url_length', 0) < 50:
                    score += 20
                
                # IP addresses in URL are suspicious
                if feature_dict.get('has_ip_address', False):
                    score -= 40
                
                # Too many suspicious keywords
                if feature_dict.get('suspicious_keywords', 0) > 2:
                    score -= 30
                
                # Too many special characters
                if feature_dict.get('special_char_count', 0) > 10:
                    score -= 20
                
                # Classify based on score
                if score >= 30:
                    results.append(0)  # Safe
                elif score >= 0:
                    results.append(1)  # Suspicious
                else:
                    results.append(2)  # Malicious
            
            return np.array(results)
        
        def predict_proba(self, features):
            """Return probability scores"""
            predictions = self.predict(features)
            probas = []
            for pred in predictions:
                if pred == 0:  # Safe
                    probas.append([0.85, 0.10, 0.05])
                elif pred == 1:  # Suspicious
                    probas.append([0.20, 0.65, 0.15])
                else:  # Malicious
                    probas.append([0.05, 0.15, 0.80])
            return np.array(probas)
    
    return URLClassifier()

def create_placeholder_file_model():
    """Create a simple rule-based file classifier"""
    class FileClassifier:
        def predict(self, features):
            """Rule-based file classification"""
            results = []
            for feature_dict in features:
                score = 0
                
                # Executable extensions are dangerous
                if feature_dict.get('has_executable_extension', False):
                    score -= 50
                
                # Suspicious keywords in content
                keyword_count = feature_dict.get('suspicious_keyword_count', 0)
                score -= keyword_count * 15
                
                # High entropy might indicate encryption/packing
                entropy = feature_dict.get('content_entropy', 0)
                if entropy > 7:
                    score -= 20
                
                # Large files are more suspicious
                file_size = feature_dict.get('file_size', 0)
                if file_size > 5 * 1024 * 1024:  # > 5MB
                    score -= 10
                
                # Classify
                if score >= -10:
                    results.append(0)  # Safe
                elif score >= -40:
                    results.append(1)  # Suspicious
                else:
                    results.append(2)  # Malicious
            
            return np.array(results)
        
        def predict_proba(self, features):
            """Return probability scores"""
            predictions = self.predict(features)
            probas = []
            for pred in predictions:
                if pred == 0:
                    probas.append([0.80, 0.15, 0.05])
                elif pred == 1:
                    probas.append([0.25, 0.60, 0.15])
                else:
                    probas.append([0.10, 0.20, 0.70])
            return np.array(probas)
    
    return FileClassifier()

def create_placeholder_log_model():
    """Create a simple rule-based log analyzer"""
    class LogClassifier:
        def predict(self, features):
            """Rule-based log classification"""
            results = []
            for feature_dict in features:
                score = 0
                
                # High error count is suspicious
                error_count = feature_dict.get('error_count', 0)
                if error_count > 10:
                    score -= 30
                
                # Suspicious patterns detected
                suspicious_count = feature_dict.get('suspicious_pattern_count', 0)
                score -= suspicious_count * 25
                
                # Too many 4xx/5xx errors
                status_4xx = feature_dict.get('status_4xx_count', 0)
                status_5xx = feature_dict.get('status_5xx_count', 0)
                if status_4xx > 20 or status_5xx > 10:
                    score -= 20
                
                # Classify
                if score >= -20:
                    results.append(0)  # Normal
                else:
                    results.append(1)  # Anomaly detected
            
            return np.array(results)
        
        def predict_proba(self, features):
            """Return probability scores"""
            predictions = self.predict(features)
            probas = []
            for pred in predictions:
                if pred == 0:  # Normal
                    probas.append([0.85, 0.15])
                else:  # Anomaly
                    probas.append([0.20, 0.80])
            return np.array(probas)
    
    return LogClassifier()

def get_url_classifier():
    """Get the URL classifier model"""
    return _models['url_classifier']

def get_file_classifier():
    """Get the file classifier model"""
    return _models['file_classifier']

def get_log_classifier():
    """Get the log classifier model"""
    return _models['log_classifier']

def classify_url(features):
    """
    Classify URL based on features
    
    Args:
        features (dict): URL features
    
    Returns:
        tuple: (risk_level, confidence_score)
    """
    model = get_url_classifier()
    
    # Convert features to list format expected by model
    feature_list = [features]
    
    # Get prediction
    prediction = model.predict(feature_list)[0]
    probabilities = model.predict_proba(feature_list)[0]
    
    # Map prediction to risk level
    risk_levels = ['safe', 'suspicious', 'malicious']
    risk_level = risk_levels[prediction]
    confidence_score = float(probabilities[prediction])
    
    return risk_level, confidence_score

def classify_file(features):
    """
    Classify file based on features
    
    Args:
        features (dict): File features
    
    Returns:
        tuple: (risk_level, confidence_score)
    """
    model = get_file_classifier()
    
    feature_list = [features]
    prediction = model.predict(feature_list)[0]
    probabilities = model.predict_proba(feature_list)[0]
    
    risk_levels = ['safe', 'suspicious', 'malicious']
    risk_level = risk_levels[prediction]
    confidence_score = float(probabilities[prediction])
    
    return risk_level, confidence_score

def classify_log(features):
    """
    Classify log based on features
    
    Args:
        features (dict): Log features
    
    Returns:
        tuple: (anomaly_detected, confidence_score)
    """
    model = get_log_classifier()
    
    feature_list = [features]
    prediction = model.predict(feature_list)[0]
    probabilities = model.predict_proba(feature_list)[0]
    
    anomaly_detected = bool(prediction)
    confidence_score = float(probabilities[prediction])
    
    return anomaly_detected, confidence_score
