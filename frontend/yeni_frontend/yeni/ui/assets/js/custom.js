document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Check if link is to another page
      if (this.getAttribute('href').indexOf('#') === 0) {
        e.preventDefault();
        
        // Get the target section ID
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            // Calculate position to scroll to (with offset for the header)
            const headerHeight = document.querySelector('#header').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            // Smooth scroll to target
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update active state in navigation
            document.querySelectorAll('#navmenu a').forEach(navLink => {
              navLink.classList.remove('active');
            });
            this.classList.add('active');
          }
        }
      }
    });
  });

  // Active state based on scroll position (only on index page)
  if (document.querySelector('.event-category')) {
    window.addEventListener('scroll', function() {
      let current = '';
      const sections = document.querySelectorAll('.event-category');
      const headerHeight = document.querySelector('#header').offsetHeight;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      document.querySelectorAll('#navmenu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // Initialize AOS animation
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});