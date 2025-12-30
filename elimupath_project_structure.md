# ElimuPath - Production MVP Setup Guide

## Project Structure

```
elimupath/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json
│   ├── .env.example
│   ├── .env                   # Your environment variables (not in git)
│   └── database/
│       └── schema.sql         # Database schema
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx            # Main React app
│   │   ├── index.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Backend Setup

### 1. Create `backend/package.json`

```json
{
  "name": "elimupath-backend",
  "version": "1.0.0",
  "description": "ElimuPath KCSE Analysis API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Create `backend/.env.example`

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/elimupath

# Server
PORT=3000
NODE_ENV=production
BASE_URL=https://your-api-domain.com

# M-PESA Daraja API (Safaricom)
# Get these from https://developer.safaricom.co.ke
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey

# M-PESA URLs
# Sandbox (for testing)
MPESA_AUTH_URL=https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
MPESA_STK_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest

# Production (when ready)
# MPESA_AUTH_URL=https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
# MPESA_STK_URL=https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Setup PostgreSQL Database

```bash
# Create database
createdb elimupath

# Or using psql
psql -U postgres
CREATE DATABASE elimupath;
\q

# Run schema
psql -U postgres -d elimupath -f database/schema.sql
```

## Frontend Setup

### 1. Create React App

```bash
npx create-react-app frontend
cd frontend
```

### 2. Install Additional Dependencies

```bash
npm install lucide-react axios
```

### 3. Create `frontend/.env.example`

```env
REACT_APP_API_URL=http://localhost:3000
```

### 4. Update `frontend/src/index.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 5. Create `frontend/src/App.jsx`

Copy the React component code from the artifact into this file, but add API integration:

```jsx
// Add at the top of App.jsx
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Update the handleAnalyze function in ResultsInput component:
const handleAnalyze = async () => {
  if (!smsText.trim()) {
    alert('Please paste your KCSE results SMS');
    return;
  }
  setLoading(true);
  try {
    const response = await axios.post(`${API_URL}/api/parse-results`, {
      smsText
    });
    onAnalyze(response.data.analysisId, smsText);
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to parse results');
  } finally {
    setLoading(false);
  }
};

// Update handlePay in Payment component:
const handlePay = async () => {
  if (!phone.match(/^254\d{9}$/)) {
    alert('Please enter a valid phone number (format: 254XXXXXXXXX)');
    return;
  }
  setLoading(true);
  try {
    await axios.post(`${API_URL}/api/pay`, {
      analysisId,
      phoneNumber: phone
    });
    
    // Poll for payment status
    const pollInterval = setInterval(async () => {
      const statusResponse = await axios.get(`${API_URL}/api/payment-status/${analysisId}`);
      if (statusResponse.data.isPaid) {
        clearInterval(pollInterval);
        onSuccess();
      }
    }, 3000);
    
    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  } catch (error) {
    alert(error.response?.data?.error || 'Payment failed');
    setLoading(false);
  }
};

// Load full analysis in FullAnalysis component:
useEffect(() => {
  const loadAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analysis/${analysisId}`);
      setResults(response.data);
    } catch (error) {
      alert('Failed to load analysis');
    }
  };
  loadAnalysis();
}, [analysisId]);
```

## M-PESA Integration Setup

### 1. Register for Daraja API

1. Go to https://developer.safaricom.co.ke
2. Create an account
3. Create a new app (select "Lipa Na M-PESA Online" for STK Push)
4. Get your Consumer Key and Consumer Secret
5. For testing, use Sandbox credentials
6. For production, apply for "Go Live" and get production credentials

### 2. Configure M-PESA

**Sandbox Testing:**
- Use test credentials from Daraja portal
- Test phone number: 254708374149
- Test amount: Any amount (won't be charged)

**Production:**
1. Get your Business Short Code (Paybill number)
2. Get your Passkey from Safaricom
3. Set up your callback URL (must be HTTPS)
4. Update environment variables with production credentials

### 3. Callback URL Setup

Your callback URL must be publicly accessible and use HTTPS:
- Example: `https://api.elimupath.co.ke/api/payment-callback`
- Safaricom will POST payment results to this URL
- Ensure your server can receive and process these callbacks

## Sample Test SMS Inputs

### Test Case 1: High Performer (Science)
```
KCSE Results 2024
Index No: 12345678901
Name: TEST STUDENT
ENG A-, KIS B+, MAT A-, BIO A, CHEM A-, PHY B+, HIST B, GEO B+, CRE B
Mean Grade: A-
```

### Test Case 2: Average Performer (Arts)
```
KCSE 2024 RESULTS
INDEX: 98765432109
ENG B, KIS B+, MAT C+, BIO B-, CHEM C+, HIST B+, GEO B, CRE B-, BST B
MEAN GRADE: B
```

### Test Case 3: Certificate Level
```
Your KCSE Results
Index: 11223344556
ENG D+, KIS D, MAT D, BIO D+, CHEM D-, HIST D+, GEO D, CRE D+
Mean Grade: D+
```

### Test Case 4: Diploma Level
```
KCSE 2024
12345678902
ENGLISH C+, KISWAHILI C, MATHS C, BIOLOGY C+, CHEMISTRY C, PHYSICS C-, HISTORY C+, GEOGRAPHY C, CRE C+
MEAN GRADE C+
```

## Deployment

### Option 1: Railway.app (Recommended - Easy)

**Backend:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set MPESA_CONSUMER_KEY=xxx
railway variables set MPESA_CONSUMER_SECRET=xxx
# ... set all other variables

# Deploy
railway up
```

**Frontend:**
```bash
# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Option 2: Render.com

**Backend:**
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `cd backend && npm install`
4. Start command: `node backend/server.js`
5. Add PostgreSQL database
6. Set environment variables

**Frontend:**
1. Create new Static Site
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/build`

### Option 3: Heroku

**Backend:**
```bash
# Create app
heroku create elimupath-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set MPESA_CONSUMER_KEY=xxx
# ... set all variables

# Deploy
git push heroku main
```

**Frontend:**
Deploy to Vercel, Netlify, or Cloudflare Pages

## Environment-Specific Configuration

### Development
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your local settings
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Edit .env
npm start
```

### Production Checklist

- [ ] Use production PostgreSQL database (not local)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS for all endpoints
- [ ] Set production M-PESA credentials
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable error logging (Sentry, LogRocket, etc.)
- [ ] Set up monitoring (UptimeRobot, Pingdom)
- [ ] Configure rate limiting
- [ ] Set up SSL certificates
- [ ] Test payment flow end-to-end
- [ ] Add analytics (Google Analytics, Plausible)

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong database passwords**
3. **Enable SSL for database connections**
4. **Validate all user inputs**
5. **Use prepared statements** (already done in code)
6. **Rate limit API endpoints**
7. **Monitor for suspicious activity**
8. **Keep dependencies updated**
9. **Use HTTPS everywhere**
10. **Sanitize error messages** (don't expose internal details)

## Adding More Courses

```sql
INSERT INTO courses (name, type, institution, description, duration, requirements, requirements_text, career_paths) VALUES
('Your Course Name', 'Degree/Diploma/Certificate', 'Institution Names', 
 'Description', 'Duration',
 '{"min_mean_grade": "C+", "required_subjects": {"MAT": "C+"}}'::jsonb,
 'Human readable requirements',
 ARRAY['Career Path 1', 'Career Path 2']);
```

## Monitoring & Analytics

### Database Queries for Insights

```sql
-- Total analyses
SELECT COUNT(*) FROM analysis;

-- Paid analyses
SELECT COUNT(*) FROM analysis WHERE is_paid = true;

-- Revenue
SELECT SUM(amount) FROM payment WHERE status = 'completed';

-- Popular mean grades
SELECT mean_grade, COUNT(*) 
FROM analysis 
GROUP BY mean_grade 
ORDER BY COUNT(*) DESC;

-- Payment success rate
SELECT 
  COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*) * 100 as success_rate
FROM payment;
```

## Troubleshooting

### Common Issues

**Payment not updating:**
- Check callback URL is accessible
- Verify M-PESA credentials
- Check database connection
- Review server logs

**SMS parsing fails:**
- Check SMS format matches expected patterns
- Add more flexible regex patterns
- Log failed SMS for analysis

**Database connection fails:**
- Verify DATABASE_URL format
- Check firewall rules
- Ensure PostgreSQL is running
- Verify credentials

## Support & Maintenance

### Regular Tasks
- Monitor payment success rates
- Review failed analyses
- Update course database
- Check for security updates
- Backup database regularly
- Monitor server resources

### User Support
- Set up email for support queries
- Create FAQ section
- Add WhatsApp support number
- Monitor social media mentions

## License & Legal

Add appropriate legal disclaimers:
- Terms of Service
- Privacy Policy
- Refund Policy (for failed payments)
- KUCCPS disclaimer
- Data protection compliance (Kenya Data Protection Act)

## Next Steps After MVP

1. User accounts (optional)
2. SMS integration for results
3. Institution comparison tool
4. Scholarship information
5. Career aptitude tests
6. Mobile app (React Native)
7. Multi-language support
8. Referral program