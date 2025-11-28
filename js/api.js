// API Configuration
// API Configuration
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_BASE_URL = isLocal
    ? 'http://localhost:3000/api'
    : 'https://my-portfolio-gbxd.onrender.com/api';

// API Client
class PortfolioAPI {
    // Cache helpers
    static get CACHE_VERSION() {
        return 'v1.0'; // Increment this to force cache clear
    }

    static getCached(key) {
        try {
            const cachedVersion = localStorage.getItem('portfolio_cache_version');
            if (cachedVersion !== this.CACHE_VERSION) {
                // Clear old cache if version mismatch
                this.clearCache();
                localStorage.setItem('portfolio_cache_version', this.CACHE_VERSION);
                return null;
            }

            const data = localStorage.getItem(`portfolio_cache_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    static setCache(key, data) {
        try {
            localStorage.setItem(`portfolio_cache_${key}`, JSON.stringify(data));
            localStorage.setItem('portfolio_cache_version', this.CACHE_VERSION);
        } catch (e) {
            console.error('Cache save failed', e);
        }
    }

    static clearCache() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('portfolio_cache_')) {
                localStorage.removeItem(key);
            }
        });
    }

    // Fetch all projects
    static async getProjects() {
        const cached = this.getCached('projects');

        // Fetch in background if cached exists
        const fetchPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/projects`);
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                this.setCache('projects', data);
                return data;
            } catch (error) {
                console.error('Error fetching projects:', error);
                return [];
            }
        })();

        if (cached) return cached;
        return await fetchPromise;
    }

    // Fetch all experience
    static async getExperience() {
        const cached = this.getCached('experience');

        const fetchPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/experience`);
                if (!response.ok) throw new Error('Failed to fetch experience');
                const data = await response.json();
                this.setCache('experience', data);
                return data;
            } catch (error) {
                console.error('Error fetching experience:', error);
                return [];
            }
        })();

        if (cached) return cached;
        return await fetchPromise;
    }

    // Fetch about section
    static async getAbout() {
        const cached = this.getCached('about');

        const fetchPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/about`);
                if (!response.ok) throw new Error('Failed to fetch about');
                const data = await response.json();
                this.setCache('about', data);
                return data;
            } catch (error) {
                console.error('Error fetching about:', error);
                return null;
            }
        })();

        if (cached) return cached;
        return await fetchPromise;
    }

    // Fetch CV info
    static async getCV() {
        const cached = this.getCached('cv');

        const fetchPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/cv`);
                if (!response.ok) throw new Error('Failed to fetch CV');
                const data = await response.json();
                this.setCache('cv', data);
                return data;
            } catch (error) {
                console.error('Error fetching CV:', error);
                return null;
            }
        })();

        if (cached) return cached;
        return await fetchPromise;
    }

    // Helper to get image URL
    static getImageURL(imagePath) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('uploads/')) {
            const baseUrl = API_BASE_URL.replace('/api', '');
            return `${baseUrl}/${imagePath}`;
        }
        return imagePath;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAPI;
}
