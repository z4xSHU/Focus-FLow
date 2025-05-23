// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const homeLogo = document.getElementById('home-logo');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    const animateItems = document.querySelectorAll('.animate-item');
    
    // Auth Modal
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Timer
    const pomodoroContainer = document.getElementById('pomodoro-container');
    const timerDisplay = document.querySelector('.time');
    const timerLabel = document.querySelector('.timer-label');
    const startTimerBtn = document.getElementById('start-timer');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const timerOptions = document.querySelectorAll('.timer-option');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    // Dark Mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Form Submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Timer Settings
    let focusDuration = 25 * 60; // 25 minutes in seconds
    let breakDuration = 5 * 60; // 5 minutes in seconds
    let longBreakDuration = 15 * 60; // 15 minutes in seconds
    let currentMode = 'focus';
    let timeLeft = focusDuration;
    let timerInterval = null;
    let isRunning = false;
    
    // Initialize animations on page load
    setTimeout(function() {
        document.querySelectorAll('.hero-section .animate-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, 300 * index);
        });
    }, 500);
    
    // Animate sections when scrolled into view
    function animateOnScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('active');
                
                // Animate items within the section
                const animItems = section.querySelectorAll('.animate-item:not(.active)');
                animItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, 200 * index);
                });
            }
        });
    }
    
    // Scroll event for animations
    window.addEventListener('scroll', animateOnScroll);
    // Initial check
    animateOnScroll();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Logo click to return to homepage
    homeLogo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Open login/signup modal
    loginBtn.addEventListener('click', function() {
        authModal.style.display = 'flex';
        document.querySelector('[data-tab="login"]').click();
    });
    
    signupBtn.addEventListener('click', function() {
        authModal.style.display = 'flex';
        document.querySelector('[data-tab="signup"]').click();
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        authModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Auth tabs switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to current tab and form
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // In a real application, you would send these credentials to your server
        console.log('Login submitted:', { email, password });
        
        // For demo purposes, directly show the pomodoro timer
        authModal.style.display = 'none';
        pomodoroContainer.classList.remove('hidden');
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // In a real application, you would send this data to your server
        console.log('Signup submitted:', { name, email, password });
        
        // For demo purposes, directly show the pomodoro timer
        authModal.style.display = 'none';
        pomodoroContainer.classList.remove('hidden');
    });
    
    // Timer functionality
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startTimerBtn.classList.add('hidden');
            pauseTimerBtn.classList.remove('hidden');
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    
                    // Play notification sound
                    const audio = new Audio('https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.0/alarm-clock.mp3');
                    audio.play();
                    
                    // Switch modes
                    if (currentMode === 'focus') {
                        currentMode = 'break';
                        timeLeft = breakDuration;
                        timerLabel.textContent = 'Break Time';
                        document.querySelector('[data-time="break"]').click();
                    } else {
                        currentMode = 'focus';
                        timeLeft = focusDuration;
                        timerLabel.textContent = 'Focus Time';
                        document.querySelector('[data-time="focus"]').click();
                    }
                    
                    updateTimerDisplay();
                    startTimerBtn.classList.remove('hidden');
                    pauseTimerBtn.classList.add('hidden');
                }
            }, 1000);
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            startTimerBtn.classList.remove('hidden');
            pauseTimerBtn.classList.add('hidden');
        }
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        
        if (currentMode === 'focus') {
            timeLeft = focusDuration;
        } else if (currentMode === 'break') {
            timeLeft = breakDuration;
        } else {
            timeLeft = longBreakDuration;
        }
        
        updateTimerDisplay();
        startTimerBtn.classList.remove('hidden');
        pauseTimerBtn.classList.add('hidden');
    }
    
    // Timer control buttons
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Timer options
    timerOptions.forEach(option => {
        option.addEventListener('click', function() {
            timerOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const timerType = this.getAttribute('data-time');
            currentMode = timerType;
            
            if (timerType === 'focus') {
                timeLeft = focusDuration;
                timerLabel.textContent = 'Focus Time';
            } else if (timerType === 'break') {
                timeLeft = breakDuration;
                timerLabel.textContent = 'Break Time';
            } else if (timerType === 'long-break') {
                timeLeft = longBreakDuration;
                timerLabel.textContent = 'Long Break';
            }
            
            // Reset timer
            clearInterval(timerInterval);
            isRunning = false;
            updateTimerDisplay();
            startTimerBtn.classList.remove('hidden');
            pauseTimerBtn.classList.add('hidden');
        });
    });
    
    // Save timer settings
    saveSettingsBtn.addEventListener('click', function() {
        focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
        breakDuration = parseInt(document.getElementById('break-duration').value) * 60;
        longBreakDuration = parseInt(document.getElementById('long-break-duration').value) * 60;
        
        // Update current timer if needed
        if (currentMode === 'focus' && !isRunning) {
            timeLeft = focusDuration;
        } else if (currentMode === 'break' && !isRunning) {
            timeLeft = breakDuration;
        } else if (currentMode === 'long-break' && !isRunning) {
            timeLeft = longBreakDuration;
        }
        
        updateTimerDisplay();
        alert('Settings saved successfully!');
    });
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });
    
    // Sidebar menu items
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Apply blur effect to all other items
            menuItems.forEach(menuItem => {
                if (menuItem !== this) {
                    menuItem.style.opacity = '0.5';
                }
            });
            
            // Apply glassmorphic effect to hovered item
            this.classList.add('glassmorphic');
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove blur effect from all items
            menuItems.forEach(menuItem => {
                menuItem.style.opacity = '1';
            });
            
            // Remove glassmorphic effect
            this.classList.remove('glassmorphic');
        });
    }
);
    // Initial state for menu items
    menuItems.forEach(item => {
        item.style.opacity = '1';
        item.classList.remove('glassmorphic');
    });
    
    // Initialize dark mode based on user preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}
);