// Sample course data
const courseData = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node and more to become a full-stack web developer",
        image: "../assets/images/course-web-dev.jpg",
        category: "Web Development",
        badge: "Bestseller",
        rating: 4.9,
        reviews: 12542,
        instructor: "Jane Smith",
        instructorImage: "../assets/images/instructor-jane.jpg",
        duration: "42 hours",
        price: 49.99,
        originalPrice: 199.99,
        level: "Beginner",
        link: "course-details.html?id=1"
    },
    {
        id: 2,
        title: "Python for Data Science and Machine Learning",
        description: "Master Python for data analysis, visualization, and machine learning algorithms",
        image: "../assets/images/course-python.jpg",
        category: "Data Science",
        badge: "Hot & New",
        rating: 4.8,
        reviews: 8735,
        instructor: "Michael Johnson",
        instructorImage: "../assets/images/instructor-michael.jpg",
        duration: "38 hours",
        price: 59.99,
        originalPrice: 149.99,
        level: "Intermediate",
        link: "course-details.html?id=2"
    },
    {
        id: 3,
        title: "UI/UX Design Fundamentals",
        description: "Learn user interface and user experience design principles for digital products",
        image: "../assets/images/course-design.jpg",
        category: "Design",
        badge: "",
        rating: 4.7,
        reviews: 3214,
        instructor: "Sarah Williams",
        instructorImage: "../assets/images/instructor-sarah.jpg",
        duration: "24 hours",
        price: 39.99,
        originalPrice: 129.99,
        level: "Beginner",
        link: "course-details.html?id=3"
    },
    {
        id: 4,
        title: "Digital Marketing Masterclass",
        description: "Comprehensive guide to SEO, social media, email marketing and advertising",
        image: "../assets/images/course-marketing.jpg",
        category: "Marketing",
        badge: "",
        rating: 4.6,
        reviews: 2875,
        instructor: "David Brown",
        instructorImage: "../assets/images/instructor-david.jpg",
        duration: "32 hours",
        price: 44.99,
        originalPrice: 159.99,
        level: "Beginner",
        link: "course-details.html?id=4"
    },
    {
        id: 5,
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into advanced JavaScript topics including closures, prototypes, and async patterns",
        image: "../assets/images/course-javascript.jpg",
        category: "Web Development",
        badge: "Advanced",
        rating: 4.9,
        reviews: 4328,
        instructor: "Robert Davis",
        instructorImage: "../assets/images/instructor-robert.jpg",
        duration: "28 hours",
        price: 54.99,
        originalPrice: 179.99,
        level: "Advanced",
        link: "course-details.html?id=5"
    },
    {
        id: 6,
        title: "Business Analytics and Strategy",
        description: "Learn data-driven business decision making and strategic planning techniques",
        image: "../assets/images/course-business.jpg",
        category: "Business",
        badge: "",
        rating: 4.7,
        reviews: 2145,
        instructor: "Jennifer Wilson",
        instructorImage: "../assets/images/instructor-jennifer.jpg",
        duration: "26 hours",
        price: 49.99,
        originalPrice: 139.99,
        level: "Intermediate",
        link: "course-details.html?id=6"
    }
];

// Load course data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to be loaded before rendering courses
    document.addEventListener('componentLoaded', function(event) {
        if (event.detail.componentName === 'header') {
            renderCourses(courseData);
        }
    });
});

// Render courses to the page
function renderCourses(courses) {
    const coursesContainer = document.querySelector('.courses-container');
    
    if (!coursesContainer) {
        console.error('Courses container not found');
        return;
    }
    
    // Clear existing courses
    coursesContainer.innerHTML = '';
    
    // Loop through courses and create cards
    courses.forEach(course => {
        // Create column
        const courseCol = document.createElement('div');
        courseCol.className = 'col-md-6 col-lg-4';
        
        // Get course card template
        const courseCardTemplate = document.createElement('template');
        fetch('../components/course-card.html')
            .then(response => response.text())
            .then(html => {
                courseCardTemplate.innerHTML = html;
                
                // Clone the template
                const courseCard = courseCardTemplate.content.cloneNode(true);
                
                // Update card content with course data
                if (course.image) {
                    courseCard.querySelector('img.card-img-top').src = course.image;
                    courseCard.querySelector('img.card-img-top').alt = course.title;
                }
                
                // Set badge
                const badge = courseCard.querySelector('.course-badge');
                if (course.badge && course.badge.trim() !== '') {
                    badge.textContent = course.badge;
                } else {
                    badge.style.display = 'none';
                }
                
                // Set category
                courseCard.querySelector('.course-category').textContent = course.category;
                
                // Set rating
                courseCard.querySelector('.course-rating').textContent = course.rating;
                courseCard.querySelector('.course-reviews').textContent = `(${course.reviews})`;
                
                // Set title and description
                courseCard.querySelector('.course-title').textContent = course.title;
                courseCard.querySelector('.course-description').textContent = course.description;
                
                // Set instructor info
                if (course.instructorImage) {
                    courseCard.querySelector('.d-flex.align-items-center img').src = course.instructorImage;
                    courseCard.querySelector('.d-flex.align-items-center img').alt = course.instructor;
                }
                courseCard.querySelector('.instructor-name').textContent = course.instructor;
                
                // Set duration
                courseCard.querySelector('.course-duration').textContent = course.duration;
                
                // Set price
                courseCard.querySelector('.course-price').textContent = `$${course.price}`;
                courseCard.querySelector('.course-original-price').textContent = `$${course.originalPrice}`;
                
                // Set link
                courseCard.querySelector('.course-link').href = course.link;
                
                // Append the course card to the column
                courseCol.appendChild(courseCard);
                
                // Append the column to the container
                coursesContainer.appendChild(courseCol);
            });
    });
}

// Filter and sort functions can be added here as the application grows