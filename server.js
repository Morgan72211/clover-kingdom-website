const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Helper function to serve HTML pages
function servePage(res, pageName) {
    const filePath = path.join(__dirname, pageName + '.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
}

// Root route
app.get('/', (req, res) => {
    servePage(res, 'index');
});

// Public pages
app.get('/announcements', (req, res) => {
    servePage(res, 'announcements');
});

app.get('/applications', (req, res) => {
    servePage(res, 'applications');
});

app.get('/events', (req, res) => {
    servePage(res, 'events');
});

app.get('/appeals', (req, res) => {
    servePage(res, 'appeals');
});

app.get('/staff', (req, res) => {
    servePage(res, 'staff');
});

app.get('/login', (req, res) => {
    servePage(res, 'login');
});

// Dashboard and management pages
app.get('/dashboard', (req, res) => {
    servePage(res, 'dashboard');
});

app.get('/manage-events', (req, res) => {
    servePage(res, 'manage-events');
});

app.get('/manage-announcements', (req, res) => {
    servePage(res, 'manage-announcements');
});

app.get('/review-applications', (req, res) => {
    servePage(res, 'review-applications');
});

app.get('/review-appeals', (req, res) => {
    servePage(res, 'review-appeals');
});

app.get('/edit-staff', (req, res) => {
    servePage(res, 'edit-staff');
});

app.get('/owner-panel', (req, res) => {
    servePage(res, 'owner-panel');
});

// Also handle .html extensions (for backwards compatibility)
app.get('/:page.html', (req, res) => {
    servePage(res, req.params.page);
});

// Catch-all 404
app.get('*', (req, res) => {
    res.status(404).send('Page not found - Clover Kingdom');
});

app.listen(PORT, () => {
    console.log(`Clover Kingdom server running on port ${PORT}`);
});