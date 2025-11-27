// API Configuration
// API Configuration
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_BASE_URL = isLocal
    ? 'http://localhost:3000/api'
    : 'https://your-backend-url-on-render.com/api'; // You will update this after deployment

// API Client
class PortfolioAPI {
    // Fetch all projects
    static async getProjects() {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

    // Fetch all experience
    static async getExperience() {
        try {
            const response = await fetch(`${API_BASE_URL}/experience`);
            if (!response.ok) throw new Error('Failed to fetch experience');
            return await response.json();
        } catch (error) {
            console.error('Error fetching experience:', error);
            return [];
        }
    }

    // Fetch about section
    static async getAbout() {
        try {
            const response = await fetch(`${API_BASE_URL}/about`);
            if (!response.ok) throw new Error('Failed to fetch about');
            return await response.json();
        } catch (error) {
            console.error('Error fetching about:', error);
            return null;
        }
    }

    // Fetch CV info
    static async getCV() {
        try {
            const response = await fetch(`${API_BASE_URL}/cv`);
            if (!response.ok) throw new Error('Failed to fetch CV');
            return await response.json();
        } catch (error) {
            console.error('Error fetching CV:', error);
            return null;
        }
    }

    // Helper to get image URL
    static getImageURL(imagePath) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('uploads/')) {
            return `http://localhost:3000/${imagePath}`;
        }
        return imagePath;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAPI;
}
