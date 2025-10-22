// JavaScript file for website interactivity
// This file handles the accessibility popup and mobile menu

// ========== PROJECT FILTERING FUNCTIONALITY ==========
// Store active categories
let activeCategories = ['all'];

// Function to filter projects by category
function filterProjects(category, clickedElement) {
    // Get all project cards and filter buttons
    const projectCards = document.querySelectorAll('.project-card');
    const allButtons = document.querySelectorAll('.filter-btn');
    
    if (category === 'all') {
        // Clear all active categories and set to 'all'
        activeCategories = ['all'];
        
        // Update button states
        allButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        clickedElement.classList.add('active');
        
        // Show all projects
        projectCards.forEach(card => {
            card.classList.remove('hidden');
        });
    } else {
        // Remove 'all' from active categories if present
        activeCategories = activeCategories.filter(cat => cat !== 'all');
        
        // Toggle the selected category
        if (activeCategories.includes(category)) {
            // Remove category if already active
            activeCategories = activeCategories.filter(cat => cat !== category);
            clickedElement.classList.remove('active');
        } else {
            // Add category if not active
            activeCategories.push(category);
            clickedElement.classList.add('active');
        }
        
        // Remove active state from 'All' button
        const allButton = document.querySelector('.filter-btn[onclick*="all"]');
        if (allButton) {
            allButton.classList.remove('active');
        }
        
        // If no categories selected, revert to all
        if (activeCategories.length === 0) {
            activeCategories = ['all'];
            if (allButton) {
                allButton.classList.add('active');
            }
            projectCards.forEach(card => {
                card.classList.remove('hidden');
            });
            return;
        }
        
        // Filter projects based on active categories
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (activeCategories.includes(cardCategory)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// ========== TEACHING STYLE QUIZ FUNCTIONALITY ==========
// Variables to store quiz answers
let quizAnswers = {};
let questionsAnswered = 0;

// Function to handle quiz option selection
function selectAnswer(element, questionId, answerValue) {
    // Remove selected class from all options in this question
    const questionDiv = element.closest('.quiz-question');
    questionDiv.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Store the answer
    const wasAnswered = quizAnswers.hasOwnProperty(questionId);
    quizAnswers[questionId] = answerValue;
    
    // Update questions answered count
    if (!wasAnswered) {
        questionsAnswered++;
    }
    
    // Show submit button when all questions are answered
    if (questionsAnswered >= 6) {
        document.getElementById('submit-btn').style.display = 'block';
    }
}

// Function to calculate and display quiz results
function submitQuiz() {
    // Count points for each teaching style
    const scores = {
        'Facilitator': 0,
        'Formal Authority': 0,
        'Personal Model': 0,
        'Expert': 0,
        'Delegator': 0,
        'Hybrid': 0
    };
    
    // Add up scores based on answers
    Object.values(quizAnswers).forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
            scores[answer]++;
        }
    });
    
    // Find the highest scoring style
    let topStyle = 'Hybrid';
    let maxScore = 0;
    
    Object.entries(scores).forEach(([style, score]) => {
        if (score > maxScore) {
            maxScore = score;
            topStyle = style;
        }
    });
    
    // Define teaching style descriptions
    const descriptions = {
        'Facilitator': 'You focus on guiding students to discover knowledge themselves. You encourage critical thinking and help students develop problem-solving skills through questioning and discussion.',
        'Formal Authority': 'You provide clear structure and expectations. Students know exactly what is expected of them, and you maintain a well-organized learning environment with clear rules and procedures.',
        'Personal Model': 'You lead by example and demonstrate skills and processes. Students learn by observing and mimicking your approach, and you provide hands-on guidance and coaching.',
        'Expert': 'You share your deep knowledge and expertise with students. You focus on transmitting information effectively and helping students understand complex concepts through detailed explanations.',
        'Delegator': 'You encourage student independence and self-directed learning. You provide resources and support while allowing students to take ownership of their learning journey.',
        'Hybrid': 'You flexibly combine multiple teaching approaches based on the situation and student needs. You adapt your style to best serve different learning objectives and student preferences.'
    };
    
    // Display result
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.innerHTML = `
        <h3>Your Primary Teaching Style: ${topStyle}</h3>
        <p>${descriptions[topStyle]}</p>
        <p><strong>Score:</strong> ${maxScore} out of 6 questions</p>
        <button onclick="resetQuiz()" class="reset-btn">Take Quiz Again</button>
    `;
    
    // Show result
    document.getElementById('quiz-result').style.display = 'block';
    
    // Hide submit button
    document.getElementById('submit-btn').style.display = 'none';
}

// Function to reset quiz
function resetQuiz() {
    quizAnswers = {};
    questionsAnswered = 0;
    
    // Remove selected class from all options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Hide submit button and result
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
}

// Wait for the page to fully load before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Get references to all the important elements we'll be working with
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityPopup = document.getElementById('accessibility-popup');
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.querySelector('nav');
    
    // Variables to track current font size and dark mode state
    let currentFontSize = 'normal';
    let isDarkMode = false;
    
    // ========== ACCESSIBILITY POPUP FUNCTIONALITY ==========
    // Show or hide the accessibility popup when the accessibility button is clicked
    if (accessibilityBtn && accessibilityPopup) {
        accessibilityBtn.addEventListener('click', function() {
            // Toggle the popup visibility
            if (accessibilityPopup.style.display === 'none' || accessibilityPopup.style.display === '') {
                accessibilityPopup.style.display = 'block';
            } else {
                accessibilityPopup.style.display = 'none';
            }
        });
        
        // Hide the popup if user clicks outside of it
        document.addEventListener('click', function(event) {
            // Check if the click was outside both the button and the popup
            if (!accessibilityBtn.contains(event.target) && !accessibilityPopup.contains(event.target)) {
                accessibilityPopup.style.display = 'none';
            }
        });
    }
    
    // ========== FONT SIZE CHANGE FUNCTIONALITY ==========
    // Function to change the font size of the entire page
    function changeFontSize(size) {
        // Remove any existing font size classes from the body
        document.body.classList.remove('font-small', 'font-normal', 'font-large');
        
        // Add the new font size class
        document.body.classList.add('font-' + size);
        
        // Update our tracking variable
        currentFontSize = size;
        
        // Store in localStorage so the setting persists
        localStorage.setItem('fontSize', size);
    }
    
    // Add click event listeners to font size buttons
    document.addEventListener('click', function(event) {
        if (event.target.id === 'small-font-btn') {
            changeFontSize('small');
        } else if (event.target.id === 'normal-font-btn') {
            changeFontSize('normal');
        } else if (event.target.id === 'large-font-btn') {
            changeFontSize('large');
        } else if (event.target.id === 'reset-btn') {
            resetToDefault();
        }
    });
    
    // ========== DARK MODE FUNCTIONALITY ==========
    // Function to toggle between light and dark mode
    function toggleDarkMode() {
        // Toggle the dark mode class on the body
        document.body.classList.toggle('dark-mode');
        
        // Update our tracking variable
        isDarkMode = document.body.classList.contains('dark-mode');
        
        // Store in localStorage so the setting persists
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update accessibility icon
        updateAccessibilityIcon();
    }
    
    // ========== RESET TO DEFAULT FUNCTIONALITY ==========
    // Function to reset all accessibility settings to default
    function resetToDefault() {
        // Reset font size to normal
        changeFontSize('normal');
        
        // Turn off dark mode
        document.body.classList.remove('dark-mode');
        isDarkMode = false;
        localStorage.setItem('darkMode', false);
        
        // Update accessibility icon
        updateAccessibilityIcon();
    }
    
    // ========== ACCESSIBILITY ICON UPDATE ==========
    // Function to update accessibility icon based on dark mode
    function updateAccessibilityIcon() {
        const accessibilityImg = document.querySelector('#accessibility-btn img');
        if (accessibilityImg) {
            if (isDarkMode) {
                accessibilityImg.src = 'images/accessibility-icon-white.png';
            } else {
                accessibilityImg.src = 'images/accessibility-icon.png';
            }
        }
    }
    
    // Add click event listener to dark mode button
    document.addEventListener('click', function(event) {
        if (event.target.id === 'dark-mode-btn') {
            toggleDarkMode();
        }
    });
    
    // ========== MOBILE MENU FUNCTIONALITY ==========
    // Toggle mobile navigation menu when menu button is clicked
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
            // Toggle the mobile menu visibility
            mobileNav.classList.toggle('mobile-menu-open');
            
            // Change the hamburger icon to an X when menu is open
            if (mobileNav.classList.contains('mobile-menu-open')) {
                menuBtn.innerHTML = '✕';
            } else {
                menuBtn.innerHTML = '☰';
            }
        });
    }
    
    // ========== RESTORE SAVED SETTINGS ==========
    // Check localStorage for saved font size and dark mode settings
    const savedFontSize = localStorage.getItem('fontSize');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply saved font size
    if (savedFontSize) {
        changeFontSize(savedFontSize);
    }
    
    // Apply saved dark mode setting
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        isDarkMode = true;
    }
    
    // Update accessibility icon based on current mode
    updateAccessibilityIcon();
    
    // ========== GRADUATION COUNTDOWN FUNCTIONALITY ==========
    // Function to calculate and update countdown
    function updateCountdown() {
        const graduationDate = new Date('2026-11-01'); // Graduation date - 374 days from Oct 23, 2025
        const now = new Date();
        const timeDifference = graduationDate - now;
        
        if (timeDifference > 0) {
            // Calculate months, weeks, and days remaining
            const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const months = Math.floor(totalDays / 30);
            const remainingDaysAfterMonths = totalDays % 30;
            const weeks = Math.floor(remainingDaysAfterMonths / 7);
            const days = remainingDaysAfterMonths % 7;
            
            // Update the individual countdown elements
            const monthsElement = document.getElementById('months');
            const weeksElement = document.getElementById('weeks');
            const daysElement = document.getElementById('days');
            
            if (monthsElement) monthsElement.textContent = months;
            if (weeksElement) weeksElement.textContent = weeks;
            if (daysElement) daysElement.textContent = days;
        }
    }
    
    // Update countdown immediately and then every hour
    updateCountdown();
    setInterval(updateCountdown, 3600000); // Update every hour (3600000 ms)
    
    // Hide the accessibility popup on page load
    if (accessibilityPopup) {
        accessibilityPopup.style.display = 'none';
    }
});

// ========== STUDENT MARK CONVERTER FUNCTIONALITY ==========
// Function to convert percentage marks to letter grades and bands
function convertMark() {
    const markInput = document.getElementById('mark-input');
    const resultsContainer = document.getElementById('results-container');
    const letterGradeSpan = document.getElementById('letter-grade');
    const bandResultSpan = document.getElementById('band-result');
    
    const mark = parseFloat(markInput.value);
    
    // Validate input
    if (isNaN(mark) || mark < 0 || mark > 100) {
        alert('Please enter a valid percentage between 0 and 100');
        return;
    }
    
    let letterGrade, band;
    
    // NSW HSC Grade scale
    if (mark >= 90) {
        letterGrade = 'A';
        band = 'Band 6';
    } else if (mark >= 80) {
        letterGrade = 'B';
        band = 'Band 5';
    } else if (mark >= 70) {
        letterGrade = 'C';
        band = 'Band 4';
    } else if (mark >= 60) {
        letterGrade = 'D';
        band = 'Band 3';
    } else if (mark >= 50) {
        letterGrade = 'E';
        band = 'Band 2';
    } else {
        letterGrade = 'F';
        band = 'Band 1';
    }
    
    // Display results
    letterGradeSpan.textContent = letterGrade;
    bandResultSpan.textContent = band;
    
    // Show results container
    resultsContainer.style.display = 'block';
}