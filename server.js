const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Serve all HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/announcements', (req, res) => {
    res.sendFile(path.join(__dirname, 'announcements.html'));
});

app.get('/applications', (req, res) => {
    res.sendFile(path.join(__dirname, 'applications.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.html'));
});

app.get('/appeals', (req, res) => {
    res.sendFile(path.join(__dirname, 'appeals.html'));
});

app.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, 'staff.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/manage-events', (req, res) => {
    res.sendFile(path.join(__dirname, 'manage-events.html'));
});

app.get('/manage-announcements', (req, res) => {
    res.sendFile(path.join(__dirname, 'manage-announcements.html'));
});

app.get('/review-applications', (req, res) => {
    res.sendFile(path.join(__dirname, 'review-applications.html'));
});

app.get('/review-appeals', (req, res) => {
    res.sendFile(path.join(__dirname, 'review-appeals.html'));
});

app.get('/edit-staff', (req, res) => {
    res.sendFile(path.join(__dirname, 'edit-staff.html'));
});

app.get('/owner-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'owner-panel.html'));
});

app.listen(PORT, () => {
    console.log(`Clover Kingdom server running on port ${PORT}`);
});