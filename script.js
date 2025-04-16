/**
 * USIU-Africa GPA Calculator
 * A simple tool to calculate semester GPA based on course grades
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('gpa-form');
    const courseRowsContainer = document.getElementById('course-rows');
    const addCourseBtn = document.getElementById('add-course');
    const resultContainer = document.getElementById('result-container');
    const gpaValue = document.getElementById('gpa-value');
    const gpaMessage = document.getElementById('gpa-message');
    
    // Grade to GPA points mapping
    const gradeScale = {
        'A': 4.0,
        'B': 3.0,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0
    };
    
    // Performance messages based on GPA
    const performanceMessages = [
        { min: 0, max: 1.0, message: "You need to improve your performance.", emoji: "😔" },
        { min: 1.1, max: 2.0, message: "Below average. Consider seeking academic help.", emoji: "😟" },
        { min: 2.1, max: 2.7, message: "Average performance. Keep working hard!", emoji: "😊" },
        { min: 2.8, max: 3.5, message: "Good performance! You're doing well.", emoji: "👍" },
        { min: 3.6, max: 4.0, message: "Excellent work! Keep it up!", emoji: "🎉" }
    ];
    
    // Initialize with 3 course rows
    for (let i = 0; i < 3; i++) {
        addCourseRow();
    }
    
    // Add course row function
    function addCourseRow() {
        const rowId = Date.now(); // Unique ID for each row
        
        const row = document.createElement('div');
        row.className = 'course-row';
        row.dataset.rowId = rowId;
        
        row.innerHTML = `
            <input type="text" placeholder="Course name" class="course-name" required>
            <select class="course-grade" required>
                <option value="">Select grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
            </select>
            <button type="button" class="remove-btn" aria-label="Remove course">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = row.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            // Don't allow removing if only one row remains
            if (document.querySelectorAll('.course-row').length > 1) {
                row.remove();
            } else {
                alert('You need at least one course to calculate GPA.');
            }
        });
        
        courseRowsContainer.appendChild(row);
    }
    
    // Add course button event listener
    addCourseBtn.addEventListener('click', addCourseRow);
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateGPA();
    });
    
    // Main GPA calculation function
    function calculateGPA() {
        const courseRows = document.querySelectorAll('.course-row');
        let totalPoints = 0;
        let validCourses = 0;
        let hasErrors = false;
        
        // Reset all error states
        document.querySelectorAll('.course-name, .course-grade').forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate and calculate for each course
        courseRows.forEach(row => {
            const nameInput = row.querySelector('.course-name');
            const gradeSelect = row.querySelector('.course-grade');
            const grade = gradeSelect.value;
            
            // Validate inputs
            if (!nameInput.value.trim()) {
                nameInput.classList.add('error');
                hasErrors = true;
            }
            
            if (!grade) {
                gradeSelect.classList.add('error');
                hasErrors = true;
                return;
            }
            
            // Only proceed if both fields are valid
            if (nameInput.value.trim() && grade) {
                totalPoints += gradeScale[grade];
                validCourses++;
            }
        });
        
        // Show error if any validation failed
        if (hasErrors) {
            alert('Please fill in all course names and select grades for all courses.');
            return;
        }
        
        // Calculate GPA
        const gpa = validCourses > 0 ? totalPoints / validCourses : 0;
        displayResults(gpa);
    }
    
    // Display results with animation
    function displayResults(gpa) {
        // Show result container if hidden
        if (resultContainer.classList.contains('hidden')) {
            resultContainer.classList.remove('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Format GPA to 2 decimal places
        const formattedGPA = gpa.toFixed(2);
        
        // Animate GPA value
        let current = 0;
        const increment = gpa / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= gpa) {
                current = gpa;
                clearInterval(timer);
            }
            gpaValue.textContent = current.toFixed(2);
        }, 50);
        
        // Get performance message
        const performance = performanceMessages.find(p => 
            gpa >= p.min && gpa <= p.max
        );
        
        gpaMessage.textContent = `${performance.message} ${performance.emoji}`;
        
        // Change color based on GPA
        if (gpa >= 3.6) {
            gpaValue.style.color = 'var(--success)';
        } else if (gpa >= 2.8) {
            gpaValue.style.color = 'var(--primary)';
        } else if (gpa >= 2.1) {
            gpaValue.style.color = 'var(--warning)';
        } else {
            gpaValue.style.color = 'var(--error)';
        }
    }
});
