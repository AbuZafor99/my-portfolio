# Portfolio CMS - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd "portfolio-cms-backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file and set your credentials:**
   ```env
   PORT=3000
   NODE_ENV=development
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password_here
   SESSION_SECRET=your_random_session_secret_here
   FRONTEND_URL=http://127.0.0.1:5500
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   The API will be running at `http://localhost:3000`

### Frontend Setup

1. **Open your portfolio site:**
   - Use Live Server extension in VS Code, or
   - Use any local web server to serve the portfolio files

2. **Access the admin dashboard:**
   - Navigate to `http://127.0.0.1:5500/admin/login.html`
   - Login with the credentials you set in `.env`

## 📝 Usage

### Admin Dashboard

The dashboard has 4 main sections:

1. **Projects** - Add, edit, delete projects with images
2. **Experience** - Manage your work experience
3. **About** - Update your about section and profile image
4. **CV** - Upload and manage your CV (PDF)

### Making Changes

1. Login to the admin dashboard
2. Navigate to the section you want to update
3. Click "Add" to create new items or "Edit" to modify existing ones
4. Upload images directly through the dashboard
5. Changes appear on your portfolio site immediately!

## 🌐 Deployment

### Backend Deployment (Choose one)

#### Option 1: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub or upload files
4. Add environment variables in Railway dashboard
5. Copy the deployment URL

#### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Set environment variables
5. Deploy

#### Option 3: Vercel
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in backend directory
4. Follow prompts to deploy

### Frontend Deployment

Your frontend is already on GitHub Pages at `abuzafor.me`!

**Update API URL for production:**

1. In `js/api.js`, update the API URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

2. In `admin/login.html` and `admin/js/admin.js`, update:
   ```javascript
   const API_URL = 'https://your-backend-url.com/api';
   ```

3. Commit and push changes to GitHub

## 🔒 Security Notes

- **Change default credentials** in `.env` before deploying
- Use strong passwords for admin access
- Enable HTTPS in production
- Keep your `.env` file secret (never commit it to Git)
- Consider adding rate limiting for production

## 📚 API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/experience` - Get all experience
- `GET /api/about` - Get about section
- `GET /api/cv` - Get CV info

### Protected Endpoints (require authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/experience` - Create experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience
- `PUT /api/about` - Update about section
- `POST /api/cv` - Upload CV

## 🛠️ Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Verify all dependencies are installed
- Check `.env` file exists and is configured

### Can't login to dashboard
- Verify backend is running
- Check credentials in `.env` file
- Clear browser cookies and try again

### Images not loading
- Ensure backend server is running
- Check image paths in database
- Verify CORS settings in backend

### Frontend not fetching data
- Check API URL in `js/api.js`
- Verify backend is accessible
- Check browser console for errors

## 📞 Support

If you encounter any issues, check:
1. Backend server logs
2. Browser console errors
3. Network tab in browser DevTools

---

**Enjoy your new CMS dashboard! 🎉**
