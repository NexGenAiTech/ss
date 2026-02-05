// student.js - Student-specific Functions
window.StudentSystem = {
    // Initialize
    init: function() {
        this.loadStudentData();
        this.setupEventListeners();
        this.loadUpcomingExams();
        this.updateDashboardStats();
    },
    
    // Load student data
    loadStudentData: function() {
        const user = window.AuthSystem.currentUser;
        if (user && user.role === 'student') {
            // Load additional student data from localStorage
            const studentData = JSON.parse(localStorage.getItem(`sankalp_student_${user.id}`) || '{}');
            user.studentData = studentData;
            return user;
        }
        return null;
    },
    
    // Save student data
    saveStudentData: function(data) {
        const user = window.AuthSystem.currentUser;
        if (user && user.role === 'student') {
            const currentData = JSON.parse(localStorage.getItem(`sankalp_student_${user.id}`) || '{}');
            const updatedData = { ...currentData, ...data };
            localStorage.setItem(`sankalp_student_${user.id}`, JSON.stringify(updatedData));
            user.studentData = updatedData;
            return true;
        }
        return false;
    },
    
    // Load upcoming exams
    loadUpcomingExams: function() {
        const container = document.getElementById('upcomingExams');
        if (!container) return;
        
        const exams = window.ExamManager.getUpcomingExams();
        
        if (exams.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-calendar" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <h4>No upcoming exams</h4>
                    <p>You don't have any exams scheduled at the moment.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        exams.slice(0, 5).forEach(exam => {
            const examCard = document.createElement('div');
            examCard.className = 'exam-card';
            
            const timeRemaining = this.getTimeRemaining(exam.date);
            
            examCard.innerHTML = `
                <div class="exam-info">
                    <h4>${exam.title}</h4>
                    <div class="exam-details">
                        <span><i class="fas fa-book"></i> ${exam.subject}</span>
                        <span><i class="fas fa-clock"></i> ${exam.duration} mins</span>
                        <span><i class="fas fa-calendar"></i> ${window.Utils.formatDate(exam.date)}</span>
                        <span><i class="fas fa-star"></i> ${exam.totalMarks} marks</span>
                    </div>
                </div>
                <div>
                    ${timeRemaining ? 
                        `<span class="badge badge-primary">${timeRemaining}</span>` : 
                        `<button class="btn btn-primary start-exam-btn" data-exam-id="${exam.id}">
                            Start Exam
                        </button>`
                    }
                </div>
            `;
            
            container.appendChild(examCard);
        });
        
        // Add event listeners to start buttons
        document.querySelectorAll('.start-exam-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = this.dataset.examId;
                window.StudentSystem.startExam(examId);
            });
        });
    },
    
    // Get time remaining until exam
    getTimeRemaining: function(examDate) {
        if (!examDate) return null;
        
        const now = new Date();
        const exam = new Date(examDate);
        const diff = exam - now;
        
        if (diff <= 0) return null;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
            return `In ${days} day${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `In ${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return 'Today';
        }
    },
    
    // Start exam
    startExam: function(examId) {
        const exam = window.ExamManager.getExam(examId);
        if (!exam) {
            alert('Exam not found!');
            return;
        }
        
        // Check if exam is published/scheduled
        if (exam.status !== 'published' && exam.status !== 'scheduled') {
            alert('This exam is not available yet!');
            return;
        }
        
        // Check exam date
        if (exam.date) {
            const now = new Date();
            const examDate = new Date(exam.date);
            if (now < examDate) {
                alert('This exam is not available until ' + window.Utils.formatDate(exam.date));
                return;
            }
        }
        
        // Check if already attempted
        const user = window.AuthSystem.currentUser;
        const existingResult = exam.results.find(r => r.userId === user.id);
        if (existingResult && exam.allowedAttempts === 1) {
            alert('You have already attempted this exam!');
            return;
        }
        
        // Store exam in session for the test
        sessionStorage.setItem('current_exam', JSON.stringify({
            id: exam.id,
            startedAt: new Date().toISOString(),
            questions: exam.questions,
            settings: exam.settings,
            duration: exam.duration
        }));
        
        // Redirect to exam page
        window.location.href = `take-exam.html?examId=${examId}`;
    },
    
    // Update dashboard statistics
    updateDashboardStats: function() {
        const user = window.AuthSystem.currentUser;
        if (!user) return;
        
        const results = window.ExamManager.getUserResults(user.id);
        const stats = this.calculateStudentStats(results);
        
        // Update stats in dashboard if elements exist
        const examsCompleted = document.getElementById('examsCompleted');
        const averageScore = document.getElementById('averageScore');
        const achievementsCount = document.getElementById('achievementsCount');
        const studyTime = document.getElementById('studyTime');
        
        if (examsCompleted) examsCompleted.textContent = stats.examsCompleted;
        if (averageScore) averageScore.textContent = stats.averageScore + '%';
        if (achievementsCount) achievementsCount.textContent = stats.achievements;
        if (studyTime) studyTime.textContent = stats.studyTime + 'h';
    },
    
    // Calculate student statistics
    calculateStudentStats: function(results) {
        const stats = {
            examsCompleted: results.length,
            totalScore: 0,
            averageScore: 0,
            passedExams: 0,
            failedExams: 0,
            achievements: 0,
            studyTime: 0
        };
        
        if (results.length > 0) {
            results.forEach(result => {
                stats.totalScore += result.score;
                if (result.status === 'passed') {
                    stats.passedExams++;
                } else {
                    stats.failedExams++;
                }
            });
            
            stats.averageScore = Math.round((stats.totalScore / results.length) * 100);
            
            // Calculate achievements
            if (stats.passedExams >= 10) stats.achievements++;
            if (stats.averageScore >= 90) stats.achievements++;
            if (stats.examsCompleted >= 5) stats.achievements++;
            
            // Estimate study time (30 minutes per exam)
            stats.studyTime = Math.round(results.length * 0.5);
        }
        
        return stats;
    },
    
    // Get performance by subject
    getSubjectPerformance: function() {
        const user = window.AuthSystem.currentUser;
        if (!user) return {};
        
        const results = window.ExamManager.getUserResults(user.id);
        const subjectPerformance = {};
        
        results.forEach(result => {
            if (!subjectPerformance[result.examSubject]) {
                subjectPerformance[result.examSubject] = {
                    totalScore: 0,
                    totalMarks: 0,
                    count: 0
                };
            }
            
            subjectPerformance[result.examSubject].totalScore += result.score;
            subjectPerformance[result.examSubject].totalMarks += result.totalMarks;
            subjectPerformance[result.examSubject].count++;
        });
        
        // Calculate percentages
        Object.keys(subjectPerformance).forEach(subject => {
            const data = subjectPerformance[subject];
            data.percentage = Math.round((data.totalScore / data.totalMarks) * 100);
        });
        
        return subjectPerformance;
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Start practice button
        const startPracticeBtn = document.getElementById('startPractice');
        if (startPracticeBtn) {
            startPracticeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.StudentSystem.startPracticeSession();
            });
        }
        
        // View results button
        const viewResultsBtn = document.getElementById('viewResults');
        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'student-results.html';
            });
        }
        
        // Download materials button
        const downloadMaterialsBtn = document.getElementById('downloadMaterials');
        if (downloadMaterialsBtn) {
            downloadMaterialsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.StudentSystem.downloadStudyMaterials();
            });
        }
        
        // Ask doubt button
        const askDoubtBtn = document.getElementById('askDoubt');
        if (askDoubtBtn) {
            askDoubtBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.StudentSystem.askDoubt();
            });
        }
    },
    
    // Start practice session
    startPracticeSession: function() {
        const subject = prompt('Enter subject to practice (mathematics, science, english, hindi):');
        if (subject && window.QuestionDatabase.subjects[subject]) {
            const questions = window.QuestionDatabase.getQuestionsBySubject(subject);
            if (questions.length > 0) {
                sessionStorage.setItem('practice_session', JSON.stringify({
                    subject: subject,
                    questions: questions.slice(0, 10), // Take first 10 questions
                    startedAt: new Date().toISOString()
                }));
                window.location.href = 'practice.html';
            } else {
                alert('No questions available for this subject!');
            }
        }
    },
    
    // Download study materials
    downloadStudyMaterials: function() {
        alert('Study materials download feature coming soon!');
    },
    
    // Ask doubt
    askDoubt: function() {
        const doubt = prompt('Enter your doubt:');
        if (doubt) {
            const user = window.AuthSystem.currentUser;
            const doubts = JSON.parse(localStorage.getItem('sankalp_doubts') || '[]');
            
            doubts.push({
                id: 'DOUBT' + Date.now().toString().slice(-6),
                studentId: user.id,
                studentName: user.name,
                doubt: doubt,
                subject: user.class || 'General',
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('sankalp_doubts', JSON.stringify(doubts));
            alert('Your doubt has been submitted! A teacher will respond soon.');
        }
    },
    
    // Track study time
    trackStudyTime: function(minutes) {
        const user = window.AuthSystem.currentUser;
        if (user) {
            const studyData = JSON.parse(localStorage.getItem(`sankalp_study_${user.id}`) || '{}');
            const today = new Date().toISOString().split('T')[0];
            
            if (!studyData[today]) {
                studyData[today] = 0;
            }
            
            studyData[today] += minutes;
            localStorage.setItem(`sankalp_study_${user.id}`, JSON.stringify(studyData));
            
            // Update total study time
            const studentData = JSON.parse(localStorage.getItem(`sankalp_student_${user.id}`) || '{}');
            studentData.totalStudyTime = (studentData.totalStudyTime || 0) + minutes;
            localStorage.setItem(`sankalp_student_${user.id}`, JSON.stringify(studentData));
        }
    },
    
    // Get study analytics
    getStudyAnalytics: function(days = 7) {
        const user = window.AuthSystem.currentUser;
        if (!user) return null;
        
        const studyData = JSON.parse(localStorage.getItem(`sankalp_study_${user.id}`) || '{}');
        const dates = [];
        const times = [];
        
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dates.push(date.getDate() + '/' + (date.getMonth() + 1));
            times.push(studyData[dateStr] || 0);
        }
        
        return {
            dates: dates,
            times: times,
            total: times.reduce((a, b) => a + b, 0),
            average: Math.round(times.reduce((a, b) => a + b, 0) / days)
        };
    }
};
