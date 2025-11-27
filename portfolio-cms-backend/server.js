const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.SESSION_SECRET || 'your-secret-key';

// Allowed origins
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'cv' ?
            path.join(__dirname, '../assets') :
            path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG, GIF) and PDF files are allowed!'));
        }
    }
});

// Helper function to read database
const readDatabase = () => {
    const dbPath = path.join(__dirname, 'database', 'data.json');
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write database
const writeDatabase = (data) => {
    const dbPath = path.join(__dirname, 'database', 'data.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
        req.user = user;
        next();
    });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Create token
        const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, message: 'Login successful', token: token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logout (Client just deletes token, but we can have an endpoint for consistency)
app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
});

// Check auth status (Verify token)
app.get('/api/auth/status', authenticateToken, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

// ==================== PUBLIC ROUTES ====================

// Get all projects
app.get('/api/projects', (req, res) => {
    try {
        const db = readDatabase();
        res.json(db.projects.sort((a, b) => a.order - b.order));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get all experience
app.get('/api/experience', (req, res) => {
    try {
        const db = readDatabase();
        res.json(db.experience.sort((a, b) => a.order - b.order));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
});

// Get about section
app.get('/api/about', (req, res) => {
    try {
        const db = readDatabase();
        res.json(db.about);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch about section' });
    }
});

// Get CV info
app.get('/api/cv', (req, res) => {
    try {
        const db = readDatabase();
        res.json(db.cv);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch CV info' });
    }
});

// ==================== PROTECTED ROUTES ====================

// Create project
app.post('/api/projects', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const db = readDatabase();
        const newProject = {
            id: Date.now().toString(),
            title: req.body.title,
            overline: req.body.overline || 'Featured Project',
            description: req.body.description,
            technologies: JSON.parse(req.body.technologies || '[]'),
            githubUrl: req.body.githubUrl || '#',
            liveUrl: req.body.liveUrl || '#',
            image: req.file ? `uploads/${req.file.filename}` : '',
            order: db.projects.length + 1
        };

        db.projects.push(newProject);
        writeDatabase(db);
        res.json({ success: true, project: newProject });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project: ' + error.message });
    }
});

// Update project
app.put('/api/projects/:id', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const db = readDatabase();
        const projectIndex = db.projects.findIndex(p => p.id === req.params.id);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = {
            ...db.projects[projectIndex],
            title: req.body.title,
            overline: req.body.overline,
            description: req.body.description,
            technologies: JSON.parse(req.body.technologies || '[]'),
            githubUrl: req.body.githubUrl,
            liveUrl: req.body.liveUrl
        };

        if (req.file) {
            updatedProject.image = `uploads/${req.file.filename}`;
        }

        db.projects[projectIndex] = updatedProject;
        writeDatabase(db);
        res.json({ success: true, project: updatedProject });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project: ' + error.message });
    }
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    try {
        const db = readDatabase();
        const projectIndex = db.projects.findIndex(p => p.id === req.params.id);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        db.projects.splice(projectIndex, 1);
        writeDatabase(db);
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Create experience
app.post('/api/experience', authenticateToken, (req, res) => {
    try {
        const db = readDatabase();
        const newExperience = {
            id: Date.now().toString(),
            company: req.body.company,
            position: req.body.position,
            period: req.body.period,
            description: JSON.parse(req.body.description || '[]'),
            tabName: req.body.tabName,
            order: db.experience.length + 1,
            isActive: false
        };

        db.experience.push(newExperience);
        writeDatabase(db);
        res.json({ success: true, experience: newExperience });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create experience: ' + error.message });
    }
});

// Update experience
app.put('/api/experience/:id', authenticateToken, (req, res) => {
    try {
        const db = readDatabase();
        const expIndex = db.experience.findIndex(e => e.id === req.params.id);

        if (expIndex === -1) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        const updatedExperience = {
            ...db.experience[expIndex],
            company: req.body.company,
            position: req.body.position,
            period: req.body.period,
            description: JSON.parse(req.body.description || '[]'),
            tabName: req.body.tabName
        };

        db.experience[expIndex] = updatedExperience;
        writeDatabase(db);
        res.json({ success: true, experience: updatedExperience });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update experience: ' + error.message });
    }
});

// Delete experience
app.delete('/api/experience/:id', authenticateToken, (req, res) => {
    try {
        const db = readDatabase();
        const expIndex = db.experience.findIndex(e => e.id === req.params.id);

        if (expIndex === -1) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        db.experience.splice(expIndex, 1);
        writeDatabase(db);
        res.json({ success: true, message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// Update about section
app.put('/api/about', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const db = readDatabase();

        db.about = {
            name: req.body.name,
            title: req.body.title,
            location: req.body.location,
            description: JSON.parse(req.body.description || '[]'),
            technologies: JSON.parse(req.body.technologies || '[]'),
            image: req.file ? `uploads/${req.file.filename}` : db.about.image
        };

        writeDatabase(db);
        res.json({ success: true, about: db.about });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update about section: ' + error.message });
    }
});

// Upload CV
app.post('/api/cv', authenticateToken, upload.single('cv'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const db = readDatabase();
        db.cv = {
            filename: req.file.originalname,
            path: `assets/${req.file.filename}`,
            uploadedAt: new Date().toISOString()
        };

        writeDatabase(db);
        res.json({ success: true, cv: db.cv });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload CV: ' + error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Portfolio CMS API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio CMS API running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
