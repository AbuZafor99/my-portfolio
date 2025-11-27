# 🚀 Quick Start - Portfolio CMS

## ⚡ Get Started in 3 Steps

### Step 1: Setup Backend Environment

```bash
cd portfolio-cms-backend
cp .env.example .env
```

Edit `.env` and set your admin credentials:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Step 2: Start Backend Server

**Option A: Using the start script (Recommended)**
```bash
./start.sh
```

**Option B: Manual start**
```bash
npm install  # If not already installed
npm start
```

Server will run at: `http://localhost:3000`

### Step 3: Access Admin Dashboard

1. Open your portfolio with Live Server (or any web server)
2. Navigate to: `http://127.0.0.1:5500/admin/login.html`
3. Login with your credentials from `.env`

## 🎯 What You Can Do

- ✅ **Add/Edit/Delete Projects** - Upload images, add links
- ✅ **Manage Experience** - Update work history
- ✅ **Edit About Section** - Change bio and skills
- ✅ **Upload CV** - Update your resume

## 📝 Default Credentials (Change These!)

- Username: `admin`
- Password: `admin123`

## 🔗 Important URLs

- Backend API: `http://localhost:3000`
- Admin Login: `http://127.0.0.1:5500/admin/login.html`
- Admin Dashboard: `http://127.0.0.1:5500/admin/index.html`
- Portfolio Site: `http://127.0.0.1:5500/index.html`

## 📚 Full Documentation

See [README-CMS.md](README-CMS.md) for complete setup and deployment guide.

---

**Need Help?** Check the troubleshooting section in README-CMS.md
