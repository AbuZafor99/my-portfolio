async function loadComponents() {
    const components = [
        { id: 'navbar-placeholder', file: 'html/navbar.html' },
        { id: 'sidebars-placeholder', file: 'html/sidebars.html' },
        { id: 'hero-placeholder', file: 'html/hero.html' },
        { id: 'about-placeholder', file: 'html/about.html' },
        { id: 'experience-placeholder', file: 'html/experience.html' },
        { id: 'work-placeholder', file: 'html/work.html' },
        { id: 'contact-placeholder', file: 'html/contact.html' }
    ];

    // Load splash screen first if possible, or just load all
    for (const component of components) {
        const element = document.getElementById(component.id);
        if (element) {
            try {
                const response = await fetch(component.file);
                if (response.ok) {
                    const text = await response.text();
                    element.innerHTML = text;
                } else {
                    console.error(`Failed to load ${component.file}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error loading ${component.file}:`, error);
            }
        }
    }

    // Load main script after content is ready
    const script = document.createElement('script');
    script.src = 'js/script.js';
    script.onload = () => {
        // Hide splash screen after a delay to show animation
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.classList.add('hidden');
                setTimeout(() => splash.remove(), 500); // Remove from DOM
            }
        }, 2000); // 2 seconds splash
    };
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadComponents);
