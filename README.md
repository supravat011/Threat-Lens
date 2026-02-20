# ThreatLens 🛡️

**Web-Based Intelligent Cyber Threat Detection System**

ThreatLens is a comprehensive cybersecurity platform that leverages machine learning to detect and analyze potential threats from URLs, files, and network logs. Built with a modern tech stack, it provides real-time threat detection, detailed analytics, and comprehensive reporting capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)

## 🌟 Features

### Core Capabilities
- **🔍 URL Threat Detection** - Analyze URLs for phishing, malware, and malicious content
- **📁 File Malware Analysis** - Scan files for threats with SHA-256 hashing and duplicate detection
- **📊 Network Log Analysis** - Parse and analyze network logs for anomalies and suspicious patterns
- **📜 Scan History** - Track all scans with filtering and search capabilities
- **🔔 Real-time Alerts** - Get notified of critical threats instantly
- **📈 Comprehensive Reports** - Generate detailed threat analysis reports
- **👤 User Management** - Secure authentication with JWT tokens
- **⚙️ Settings & Profiles** - Customize your security preferences

### Technical Features
- Machine Learning-based threat classification
- RESTful API architecture
- Real-time threat scoring and confidence levels
- Duplicate scan prevention
- Multi-level alert system (Critical, Medium, Low)
- JSON report export
- Responsive modern UI with dark mode

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router v6
- **Charts**: Recharts

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **ML Framework**: Scikit-learn
- **API**: RESTful with CORS support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ThreatLens
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and set your secret keys
# SECRET_KEY=your-secret-key-here
# JWT_SECRET_KEY=your-jwt-secret-here

# Start the backend server
python app.py
```

The backend will start on **http://localhost:5000**

#### 3. Frontend Setup
```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:8080**

### Default Admin Credentials
```
Username: admin
Email: admin@threatlens.com
Password: Admin@123
```

⚠️ **Important**: Change the default admin password immediately after first login!

## 📖 Usage

### 1. Authentication
- Register a new account or login with existing credentials
- JWT tokens are automatically managed and stored securely

### 2. Scanning URLs
- Navigate to **Scan URL** page
- Enter the URL to analyze
- View threat level, confidence score, and detailed features

### 3. Uploading Files
- Go to **Upload File** page
- Select a file (.pdf, .docx, .txt, .csv, .log)
- Get instant malware analysis results

### 4. Analyzing Logs
- Visit **Log Analysis** page
- Upload network log files
- Review detected patterns and anomalies

### 5. Viewing History
- Access **Scan History** to see all past scans
- Filter by type (URL/File/Log) or risk level
- Click on any scan for detailed information

### 6. Managing Alerts
- Check **Alerts** page for threat notifications
- Filter by severity or unread status
- Mark as read or delete alerts

### 7. Generating Reports
- Open **Reports** page
- Click "Generate Report"
- Choose report type (Summary/Detailed) and time period
- Download reports as JSON

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}
```

### Scanning Endpoints

#### Scan URL
```http
POST /scan/url
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Scan File
```http
POST /scan/file
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

#### Analyze Log
```http
POST /scan/log
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

### History & Reports

#### Get Scan History
```http
GET /history?type=url&risk_level=malicious&limit=10
Authorization: Bearer <token>
```

#### Generate Report
```http
POST /reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "report_type": "detailed",
  "days": 7
}
```

#### Download Report
```http
GET /reports/<report_id>/download
Authorization: Bearer <token>
```

### Alerts

#### Get Alerts
```http
GET /alerts?unread=true&severity=critical
Authorization: Bearer <token>
```

#### Mark Alert as Read
```http
PUT /alerts/<alert_id>/read
Authorization: Bearer <token>
```

For complete API documentation, see [backend/README.md](backend/README.md)

## 🧪 Machine Learning Models

ThreatLens uses ML classifiers for threat detection:

### URL Classifier
- **Features**: URL length, HTTPS presence, special characters, IP detection, suspicious keywords
- **Output**: safe, suspicious, or malicious classification with confidence score

### File Classifier
- **Features**: File size, extension, entropy, keyword analysis, executable detection
- **Output**: Risk level and malware probability

### Log Analyzer
- **Features**: Error patterns, suspicious IPs, status codes, request anomalies
- **Output**: Anomaly detection with pattern summary

### Training Your Own Models

1. Prepare training data in the required format
2. Train models using scikit-learn
3. Save models as pickle files:
   - `backend/ml_models/url_classifier.pkl`
   - `backend/ml_models/file_classifier.pkl`
   - `backend/ml_models/log_classifier.pkl`
4. Restart the backend server

Currently, placeholder rule-based models are used for development. Replace with trained models for production use.

## 🗄️ Database Schema

### Tables
- **users** - User accounts and authentication
- **url_scans** - URL scan results
- **file_scans** - File analysis results
- **log_analyses** - Network log analysis
- **scan_history** - Unified scan tracking
- **alerts** - Threat notifications
- **reports** - Generated reports

See [backend/README.md](backend/README.md) for detailed schema.

## 🔒 Security

- **Password Hashing**: Werkzeug secure password hashing
- **JWT Authentication**: Stateless token-based auth with expiration
- **Input Validation**: Comprehensive validation on all inputs
- **File Validation**: Type and size restrictions on uploads
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **XSS Prevention**: Input sanitization
- **CORS**: Configured for secure cross-origin requests

## 📁 Project Structure

```
ThreatLens/
├── backend/                 # Flask backend
│   ├── app.py              # Main application
│   ├── config.py           # Configuration
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── ml_models/          # ML model files
│   ├── utils/              # Utilities
│   └── database/           # DB initialization
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   └── hooks/              # Custom hooks
├── public/                 # Static assets
└── README.md              # This file
```

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
npm test
```

### Building for Production

#### Frontend
```bash
npm run build
```

#### Backend
Use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🚢 Deployment

### Environment Variables
Set these in production:
```env
SECRET_KEY=<strong-random-key>
JWT_SECRET_KEY=<strong-random-key>
FLASK_ENV=production
DATABASE_URL=<production-database-url>
```

### Recommendations
- Use PostgreSQL or MySQL instead of SQLite
- Enable HTTPS with SSL certificates
- Implement rate limiting
- Set up logging and monitoring
- Use environment-specific configurations
- Deploy frontend to CDN (Vercel, Netlify)
- Deploy backend to cloud platform (AWS, Heroku, DigitalOcean)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Flask team for the excellent web framework
- Scikit-learn for ML capabilities
- React team for the frontend framework

## 📧 Support

For support, email support@threatlens.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Real-time threat intelligence feeds
- [ ] Advanced ML model training interface
- [ ] Multi-user organization support
- [ ] API rate limiting
- [ ] Webhook notifications
- [ ] Dark web monitoring
- [ ] Mobile application
- [ ] Browser extension

---

**Made with ❤️ for cybersecurity professionals**
