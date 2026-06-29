import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch config from server first to initialize app settings
  try {
    window.appConfig = await fetch('/api/config').then(res => res.json());
  } catch (err) {
    console.error('Failed to load portal configuration:', err);
    // Safe fallback config
    window.appConfig = {
      websiteMetadata: { title: "Clover Kingdom", logoSymbol: "🍀", logoText: "CloverKingdom" }
    };
  }

  // 2. Initialize UI components
  initThemeToggle();
  initCursorGlow();
  initCanvasParticles();
  
  // 3. Initialize authentication states and update navigation
  const router = new Router();
  await checkAuthAndSetupNav(router);

  // 4. Activate SPA Router on current URL path
  router.navigate(window.location.pathname);
});

/**
 * Theme Toggle Functionality (Dark / Light Mode)
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('kingdom-theme') || 'theme-dark';
  body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('theme-dark')) {
      body.classList.replace('theme-dark', 'theme-light');
      localStorage.setItem('kingdom-theme', 'theme-light');
    } else {
      body.classList.replace('theme-light', 'theme-dark');
      localStorage.setItem('kingdom-theme', 'theme-dark');
    }
  });
}

/**
 * Premium Interactive Background Glow (Follows cursor)
 */
function initCursorGlow() {
  const glowBg = document.getElementById('glow-bg');
  if (!glowBg) return;

  window.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;

    glowBg.style.background = `
      radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255, 71, 87, 0.12) 0%, transparent 40%),
      radial-gradient(circle at ${100 - xPct}% ${100 - yPct}%, rgba(245, 158, 11, 0.08) 0%, transparent 45%)
    `;
  });
}

/**
 * Canvas Magic Particle System
 */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Particle constructor
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Spread initially
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2 + 1;
      this.speedY = -(Math.random() * 0.7 + 0.3);
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? '#ff4757' : '#f59e0b'; // Crimson or Gold
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Fade out near top
      if (this.y < 100) {
        this.opacity -= 0.005;
      }
      
      if (this.y < 0 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for next draw
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * Check Discord Login Status and Update Header Buttons/Links
 */
async function checkAuthAndSetupNav(router) {
  const loginBtn = document.getElementById('btn-login-status');
  const dashboardLink = document.getElementById('nav-admin');
  if (!loginBtn) return;

  try {
    const auth = await fetch('/auth/user').then(res => res.json());

    if (auth.loggedIn) {
      // User is logged in
      loginBtn.innerHTML = `🏰 ${auth.user.username.split('#')[0]}`;
      loginBtn.title = `Access Staff Dashboard. Roles: ${auth.user.roles.join(', ')}`;
      loginBtn.className = "btn btn-primary btn-sm";
      
      // Make Dashboard link visible in the navigation header
      if (dashboardLink) {
        dashboardLink.style.display = 'block';
      }

      // Wire login button to redirect to admin
      loginBtn.onclick = () => router.navigate('/admin');
    } else {
      // User is guest
      loginBtn.textContent = 'Staff Login';
      loginBtn.className = "btn btn-secondary btn-sm";
      if (dashboardLink) {
        dashboardLink.style.display = 'none';
      }

      loginBtn.onclick = () => {
        window.location.href = '/auth/discord';
      };
    }
  } catch (err) {
    console.error('Error verifying credentials status:', err);
    loginBtn.textContent = 'Staff Login';
    loginBtn.onclick = () => {
      window.location.href = '/auth/discord';
    };
  }
}
