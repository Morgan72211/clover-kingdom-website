// ============================================
// ACCOUNTS CONFIG - EDIT THIS SECTION ONLY
// ============================================

function loadAccountsConfig() {
    const saved = localStorage.getItem('ck_accounts_config');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        users: {
            "Suki": {
                password: "CloverKingdom_SilverSovereign",
                rank: "Owner",
                displayName: "Suki"
            }
        },
        ranks: {
            "Vice Captain": { level: 1, color: "#7f8c8d" },
            "Captain": { level: 2, color: "#95a5a6" },
            "Sovereign": { level: 3, color: "#bdc3c7" },
            "Wizard King": { level: 4, color: "#d5dbdb" },
            "Owner": { level: 5, color: "#f39c12" }
        }
    };
}

function saveAccountsConfig() {
    localStorage.setItem('ck_accounts_config', JSON.stringify(ACCOUNTS_CONFIG));
}

let ACCOUNTS_CONFIG = loadAccountsConfig();

function saveWebhook() {
    const webhookInput = document.getElementById('webhookUrl');
    if (!webhookInput) return;
    
    const url = webhookInput.value.trim();
    
    if (!url) {
        alert('Please enter a webhook URL');
        return;
    }
    
    if (!url.startsWith('https://discord.com/api/webhooks/')) {
        alert('Invalid Discord webhook URL. Must start with https://discord.com/api/webhooks/');
        return;
    }
    
    localStorage.setItem('ck_discord_webhook', url);
    alert('Webhook saved successfully!');
    
    const statusEl = document.getElementById('webhookStatus');
    if (statusEl) {
        statusEl.textContent = '✓ Webhook saved!';
        statusEl.style.color = '#2ecc71';
    }
}

// ============================================
// SESSION UTILS
// ============================================

function getUsers() {
    const config = loadAccountsConfig();
    return config.users || {};
}

function getSession() {
    const session = localStorage.getItem('ck_session');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}

function setSession(user) {
    const config = loadAccountsConfig();
    const rankData = config.ranks[user.rank] || { level: 0, color: '#888' };
    const username = Object.keys(config.users).find(k => config.users[k] === user) || user.displayName;
    localStorage.setItem('ck_session', JSON.stringify({
        username: username,
        rank: user.rank,
        level: rankData.level,
        color: rankData.color,
        displayName: user.displayName
    }));
}

function clearSession() {
    localStorage.removeItem('ck_session');
}

function getRankColor(rank) {
    const config = loadAccountsConfig();
    return (config.ranks[rank] || {}).color || '#888';
}

function getRankLevel(rank) {
    const config = loadAccountsConfig();
    return (config.ranks[rank] || {}).level || 0;
}

// ============================================
// DISCORD WEBHOOK
// ============================================
console.log("TEST")
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1366958369926660196/EXAMPLE_TOKEN';

async function sendToDiscord(webhookUrl, title, message, priority) {
    const colors = {
        normal: 0x888888,
        important: 0xf39c12,
        urgent: 0xe74c3c
    };
    
    const payload = {
        embeds: [{
            title: '📢 ' + title,
            description: message,
            color: colors[priority] || colors.normal,
            footer: { text: 'Clover Kingdom Announcements' },
            timestamp: new Date().toISOString()
        }]
    };
    
    const response = await fetch('/api/send-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookUrl, payload: payload })
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Server error: ' + response.status);
    }
    return response;
}

// ============================================
// LOGIN
// ============================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        
        const users = getUsers();
        const user = users[username];
        
        if (!user || user.password !== password) {
            errorDiv.textContent = 'Invalid credentials. Access denied.';
            errorDiv.style.display = 'block';
            return;
        }
        
        setSession(user);
        window.location.href = 'dashboard.html';
    });
}

// ============================================
// LOGOUT
// ============================================

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearSession();
        window.location.href = 'index.html';
    });
}

// ============================================
// NAV & AUTH
// ============================================

function updateAuthNav() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    const session = getSession();
    if (session) {
        authLink.textContent = 'Dashboard';
        authLink.href = 'dashboard.html';
    } else {
        authLink.textContent = 'Sign In';
        authLink.href = 'login.html';
    }
}

// ============================================
// SIDEBAR
// ============================================

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const footer = document.getElementById('footer');
const dashboardMain = document.querySelector('.dashboard-main');

let sidebarOpen = false;

function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.classList.remove('collapsed');
        if (sidebarToggle) {
            sidebarToggle.classList.add('shifted');
            sidebarToggle.classList.add('active');
        }
    } else {
        sidebar.classList.add('collapsed');
        if (sidebarToggle) {
            sidebarToggle.classList.remove('shifted');
            sidebarToggle.classList.remove('active');
        }
    }
    
    if (mainContent) {
        mainContent.classList.toggle('expanded', !sidebarOpen);
    }
    
    if (footer) {
        footer.classList.toggle('expanded', !sidebarOpen);
    }
    
    if (dashboardMain) {
        dashboardMain.classList.toggle('expanded', !sidebarOpen);
    }
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

function initSidebarRank() {
    const session = getSession();
    if (!session) return;
    
    const sidebarRank = document.getElementById('sidebarRank');
    if (sidebarRank) {
        sidebarRank.textContent = session.rank;
        sidebarRank.style.color = getRankColor(session.rank);
        sidebarRank.style.borderColor = getRankColor(session.rank);
    }
    
    const adminLinks = document.getElementById('adminLinks');
    if (adminLinks) {
        const level = session.level;
        let adminHTML = '';
        
        adminHTML += '<li class="admin-label">General</li>';
        adminHTML += '<li><a href="manage-events.html">Manage Events</a></li>';
        
        if (level >= 2) {
            adminHTML += '<li class="admin-label">Captain+</li>';
            adminHTML += '<li><a href="manage-announcements.html">Manage Announcements</a></li>';
            adminHTML += '<li><a href="review-applications.html">Review Applications</a></li>';
            adminHTML += '<li><a href="#" onclick="openCreateAppModal()">Create Application</a></li>';
        }
        
        if (level >= 3) {
            adminHTML += '<li class="admin-label">Sovereign+</li>';
            adminHTML += '<li><a href="review-appeals.html">Review Appeals</a></li>';
            adminHTML += '<li><a href="edit-staff.html">Edit Staff</a></li>';
        }
        
        if (level >= 4) {
            adminHTML += '<li class="admin-label">High Command</li>';
            adminHTML += '<li><a href="owner-panel.html">👑 Owner Panel</a></li>';
        }
        
        adminLinks.innerHTML = adminHTML;
    }
}

if (document.getElementById('adminLinks')) {
    initSidebarRank();
}

// ============================================
// DASHBOARD
// ============================================

function initDashboard() {
    const session = getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    const level = session.level;
    
    const welcomeText = document.getElementById('welcomeText');
    const userRank = document.getElementById('userRank');
    const userName = document.getElementById('userName');
    
    if (welcomeText) welcomeText.textContent = 'Welcome to the Kingdom';
    if (userRank) {
        userRank.textContent = session.rank;
        userRank.style.color = getRankColor(session.rank);
        userRank.style.borderColor = getRankColor(session.rank);
    }
    if (userName) userName.textContent = session.username;
    
    loadDashboardStats();
    
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        let actionsHTML = '';
        
        actionsHTML += '<a href="manage-events.html" class="action-btn"><span style="font-size:2rem;margin-bottom:0.5rem;">📅</span><br>Manage Events</a>';
        
        if (level >= 2) {
            actionsHTML += '<a href="review-applications.html" class="action-btn"><span style="font-size:2rem;margin-bottom:0.5rem;">📋</span><br>Review Apps</a>';
            actionsHTML += '<a href="manage-announcements.html" class="action-btn"><span style="font-size:2rem;margin-bottom:0.5rem;">📢</span><br>Post News</a>';
            actionsHTML += '<button class="action-btn" onclick="openCreateAppModal()"><span style="font-size:2rem;margin-bottom:0.5rem;">➕</span><br>Create App</button>';
        }
        
        if (level >= 3) {
            actionsHTML += '<a href="review-appeals.html" class="action-btn"><span style="font-size:2rem;margin-bottom:0.5rem;">📝</span><br>Review Appeals</a>';
            actionsHTML += '<a href="edit-staff.html" class="action-btn"><span style="font-size:2rem;margin-bottom:0.5rem;">✏️</span><br>Edit Staff</a>';
        }
        
        if (level >= 5) {
            actionsHTML += '<a href="owner-panel.html" class="action-btn owner"><span style="font-size:2rem;margin-bottom:0.5rem;">👑</span><br>Owner Panel</a>';
        }
        
        quickActions.innerHTML = actionsHTML;
    }
}

function loadDashboardStats() {
    const config = loadAccountsConfig();
    const users = config.users || {};
    const apps = JSON.parse(localStorage.getItem('ck_applications') || '[]');
    const appeals = JSON.parse(localStorage.getItem('ck_appeals') || '[]');
    
    const totalStaff = Object.keys(users).length;
    const pendingApps = apps.filter(function(a) { return a.status === 'pending'; }).length;
    const pendingAppeals = appeals.filter(function(a) { return a.status === 'pending'; }).length;
    
    const totalStaffEl = document.getElementById('dashTotalStaff');
    const activeStaffEl = document.getElementById('dashActiveStaff');
    const pendingAppsEl = document.getElementById('dashPendingApps');
    const pendingAppealsEl = document.getElementById('dashPendingAppeals');
    
    if (totalStaffEl) totalStaffEl.textContent = totalStaff;
    if (activeStaffEl) activeStaffEl.textContent = totalStaff;
    if (pendingAppsEl) pendingAppsEl.textContent = pendingApps;
    if (pendingAppealsEl) pendingAppealsEl.textContent = pendingAppeals;
}

if (document.body.classList.contains('dashboard-body')) {
    initDashboard();
}

// ============================================
// EVENTS
// ============================================

const eventForm = document.getElementById('eventForm');
if (eventForm) {
    loadEvents();
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('eventName').value;
        const date = document.getElementById('eventDate').value;
        const desc = document.getElementById('eventDesc').value;
        const type = document.getElementById('eventType').value;
        
        const events = JSON.parse(localStorage.getItem('ck_events') || '[]');
        events.push({ name: name, date: date, desc: desc, type: type, id: Date.now() });
        localStorage.setItem('ck_events', JSON.stringify(events));
        
        alert('Event created successfully!');
        eventForm.reset();
        loadEvents();
    });
}

function loadEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    let events = JSON.parse(localStorage.getItem('ck_events') || '[]');
    
    if (events.length === 0) {
        events = [
            { name: 'Magic Knight Tournament', date: '2026-06-15', desc: 'Compete against the strongest mages in the kingdom. Grand prize: Royal Grimoire.', type: 'tournament', id: 2001 },
            { name: 'Beast Hunt Quest', date: '2026-06-22', desc: 'Join a squad to track and subdue magical beasts threatening nearby villages.', type: 'quest', id: 2002 },
            { name: 'Kingdom Festival', date: '2026-07-01', desc: 'Celebrate the founding of Clover Kingdom with games, food, and magic displays.', type: 'festival', id: 2003 }
        ];
        localStorage.setItem('ck_events', JSON.stringify(events));
    }
    
    if (events.length === 0) {
        container.innerHTML = '<p style="color:var(--text-dark);text-align:center;">No events yet. Create one above!</p>';
        return;
    }
    
    let html = '<div class="cards-grid">';
    events.forEach(function(event) {
        html += '<div class="card" style="text-align:left;">';
        html += '<div style="color:var(--gold);font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;margin-bottom:0.5rem;">' + event.type + '</div>';
        html += '<h3 style="margin-bottom:0.5rem;">' + event.name + '</h3>';
        html += '<p style="color:var(--text-dark);font-size:0.9rem;margin-bottom:1rem;">' + event.desc + '</p>';
        html += '<div style="color:var(--gold);font-size:0.85rem;">📅 ' + event.date + '</div>';
        html += '<button onclick="deleteEvent(' + event.id + ')" style="margin-top:1rem;background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Delete</button>';
        html += '</div>';
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    let events = JSON.parse(localStorage.getItem('ck_events') || '[]');
    events = events.filter(function(e) { return e.id !== id; });
    localStorage.setItem('ck_events', JSON.stringify(events));
    loadEvents();
}

// ============================================
// ANNOUNCEMENTS
// ============================================

const announcementForm = document.getElementById('announcementForm');
if (announcementForm) {
    loadAnnouncements();
    
    announcementForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('announceTitle').value;
        const message = document.getElementById('announceMessage').value;
        const priority = document.getElementById('announcePriority').value;
        const sendToDiscord = document.getElementById('sendToDiscord').checked;
        const webhookUrl = localStorage.getItem('ck_discord_webhook') || DISCORD_WEBHOOK_URL || '';
        
        const announcements = JSON.parse(localStorage.getItem('ck_announcements') || '[]');
        announcements.unshift({ 
            title: title, 
            message: message, 
            priority: priority, 
            date: new Date().toLocaleDateString(),
            id: Date.now() 
        });
        localStorage.setItem('ck_announcements', JSON.stringify(announcements));
        
        if (sendToDiscord && webhookUrl) {
            try {
                await sendToDiscord(webhookUrl, title, message, priority);
                alert('Announcement posted to website and Discord!');
            } catch (err) {
                alert('Saved to website but Discord webhook failed: ' + err.message);
            }
        } else if (sendToDiscord && !webhookUrl) {
            alert('Announcement saved to website! (No webhook configured - save one above)');
        } else {
            alert('Announcement posted to website only!');
        }
        
        announcementForm.reset();
        document.getElementById('sendToDiscord').checked = false;
        loadAnnouncements();
    });
}

function loadAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    if (!container) return;
    
    let announcements = JSON.parse(localStorage.getItem('ck_announcements') || '[]');
    
    if (announcements.length === 0) {
        announcements = [
            { title: 'Welcome to the New Kingdom!', message: 'The Clover Kingdom website has officially launched! Explore our magical realm and join us on this journey.', priority: 'important', date: 'May 25, 2026', id: 1001 },
            { title: 'Magic Knight Exams', message: 'Applications for the next Magic Knight squad entrance exam are now open. Prepare your grimoires!', priority: 'normal', date: 'May 20, 2026', id: 1002 },
            { title: 'Server Updates', message: 'New spells added to the grimoire system. Check the events page for details on upcoming training sessions.', priority: 'normal', date: 'May 15, 2026', id: 1003 }
        ];
        localStorage.setItem('ck_announcements', JSON.stringify(announcements));
    }
    
    if (announcements.length === 0) {
        container.innerHTML = '<p style="color:var(--text-dark);text-align:center;">No announcements yet. Post one above!</p>';
        return;
    }
    
    let html = '';
    announcements.forEach(function(ann) {
        const priorityColor = ann.priority === 'urgent' ? '#e74c3c' : ann.priority === 'important' ? '#f39c12' : 'var(--gold)';
        html += '<div class="announcement-card" style="margin-bottom:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">';
        html += '<span style="color:' + priorityColor + ';font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;">' + ann.priority + '</span>';
        html += '<span style="color:var(--text-dark);font-size:0.8rem;">' + ann.date + '</span>';
        html += '</div>';
        html += '<h3 style="margin-bottom:0.5rem;">' + ann.title + '</h3>';
        html += '<p style="color:var(--text-dark);">' + ann.message + '</p>';
        html += '<button onclick="deleteAnnouncement(' + ann.id + ')" style="margin-top:1rem;background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Delete</button>';
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function deleteAnnouncement(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    let announcements = JSON.parse(localStorage.getItem('ck_announcements') || '[]');
    announcements = announcements.filter(function(a) { return a.id !== id; });
    localStorage.setItem('ck_announcements', JSON.stringify(announcements));
    loadAnnouncements();
}

// ============================================
// APPLICATIONS
// ============================================

let currentAppFilter = 'all';

function loadApplications(filter) {
    const container = document.getElementById('applicationsContainer');
    if (!container) return;
    
    if (filter) currentAppFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    const activeBtn = document.getElementById('filter-' + currentAppFilter);
    if (activeBtn) activeBtn.classList.add('active');
    
    let apps = JSON.parse(localStorage.getItem('ck_applications') || '[]');
    
    if (currentAppFilter !== 'all') {
        apps = apps.filter(function(app) { return app.status === currentAppFilter; });
    }
    
    if (apps.length === 0) {
        container.innerHTML = '<div class="announcement-card" style="text-align:center;padding:3rem;"><p style="color:var(--text-dark);font-size:1.1rem;">No ' + (currentAppFilter !== 'all' ? currentAppFilter + ' ' : '') + 'applications.</p></div>';
        return;
    }
    
    let html = '';
    apps.forEach(function(app) {
        const statusColor = app.status === 'approved' ? '#2ecc71' : app.status === 'denied' ? '#e74c3c' : 'var(--gold)';
        html += '<div class="announcement-card" style="margin-bottom:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">';
        html += '<div><h3 style="margin-bottom:0.3rem;">' + app.name + '</h3>';
        html += '<span style="color:var(--text-dark);font-size:0.85rem;">' + app.type + ' • ' + app.date + '</span></div>';
        html += '<span style="color:' + statusColor + ';font-size:0.8rem;text-transform:uppercase;letter-spacing:2px;padding:0.3rem 0.8rem;border:1px solid ' + statusColor + ';border-radius:20px;">' + app.status + '</span>';
        html += '</div>';
        html += '<p style="color:var(--text-dark);margin-bottom:0.5rem;"><strong>Discord:</strong> ' + app.discord + '</p>';
        html += '<p style="color:var(--text-dark);margin-bottom:0.5rem;"><strong>Reason:</strong> ' + app.reason + '</p>';
        html += '<p style="color:var(--text-dark);margin-bottom:1rem;"><strong>Experience:</strong> ' + app.experience + '</p>';
        if (app.createdBy) {
            html += '<p style="color:var(--text-dark);font-size:0.8rem;margin-bottom:1rem;">Created by: ' + app.createdBy + '</p>';
        }
        if (app.status === 'pending') {
            html += '<div style="display:flex;gap:0.5rem;">';
            html += '<button onclick="updateAppStatus(' + app.id + ', \'approved\')" style="background:#2ecc71;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Approve</button>';
            html += '<button onclick="updateAppStatus(' + app.id + ', \'denied\')" style="background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Deny</button>';
            html += '</div>';
        }
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function filterApps(filter) {
    loadApplications(filter);
}

function updateAppStatus(id, status) {
    let apps = JSON.parse(localStorage.getItem('ck_applications') || '[]');
    const app = apps.find(function(a) { return a.id === id; });
    if (app) app.status = status;
    localStorage.setItem('ck_applications', JSON.stringify(apps));
    loadApplications();
}

if (document.getElementById('applicationsContainer')) {
    loadApplications();
}

// ============================================
// APPEALS
// ============================================

let currentAppealFilter = 'all';

function loadAppeals(filter) {
    const container = document.getElementById('appealsContainer');
    if (!container) return;
    
    if (filter) currentAppealFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    const activeBtn = document.getElementById('filter-' + currentAppealFilter);
    if (activeBtn) activeBtn.classList.add('active');
    
    let appeals = JSON.parse(localStorage.getItem('ck_appeals') || '[]');
    
    if (appeals.length === 0) {
        appeals = [{
            id: 1,
            type: 'ban',
            discord: 'DemoUser#1234',
            reason: 'I believe my ban was unjustified. I was not involved in the incident.',
            date: new Date().toLocaleDateString(),
            status: 'pending'
        }];
        localStorage.setItem('ck_appeals', JSON.stringify(appeals));
    }
    
    if (currentAppealFilter !== 'all') {
        appeals = appeals.filter(function(a) { return a.status === currentAppealFilter; });
    }
    
    if (appeals.length === 0) {
        container.innerHTML = '<div class="announcement-card" style="text-align:center;padding:3rem;"><p style="color:var(--text-dark);font-size:1.1rem;">No ' + (currentAppealFilter !== 'all' ? currentAppealFilter + ' ' : '') + 'appeals.</p></div>';
        return;
    }
    
    let html = '';
    appeals.forEach(function(appeal) {
        const statusColor = appeal.status === 'approved' ? '#2ecc71' : appeal.status === 'denied' ? '#e74c3c' : 'var(--gold)';
        const typeLabel = appeal.type.charAt(0).toUpperCase() + appeal.type.slice(1);
        html += '<div class="announcement-card" style="margin-bottom:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">';
        html += '<div><h3 style="margin-bottom:0.3rem;">' + typeLabel + ' Appeal</h3>';
        html += '<span style="color:var(--text-dark);font-size:0.85rem;">' + appeal.discord + ' • ' + appeal.date + '</span></div>';
        html += '<span style="color:' + statusColor + ';font-size:0.8rem;text-transform:uppercase;letter-spacing:2px;padding:0.3rem 0.8rem;border:1px solid ' + statusColor + ';border-radius:20px;">' + appeal.status + '</span>';
        html += '</div>';
        html += '<p style="color:var(--text-dark);margin-bottom:1rem;">' + appeal.reason + '</p>';
        if (appeal.status === 'pending') {
            html += '<div style="display:flex;gap:0.5rem;">';
            html += '<button onclick="updateAppealStatus(' + appeal.id + ', \'approved\')" style="background:#2ecc71;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Approve</button>';
            html += '<button onclick="updateAppealStatus(' + appeal.id + ', \'denied\')" style="background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;">Deny</button>';
            html += '</div>';
        }
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function filterAppeals(filter) {
    loadAppeals(filter);
}

function updateAppealStatus(id, status) {
    let appeals = JSON.parse(localStorage.getItem('ck_appeals') || '[]');
    const appeal = appeals.find(function(a) { return a.id === id; });
    if (appeal) appeal.status = status;
    localStorage.setItem('ck_appeals', JSON.stringify(appeals));
    loadAppeals();
}

if (document.getElementById('appealsContainer')) {
    loadAppeals();
}

// ============================================
// STAFF
// ============================================

function loadStaffList() {
    const container = document.getElementById('staffListContainer');
    if (!container) return;
    
    const config = loadAccountsConfig();
    const allStaff = [];
    
    for (const [username, data] of Object.entries(config.users)) {
        allStaff.push({
            name: data.displayName || username,
            rank: data.rank,
            username: username,
            color: getRankColor(data.rank)
        });
    }
    
    allStaff.sort(function(a, b) { return getRankLevel(b.rank) - getRankLevel(a.rank); });
    
    const rankCounts = {};
    allStaff.forEach(function(s) {
        rankCounts[s.rank] = (rankCounts[s.rank] || 0) + 1;
    });
    
    const totalEl = document.getElementById('totalStaffCount');
    const ownerEl = document.getElementById('ownerCount');
    const wizardEl = document.getElementById('wizardKingCount');
    const captainEl = document.getElementById('captainCount');
    
    if (totalEl) totalEl.textContent = allStaff.length;
    if (ownerEl) ownerEl.textContent = rankCounts['Owner'] || 0;
    if (wizardEl) wizardEl.textContent = rankCounts['Wizard King'] || 0;
    if (captainEl) captainEl.textContent = (rankCounts['Captain'] || 0) + (rankCounts['Vice Captain'] || 0);
    
    if (allStaff.length === 0) {
        container.innerHTML = '<p style="color:var(--text-dark);text-align:center;">No staff members.</p>';
        return;
    }
    
    let html = '<div class="staff-grid">';
    allStaff.forEach(function(staff) {
        html += '<div class="staff-card" style="text-align:left;">';
        html += '<div style="color:' + staff.color + ';font-size:0.85rem;text-transform:uppercase;letter-spacing:3px;margin-bottom:0.5rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(136,136,136,0.2);">' + staff.rank + '</div>';
        html += '<h3 style="margin-bottom:0.5rem;">' + staff.name + '</h3>';
        html += '<p style="color:var(--text-dark);font-size:0.9rem;">@' + staff.username + '</p>';
        html += '<button onclick="removeStaff(\'' + staff.username + '\')" style="margin-top:1rem;background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;font-size:0.8rem;">Remove</button>';
        html += '</div>';
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function removeStaff(username) {
    if (!confirm('Are you sure you want to remove ' + username + '?')) return;
    
    if (username === 'Suki') {
        alert('Cannot remove the Owner!');
        return;
    }
    
    ACCOUNTS_CONFIG = loadAccountsConfig();
    if (ACCOUNTS_CONFIG.users[username]) {
        delete ACCOUNTS_CONFIG.users[username];
        saveAccountsConfig();
        alert(username + ' has been removed.');
        loadStaffList();
    }
}

if (document.getElementById('staffListContainer')) {
    loadStaffList();
}

// ============================================
// MODALS
// ============================================

function openCreateAppModal() {
    const existing = document.getElementById('createAppModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'createAppModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>➕ Create Application</h2><form id="createAppForm">' +
        '<div class="form-group"><label>Applicant Name</label><input type="text" id="createAppName" placeholder="Enter name" required></div>' +
        '<div class="form-group"><label>Discord Username</label><input type="text" id="createAppDiscord" placeholder="e.g. User#1234" required></div>' +
        '<div class="form-group"><label>Position</label><select id="createAppType" required><option value="Magic Knight">Magic Knight</option><option value="Staff">Staff</option><option value="Squad Member">Squad Member</option></select></div>' +
        '<div class="form-group"><label>Notes (Optional)</label><textarea id="createAppNotes" rows="3" placeholder="Internal notes..."></textarea></div>' +
        '<button type="submit" class="btn-submit">Create Application</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeCreateAppModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeCreateAppModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('createAppForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const apps = JSON.parse(localStorage.getItem('ck_applications') || '[]');
        apps.push({
            id: Date.now(),
            name: document.getElementById('createAppName').value,
            discord: document.getElementById('createAppDiscord').value,
            type: document.getElementById('createAppType').value,
            reason: 'Staff-created application',
            experience: document.getElementById('createAppNotes').value || 'None',
            date: new Date().toLocaleDateString(),
            status: 'pending',
            createdBy: getSession().username
        });
        
        localStorage.setItem('ck_applications', JSON.stringify(apps));
        alert('Application created successfully!');
        closeCreateAppModal();
    });
}

function closeCreateAppModal() {
    const modal = document.getElementById('createAppModal');
    if (modal) modal.remove();
}

function openAddStaffModal() {
    const existing = document.getElementById('addStaffModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'addStaffModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>➕ Add Staff Member</h2><form id="addStaffForm">' +
        '<div class="form-group"><label>Username</label><input type="text" id="addStaffUser" placeholder="Login username" required></div>' +
        '<div class="form-group"><label>Display Name</label><input type="text" id="addStaffName" placeholder="Display name" required></div>' +
        '<div class="form-group"><label>Password</label><input type="text" id="addStaffPass" placeholder="Temporary password" required></div>' +
        '<div class="form-group"><label>Rank</label><select id="addStaffRank" required><option value="Vice Captain">Vice Captain</option><option value="Captain">Captain</option><option value="Sovereign">Sovereign</option><option value="Wizard King">Wizard King</option></select></div>' +
        '<button type="submit" class="btn-submit">Add Staff</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeAddStaffModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeAddStaffModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('addStaffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('addStaffUser').value;
        const name = document.getElementById('addStaffName').value;
        const pass = document.getElementById('addStaffPass').value;
        const rank = document.getElementById('addStaffRank').value;
        
        ACCOUNTS_CONFIG = loadAccountsConfig();
        ACCOUNTS_CONFIG.users[username] = {
            password: pass,
            rank: rank,
            displayName: name
        };
        saveAccountsConfig();
        
        alert('Staff member ' + name + ' added as ' + rank + '!');
        closeAddStaffModal();
        loadStaffList();
    });
}

function closeAddStaffModal() {
    const modal = document.getElementById('addStaffModal');
    if (modal) modal.remove();
}

function openRemoveStaffModal() {
    const config = loadAccountsConfig();
    const users = config.users;
    let options = '';
    for (const [username, data] of Object.entries(users)) {
        if (username !== 'Suki') {
            options += '<option value="' + username + '">' + (data.displayName || username) + ' (' + data.rank + ')</option>';
        }
    }
    
    if (!options) {
        alert('No staff members can be removed.');
        return;
    }
    
    const existing = document.getElementById('removeStaffModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'removeStaffModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>➖ Remove Staff</h2><form id="removeStaffForm">' +
        '<div class="form-group"><label>Select Staff Member</label><select id="removeStaffSelect" required>' + options + '</select></div>' +
        '<button type="submit" class="btn-submit" style="background:#e74c3c;">Remove Staff</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeRemoveStaffModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeRemoveStaffModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('removeStaffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('removeStaffSelect').value;
        removeStaff(username);
        closeRemoveStaffModal();
    });
}

function closeRemoveStaffModal() {
    const modal = document.getElementById('removeStaffModal');
    if (modal) modal.remove();
}

function openChangeRankModal() {
    const config = loadAccountsConfig();
    const users = config.users;
    let userOptions = '';
    for (const [username, data] of Object.entries(users)) {
        userOptions += '<option value="' + username + '">' + (data.displayName || username) + ' (' + data.rank + ')</option>';
    }
    
    const rankOptions = '<option value="Vice Captain">Vice Captain</option>' +
        '<option value="Captain">Captain</option>' +
        '<option value="Sovereign">Sovereign</option>' +
        '<option value="Wizard King">Wizard King</option>' +
        '<option value="Owner">Owner</option>';
    
    const existing = document.getElementById('changeRankModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'changeRankModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>🔄 Change Rank</h2><form id="changeRankForm">' +
        '<div class="form-group"><label>Select Staff Member</label><select id="changeRankUser" required>' + userOptions + '</select></div>' +
        '<div class="form-group"><label>New Rank</label><select id="changeRankNew" required>' + rankOptions + '</select></div>' +
        '<button type="submit" class="btn-submit">Change Rank</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeChangeRankModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeChangeRankModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('changeRankForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('changeRankUser').value;
        const newRank = document.getElementById('changeRankNew').value;
        
        ACCOUNTS_CONFIG = loadAccountsConfig();
        if (ACCOUNTS_CONFIG.users[username]) {
            ACCOUNTS_CONFIG.users[username].rank = newRank;
            saveAccountsConfig();
            alert(username + ' is now ' + newRank + '!');
            closeChangeRankModal();
            loadStaffList();
        }
    });
}

function closeChangeRankModal() {
    const modal = document.getElementById('changeRankModal');
    if (modal) modal.remove();
}

// ============================================
// OWNER PANEL
// ============================================

function initOwnerPanel() {
    const session = getSession();
    if (!session || session.level < 5) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const config = loadAccountsConfig();
    const users = config.users || {};
    const apps = JSON.parse(localStorage.getItem('ck_applications') || '[]');
    const events = JSON.parse(localStorage.getItem('ck_events') || '[]');
    const announcements = JSON.parse(localStorage.getItem('ck_announcements') || '[]');
    
    const totalUsersEl = document.getElementById('sysTotalUsers');
    const totalAppsEl = document.getElementById('sysTotalApps');
    const totalEventsEl = document.getElementById('sysTotalEvents');
    const totalAnnounceEl = document.getElementById('sysTotalAnnounce');
    
    if (totalUsersEl) totalUsersEl.textContent = Object.keys(users).length;
    if (totalAppsEl) totalAppsEl.textContent = apps.length;
    if (totalEventsEl) totalEventsEl.textContent = events.length;
    if (totalAnnounceEl) totalAnnounceEl.textContent = announcements.length;
    
    loadSystemActivityLog();
}

function loadSystemActivityLog() {
    const container = document.getElementById('systemActivityLog');
    if (!container) return;
    
    const logs = JSON.parse(localStorage.getItem('ck_activity_log') || '[]');
    
    if (logs.length === 0) {
        container.innerHTML = '<p style="color:var(--text-dark);text-align:center;">No activity recorded yet.</p>';
        return;
    }
    
    let html = '';
    logs.slice(0, 50).forEach(function(log) {
        html += '<div class="activity-item">';
        html += '<div class="activity-time">' + log.time + '</div>';
        html += '<div class="activity-text">' + log.action + '</div>';
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function logActivity(action) {
    const logs = JSON.parse(localStorage.getItem('ck_activity_log') || '[]');
    logs.unshift({
        time: new Date().toLocaleString(),
        action: action
    });
    if (logs.length > 100) logs.pop();
    localStorage.setItem('ck_activity_log', JSON.stringify(logs));
}

function clearActivityLog() {
    if (!confirm('Are you sure you want to clear all activity logs?')) return;
    localStorage.removeItem('ck_activity_log');
    loadSystemActivityLog();
}

// ============================================
// RESET / EXPORT / IMPORT / SETTINGS
// ============================================

function openResetDataModal() {
    const existing = document.getElementById('resetDataModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'resetDataModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>🗑️ Reset Data</h2>' +
        '<p style="color:#e74c3c;text-align:center;margin-bottom:1.5rem;">WARNING: This cannot be undone!</p>' +
        '<form id="resetDataForm">' +
        '<div class="form-group"><label>Select Data to Reset</label><select id="resetType" required>' +
        '<option value="all">Everything (Full Reset)</option>' +
        '<option value="applications">Applications Only</option>' +
        '<option value="events">Events Only</option>' +
        '<option value="announcements">Announcements Only</option>' +
        '<option value="appeals">Appeals Only</option>' +
        '<option value="activity">Activity Log Only</option>' +
        '</select></div>' +
        '<div class="form-group"><label>Confirm Password</label><input type="password" id="resetConfirmPass" placeholder="Enter your password" required></div>' +
        '<button type="submit" class="btn-submit" style="background:#e74c3c;">Reset Data</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeResetDataModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeResetDataModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('resetDataForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const resetType = document.getElementById('resetType').value;
        const confirmPass = document.getElementById('resetConfirmPass').value;
        
        const config = loadAccountsConfig();
        const owner = config.users['Suki'];
        if (!owner || owner.password !== confirmPass) {
            alert('Incorrect password!');
            return;
        }
        
        if (!confirm('Are you ABSOLUTELY sure? This cannot be undone!')) return;
        
        switch(resetType) {
            case 'all':
                localStorage.removeItem('ck_applications');
                localStorage.removeItem('ck_events');
                localStorage.removeItem('ck_announcements');
                localStorage.removeItem('ck_appeals');
                localStorage.removeItem('ck_activity_log');
                const defaultConfig = {
                    users: {
                        "Suki": {
                            password: "CloverKingdom_SilverSovereign",
                            rank: "Owner",
                            displayName: "Suki"
                        }
                    },
                    ranks: {
                        "Vice Captain": { level: 1, color: "#7f8c8d" },
                        "Captain": { level: 2, color: "#95a5a6" },
                        "Sovereign": { level: 3, color: "#bdc3c7" },
                        "Wizard King": { level: 4, color: "#d5dbdb" },
                        "Owner": { level: 5, color: "#f39c12" }
                    }
                };
                localStorage.setItem('ck_accounts_config', JSON.stringify(defaultConfig));
                ACCOUNTS_CONFIG = defaultConfig;
                alert('All data has been reset to defaults.');
                logActivity('Owner performed full data reset');
                break;
            case 'applications':
                localStorage.removeItem('ck_applications');
                alert('Applications have been reset.');
                logActivity('Owner reset applications');
                break;
            case 'events':
                localStorage.removeItem('ck_events');
                alert('Events have been reset.');
                logActivity('Owner reset events');
                break;
            case 'announcements':
                localStorage.removeItem('ck_announcements');
                alert('Announcements have been reset.');
                logActivity('Owner reset announcements');
                break;
            case 'appeals':
                localStorage.removeItem('ck_appeals');
                alert('Appeals have been reset.');
                logActivity('Owner reset appeals');
                break;
            case 'activity':
                localStorage.removeItem('ck_activity_log');
                alert('Activity log has been cleared.');
                logActivity('Owner cleared activity log');
                break;
        }
        
        closeResetDataModal();
        initOwnerPanel();
    });
}

function closeResetDataModal() {
    const modal = document.getElementById('resetDataModal');
    if (modal) modal.remove();
}

function openExportDataModal() {
    const existing = document.getElementById('exportDataModal');
    if (existing) existing.remove();
    
    const config = loadAccountsConfig();
    const exportData = {
        accounts: config,
        applications: JSON.parse(localStorage.getItem('ck_applications') || '[]'),
        events: JSON.parse(localStorage.getItem('ck_events') || '[]'),
        announcements: JSON.parse(localStorage.getItem('ck_announcements') || '[]'),
        appeals: JSON.parse(localStorage.getItem('ck_appeals') || '[]'),
        activityLog: JSON.parse(localStorage.getItem('ck_activity_log') || '[]'),
        exportedAt: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    
    const overlay = document.createElement('div');
    overlay.id = 'exportDataModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>📤 Export Data</h2>' +
        '<p style="color:var(--text-dark);margin-bottom:1rem;">Copy this data to save a backup:</p>' +
        '<div class="form-group"><textarea id="exportDataArea" rows="10" readonly style="font-family:monospace;font-size:0.75rem;">' + jsonString + '</textarea></div>' +
        '<button type="button" class="btn-submit" onclick="copyExportData()">Copy to Clipboard</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeExportDataModal()">Close</button>' +
        '</div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeExportDataModal();
    });
    
    document.body.appendChild(overlay);
    logActivity('Owner exported system data');
}

function copyExportData() {
    const textarea = document.getElementById('exportDataArea');
    textarea.select();
    document.execCommand('copy');
    alert('Data copied to clipboard!');
}

function closeExportDataModal() {
    const modal = document.getElementById('exportDataModal');
    if (modal) modal.remove();
}

function openImportDataModal() {
    const existing = document.getElementById('importDataModal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'importDataModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>📥 Import Data</h2>' +
        '<p style="color:#e74c3c;text-align:center;margin-bottom:1rem;">WARNING: This will overwrite existing data!</p>' +
        '<form id="importDataForm">' +
        '<div class="form-group"><label>Paste Backup Data (JSON)</label><textarea id="importDataArea" rows="10" placeholder="Paste your backup JSON here..." required style="font-family:monospace;font-size:0.75rem;"></textarea></div>' +
        '<div class="form-group"><label>Confirm Password</label><input type="password" id="importConfirmPass" placeholder="Enter your password" required></div>' +
        '<button type="submit" class="btn-submit" style="background:#e74c3c;">Import Data</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeImportDataModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeImportDataModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('importDataForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const importJson = document.getElementById('importDataArea').value;
        const confirmPass = document.getElementById('importConfirmPass').value;
        
        const config = loadAccountsConfig();
        const owner = config.users['Suki'];
        if (!owner || owner.password !== confirmPass) {
            alert('Incorrect password!');
            return;
        }
        
        if (!confirm('This will overwrite ALL existing data. Continue?')) return;
        
        try {
            const data = JSON.parse(importJson);
            
            if (data.accounts) {
                localStorage.setItem('ck_accounts_config', JSON.stringify(data.accounts));
                ACCOUNTS_CONFIG = data.accounts;
            }
            if (data.applications) localStorage.setItem('ck_applications', JSON.stringify(data.applications));
            if (data.events) localStorage.setItem('ck_events', JSON.stringify(data.events));
            if (data.announcements) localStorage.setItem('ck_announcements', JSON.stringify(data.announcements));
            if (data.appeals) localStorage.setItem('ck_appeals', JSON.stringify(data.appeals));
            if (data.activityLog) localStorage.setItem('ck_activity_log', JSON.stringify(data.activityLog));
            
            alert('Data imported successfully!');
            logActivity('Owner imported system data');
            closeImportDataModal();
            initOwnerPanel();
        } catch (err) {
            alert('Invalid JSON data! Please check your backup.');
        }
    });
}

function closeImportDataModal() {
    const modal = document.getElementById('importDataModal');
    if (modal) modal.remove();
}

function openSiteSettingsModal() {
    const existing = document.getElementById('siteSettingsModal');
    if (existing) existing.remove();
    
    const currentWebhook = localStorage.getItem('ck_discord_webhook') || '';
    const currentTitle = localStorage.getItem('ck_site_title') || 'Clover Kingdom';
    const currentSubtitle = localStorage.getItem('ck_site_subtitle') || 'Where Magic Reigns Supreme';
    
    const overlay = document.createElement('div');
    overlay.id = 'siteSettingsModal';
    overlay.className = 'modal-overlay active';
    
    overlay.innerHTML = '<div class="modal"><h2>⚙️ Site Settings</h2><form id="siteSettingsForm">' +
        '<div class="form-group"><label>Discord Webhook URL (Global)</label><input type="text" id="globalWebhookUrl" value="' + currentWebhook + '" placeholder="https://discord.com/api/webhooks/..." style="font-family:monospace;font-size:0.85rem;"><small style="color:var(--text-dark);display:block;margin-top:0.5rem;">Used for all Discord announcements</small></div>' +
        '<div class="form-group"><label>Site Title</label><input type="text" id="siteTitle" value="' + currentTitle + '" placeholder="Site title"></div>' +
        '<div class="form-group"><label>Site Subtitle</label><input type="text" id="siteSubtitle" value="' + currentSubtitle + '" placeholder="Site subtitle"></div>' +
        '<button type="submit" class="btn-submit">Save Settings</button>' +
        '<button type="button" class="btn-submit" style="background:#555;margin-top:0.5rem;" onclick="closeSiteSettingsModal()">Cancel</button>' +
        '</form></div>';
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeSiteSettingsModal();
    });
    
    document.body.appendChild(overlay);
    
    document.getElementById('siteSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const webhook = document.getElementById('globalWebhookUrl').value;
        const title = document.getElementById('siteTitle').value;
        const subtitle = document.getElementById('siteSubtitle').value;
        
        localStorage.setItem('ck_discord_webhook', webhook);
        localStorage.setItem('ck_site_title', title);
        localStorage.setItem('ck_site_subtitle', subtitle);
        
        alert('Settings saved!');
        logActivity('Owner updated site settings');
        closeSiteSettingsModal();
    });
}

function closeSiteSettingsModal() {
    const modal = document.getElementById('siteSettingsModal');
    if (modal) modal.remove();
}

if (document.getElementById('systemActivityLog')) {
    initOwnerPanel();
}

// ============================================
// ANIMATIONS & EFFECTS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(function(el) {
    fadeObserver.observe(el);
});

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(particle);
    }
}

createParticles();

// ============================================
// INIT
// ============================================

updateAuthNav();