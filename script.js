document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

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

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.hero, .about, .experience, .work, .contact');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});

// Tab Functionality for Experience Section
function openTab(evt, jobName) {
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
    evt.currentTarget.className += " active";
}
