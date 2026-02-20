# ThreatLens Backend

Backend API for ThreatLens - Web-Based Intelligent Cyber Threat Detection System

## Features

- 🔐 **User Authentication**: JWT-based authentication with secure password hashing
- 🌐 **URL Threat Detection**: ML-based URL scanning and classification
- 📁 **File Malware Analysis**: Upload and scan files for malicious content
- 📊 **Network Log Analysis**: Analyze log files for anomalies and suspicious patterns
- 📈 **Scan History**: Track all scanning activities with filtering options
- 🚨 **Threat Alerts**: Automatic alert generation for high-risk detections
- 📄 **Reports**: Generate comprehensive threat analysis reports

## Technology Stack

- **Framework**: Flask 3.0.0
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (PyJWT)
- **Machine Learning**: Scikit-learn
- **Security**: Werkzeug password hashing, input validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set your secret keys:

```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
FLASK_ENV=development
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - Logout (protected)

### Scanning

- `POST /api/scan/url` - Scan URL for threats (protected)
- `GET /api/scan/url/<scan_id>` - Get URL scan details (protected)
- `POST /api/scan/file` - Upload and scan file (protected)
- `GET /api/scan/file/<scan_id>` - Get file scan details (protected)
- `POST /api/scan/log` - Upload and analyze log file (protected)
- `GET /api/scan/log/<analysis_id>` - Get log analysis details (protected)

### History

- `GET /api/history` - Get scan history with filters (protected)
- `GET /api/history/<history_id>` - Get specific history item (protected)

### Alerts

- `GET /api/alerts` - Get alerts with filters (protected)
- `GET /api/alerts/<alert_id>` - Get specific alert (protected)
- `PUT /api/alerts/<alert_id>/read` - Mark alert as read (protected)
- `DELETE /api/alerts/<alert_id>` - Delete alert (protected)
- `PUT /api/alerts/mark-all-read` - Mark all alerts as read (protected)

### Reports

- `GET /api/reports` - Get all reports (protected)
- `POST /api/reports/generate` - Generate new report (protected)
- `GET /api/reports/<report_id>` - Get specific report (protected)
- `GET /api/reports/<report_id>/download` - Download report as JSON (protected)

### Utility

- `GET /api/health` - Health check endpoint
- `GET /` - API information

## Default Credentials

A default admin user is created on first run:

- **Username**: admin
- **Email**: admin@threatlens.com
- **Password**: Admin@123

⚠️ **Change this password in production!**

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### Scan URL

```bash
curl -X POST http://localhost:5000/api/scan/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"url":"https://example.com"}'
```

### Upload and Scan File

```bash
curl -X POST http://localhost:5000/api/scan/file \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -F "file=@/path/to/file.txt"
```

### Get Scan History

```bash
curl -X GET "http://localhost:5000/api/history?type=url&limit=10" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Generate Report

```bash
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"report_type":"detailed","days":7}'
```

## Machine Learning Models

The backend uses placeholder rule-based models for initial development. These models classify threats based on:

- **URL Classification**: HTTPS presence, URL length, suspicious keywords, IP addresses
- **File Classification**: File extension, suspicious keywords, content entropy
- **Log Analysis**: Error patterns, suspicious patterns, HTTP status codes

To use real trained models:

1. Train your models using scikit-learn
2. Save them as pickle files
3. Place them in the `ml_models/` directory:
   - `url_classifier.pkl`
   - `file_classifier.pkl`
   - `log_classifier.pkl`

## Database

SQLite database (`threatlens.db`) is created automatically on first run.

### Tables

- `users` - User accounts
- `url_scans` - URL scan results
- `file_scans` - File scan results
- `log_analyses` - Log analysis results
- `scan_history` - Unified scan history
- `alerts` - Threat alerts
- `reports` - Generated reports

## Security Features

- Password hashing with Werkzeug
- JWT token-based authentication
- Input validation and sanitization
- File type and size validation
- CORS configuration for frontend
- SQL injection prevention via SQLAlchemy ORM

## File Upload Limits

- **Max file size**: 10MB
- **Allowed extensions**: .pdf, .docx, .txt, .csv, .log

## Development

To reset the database:

```python
from app import create_app
from database.db_init import reset_db

app = create_app()
reset_db(app)
```

## Production Deployment

For production:

1. Set strong `SECRET_KEY` and `JWT_SECRET_KEY` in environment variables
2. Use a production-grade database (PostgreSQL, MySQL)
3. Set `FLASK_ENV=production`
4. Use a production WSGI server (Gunicorn, uWSGI)
5. Enable HTTPS
6. Implement rate limiting
7. Set up proper logging and monitoring

## License

MIT License
