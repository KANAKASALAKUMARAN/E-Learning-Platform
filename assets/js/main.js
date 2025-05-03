/**
 * LearnHub - E-Learning Platform
 * Main JavaScript file for core functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavbar();
    initCourseCards();
    initAuthentication();
    initQuizzes();
    checkUserLoggedIn();
    initProgressTracking();
    initSearchFilters();
});

/**
 * Initialize navbar functionality
 */
function initNavbar() {
    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Handle mobile navigation toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            document.querySelector('.navbar-collapse').classList.toggle('show');
        });
    }
}

/**
 * Initialize course card interactions
 */
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Add hover effects manually for browsers that might not support CSS transitions
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
        });
    });
}

/**
 * Handle user authentication (login, signup, logout)
 */
function initAuthentication() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (!email || !password) {
                showAlert('Please enter both email and password', 'danger');
                return;
            }
            
            // For demo purposes, we'll use localStorage to simulate user authentication
            // In a real application, you would use a backend server to authenticate users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set logged in user
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'student'
                }));
                
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '../pages/dashboard.html';
                }, 1500);
            } else {
                showAlert('Invalid email or password', 'danger');
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                showAlert('Please fill in all fields', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            // For demo purposes, we'll use localStorage to store users
            // In a real application, you would use a backend server to register users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                showAlert('Email already in use', 'danger');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                role: 'student',
                enrolledCourses: [],
                completedLessons: [],
                achievements: []
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Log the user in
            localStorage.setItem('currentUser', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }));
            
            showAlert('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1500);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            localStorage.removeItem('currentUser');
            showAlert('Logged out successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        });
    }
}

/**
 * Check if user is logged in and update UI accordingly
 */
function checkUserLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginButtons = document.querySelector('.login-buttons');
    const userProfile = document.querySelector('.user-profile');
    
    if (currentUser) {
        // User is logged in
        if (loginButtons) loginButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            const userNameElement = userProfile.querySelector('.user-name');
            if (userNameElement) userNameElement.textContent = currentUser.name;
        }
        
        // Check if the user is on a page that requires authentication
        const requiresAuth = document.body.classList.contains('requires-auth');
        if (requiresAuth) {
            // Allow access
        } else {
            // Check if the user is on login/signup page and redirect if logged in
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('signup.html')) {
                window.location.href = '../pages/dashboard.html';
            }
        }
    } else {
        // User is not logged in
        if (loginButtons) loginButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        
        // Check if the user is on a page that requires authentication
        const requiresAuth = document.body.classList.contains('requires-auth');
        if (requiresAuth) {
            showAlert('Please log in to access this page', 'warning');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 1500);
        }
    }
}

/**
 * Initialize interactive quiz functionality
 */
function initQuizzes() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    const quizOptions = quizContainer.querySelectorAll('.quiz-option');
    const submitQuizBtn = document.getElementById('submitQuiz');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            quizOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', function() {
            const selectedOption = quizContainer.querySelector('.quiz-option.selected');
            if (!selectedOption) {
                showAlert('Please select an answer', 'warning');
                return;
            }
            
            // Get the correct answer (in a real app, this would come from a database)
            const correctAnswer = quizContainer.getAttribute('data-correct');
            const selectedAnswer = selectedOption.getAttribute('data-option');
            
            quizOptions.forEach(option => {
                const optionValue = option.getAttribute('data-option');
                option.classList.remove('correct', 'incorrect');
                
                if (optionValue === correctAnswer) {
                    option.classList.add('correct');
                } else if (optionValue === selectedAnswer && selectedAnswer !== correctAnswer) {
                    option.classList.add('incorrect');
                }
            });
            
            // Disable further selection
            quizOptions.forEach(option => {
                option.style.pointerEvents = 'none';
            });
            
            // Save progress if answer is correct
            if (selectedAnswer === correctAnswer) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    // Get the quiz ID
                    const quizId = quizContainer.getAttribute('data-quiz-id');
                    
                    // Store completed quiz
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(user => user.id === currentUser.id);
                    
                    if (userIndex !== -1) {
                        if (!users[userIndex].completedQuizzes) {
                            users[userIndex].completedQuizzes = [];
                        }
                        
                        if (!users[userIndex].completedQuizzes.includes(quizId)) {
                            users[userIndex].completedQuizzes.push(quizId);
                            localStorage.setItem('users', JSON.stringify(users));
                            
                            // Check for achievements
                            checkForAchievements(users[userIndex]);
                        }
                    }
                    
                    showAlert('Correct! Great job!', 'success');
                    
                    // Show next button if it exists
                    const nextLessonBtn = document.getElementById('nextLesson');
                    if (nextLessonBtn) {
                        nextLessonBtn.style.display = 'block';
                    }
                }
            } else {
                showAlert('Incorrect. Try again!', 'danger');
            }
            
            this.disabled = true;
        });
    }
}

/**
 * Initialize progress tracking functionality
 */
function initProgressTracking() {
    const progressBars = document.querySelectorAll('.course-progress');
    if (!progressBars.length) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get user data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user || !user.completedLessons) return;
    
    // Update each progress bar
    progressBars.forEach(progressBar => {
        const courseId = progressBar.getAttribute('data-course-id');
        const totalLessons = parseInt(progressBar.getAttribute('data-total-lessons'), 10) || 0;
        
        if (!courseId || totalLessons === 0) return;
        
        // Count completed lessons for this course
        const completedLessons = user.completedLessons.filter(
            lesson => lesson.startsWith(`${courseId}-`)
        ).length;
        
        // Calculate progress percentage
        const progressPercent = Math.round((completedLessons / totalLessons) * 100);
        
        // Update progress bar
        const progressBarElement = progressBar.querySelector('.progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = `${progressPercent}%`;
            progressBarElement.setAttribute('aria-valuenow', progressPercent);
            progressBarElement.textContent = `${progressPercent}%`;
        }
        
        // Update text display if exists
        const progressText = progressBar.nextElementSibling;
        if (progressText && progressText.classList.contains('progress-text')) {
            progressText.textContent = `${completedLessons}/${totalLessons} lessons completed`;
        }
    });
}

/**
 * Check for achievements based on user progress
 */
function checkForAchievements(user) {
    if (!user) return;
    
    if (!user.achievements) {
        user.achievements = [];
    }
    
    // Define achievements
    const achievements = [
        {
            id: 'first-lesson',
            title: 'First Steps',
            description: 'Complete your first lesson',
            icon: 'fa-flag-checkered',
            condition: () => user.completedLessons && user.completedLessons.length >= 1
        },
        {
            id: 'five-lessons',
            title: 'Quick Learner',
            description: 'Complete 5 lessons',
            icon: 'fa-bolt',
            condition: () => user.completedLessons && user.completedLessons.length >= 5
        },
        {
            id: 'first-course',
            title: 'Course Graduate',
            description: 'Complete an entire course',
            icon: 'fa-graduation-cap',
            condition: () => {
                if (!user.enrolledCourses || !user.completedLessons) return false;
                
                // Check if any course has all lessons completed
                // This is a simplified check - in a real app, you would check against actual course data
                const courseLessonCounts = {};
                const courseCompletedLessons = {};
                
                user.completedLessons.forEach(lesson => {
                    const courseId = lesson.split('-')[0];
                    if (!courseCompletedLessons[courseId]) {
                        courseCompletedLessons[courseId] = 0;
                    }
                    courseCompletedLessons[courseId]++;
                });
                
                // Mock course data (in a real app, this would come from your database)
                const courses = [
                    { id: '1', totalLessons: 10 },
                    { id: '2', totalLessons: 12 },
                    { id: '3', totalLessons: 8 }
                ];
                
                return courses.some(course => 
                    courseCompletedLessons[course.id] && 
                    courseCompletedLessons[course.id] >= course.totalLessons
                );
            }
        }
    ];
    
    // Check each achievement
    achievements.forEach(achievement => {
        if (!user.achievements.some(a => a.id === achievement.id) && achievement.condition()) {
            // Award the achievement
            user.achievements.push({
                id: achievement.id,
                title: achievement.title,
                earnedAt: new Date().toISOString()
            });
            
            // Save to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Show notification
            showAchievementNotification(achievement);
        }
    });
}

/**
 * Show achievement notification
 */
function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">
            <i class="fas ${achievement.icon}"></i>
        </div>
        <div class="achievement-content">
            <h5>Achievement Unlocked!</h5>
            <p>${achievement.title}</p>
            <p class="text-muted">${achievement.description}</p>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
        
        // Remove after display
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }, 100);
}

/**
 * Initialize search and filter functionality
 */
function initSearchFilters() {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const levelFilters = document.querySelectorAll('.level-filter');
    const courseCards = document.querySelectorAll('.course-card');
    
    if (!searchInput && !categoryFilters.length && !courseCards.length) return;
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    
    // Category filter functionality
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle active class
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            filterCourses();
        });
    });
    
    // Level filter functionality
    levelFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle active class
            levelFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            filterCourses();
        });
    });
    
    function filterCourses() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = document.querySelector('.category-filter.active');
        const selectedLevel = document.querySelector('.level-filter.active');
        
        const categoryValue = selectedCategory ? selectedCategory.getAttribute('data-category') : 'all';
        const levelValue = selectedLevel ? selectedLevel.getAttribute('data-level') : 'all';
        
        courseCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const level = card.getAttribute('data-level');
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '';
            const matchesCategory = categoryValue === 'all' || category === categoryValue;
            const matchesLevel = levelValue === 'all' || level === levelValue;
            
            if (matchesSearch && matchesCategory && matchesLevel) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            const hasVisibleCourses = Array.from(courseCards).some(card => card.style.display !== 'none');
            noResults.style.display = hasVisibleCourses ? 'none' : 'block';
        }
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show fixed-top w-50 mx-auto mt-3`;
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Append to body
    document.body.appendChild(alert);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Initialize the mock data for the e-learning platform
function initMockData() {
    // Check if data has already been initialized
    if (localStorage.getItem('dataInitialized')) return;
    
    // Create mock courses
    const courses = [
        {
            id: '1',
            title: 'Data Science Fundamentals',
            description: 'Master key concepts in data analysis, Python, and machine learning',
            instructor: 'Dr. Sarah Johnson',
            category: 'data-science',
            level: 'beginner',
            price: 49.99,
            rating: 4.8,
            reviewCount: 240,
            image: 'course1.jpg',
            isBestseller: true,
            isNew: false,
            lessons: [
                { id: '1-1', title: 'Introduction to Data Science', duration: '10:15' },
                { id: '1-2', title: 'Python Basics for Data Analysis', duration: '15:30' },
                { id: '1-3', title: 'Data Cleaning and Preprocessing', duration: '12:45' },
                { id: '1-4', title: 'Exploratory Data Analysis', duration: '14:20' },
                { id: '1-5', title: 'Introduction to Machine Learning', duration: '18:10' }
            ]
        },
        {
            id: '2',
            title: 'Full-Stack Web Development',
            description: 'Comprehensive guide to modern web development with MERN stack',
            instructor: 'Alex Rivera',
            category: 'web-development',
            level: 'intermediate',
            price: 59.99,
            rating: 4.9,
            reviewCount: 315,
            image: 'course2.jpg',
            isBestseller: false,
            isNew: true,
            lessons: [
                { id: '2-1', title: 'HTML5 and CSS3 Fundamentals', duration: '11:20' },
                { id: '2-2', title: 'JavaScript Essentials', duration: '16:45' },
                { id: '2-3', title: 'React.js Crash Course', duration: '14:30' },
                { id: '2-4', title: 'Node.js and Express Basics', duration: '13:15' },
                { id: '2-5', title: 'MongoDB Database Integration', duration: '12:40' }
            ]
        },
        {
            id: '3',
            title: 'Strategic Leadership Skills',
            description: 'Develop essential leadership skills for the modern workplace',
            instructor: 'Michael Chen, MBA',
            category: 'business',
            level: 'advanced',
            price: 39.99,
            rating: 4.7,
            reviewCount: 189,
            image: 'course3.jpg',
            isBestseller: false,
            isNew: false,
            lessons: [
                { id: '3-1', title: 'Leadership Foundations', duration: '09:15' },
                { id: '3-2', title: 'Effective Communication', duration: '12:30' },
                { id: '3-3', title: 'Team Management Strategies', duration: '14:45' },
                { id: '3-4', title: 'Conflict Resolution', duration: '11:20' },
                { id: '3-5', title: 'Strategic Decision Making', duration: '15:10' }
            ]
        }
    ];
    
    // Create mock users (including an admin user)
    const users = [
        {
            id: '1',
            name: 'Admin User',
            email: 'admin@learnhub.com',
            password: 'admin123',
            role: 'admin',
            enrolledCourses: ['1', '2', '3'],
            completedLessons: ['1-1', '1-2', '2-1'],
            achievements: []
        },
        {
            id: '2',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'student',
            enrolledCourses: ['1', '3'],
            completedLessons: ['1-1', '3-1', '3-2'],
            achievements: []
        }
    ];
    
    // Store in localStorage
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('dataInitialized', 'true');
}

// Initialize mock data
initMockData();