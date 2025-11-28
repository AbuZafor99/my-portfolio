function initPortfolio() {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
                navbar.style.height = '70px';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.height = '100px';
            }

            lastScrollTop = scrollTop;
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.hero, .about, .experience, .work, .contact, .slide-up, .slide-left, .slide-right');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                // Remove inline styles if they conflict with CSS classes for animations
                // element.style.opacity = '1'; 
                // element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements are now handled by CSS classes
    // revealElements.forEach(element => {
    //     element.style.opacity = '0';
    //     element.style.transform = 'translateY(20px)';
    //     element.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    // });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

// Initialize when DOM is ready or if already loaded (for dynamic loading)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// Tab Functionality for Experience Section
window.openTab = function (evt, jobName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("job-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(jobName).style.display = "block";
    if (evt) evt.currentTarget.className += " active";
}

// Load Projects
async function loadProjects() {
    const projectList = document.getElementById('projectList');
    if (!projectList) return;

    try {
        const projects = await PortfolioAPI.getProjects();

        if (projects.length === 0) {
            projectList.innerHTML = '<p style="color: #8892b0; text-align: center;">No projects available.</p>';
            return;
        }

        projectList.innerHTML = '';

        projects.forEach((project, index) => {
            const li = document.createElement('li');
            li.className = `project-item ${index % 2 === 0 ? 'slide-left' : 'slide-right'}`;

            const imageUrl = PortfolioAPI.getImageURL(project.image);

            li.innerHTML = `
                    <div class="project-content">
                        <p class="project-overline">${project.overline}</p>
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-description">
                            <p>${project.description}</p>
                        </div>
                        <ul class="project-tech-list">
                            ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                        <div class="project-links">
                            ${project.githubUrl && project.githubUrl !== '#' ?
                    `<a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                            ${project.liveUrl && project.liveUrl !== '#' ?
                    `<a href="${project.liveUrl}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                    <div class="project-image">
                        <a href="${project.githubUrl || '#'}" target="_blank">
                            <img src="${imageUrl}" alt="${project.title}" />
                        </a>
                    </div>
                `;

            projectList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to load projects:', error);
        projectList.innerHTML = '<p style="color: #f87171; text-align: center;">Failed to load projects. Please try again later.</p>';
    }
}

// Load Experience
async function loadExperience() {
    const tabsList = document.getElementById('experienceTabs');
    const contentDiv = document.getElementById('experienceContent');
    if (!tabsList || !contentDiv) return;

    try {
        const experiences = await PortfolioAPI.getExperience();

        if (experiences.length === 0) {
            contentDiv.innerHTML = '<p style="color: #8892b0;">No experience available.</p>';
            return;
        }

        // Create tabs
        tabsList.innerHTML = '';
        experiences.forEach((exp, index) => {
            const li = document.createElement('li');
            li.className = `tab-button ${index === 0 ? 'active' : ''}`;
            li.textContent = exp.tabName;
            li.onclick = (e) => window.openTab(e, `job${exp.id}`);
            tabsList.appendChild(li);
        });

        // Create content
        contentDiv.innerHTML = '';
        experiences.forEach((exp, index) => {
            const div = document.createElement('div');
            div.id = `job${exp.id}`;
            div.className = 'job-content slide-right';
            div.style.display = index === 0 ? 'block' : 'none';

            div.innerHTML = `
                    <h3>
                        ${exp.position}
                        <span>@ ${exp.company}</span>
                    </h3>
                    <p class="range">${exp.period}</p>
                    <ul class="job-desc">
                        ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                `;

            contentDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Failed to load experience:', error);
        contentDiv.innerHTML = '<p style="color: #f87171;">Failed to load experience. Please try again later.</p>';
    }
}

// Load About
async function loadAbout() {
    const aboutText = document.getElementById('aboutText');
    const aboutImage = document.getElementById('aboutImage');
    if (!aboutText) return;

    try {
        const about = await PortfolioAPI.getAbout();

        if (!about) {
            aboutText.innerHTML = '<p style="color: #f87171;">Failed to load about section.</p>';
            return;
        }

        // Build description HTML
        let descriptionHTML = '';
        about.description.forEach(paragraph => {
            descriptionHTML += `<p>${paragraph}</p>`;
        });

        // Build technologies list
        const techListHTML = `
            <ul>
                ${about.technologies.map(tech => `<li>${tech}</li>`).join('')}
            </ul>
        `;

        aboutText.innerHTML = descriptionHTML + techListHTML;

        // Update image
        if (aboutImage) {
            const imageUrl = PortfolioAPI.getImageURL(about.image);
            aboutImage.src = imageUrl;
            aboutImage.alt = about.name;
        }
    } catch (error) {
        console.error('Failed to load about section:', error);
        aboutText.innerHTML = '<p style="color: #f87171;">Failed to load about section. Please try again later.</p>';
    }
}

// Load CV Link
async function loadCVLink() {
    const cvBtn = document.getElementById('cvDownloadBtn');
    if (!cvBtn) return;

    try {
        const cv = await PortfolioAPI.getCV();
        if (cv && cv.path) {
            cvBtn.href = cv.path;
        }
    } catch (error) {
        console.error('Failed to load CV link:', error);
    }
}

// Call load functions
loadProjects();
loadExperience();
loadAbout();
loadCVLink();
}
