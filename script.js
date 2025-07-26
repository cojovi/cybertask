// Notion API Configuration
const NOTION_CONFIG = {
    token: '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',
    version: '2022-06-28',
    databases: {
        high: '1eba40b6e27d8004895bd2eb2d884d04',
        medium: '21ba40b6e27d80e492d5e87cc1ee7379',
        low: '1eda40b6e27d80519a4ade43b1b11741'
    }
};

// Global state
let allTasks = [];
let filteredTasks = [];
let currentFilter = 'all';
let currentSort = 'priority';

// DOM elements
const elements = {
    loadingBar: document.getElementById('loadingBar'),
    searchInput: document.getElementById('searchInput'),
    refreshBtn: document.getElementById('refreshBtn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sortSelect'),
    taskModal: document.getElementById('taskModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.getElementById('closeModal'),
    notifications: document.getElementById('notifications'),
    statCounts: {
        high: document.getElementById('highPriorityCount'),
        medium: document.getElementById('mediumPriorityCount'),
        low: document.getElementById('lowPriorityCount'),
        completed: document.getElementById('completedCount')
    },
    taskContainers: {
        high: document.getElementById('highPriorityTasks'),
        medium: document.getElementById('mediumPriorityTasks'),
        low: document.getElementById('lowPriorityTasks')
    }
};

// Utility functions
const showLoading = () => {
    elements.loadingBar.classList.add('active');
};

const hideLoading = () => {
    elements.loadingBar.classList.remove('active');
};

const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
};

const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getTaskStatus = (properties) => {
    // Try to find status in various property names
    const statusFields = ['Status', 'status', 'State', 'state'];
    for (const field of statusFields) {
        if (properties[field]) {
            const status = properties[field];
            if (status.select) return status.select.name;
            if (status.multi_select) return status.multi_select[0]?.name || 'Not started';
            if (status.checkbox) return status.checkbox ? 'Completed' : 'Not started';
        }
    }
    return 'Not started';
};

const getTaskPriority = (properties) => {
    // Try to find priority in various property names
    const priorityFields = ['Priority', 'priority', 'Importance', 'importance'];
    for (const field of priorityFields) {
        if (properties[field]) {
            const priority = properties[field];
            if (priority.select) return priority.select.name;
            if (priority.multi_select) return priority.multi_select[0]?.name || 'Low';
        }
    }
    return 'Low';
};

const getTaskTitle = (properties) => {
    // Try to find title in various property names
    const titleFields = ['Name', 'name', 'Title', 'title', 'Task', 'task'];
    for (const field of titleFields) {
        if (properties[field]) {
            const title = properties[field];
            if (title.title) return title.title.map(t => t.plain_text).join('');
            if (title.rich_text) return title.rich_text.map(t => t.plain_text).join('');
        }
    }
    return 'Untitled Task';
};

const getTaskDescription = (properties) => {
    // Try to find description in various property names
    const descFields = ['Description', 'description', 'Notes', 'notes', 'Details', 'details'];
    for (const field of descFields) {
        if (properties[field]) {
            const desc = properties[field];
            if (desc.rich_text) return desc.rich_text.map(t => t.plain_text).join('');
        }
    }
    return '';
};

const getTaskDate = (properties) => {
    // Try to find date in various property names
    const dateFields = ['Due Date', 'due_date', 'Date', 'date', 'Deadline', 'deadline'];
    for (const field of dateFields) {
        if (properties[field]) {
            const date = properties[field];
            if (date.date) return date.date.start;
        }
    }
    return null;
};

// --- REPLACE Notion API logic with FastAPI fetch ---

// Map db1, db2, db3 to priorities
const DB_PRIORITY_MAP = {
    db1: 'high',
    db2: 'medium',
    db3: 'low'
};

const loadAllTasks = async () => {
    showLoading();
    try {
        const response = await fetch('/api/notion_entries');
        if (!response.ok) throw new Error('Failed to fetch Notion data');
        const data = await response.json();
        allTasks = [];
        for (const [dbKey, entries] of Object.entries(data)) {
            const priority = DB_PRIORITY_MAP[dbKey] || 'low';
            for (const entry of entries) {
                allTasks.push({
                    id: entry.id,
                    title: entry.title,
                    description: '', // Optionally parse from entry.properties
                    status: 'Not started', // Optionally parse from entry.properties
                    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
                    date: null, // Optionally parse from entry.properties
                    database: priority,
                    url: entry.url || '',
                    properties: entry.properties
                });
            }
        }
        filteredTasks = [...allTasks];
        updateStatistics();
        renderTasks();
        updateProgressBars();
        showNotification(`Loaded ${allTasks.length} tasks successfully`, 'success');
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Failed to load tasks', 'error');
    } finally {
        hideLoading();
    }
};

// UI rendering functions
const createTaskCard = (task) => {
    const card = document.createElement('div');
    card.className = `task-card ${task.status.toLowerCase() === 'completed' ? 'completed' : ''}`;
    card.dataset.taskId = task.id;

    const priorityClass = task.priority.toLowerCase();
    const statusClass = task.status.toLowerCase().replace(/\s+/g, '-');

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            <div class="task-status ${statusClass}">${task.status}</div>
        </div>
        <div class="task-description">${task.description || 'No description available'}</div>
        <div class="task-footer">
            <div class="task-date">${formatDate(task.date)}</div>
            <div class="task-priority ${priorityClass}">${task.priority}</div>
        </div>
    `;

    card.addEventListener('click', () => showTaskModal(task));
    return card;
};

const renderTasks = () => {
    const tasksByDatabase = {
        high: filteredTasks.filter(task => task.database === 'high'),
        medium: filteredTasks.filter(task => task.database === 'medium'),
        low: filteredTasks.filter(task => task.database === 'low')
    };

    Object.keys(tasksByDatabase).forEach(priority => {
        const container = elements.taskContainers[priority];
        const tasks = tasksByDatabase[priority];

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No ${priority} priority tasks found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        tasks.forEach((task, index) => {
            const card = createTaskCard(task);
            card.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(card);
        });
    });
};

const updateStatistics = () => {
    const stats = {
        high: allTasks.filter(task => task.database === 'high').length,
        medium: allTasks.filter(task => task.database === 'medium').length,
        low: allTasks.filter(task => task.database === 'low').length,
        completed: allTasks.filter(task => task.status.toLowerCase() === 'completed').length
    };

    Object.keys(stats).forEach(key => {
        if (elements.statCounts[key]) {
            elements.statCounts[key].textContent = stats[key];
        }
    });
};

const updateProgressBars = () => {
    const databases = ['high', 'medium', 'low'];
    
    databases.forEach(priority => {
        const tasks = allTasks.filter(task => task.database === priority);
        const completed = tasks.filter(task => task.status.toLowerCase() === 'completed').length;
        const total = tasks.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        const progressFill = document.querySelector(`.${priority}-priority-fill`);
        const progressText = progressFill?.closest('.database-progress')?.querySelector('.progress-text');

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${completed}/${total} completed`;
        }
    });
};

const showTaskModal = (task) => {
    elements.modalTitle.textContent = task.title;
    elements.modalBody.innerHTML = `
        <div class="modal-task-details">
            <div class="modal-field">
                <strong>Status:</strong> 
                <span class="task-status ${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span>
            </div>
            <div class="modal-field">
                <strong>Priority:</strong> 
                <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div class="modal-field">
                <strong>Due Date:</strong> ${formatDate(task.date)}
            </div>
            <div class="modal-field">
                <strong>Database:</strong> ${task.database.charAt(0).toUpperCase() + task.database.slice(1)} Priority
            </div>
            <div class="modal-field">
                <strong>Description:</strong>
                <p>${task.description || 'No description available'}</p>
            </div>
            <div class="modal-actions">
                <a href="${task.url}" target="_blank" class="btn btn-primary">Open in Notion</a>
            </div>
        </div>
    `;
    elements.taskModal.classList.add('active');
};

const closeTaskModal = () => {
    elements.taskModal.classList.remove('active');
};

// Filter and sort functions
const applyFilter = (filter) => {
    currentFilter = filter;
    
    switch (filter) {
        case 'all':
            filteredTasks = [...allTasks];
            break;
        case 'high':
            filteredTasks = allTasks.filter(task => task.database === 'high');
            break;
        case 'medium':
            filteredTasks = allTasks.filter(task => task.database === 'medium');
            break;
        case 'low':
            filteredTasks = allTasks.filter(task => task.database === 'low');
            break;
        case 'completed':
            filteredTasks = allTasks.filter(task => task.status.toLowerCase() === 'completed');
            break;
    }
    
    applySorting();
    renderTasks();
    updateFilterButtons();
};

const applySorting = () => {
    const sortBy = currentSort;
    
    filteredTasks.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return priorityOrder[b.priority.toLowerCase()] - priorityOrder[a.priority.toLowerCase()];
            case 'date':
                const dateA = new Date(a.date || '9999-12-31');
                const dateB = new Date(b.date || '9999-12-31');
                return dateA - dateB;
            case 'status':
                const statusOrder = { 'not started': 1, 'in progress': 2, 'completed': 3 };
                return statusOrder[a.status.toLowerCase()] - statusOrder[b.status.toLowerCase()];
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
};

const updateFilterButtons = () => {
    elements.filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        }
    });
};

const searchTasks = (query) => {
    if (!query) {
        applyFilter(currentFilter);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    filteredTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.status.toLowerCase().includes(searchTerm) ||
        task.priority.toLowerCase().includes(searchTerm)
    );
    
    applySorting();
    renderTasks();
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadAllTasks();
    
    // Refresh button
    elements.refreshBtn.addEventListener('click', loadAllTasks);
    
    // Search functionality
    elements.searchInput.addEventListener('input', (e) => {
        searchTasks(e.target.value);
    });
    
    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.filter);
        });
    });
    
    // Sort select
    elements.sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applySorting();
        renderTasks();
    });
    
    // Modal controls
    elements.closeModal.addEventListener('click', closeTaskModal);
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) {
            closeTaskModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskModal();
        }
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            loadAllTasks();
        }
        if (e.key === 'f' && e.ctrlKey) {
            e.preventDefault();
            elements.searchInput.focus();
        }
    });
    
    // Auto-refresh every 5 minutes
    setInterval(loadAllTasks, 5 * 60 * 1000);
});

// Add some CSS for modal styling
const modalStyles = `
    .modal-task-details {
        color: var(--text-primary);
    }
    
    .modal-field {
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-field:last-child {
        border-bottom: none;
    }
    
    .modal-field strong {
        color: var(--accent-blue);
        display: inline-block;
        width: 100px;
    }
    
    .modal-field p {
        margin-top: 0.5rem;
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .modal-actions {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .btn-primary {
        background: linear-gradient(45deg, var(--accent-blue), var(--accent-purple));
        color: var(--text-primary);
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
    }
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Export functions for debugging (if needed)
window.dashboardDebug = {
    allTasks,
    filteredTasks,
    loadAllTasks,
    NOTION_CONFIG
};