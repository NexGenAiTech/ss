// admin.js - Admin-specific Functions
window.AdminSystem = {
    // Initialize
    init: function() {
        this.loadAdminData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadRecentActivities();
    },
    
    // Load admin data
    loadAdminData: function() {
        const user = window.AuthSystem.currentUser;
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
            return user;
        }
        return null;
    },
    
    // Load dashboard data
    loadDashboardData: function() {
        this.updateStats();
        this.loadUsersTable();
        this.loadExamsTable();
    },
    
    // Update statistics
    updateStats: function() {
        const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
        const exams = JSON.parse(localStorage.getItem('sankalp_exams') || '[]');
        const questions = window.QuestionDatabase.questions;
        
        // Count by role
        const students = users.filter(u => u.role === 'student').length;
        const teachers = users.filter(u => u.role === 'teacher').length;
        const admins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
        
        // Update stats cards
        document.getElementById('totalStudents').textContent = students;
        document.getElementById('totalTeachers').textContent = teachers;
        document.getElementById('totalExams').textContent = exams.length;
        document.getElementById('totalQuestions').textContent = questions.length;
    },
    
    // Load users table
    loadUsersTable: function() {
        const table = document.getElementById('usersTable');
        if (!table) return;
        
        const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
        
        table.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Get user status (active if logged in recently)
            const lastActivity = this.getLastActivity(user.id);
            const isActive = lastActivity && 
                (new Date() - new Date(lastActivity.timestamp)) < 24 * 60 * 60 * 1000;
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; border-radius: 50%; 
                             background: #2a8bf2; color: white; display: flex; 
                             align-items: center; justify-content: center; font-weight: bold;">
                            ${user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        ${user.name}
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="badge ${this.getRoleBadgeClass(user.role)}">
                        ${user.role}
                    </span>
                </td>
                <td>
                    <span class="badge ${isActive ? 'badge-success' : 'badge-secondary'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn btn-edit" onclick="AdminSystem.editUser('${user.id}')">
                            Edit
                        </button>
                        <button class="action-btn btn-delete" onclick="AdminSystem.deleteUser('${user.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            table.appendChild(row);
        });
    },
    
    // Load exams table
    loadExamsTable: function() {
        const table = document.getElementById('examsTable');
        if (!table) return;
        
        const exams = JSON.parse(localStorage.getItem('sankalp_exams') || '[]');
        
        table.innerHTML = '';
        exams.forEach(exam => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${exam.id}</td>
                <td>${exam.title}</td>
                <td>${exam.subject}</td>
                <td>${exam.questions?.length || 0}</td>
                <td>${exam.createdBy}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn btn-view" onclick="AdminSystem.viewExam('${exam.id}')">
                            View
                        </button>
                        <button class="action-btn btn-edit" onclick="AdminSystem.editExam('${exam.id}')">
                            Edit
                        </button>
                    </div>
                </td>
            `;
            table.appendChild(row);
        });
    },
    
    // Load recent activities
    loadRecentActivities: function() {
        const container = document.getElementById('activityList');
        if (!container) return;
        
        const examActivities = window.ExamManager.getRecentActivities(10);
        const authActivities = JSON.parse(localStorage.getItem('sankalp_activities') || '[]');
        const allActivities = [...examActivities, ...authActivities.slice(-10)]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        container.innerHTML = '';
        
        if (allActivities.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-history" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <h4>No recent activities</h4>
                </div>
            `;
            return;
        }
        
        allActivities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const iconClass = this.getActivityIconClass(activity.action);
            const timeAgo = this.getTimeAgo(activity.timestamp);
            
            item.innerHTML = `
                <div class="activity-icon ${iconClass}">
                    <i class="fas fa-${this.getActivityIcon(activity.action)}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${this.getActivityTitle(activity.action)}</div>
                    <div style="font-size: 14px; color: #666;">${activity.details}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">${timeAgo}</div>
                </div>
            `;
            container.appendChild(item);
        });
    },
    
    // Get activity icon class
    getActivityIconClass: function(action) {
        const classes = {
            login: 'icon-login',
            logout: 'icon-login',
            register: 'icon-user-added',
            exam_start: 'icon-exam-created',
            exam_submit: 'icon-exam-created',
            profile_update: 'icon-settings'
        };
        return classes[action] || 'icon-login';
    },
    
    // Get activity icon
    getActivityIcon: function(action) {
        const icons = {
            login: 'sign-in-alt',
            logout: 'sign-out-alt',
            register: 'user-plus',
            exam_start: 'play-circle',
            exam_submit: 'check-circle',
            profile_update: 'cog'
        };
        return icons[action] || 'history';
    },
    
    // Get activity title
    getActivityTitle: function(action) {
        const titles = {
            login: 'User Login',
            logout: 'User Logout',
            register: 'New Registration',
            exam_start: 'Exam Started',
            exam_submit: 'Exam Submitted',
            profile_update: 'Profile Updated'
        };
        return titles[action] || 'Activity';
    },
    
    // Get time ago
    getTimeAgo: function(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diff = now - past;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return past.toLocaleDateString();
    },
    
    // Get last activity
    getLastActivity: function(userId) {
        const activities = JSON.parse(localStorage.getItem('sankalp_activities') || '[]');
        const userActivities = activities.filter(a => a.user === userId);
        return userActivities[userActivities.length - 1];
    },
    
    // Get role badge class
    getRoleBadgeClass: function(role) {
        const classes = {
            student: 'badge-primary',
            teacher: 'badge-success',
            admin: 'badge-danger',
            super_admin: 'badge-warning'
        };
        return classes[role] || 'badge-secondary';
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add user form
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addNewUser();
            });
        }
    },
    
    // Add new user
    addNewUser: async function() {
        const name = document.getElementById('newUserName').value;
        const email = document.getElementById('newUserEmail').value;
        const role = document.getElementById('newUserRole').value;
        const password = document.getElementById('newUserPassword').value;
        
        try {
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
            if (users.find(u => u.email === email)) {
                throw new Error('User with this email already exists');
            }
            
            // Generate user ID
            const userId = role === 'student' ? 'STU' + Date.now().toString().slice(-6) :
                          role === 'teacher' ? 'TEA' + Date.now().toString().slice(-6) :
                          'ADM' + Date.now().toString().slice(-6);
            
            const newUser = {
                id: userId,
                name: name,
                email: email,
                role: role,
                password: password, // Note: In production, this should be hashed
                createdAt: new Date().toISOString(),
                avatar: name.split(' ').map(n => n[0]).join('')
            };
            
            users.push(newUser);
            localStorage.setItem('sankalp_users', JSON.stringify(users));
            
            // Log activity
            window.AuthSystem.logActivity('user_added', `Admin added new ${role}: ${name}`);
            
            alert('User added successfully!');
            document.getElementById('addUserModal').style.display = 'none';
            addUserForm.reset();
            
            // Refresh tables
            this.loadDashboardData();
            
        } catch (error) {
            alert('Error adding user: ' + error.message);
        }
    },
    
    // Edit user
    editUser: function(userId) {
        alert('Edit user feature coming soon! User ID: ' + userId);
    },
    
    // Delete user
    deleteUser: function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                const userName = users[userIndex].name;
                users.splice(userIndex, 1);
                localStorage.setItem('sankalp_users', JSON.stringify(users));
                
                // Log activity
                window.AuthSystem.logActivity('user_deleted', `Admin deleted user: ${userName}`);
                
                alert('User deleted successfully!');
                this.loadDashboardData();
            }
        }
    },
    
    // View exam
    viewExam: function(examId) {
        const exam = window.ExamManager.getExam(examId);
        if (exam) {
            const details = `
                Exam ID: ${exam.id}
                Title: ${exam.title}
                Subject: ${exam.subject}
                Class: ${exam.class}
                Total Marks: ${exam.totalMarks}
                Duration: ${exam.duration} minutes
                Status: ${exam.status}
                Questions: ${exam.questions?.length || 0}
                Participants: ${exam.participants?.length || 0}
                Created: ${new Date(exam.createdAt).toLocaleDateString()}
            `;
            alert(details);
        }
    },
    
    // Edit exam
    editExam: function(examId) {
        alert('Edit exam feature coming soon! Exam ID: ' + examId);
    },
    
    // Generate reports
    generateReport: function(type) {
        let reportData;
        
        switch(type) {
            case 'users':
                const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
                reportData = {
                    type: 'user_report',
                    totalUsers: users.length,
                    byRole: {
                        student: users.filter(u => u.role === 'student').length,
                        teacher: users.filter(u => u.role === 'teacher').length,
                        admin: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
                    },
                    users: users.map(u => ({
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        role: u.role,
                        createdAt: u.createdAt
                    }))
                };
                break;
                
            case 'exams':
                const exams = JSON.parse(localStorage.getItem('sankalp_exams') || '[]');
                reportData = {
                    type: 'exam_report',
                    totalExams: exams.length,
                    byStatus: {
                        draft: exams.filter(e => e.status === 'draft').length,
                        published: exams.filter(e => e.status === 'published').length,
                        scheduled: exams.filter(e => e.status === 'scheduled').length
                    },
                    exams: exams.map(e => ({
                        id: e.id,
                        title: e.title,
                        subject: e.subject,
                        class: e.class,
                        totalMarks: e.totalMarks,
                        status: e.status,
                        participants: e.participants?.length || 0,
                        createdAt: e.createdAt
                    }))
                };
                break;
                
            case 'questions':
                const questions = window.QuestionDatabase.questions;
                reportData = {
                    type: 'question_report',
                    totalQuestions: questions.length,
                    bySubject: window.QuestionDatabase.getStatistics().bySubject,
                    byDifficulty: window.QuestionDatabase.getStatistics().byDifficulty,
                    questions: questions.map(q => ({
                        id: q.id,
                        subject: q.subject,
                        topic: q.topic,
                        type: q.type,
                        difficulty: q.difficulty,
                        marks: q.marks,
                        createdAt: q.createdAt
                    }))
                };
                break;
        }
        
        if (reportData) {
            this.downloadReport(reportData);
        }
    },
    
    // Download report
    downloadReport: function(reportData) {
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportData.type}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Backup system data
    backupData: function() {
        const backup = {
            users: JSON.parse(localStorage.getItem('sankalp_users') || '[]'),
            exams: JSON.parse(localStorage.getItem('sankalp_exams') || '[]'),
            questions: window.QuestionDatabase.questions,
            subjects: window.QuestionDatabase.subjects,
            examTemplates: window.QuestionDatabase.examTemplates,
            backupDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sankalp_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Backup created successfully!');
    },
    
    // Restore system data
    restoreData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.users) {
                localStorage.setItem('sankalp_users', JSON.stringify(data.users));
            }
            
            if (data.exams) {
                localStorage.setItem('sankalp_exams', JSON.stringify(data.exams));
            }
            
            if (data.questions) {
                window.QuestionDatabase.questions = data.questions;
                window.QuestionDatabase.saveToLocalStorage();
            }
            
            alert('Data restored successfully!');
            this.loadDashboardData();
            
        } catch (error) {
            alert('Error restoring data: ' + error.message);
        }
    },
    
    // System settings
    updateSystemSettings: function(settings) {
        const currentSettings = JSON.parse(localStorage.getItem('sankalp_settings') || '{}');
        const updatedSettings = { ...currentSettings, ...settings };
        localStorage.setItem('sankalp_settings', JSON.stringify(updatedSettings));
        return updatedSettings;
    },
    
    // Get system settings
    getSystemSettings: function() {
        return JSON.parse(localStorage.getItem('sankalp_settings') || '{}');
    }
};
