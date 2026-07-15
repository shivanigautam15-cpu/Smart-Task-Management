const API_BASE = '/api'; 

let isLoginMode = true;
let currentUser = null;
let currentToken = localStorage.getItem('token') || null;

const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authForm = document.getElementById('auth-form');
const toggleAuthBtn = document.getElementById('toggle-auth-btn');
const registerFields = document.querySelectorAll('.register-only');
const tasksListContainer = document.getElementById('tasks-list');
const noTasksFallback = document.getElementById('no-tasks-fallback');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const taskIdField = document.getElementById('task-id-field');

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    if (currentToken && savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showAuthScreen();
    }
});

function showAuthScreen() {
    dashboardScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
}

function showDashboard() {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    document.getElementById('user-display-name').textContent = currentUser.name;
    document.getElementById('user-display-role').textContent = currentUser.role;
    fetchAndRenderTasks();
}

toggleAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    document.getElementById('auth-title').textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
    document.getElementById('auth-subtitle').textContent = isLoginMode ? 'Login to manage your tasks effectively.' : 'Sign up to modernize your collaborative workspace.';
    document.getElementById('auth-submit-btn').textContent = isLoginMode ? 'Sign In' : 'Register Profile';
    document.getElementById('toggle-text').textContent = isLoginMode ? "Don't have an account?" : 'Already have an account?';
    toggleAuthBtn.textContent = isLoginMode ? 'Create one' : 'Login instead';

    registerFields.forEach(field => {
        if (isLoginMode) field.classList.add('hidden');
        else field.classList.remove('hidden');
    });
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        if (isLoginMode) {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            currentToken = data.token;
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showDashboard();
        } else {
            const name = document.getElementById('auth-name').value;
            const role = document.getElementById('auth-role').value;

            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || data.message || 'Registration failed');

            alert('Registration complete! Switching to login tab.');
            isLoginMode = true;
            toggleAuthBtn.click();
        }
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
   localStorage.clear();
    currentToken = null;
    currentUser = null;

     document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
    
    const nameField = document.getElementById('auth-name');
    if (nameField) {
        nameField.value = '';
    }

    
    document.getElementById('auth-form').reset();

   
    showAuthScreen();
});

async function fetchAndRenderTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const tasks = await response.json();
        
        tasksListContainer.innerHTML = '';
        if (!tasks || tasks.length === 0) {
            noTasksFallback.classList.remove('hidden');
            return;
        }
        noTasksFallback.classList.add('hidden');

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card';
            const cleanStatus = task.status.replace(/\s+/g, '').toLowerCase();
            
            card.innerHTML = `
                <div>
                    <h4>${escapeHTML(task.title)}</h4>
                    <p>${escapeHTML(task.description || 'No context details supplied.')}</p>
                </div>
                <div>
                    <div class="task-meta">
                        <span class="badge status-${cleanStatus}">${task.status}</span>
                        <span class="badge" style="background:#f1f5f9; color:#475569">Priority: ${task.priority}</span>
                    </div>
                    <div class="task-actions">
                        <button class="btn-secondary" onclick="openEditModal('${task._id}', '${escapeJS(task.title)}', '${escapeJS(task.description)}', '${task.status}', '${task.priority}')">Edit</button>
                        <button class="btn-danger" style="padding: 0.4rem 0.8rem;" onclick="executeDeleteTask('${task._id}')">Delete</button>
                    </div>
                </div>
            `;
            tasksListContainer.appendChild(card);
        });
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

document.getElementById('open-create-modal-btn').addEventListener('click', () => {
    modalTitle.textContent = 'Create New Task';
    taskIdField.value = '';
    taskForm.reset();
    taskModal.classList.remove('hidden');
});

function openEditModal(id, title, desc, status, priority) {
    modalTitle.textContent = 'Edit Tracked Deliverable';
    taskIdField.value = id;
    document.getElementById('task-title').value = title;
    document.getElementById('task-desc').value = desc === 'undefined' ? '' : desc;
    document.getElementById('task-status').value = status;
    document.getElementById('task-priority').value = priority;
    taskModal.classList.remove('hidden');
}

window.openEditModal = openEditModal;

function closeModal() { taskModal.classList.add('hidden'); }
document.getElementById('close-modal-btn').addEventListener('click', closeModal);
document.getElementById('modal-close-overlay').addEventListener('click', closeModal);

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = taskIdField.value;
    const payload = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
    };

    const targetUrl = id ? `${API_BASE}/tasks/${id}` : `${API_BASE}/tasks`;
    const targetMethod = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(targetUrl, {
            method: targetMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to save task.');
        }

        closeModal();
        fetchAndRenderTasks();
    } catch (err) {
        alert(err.message);
    }
});

window.executeDeleteTask = async function executeDeleteTask(id) {
    if (!confirm('Are you certain you wish to purge this task?')) return;
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Deletion rejected.');
        }
        fetchAndRenderTasks();
    } catch (err) {
        alert(err.message);
    }
};

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
function escapeJS(str) {
    if (!str || str === 'undefined') return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
