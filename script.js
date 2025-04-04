document.addEventListener('DOMContentLoaded', function() {
    const studentBtn = document.getElementById('student-btn');
    const facultyBtn = document.getElementById('faculty-btn');

    if (studentBtn && facultyBtn) {
        studentBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });

        facultyBtn.addEventListener('click', function() {
            window.location.href = 'faculty-login.html';
        });
    }
});