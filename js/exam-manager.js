// exam-manager.js - Exam Management System
window.ExamManager = {
    exams: [],
    
    // Initialize
    init: function() {
        this.loadExams();
        this.setupEventListeners();
    },
    
    // Load exams from localStorage
    loadExams: function() {
        try {
            const savedExams = localStorage.getItem('sankalp_exams');
            if (savedExams) {
                this.exams = JSON.parse(savedExams);
            }
            return this.exams;
        } catch (error) {
            console.error('Error loading exams:', error);
            return [];
        }
    },
    
    // Save exams to localStorage
    saveExams: function() {
        try {
            localStorage.setItem('sankalp_exams', JSON.stringify(this.exams));
            return true;
        } catch (error) {
            console.error('Error saving exams:', error);
            return false;
        }
    },
    
    // Create new exam
    createExam: function(examData) {
        const exam = {
            id: 'EXAM' + Date.now().toString().slice(-6),
            ...examData,
            createdBy: window.AuthSystem.currentUser?.id || 'anonymous',
            createdAt: new Date().toISOString(),
            status: 'draft',
            participants: [],
            results: []
        };
        
        this.exams.push(exam);
        this.saveExams();
        return exam;
    },
    
    // Get exam by ID
    getExam: function(examId) {
        return this.exams.find(exam => exam.id === examId);
    },
    
    // Update exam
    updateExam: function(examId, updates) {
        const index = this.exams.findIndex(exam => exam.id === examId);
        if (index !== -1) {
            this.exams[index] = { ...this.exams[index], ...updates };
            this.saveExams();
            return this.exams[index];
        }
        return null;
    },
    
    // Delete exam
    deleteExam: function(examId) {
        const index = this.exams.findIndex(exam => exam.id === examId);
        if (index !== -1) {
            this.exams.splice(index, 1);
            this.saveExams();
            return true;
        }
        return false;
    },
    
    // Publish exam
    publishExam: function(examId) {
        return this.updateExam(examId, { status: 'published', publishedAt: new Date().toISOString() });
    },
    
    // Schedule exam
    scheduleExam: function(examId, scheduleDate) {
        return this.updateExam(examId, { 
            status: 'scheduled', 
            scheduleDate: scheduleDate 
        });
    },
    
    // Get exams by status
    getExamsByStatus: function(status) {
        return this.exams.filter(exam => exam.status === status);
    },
    
    // Get exams by creator
    getExamsByCreator: function(userId) {
        return this.exams.filter(exam => exam.createdBy === userId);
    },
    
    // Get upcoming exams
    getUpcomingExams: function() {
        const now = new Date();
        return this.exams.filter(exam => {
            if (exam.status !== 'published' && exam.status !== 'scheduled') return false;
            if (!exam.date) return true;
            const examDate = new Date(exam.date);
            return examDate > now;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    },
    
    // Add participant to exam
    addParticipant: function(examId, userId) {
        const exam = this.getExam(examId);
        if (exam) {
            if (!exam.participants.includes(userId)) {
                exam.participants.push(userId);
                this.saveExams();
            }
            return true;
        }
        return false;
    },
    
    // Submit exam result
    submitResult: function(examId, result) {
        const exam = this.getExam(examId);
        if (exam) {
            result.id = 'RES' + Date.now().toString().slice(-6);
            result.submittedAt = new Date().toISOString();
            result.userId = window.AuthSystem.currentUser?.id;
            
            exam.results.push(result);
            this.saveExams();
            
            // Calculate statistics
            this.updateExamStatistics(examId);
            
            return result;
        }
        return null;
    },
    
    // Update exam statistics
    updateExamStatistics: function(examId) {
        const exam = this.getExam(examId);
        if (exam && exam.results.length > 0) {
            const scores = exam.results.map(r => r.score);
            const total = scores.reduce((a, b) => a + b, 0);
            
            exam.statistics = {
                totalParticipants: exam.results.length,
                averageScore: total / exam.results.length,
                highestScore: Math.max(...scores),
                lowestScore: Math.min(...scores),
                passPercentage: (exam.results.filter(r => r.score >= exam.passingPercent || 40).length / exam.results.length) * 100
            };
            
            this.saveExams();
        }
    },
    
    // Get exam results
    getExamResults: function(examId) {
        const exam = this.getExam(examId);
        return exam ? exam.results : [];
    },
    
    // Get user results
    getUserResults: function(userId) {
        const userResults = [];
        this.exams.forEach(exam => {
            const userResult = exam.results.find(r => r.userId === userId);
            if (userResult) {
                userResults.push({
                    examId: exam.id,
                    examTitle: exam.title,
                    examSubject: exam.subject,
                    score: userResult.score,
                    totalMarks: exam.totalMarks,
                    submittedAt: userResult.submittedAt,
                    status: userResult.score >= (exam.passingPercent || 40) ? 'passed' : 'failed'
                });
            }
        });
        return userResults;
    },
    
    // Generate exam report
    generateReport: function(examId, format = 'pdf') {
        const exam = this.getExam(examId);
        if (!exam) return null;
        
        const report = {
            examId: exam.id,
            examTitle: exam.title,
            totalParticipants: exam.participants.length,
            averageScore: exam.statistics?.averageScore || 0,
            highestScore: exam.statistics?.highestScore || 0,
            lowestScore: exam.statistics?.lowestScore || 0,
            passPercentage: exam.statistics?.passPercentage || 0,
            generatedAt: new Date().toISOString(),
            questions: exam.questions?.length || 0,
            results: exam.results.map(r => ({
                userId: r.userId,
                score: r.score,
                percentage: (r.score / exam.totalMarks) * 100,
                submittedAt: r.submittedAt
            }))
        };
        
        return report;
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Exam start event
        document.addEventListener('examStart', (event) => {
            const { examId, userId } = event.detail;
            this.addParticipant(examId, userId);
            this.logActivity('exam_start', `User ${userId} started exam ${examId}`);
        });
        
        // Exam submit event
        document.addEventListener('examSubmit', (event) => {
            const { examId, result } = event.detail;
            this.submitResult(examId, result);
            this.logActivity('exam_submit', `User ${result.userId} submitted exam ${examId} with score ${result.score}`);
        });
    },
    
    // Log activity
    logActivity: function(action, details) {
        try {
            const activities = JSON.parse(localStorage.getItem('sankalp_exam_activities') || '[]');
            activities.push({
                action,
                details,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 500 activities
            if (activities.length > 500) {
                activities.splice(0, activities.length - 500);
            }
            
            localStorage.setItem('sankalp_exam_activities', JSON.stringify(activities));
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    },
    
    // Get recent activities
    getRecentActivities: function(limit = 50) {
        try {
            const activities = JSON.parse(localStorage.getItem('sankalp_exam_activities') || '[]');
            return activities.slice(-limit).reverse();
        } catch (error) {
            console.error('Error getting activities:', error);
            return [];
        }
    },
    
    // Export exam data
    exportExamData: function(examId) {
        const exam = this.getExam(examId);
        if (!exam) return null;
        
        const data = {
            exam: exam,
            statistics: exam.statistics,
            results: exam.results,
            exportedAt: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    },
    
    // Import exam data
    importExamData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.exam) {
                // Check if exam already exists
                const existingIndex = this.exams.findIndex(e => e.id === data.exam.id);
                if (existingIndex !== -1) {
                    // Update existing exam
                    this.exams[existingIndex] = { ...this.exams[existingIndex], ...data.exam };
                } else {
                    // Add new exam
                    this.exams.push(data.exam);
                }
                this.saveExams();
                return { success: true, examId: data.exam.id };
            }
            return { success: false, error: 'Invalid exam data' };
        } catch (error) {
            console.error('Error importing exam data:', error);
            return { success: false, error: error.message };
        }
    }
};

// Initialize exam manager
ExamManager.init();
