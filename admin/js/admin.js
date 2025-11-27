const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_URL = isLocal
    ? 'http://localhost:3000/api'
    : 'https://my-portfolio-gbxd.onrender.com/api';

// Check authentication on page load
window.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadAllData();
    setupEventListeners();
});

// Get token from local storage
function getToken() {
    return localStorage.getItem('adminToken');
}

// Check if user is authenticated
async function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/status`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Project form
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    document.getElementById('projectImage').addEventListener('change', previewProjectImage);

    // Experience form
    document.getElementById('experienceForm').addEventListener('submit', handleExperienceSubmit);
}

// Switch tabs
function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// Load all data
async function loadAllData() {
    await loadProjects();
    await loadExperience();
    await loadAbout();
    await loadCV();
}

// ==================== PROJECTS ====================

async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();

        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        if (projects.length === 0) {
            projectsList.innerHTML = '<p style="color: var(--text-secondary);">No projects yet. Add your first project!</p>';
            return;
        }

        projects.forEach(project => {
            const card = createProjectCard(project);
            projectsList.appendChild(card);
        });
    } catch (error) {
        showToast('Failed to load projects', 'error');
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const imageUrl = project.image.startsWith('uploads/')
        ? `http://localhost:3000/${project.image}`
        : `../${project.image}`;

    card.innerHTML = `
        ${project.image ? `<img src="${imageUrl}" alt="${project.title}" class="item-image">` : ''}
        <div class="item-subtitle">${project.overline}</div>
        <h3 class="item-title">${project.title}</h3>
        <p class="item-description">${project.description}</p>
        <div class="item-tags">
            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
        <div class="item-actions">
            <button class="btn-edit" onclick="editProject('${project.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteProject('${project.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

function showAddProjectModal() {
    document.getElementById('projectModalTitle').textContent = 'Add Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectImagePreview').innerHTML = '';
    document.getElementById('projectModal').classList.add('show');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
}

async function editProject(id) {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        const project = projects.find(p => p.id === id);

        if (!project) return;

        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectOverline').value = project.overline;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTechnologies').value = project.technologies.join(', ');
        document.getElementById('projectGithub').value = project.githubUrl;
        document.getElementById('projectLive').value = project.liveUrl;

        if (project.image) {
            const imageUrl = project.image.startsWith('uploads/')
                ? `http://localhost:3000/${project.image}`
                : `../${project.image}`;
            document.getElementById('projectImagePreview').innerHTML =
                `<img src="${imageUrl}" alt="${project.title}">`;
        }

        document.getElementById('projectModal').classList.add('show');
    } catch (error) {
        showToast('Failed to load project', 'error');
    }
}

async function handleProjectSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const id = document.getElementById('projectId').value;

    formData.append('title', document.getElementById('projectTitle').value);
    formData.append('overline', document.getElementById('projectOverline').value);
    formData.append('description', document.getElementById('projectDescription').value);
    formData.append('technologies', JSON.stringify(
        document.getElementById('projectTechnologies').value.split(',').map(t => t.trim())
    ));
    formData.append('githubUrl', document.getElementById('projectGithub').value || '#');
    formData.append('liveUrl', document.getElementById('projectLive').value || '#');

    const imageFile = document.getElementById('projectImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const url = id ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (response.ok) {
            showToast(id ? 'Project updated!' : 'Project added!', 'success');
            closeProjectModal();
            await loadProjects();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to save project', 'error');
        }
    } catch (error) {
        showToast('Failed to save project', 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            showToast('Project deleted!', 'success');
            await loadProjects();
        } else {
            showToast('Failed to delete project', 'error');
        }
    } catch (error) {
        showToast('Failed to delete project', 'error');
    }
}

function previewProjectImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('projectImagePreview').innerHTML =
                `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// ==================== EXPERIENCE ====================

async function loadExperience() {
    try {
        const response = await fetch(`${API_URL}/experience`);
        const experiences = await response.json();

        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = '';

        if (experiences.length === 0) {
            experienceList.innerHTML = '<p style="color: var(--text-secondary);">No experience yet. Add your first experience!</p>';
            return;
        }

        experiences.forEach(exp => {
            const card = createExperienceCard(exp);
            experienceList.appendChild(card);
        });
    } catch (error) {
        showToast('Failed to load experience', 'error');
    }
}

function createExperienceCard(exp) {
    const card = document.createElement('div');
    card.className = 'item-card';

    card.innerHTML = `
        <div class="item-subtitle">${exp.tabName}</div>
        <h3 class="item-title">${exp.position}</h3>
        <p style="color: var(--accent); margin-bottom: 10px;">${exp.company}</p>
        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 15px;">${exp.period}</p>
        <ul style="color: var(--text-secondary); font-size: 14px; line-height: 1.8; padding-left: 20px;">
            ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
        </ul>
        <div class="item-actions">
            <button class="btn-edit" onclick="editExperience('${exp.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteExperience('${exp.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

function showAddExperienceModal() {
    document.getElementById('experienceModalTitle').textContent = 'Add Experience';
    document.getElementById('experienceForm').reset();
    document.getElementById('experienceId').value = '';

    // Reset description points
    document.getElementById('descriptionPoints').innerHTML = `
        <div class="description-point">
            <input type="text" class="desc-input" placeholder="Description point 1">
            <button type="button" class="btn-remove" onclick="removeDescPoint(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.getElementById('experienceModal').classList.add('show');
}

function closeExperienceModal() {
    document.getElementById('experienceModal').classList.remove('show');
}

function addDescPoint() {
    const container = document.getElementById('descriptionPoints');
    const count = container.children.length + 1;

    const point = document.createElement('div');
    point.className = 'description-point';
    point.innerHTML = `
        <input type="text" class="desc-input" placeholder="Description point ${count}">
        <button type="button" class="btn-remove" onclick="removeDescPoint(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(point);
}

function removeDescPoint(btn) {
    const container = document.getElementById('descriptionPoints');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    } else {
        showToast('At least one description point is required', 'error');
    }
}

async function editExperience(id) {
    try {
        const response = await fetch(`${API_URL}/experience`);
        const experiences = await response.json();
        const exp = experiences.find(e => e.id === id);

        if (!exp) return;

        document.getElementById('experienceModalTitle').textContent = 'Edit Experience';
        document.getElementById('experienceId').value = exp.id;
        document.getElementById('experienceCompany').value = exp.company;
        document.getElementById('experiencePosition').value = exp.position;
        document.getElementById('experiencePeriod').value = exp.period;
        document.getElementById('experienceTabName').value = exp.tabName;

        // Set description points
        const container = document.getElementById('descriptionPoints');
        container.innerHTML = '';
        exp.description.forEach((desc, index) => {
            const point = document.createElement('div');
            point.className = 'description-point';
            point.innerHTML = `
                <input type="text" class="desc-input" value="${desc}" placeholder="Description point ${index + 1}">
                <button type="button" class="btn-remove" onclick="removeDescPoint(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(point);
        });

        document.getElementById('experienceModal').classList.add('show');
    } catch (error) {
        showToast('Failed to load experience', 'error');
    }
}

async function handleExperienceSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('experienceId').value;
    const descPoints = Array.from(document.querySelectorAll('.desc-input'))
        .map(input => input.value.trim())
        .filter(val => val !== '');

    if (descPoints.length === 0) {
        showToast('At least one description point is required', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('company', document.getElementById('experienceCompany').value);
    formData.append('position', document.getElementById('experiencePosition').value);
    formData.append('period', document.getElementById('experiencePeriod').value);
    formData.append('tabName', document.getElementById('experienceTabName').value);
    formData.append('description', JSON.stringify(descPoints));

    try {
        const url = id ? `${API_URL}/experience/${id}` : `${API_URL}/experience`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (response.ok) {
            showToast(id ? 'Experience updated!' : 'Experience added!', 'success');
            closeExperienceModal();
            await loadExperience();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to save experience', 'error');
        }
    } catch (error) {
        showToast('Failed to save experience', 'error');
    }
}

async function deleteExperience(id) {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
        const response = await fetch(`${API_URL}/experience/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            showToast('Experience deleted!', 'success');
            await loadExperience();
        } else {
            showToast('Failed to delete experience', 'error');
        }
    } catch (error) {
        showToast('Failed to delete experience', 'error');
    }
}

// ==================== ABOUT ====================

async function loadAbout() {
    try {
        const response = await fetch(`${API_URL}/about`);
        const about = await response.json();

        const aboutForm = document.getElementById('aboutForm');
        aboutForm.innerHTML = `
            <form id="aboutUpdateForm">
                <div class="form-group">
                    <label for="aboutName">Name *</label>
                    <input type="text" id="aboutName" value="${about.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="aboutTitle">Title *</label>
                    <input type="text" id="aboutTitle" value="${about.title}" required>
                </div>
                
                <div class="form-group">
                    <label for="aboutLocation">Location *</label>
                    <input type="text" id="aboutLocation" value="${about.location}" required>
                </div>
                
                <div class="form-group">
                    <label>Description Paragraphs *</label>
                    <div id="aboutDescPoints">
                        ${about.description.map((desc, i) => `
                            <div class="description-point" style="margin-bottom: 15px;">
                                <textarea class="about-desc-input" rows="3" placeholder="Paragraph ${i + 1}">${desc}</textarea>
                                <button type="button" class="btn-remove" onclick="removeAboutDesc(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-add-point" onclick="addAboutDesc()">
                        <i class="fas fa-plus"></i> Add Paragraph
                    </button>
                </div>
                
                <div class="form-group">
                    <label for="aboutTechnologies">Technologies (comma-separated) *</label>
                    <input type="text" id="aboutTechnologies" value="${about.technologies.join(', ')}" required>
                </div>
                
                <div class="form-group">
                    <label for="aboutImage">Profile Image</label>
                    <input type="file" id="aboutImage" accept="image/*">
                    <div class="image-preview">
                        <img src="../${about.image}" alt="Profile">
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </form>
        `;

        document.getElementById('aboutUpdateForm').addEventListener('submit', handleAboutSubmit);
    } catch (error) {
        showToast('Failed to load about section', 'error');
    }
}

function addAboutDesc() {
    const container = document.getElementById('aboutDescPoints');
    const count = container.children.length + 1;

    const point = document.createElement('div');
    point.className = 'description-point';
    point.style.marginBottom = '15px';
    point.innerHTML = `
        <textarea class="about-desc-input" rows="3" placeholder="Paragraph ${count}"></textarea>
        <button type="button" class="btn-remove" onclick="removeAboutDesc(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(point);
}

function removeAboutDesc(btn) {
    const container = document.getElementById('aboutDescPoints');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    } else {
        showToast('At least one paragraph is required', 'error');
    }
}

async function handleAboutSubmit(e) {
    e.preventDefault();

    const descPoints = Array.from(document.querySelectorAll('.about-desc-input'))
        .map(input => input.value.trim())
        .filter(val => val !== '');

    const formData = new FormData();
    formData.append('name', document.getElementById('aboutName').value);
    formData.append('title', document.getElementById('aboutTitle').value);
    formData.append('location', document.getElementById('aboutLocation').value);
    formData.append('description', JSON.stringify(descPoints));
    formData.append('technologies', JSON.stringify(
        document.getElementById('aboutTechnologies').value.split(',').map(t => t.trim())
    ));

    const imageFile = document.getElementById('aboutImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_URL}/about`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (response.ok) {
            showToast('About section updated!', 'success');
            await loadAbout();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to update about section', 'error');
        }
    } catch (error) {
        showToast('Failed to update about section', 'error');
    }
}

// ==================== CV ====================

async function loadCV() {
    try {
        const response = await fetch(`${API_URL}/cv`);
        const cv = await response.json();

        const cvSection = document.getElementById('cvSection');
        cvSection.innerHTML = `
            <div class="cv-info">
                <div class="cv-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="cv-details">
                    <h4>Current CV</h4>
                    <p>${cv.filename}</p>
                    <p style="font-size: 12px; margin-top: 5px;">Uploaded: ${new Date(cv.uploadedAt).toLocaleDateString()}</p>
                    <a href="../${cv.path}" target="_blank" class="btn-primary" style="margin-top: 10px; display: inline-flex;">
                        <i class="fas fa-download"></i> Download CV
                    </a>
                </div>
            </div>
            
            <form id="cvUploadForm">
                <div class="form-group">
                    <label for="cvFile">Upload New CV (PDF only)</label>
                    <input type="file" id="cvFile" accept=".pdf" required>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-upload"></i> Upload CV
                </button>
            </form>
        `;

        document.getElementById('cvUploadForm').addEventListener('submit', handleCVUpload);
    } catch (error) {
        showToast('Failed to load CV info', 'error');
    }
}

async function handleCVUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById('cvFile');
    const file = fileInput.files[0];

    if (!file) {
        showToast('Please select a PDF file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    const token = getToken();
    console.log('Uploading CV with token:', token);

    try {
        const response = await fetch(`${API_URL}/cv`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        console.log('CV Upload Response Status:', response.status);

        if (response.ok) {
            showToast('CV uploaded successfully!', 'success');
            await loadCV();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to upload CV', 'error');
        }
    } catch (error) {
        showToast('Failed to upload CV', 'error');
    }
}

// ==================== UTILITIES ====================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
