import { HomeView, ApplyView, AppealView, AdminView } from './views.js';

const routes = {
  '/': HomeView,
  '/apply': ApplyView,
  '/appeal': AppealView,
  '/admin': AdminView
};

/**
 * Handle SPA Routing and Glass Transition Animations
 */
export class Router {
  constructor() {
    this.appView = document.getElementById('app-view');
    
    // Intercept clicks on links with the 'spa-link' class
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.spa-link');
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
      }
    });

    // Handle back/forward history navigation
    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.pathname, false);
    });
  }

  /**
   * Navigate to a new path
   */
  async navigate(path) {
    this.loadRoute(path, true);
  }

  /**
   * Load and render the view for the specified path
   */
  async loadRoute(path, shouldPushState = true) {
    // Fallback to home if route doesn't exist
    const renderView = routes[path] || HomeView;

    // Apply Glass Transition: Fade out current content
    this.appView.classList.add('exit-fade');

    // Wait for transition duration (matching CSS transition: 0.25s)
    setTimeout(async () => {
      try {
        // Clear old content and render new view
        this.appView.innerHTML = '';
        await renderView(this.appView, this);

        // Update active navigation link in header
        this.updateActiveNav(path);

        // Push new URL state if required
        if (shouldPushState) {
          window.history.pushState({}, '', path);
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Trigger entrance transition
        this.appView.classList.remove('exit-fade');
        this.appView.classList.add('enter-fade');

        // Remove entrance class after animation completes
        setTimeout(() => {
          this.appView.classList.remove('enter-fade');
        }, 300);

      } catch (err) {
        console.error('Error rendering view:', err);
        this.appView.innerHTML = `
          <div class="container" style="padding: var(--spacing-xl) 0; text-align: center;">
            <h2 class="section-title">Ceremony Error</h2>
            <p>The mana currents are unstable. Please reload the page.</p>
            <a href="/" class="btn btn-primary spa-link" style="margin-top: var(--spacing-sm)">Return Home</a>
          </div>
        `;
        this.appView.classList.remove('exit-fade');
      }
    }, 250);
  }

  /**
   * Highlight the active link in the navigation header
   */
  updateActiveNav(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });
  }
}
