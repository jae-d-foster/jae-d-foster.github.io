// JavaScript file for website interactivity
// This file handles the accessibility popup and navigation menu

// PROJECT FILTERING FUNCTIONALIT
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

// TEACHING STYLE QUIZ FUNCTIONALITY
// Variables to store quiz answers
let quizAnswers = {};
let questionsAnswered = 0;

// Function to toggle quiz visibility
function toggleQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const toggleBtn = document.querySelector('.quiz-toggle-btn');
    
    if (quizContainer.style.display === 'none' || quizContainer.style.display === '') {
        quizContainer.style.display = 'block';
        toggleBtn.textContent = 'Hide Quiz';
    } else {
        quizContainer.style.display = 'none';
        toggleBtn.textContent = 'Tap to Display Quiz';
    }
}

// Function to handle quiz option selection
function selectAnswer(questionId, answerValue, element) {
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
    if (questionsAnswered >= 3) {  // Changed from 6 to 3 since you have 3 questions
        document.getElementById('submit-btn').style.display = 'block';
    }
}

// Function to calculate and display quiz results
function calculateResult() {
    // Count answers for each teaching style approach
    const styles = {
        'hands-on': 0,
        'discussion': 0,
        'visual': 0,
        'learning': 0,
        'support': 0,
        'practice': 0,
        'creativity': 0,
        'relationships': 0,
        'achievement': 0
    };
    
    // Count the answers
    Object.values(quizAnswers).forEach(answer => {
        if (styles.hasOwnProperty(answer)) {
            styles[answer]++;
        }
    });
    
    // Determine teaching style based on combinations
    let teachingStyle = '';
    let description = '';
    
    // Check for dominant patterns
    if (styles['hands-on'] >= 1 && styles['creativity'] >= 1) {
        teachingStyle = 'Creative Facilitator';
        description = 'You believe in learning through doing and encourage students to explore their creativity. You create hands-on learning experiences that allow students to discover and innovate.';
    } else if (styles['discussion'] >= 1 && styles['relationships'] >= 1) {
        teachingStyle = 'Collaborative Guide';
        description = 'You foster strong relationships and encourage collaborative learning. You believe that students learn best through meaningful discussions and peer interaction.';
    } else if (styles['visual'] >= 1 && styles['achievement'] >= 1) {
        teachingStyle = 'Structured Presenter';
        description = 'You organize information clearly and focus on helping students achieve their academic goals. You use visual aids and structured approaches to ensure understanding.';
    } else if (styles['learning'] >= 1 && styles['support'] >= 1) {
        teachingStyle = 'Supportive Mentor';
        description = 'You turn challenges into opportunities and provide strong emotional support. You believe that mistakes are valuable learning experiences and every student can succeed with the right support.';
    } else if (styles['practice'] >= 1) {
        teachingStyle = 'Skill Builder';
        description = 'You focus on building strong foundational skills through practice and repetition. You believe that mastery comes through consistent effort and structured learning.';
    } else {
        teachingStyle = 'Adaptive Educator';
        description = 'You flexibly combine different teaching approaches based on student needs. You adapt your methods to create the best learning environment for each situation.';
    }
    
    // Display result
    const resultDiv = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');
    
    resultText.innerHTML = `<strong>${teachingStyle}</strong><br><br>${description}`;
    resultDiv.style.display = 'block';
    
    // Hide submit button
    document.getElementById('submit-btn').style.display = 'none';
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
    
    // ACCESSIBILITY POPUP FUNCTIONALITY
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
    
    // FONT SIZE CHANGE FUNCTIONALITY
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
    
    // DARK MODE FUNCTIONALITY
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
    
    // RESET TO DEFAULT FUNCTIONALITY
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
    
    // ACCESSIBILITY ICON UPDATE
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
    
    // NAVIGATION MENU FUNCTIONALITY
    // Toggle Navigation menu when menu button is clicked
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
    
    // RESTORE SAVED SETTINGS
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
    
    // GRADUATION COUNTDOWN FUNCTIONALITY
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

// STUDENT MARK CONVERTER FUNCTIONALITY
// Function to convert percentage marks to letter grades and bands
function convertMark() {
    const markInput = document.getElementById('mark-input');
    const resultsContainer = document.getElementById('results-container');
    const letterGradeSpan = document.getElementById('letter-grade');
    const bandResultSpan = document.getElementById('band-result');
    
    // Clear any existing error messages
    const existingError = document.getElementById('error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const mark = parseFloat(markInput.value);
    
    // Validate input
    if (isNaN(mark) || mark < 0 || mark > 100) {
        // Create and display error message on the page
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = `
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ef5350;
            border-radius: 6px;
            padding: 12px;
            margin: 10px 0;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            text-align: center;
        `;
        errorDiv.textContent = 'Please enter a valid percentage between 0 and 100';
        
        // Insert error message after the input
        markInput.parentNode.insertBefore(errorDiv, markInput.nextSibling);
        
        // Hide results container if it's visible
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
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