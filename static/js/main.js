/**
 * MarketPulse - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Toggle icon if needed
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // FAQ accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Toggle icon rotation
            const icon = this.querySelector('i');
            icon.classList.toggle('rotate-180');
            
            // Toggle content visibility
            const content = this.nextElementSibling;
            content.classList.toggle('hidden');
        });
    });
    
    // Scroll to form if URL has #free-trial hash
    if (window.location.hash === '#free-trial') {
        const freeTrialSection = document.getElementById('free-trial');
        if (freeTrialSection) {
            setTimeout(() => {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: freeTrialSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
    
    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Add class for elements to animate
    document.querySelectorAll('section > div > div').forEach(div => {
        div.classList.add('animate-on-scroll');
    });
    
    // Run on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
