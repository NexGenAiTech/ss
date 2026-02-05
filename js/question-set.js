// question-set.js - Separate Question Database
window.QuestionDatabase = {
    // Subject categories
    subjects: {
        mathematics: {
            id: 'math',
            name: 'Mathematics',
            description: 'Mathematics questions for all levels',
            topics: ['algebra', 'geometry', 'trigonometry', 'calculus', 'statistics']
        },
        science: {
            id: 'science',
            name: 'Science',
            description: 'Physics, Chemistry, Biology',
            topics: ['physics', 'chemistry', 'biology']
        },
        english: {
            id: 'english',
            name: 'English',
            description: 'Grammar, Comprehension, Vocabulary',
            topics: ['grammar', 'comprehension', 'vocabulary', 'writing']
        },
        hindi: {
            id: 'hindi',
            name: 'Hindi',
            description: 'हिंदी व्याकरण और साहित्य',
            topics: ['vyakaran', 'sahitya', 'rachana']
        }
    },

    // Question templates
    questionTypes: {
        mcq: 'Multiple Choice',
        true_false: 'True/False',
        fill_blank: 'Fill in the Blank',
        descriptive: 'Descriptive Answer',
        match: 'Matching',
        arrange: 'Arrange in Order'
    },

    // Difficulty levels
    difficultyLevels: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
    },

    // Master question bank
    questions: [
        // Mathematics Questions
        {
            id: 'MATH001',
            subject: 'mathematics',
            topic: 'algebra',
            type: 'mcq',
            difficulty: 'easy',
            question: 'What is the value of x in the equation 2x + 5 = 15?',
            options: ['5', '10', '15', '20'],
            correctAnswer: '5',
            explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['linear-equations', 'basic-algebra']
        },
        {
            id: 'MATH002',
            subject: 'mathematics',
            topic: 'geometry',
            type: 'mcq',
            difficulty: 'medium',
            question: 'What is the area of a circle with radius 7cm?',
            options: ['44 cm²', '154 cm²', '308 cm²', '616 cm²'],
            correctAnswer: '154 cm²',
            explanation: 'Area = πr² = (22/7) × 7 × 7 = 154 cm²',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['circle', 'area', 'geometry']
        },
        {
            id: 'MATH003',
            subject: 'mathematics',
            topic: 'trigonometry',
            type: 'mcq',
            difficulty: 'medium',
            question: 'What is the value of sin²θ + cos²θ?',
            options: ['0', '1', 'tanθ', 'cotθ'],
            correctAnswer: '1',
            explanation: 'This is a fundamental trigonometric identity: sin²θ + cos²θ = 1',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['trigonometry', 'identities']
        },
        {
            id: 'MATH004',
            subject: 'mathematics',
            topic: 'algebra',
            type: 'mcq',
            difficulty: 'hard',
            question: 'If α and β are the roots of x² - 5x + 6 = 0, what is α² + β²?',
            options: ['13', '25', '37', '49'],
            correctAnswer: '13',
            explanation: 'α + β = 5, αβ = 6. α² + β² = (α + β)² - 2αβ = 25 - 12 = 13',
            marks: 2,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['quadratic-equations', 'roots']
        },
        {
            id: 'MATH005',
            subject: 'mathematics',
            topic: 'statistics',
            type: 'mcq',
            difficulty: 'easy',
            question: 'What is the mean of numbers 10, 20, 30, 40, 50?',
            options: ['25', '30', '35', '40'],
            correctAnswer: '30',
            explanation: 'Mean = (10+20+30+40+50)/5 = 150/5 = 30',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['statistics', 'mean', 'average']
        },

        // Science Questions
        {
            id: 'SCI001',
            subject: 'science',
            topic: 'physics',
            type: 'mcq',
            difficulty: 'easy',
            question: 'What is the SI unit of force?',
            options: ['Joule', 'Watt', 'Newton', 'Pascal'],
            correctAnswer: 'Newton',
            explanation: 'Force is measured in Newtons (N)',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['physics', 'units', 'force']
        },
        {
            id: 'SCI002',
            subject: 'science',
            topic: 'chemistry',
            type: 'mcq',
            difficulty: 'medium',
            question: 'What is the chemical formula of water?',
            options: ['H2O', 'HO2', 'H2O2', 'OH'],
            correctAnswer: 'H2O',
            explanation: 'Water is composed of two hydrogen atoms and one oxygen atom',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['chemistry', 'formula', 'water']
        },
        {
            id: 'SCI003',
            subject: 'science',
            topic: 'biology',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Which cell organelle is known as the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
            correctAnswer: 'Mitochondria',
            explanation: 'Mitochondria produce ATP, the energy currency of the cell',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['biology', 'cell', 'organelles']
        },

        // English Questions
        {
            id: 'ENG001',
            subject: 'english',
            topic: 'grammar',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Choose the correct sentence:',
            options: [
                'She don\'t like apples',
                'She doesn\'t likes apples',
                'She doesn\'t like apples',
                'She don\'t likes apples'
            ],
            correctAnswer: 'She doesn\'t like apples',
            explanation: 'Third person singular requires "doesn\'t" followed by base verb',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['grammar', 'verbs', 'present-tense']
        },
        {
            id: 'ENG002',
            subject: 'english',
            topic: 'vocabulary',
            type: 'mcq',
            difficulty: 'medium',
            question: 'What is the synonym of "Benevolent"?',
            options: ['Cruel', 'Kind', 'Selfish', 'Mean'],
            correctAnswer: 'Kind',
            explanation: 'Benevolent means well-meaning and kindly',
            marks: 1,
            createdBy: 'admin',
            createdAt: '2024-01-15',
            tags: ['vocabulary', 'synonyms']
        }
    ],

    // Exam templates
    examTemplates: {
        class10_math: {
            id: 'class10_math_final',
            name: 'Class 10 Mathematics Final Exam',
            subject: 'mathematics',
            class: '10',
            duration: 180, // minutes
            totalMarks: 100,
            sections: [
                {
                    name: 'Section A',
                    type: 'mcq',
                    questionsCount: 20,
                    marksPerQuestion: 1,
                    negativeMarking: false
                },
                {
                    name: 'Section B',
                    type: 'descriptive',
                    questionsCount: 5,
                    marksPerQuestion: 4,
                    negativeMarking: false
                }
            ],
            topics: ['algebra', 'geometry', 'trigonometry', 'statistics']
        },
        class10_science: {
            id: 'class10_science_midterm',
            name: 'Class 10 Science Midterm',
            subject: 'science',
            class: '10',
            duration: 120,
            totalMarks: 80,
            sections: [
                {
                    name: 'Physics',
                    questionsCount: 15,
                    marksPerQuestion: 2
                },
                {
                    name: 'Chemistry',
                    questionsCount: 10,
                    marksPerQuestion: 3
                },
                {
                    name: 'Biology',
                    questionsCount: 10,
                    marksPerQuestion: 2
                }
            ]
        }
    },

    // Methods to get questions
    getQuestionsBySubject: function(subject) {
        return this.questions.filter(q => q.subject === subject);
    },

    getQuestionsByTopic: function(topic) {
        return this.questions.filter(q => q.topic === topic);
    },

    getQuestionsByDifficulty: function(difficulty) {
        return this.questions.filter(q => q.difficulty === difficulty);
    },

    getQuestionById: function(id) {
        return this.questions.find(q => q.id === id);
    },

    addQuestion: function(question) {
        question.id = this.generateQuestionId(question.subject);
        question.createdAt = new Date().toISOString().split('T')[0];
        this.questions.push(question);
        this.saveToLocalStorage();
        return question;
    },

    generateQuestionId: function(subject) {
        const prefix = subject.substring(0, 3).toUpperCase();
        const existingIds = this.questions
            .filter(q => q.id.startsWith(prefix))
            .map(q => parseInt(q.id.replace(prefix, '')) || 0);
        
        const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    },

    // Save to localStorage for persistence
    saveToLocalStorage: function() {
        try {
            localStorage.setItem('sankalp_question_bank', JSON.stringify(this.questions));
            localStorage.setItem('sankalp_subjects', JSON.stringify(this.subjects));
            localStorage.setItem('sankalp_exam_templates', JSON.stringify(this.examTemplates));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Load from localStorage
    loadFromLocalStorage: function() {
        try {
            const savedQuestions = localStorage.getItem('sankalp_question_bank');
            const savedSubjects = localStorage.getItem('sankalp_subjects');
            const savedTemplates = localStorage.getItem('sankalp_exam_templates');
            
            if (savedQuestions) {
                this.questions = JSON.parse(savedQuestions);
            }
            if (savedSubjects) {
                this.subjects = JSON.parse(savedSubjects);
            }
            if (savedTemplates) {
                this.examTemplates = JSON.parse(savedTemplates);
            }
            return true;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return false;
        }
    },

    // Generate exam from template
    generateExam: function(templateId, countPerTopic = 5) {
        const template = this.examTemplates[templateId];
        if (!template) return null;
        
        const examQuestions = [];
        const topics = template.topics || Object.keys(this.subjects[template.subject].topics);
        
        topics.forEach(topic => {
            const topicQuestions = this.getQuestionsByTopic(topic)
                .filter(q => q.subject === template.subject)
                .slice(0, countPerTopic);
            
            examQuestions.push(...topicQuestions);
        });
        
        return {
            ...template,
            questions: examQuestions,
            generatedAt: new Date().toISOString(),
            totalQuestions: examQuestions.length
        };
    },

    // Export questions to JSON
    exportQuestions: function(format = 'json') {
        const data = {
            questions: this.questions,
            subjects: this.subjects,
            examTemplates: this.examTemplates,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            // Convert to CSV format
            const csvRows = [];
            csvRows.push(['ID', 'Subject', 'Topic', 'Type', 'Difficulty', 'Question', 'Options', 'Correct Answer', 'Marks']);
            
            this.questions.forEach(q => {
                csvRows.push([
                    q.id,
                    q.subject,
                    q.topic,
                    q.type,
                    q.difficulty,
                    q.question,
                    q.options.join('|'),
                    q.correctAnswer,
                    q.marks
                ]);
            });
            
            return csvRows.map(row => row.join(',')).join('\n');
        }
    },

    // Import questions from JSON
    importQuestions: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.questions) {
                data.questions.forEach(q => {
                    if (!this.questions.find(existing => existing.id === q.id)) {
                        this.questions.push(q);
                    }
                });
            }
            
            if (data.subjects) {
                this.subjects = { ...this.subjects, ...data.subjects };
            }
            
            this.saveToLocalStorage();
            return { success: true, count: data.questions?.length || 0 };
        } catch (error) {
            console.error('Error importing questions:', error);
            return { success: false, error: error.message };
        }
    },

    // Statistics
    getStatistics: function() {
        return {
            totalQuestions: this.questions.length,
            bySubject: Object.keys(this.subjects).reduce((acc, subject) => {
                acc[subject] = this.questions.filter(q => q.subject === subject).length;
                return acc;
            }, {}),
            byDifficulty: {
                easy: this.questions.filter(q => q.difficulty === 'easy').length,
                medium: this.questions.filter(q => q.difficulty === 'medium').length,
                hard: this.questions.filter(q => q.difficulty === 'hard').length
            },
            byType: {
                mcq: this.questions.filter(q => q.type === 'mcq').length,
                true_false: this.questions.filter(q => q.type === 'true_false').length,
                fill_blank: this.questions.filter(q => q.type === 'fill_blank').length,
                descriptive: this.questions.filter(q => q.type === 'descriptive').length
            }
        };
    }
};

// Initialize and load from localStorage
QuestionDatabase.loadFromLocalStorage();

// For backward compatibility with old system
window.mathematicsQuestions = QuestionDatabase.getQuestionsBySubject('mathematics').map(q => ({
    question: q.question,
    questionHindi: q.question, // Add Hindi translation if available
    options: q.options,
    optionsHindi: q.options,
    answer: q.correctAnswer,
    explanation: q.explanation,
    explanationHindi: q.explanation,
    image: q.image || null
}));
