// Views for Clover Kingdom SPA

/**
 * Fetch helper with error handling
 */
async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * 1. HOME VIEW
 */
export async function HomeView(container, router) {
  // Fetch Announcements and Events in parallel
  const [announcements, events] = await Promise.all([
    apiFetch('/api/announcements').catch(() => []),
    apiFetch('/api/events').catch(() => [])
  ]);

  const squads = window.appConfig?.magicKnightSquads || [];
  const staff = window.appConfig?.staffProfiles || [];

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <!-- Background Watermark Logo -->
          <img class="watermark-logo" src="/assets/images/CloverKingdomLogo.png" alt="Watermark Logo">
          <span class="badge" id="hero-badge">Clover Kingdom Portal</span>
          <h1 class="hero-title" id="main-title">Surpass Your Limits. <br><span class="gradient-text">Right Here, Right Now.</span></h1>
          <p class="hero-description" id="main-description">
            Welcome to the Clover Kingdom, a land where magic is everything. Apply for squads, appeal ban records, review announcements, and attend kingdom events.
          </p>
          <div class="hero-actions">
            <a href="/apply" class="btn btn-primary spa-link" id="cta-find-grimoire">Join the Magic Knights</a>
            <a href="#squads" class="btn btn-secondary" id="btn-explore-squads">Explore Squads</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="magic-circle-container">
            <div class="magic-circle outer"></div>
            <div class="magic-circle inner"></div>
            <div class="magic-grimoire-card" id="magic-grimoire-card">
              <img class="grimoire-logo-img" src="/assets/images/CloverKingdomLogo.png" alt="Grimoire Emblem">
              <span class="grimoire-glow"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements Section -->
    <section class="lore-section" id="announcements-section" style="border-top: 1px solid var(--color-border); padding: var(--spacing-lg) 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Kingdom Announcements</h2>
          <p class="section-subtitle">Official declarations from the Captains, Wizard King, and Sovereigns.</p>
        </div>
        
        <div class="announcements-feed">
          ${announcements.length === 0 ? `
            <div class="no-data-card">
              <p>Peace reigns across the kingdom. No recent declarations have been issued.</p>
            </div>
          ` : announcements.map(ann => `
            <div class="announcement-item">
              <div class="announcement-header">
                <span class="announcement-author">📜 ${ann.author}</span>
                <span class="announcement-date">${new Date(ann.created_at).toLocaleDateString()}</span>
              </div>
              <h3 class="announcement-title">${escapeHtml(ann.title)}</h3>
              <p class="announcement-content">${escapeHtml(ann.content).replace(/\n/g, '<br>')}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section" id="events-section" style="padding: var(--spacing-lg) 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Upcoming Kingdom Events</h2>
          <p class="section-subtitle">Events, exams, and battles you can attend.</p>
        </div>
        
        <div class="events-grid">
          ${events.length === 0 ? `
            <div class="no-data-card" style="grid-column: 1 / -1;">
              <p>No upcoming events scheduled. Stay tuned to the mana currents.</p>
            </div>
          ` : events.map(evt => `
            <div class="event-card">
              <div class="event-date-badge">📅 ${escapeHtml(evt.event_date)}</div>
              <h3 class="event-title">${escapeHtml(evt.title)}</h3>
              <p class="event-description">${escapeHtml(evt.description)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Lore Section -->
    <section class="lore-section" id="lore">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">The Legend of the Kingdom</h2>
          <p class="section-subtitle">A history written in magic, battles, and unbreakable bonds.</p>
        </div>
        <div class="lore-grid">
          <div class="lore-card">
            <div class="card-icon">📖</div>
            <h3>Historical Legacy</h3>
            <p>Protected by the Magic Emperor, the kingdom has thrived for generations, shielding its citizens from external threats and rogue mages.</p>
          </div>
          <div class="lore-card">
            <div class="card-icon">✨</div>
            <h3>Nature of Mana</h3>
            <p>Mana flows through all living things. Mages harness this ambient energy to manifest spells ranging from basic elemental magic to complex spatial attributes.</p>
          </div>
          <div class="lore-card">
            <div class="card-icon">🍀</div>
            <h3>The Clover Symbol</h3>
            <p>Each leaf of the clover represents something: integrity, hope, and love. The rare fourth leaf holds good luck, and the legendary fifth... is home to a demon.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Magic Knight Squads Section -->
    <section class="squads-section" id="squads">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Magic Knight Squads</h2>
          <p class="section-subtitle">Distinct squads of elite mages defending our borders, fully configurable.</p>
        </div>
        <div class="squads-grid">
          ${squads.map(squad => `
            <div class="squad-card" id="squad-${squad.id}">
              <div class="squad-glow" style="--squad-color: ${squad.color};"></div>
              <div class="squad-header">
                <span class="squad-emblem">${squad.emblem}</span>
                <span class="squad-stars">${'★'.repeat(squad.stars)}${'☆'.repeat(5 - squad.stars)}</span>
              </div>
              <h3 class="squad-name" style="color: ${squad.color};">${squad.name}</h3>
              <p class="squad-description">${squad.description}</p>
              <div class="squad-footer">
                <span>Captain: ${squad.captain}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Staff Profiles Section -->
    <section class="staff-section" id="staff-section" style="padding: var(--spacing-lg) 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); background-color: rgba(18, 18, 22, 0.25); transition: background-color var(--transition-medium);">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Magic Parliament & Captains</h2>
          <p class="section-subtitle">The mages shaping the destiny of the Clover Kingdom.</p>
        </div>
        <div class="staff-grid">
          ${staff.map(member => `
            <div class="staff-profile-card-home">
              <div class="staff-info">
                <h3 class="staff-member-name">${escapeHtml(member.name)}</h3>
                <span class="staff-member-role">${escapeHtml(member.role)}</span>
                <span class="staff-member-magic">✨ ${escapeHtml(member.magic)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Grimoire Finder Section -->
    <section class="grimoire-section" id="grimoire">
      <div class="container">
        <div class="grimoire-container-card">
          <div class="grimoire-content">
            <h2 class="section-title text-left">Discover Your Magic Attribute</h2>
            <p class="grimoire-text">
              The Grimoire Tower awaits. Answer the call of the mana, tap into your inner strength, and see what magic attribute resonates with your soul.
            </p>
            <button class="btn btn-primary" id="btn-initiate-exam">Initiate Grimoire Ceremony</button>
          </div>
          <div class="grimoire-display" id="grimoire-display-zone">
            <div class="grimoire-placeholder-art">🔮</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Wire up Grimoire Ceremony
  const btnInitiate = container.querySelector('#btn-initiate-exam');
  const displayZone = container.querySelector('#grimoire-display-zone');
  const MAGIC_ATTRIBUTES = window.appConfig?.magicAttributes || [];

  if (btnInitiate && displayZone) {
    btnInitiate.addEventListener('click', () => {
      displayZone.innerHTML = `
        <div class="exam-loader">
          <div class="exam-spinner"></div>
          <p>Attuning to the Mana currents...</p>
        </div>
      `;
      btnInitiate.disabled = true;
      btnInitiate.textContent = 'Communing...';

      setTimeout(() => {
        const selection = MAGIC_ATTRIBUTES[Math.floor(Math.random() * MAGIC_ATTRIBUTES.length)];
        displayZone.innerHTML = `
          <div class="result-card">
            <div class="card-icon" style="font-size: 4rem; filter: drop-shadow(0 0 15px ${selection.color}88)">${selection.icon}</div>
            <h3 class="result-attribute" style="background: linear-gradient(135deg, ${selection.color} 0%, #fff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${selection.name}
            </h3>
            <p class="result-description">${selection.description}</p>
          </div>
        `;
        btnInitiate.disabled = false;
        btnInitiate.textContent = 'Attune Again';
      }, 2000);
    });
  }

  // Wire up Explore Squads smooth scroll
  const btnExplore = container.querySelector('#btn-explore-squads');
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const squadsSection = container.querySelector('#squads');
      if (squadsSection) {
        squadsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * 2. APPLY VIEW (Magic Knight Application Form)
 */
export async function ApplyView(container, router) {
  const squads = window.appConfig?.magicKnightSquads || [];

  container.innerHTML = `
    <section class="form-section">
      <div class="container container-narrow">
        <div class="section-header">
          <h2 class="section-title">Magic Knight Entrance Application</h2>
          <p class="section-subtitle">Declare your allegiance, manifest your attribute, and step forward into greatness.</p>
        </div>

        <div class="glass-form-card" id="apply-form-container">
          <form id="apply-form">
            <div class="form-group">
              <label for="username">Discord Username</label>
              <input type="text" id="username" name="username" placeholder="e.g., ._ghost2953_." required>
            </div>

            <div class="form-group">
              <label for="squad">Desired Squad</label>
              <select id="squad" name="squad" required>
                <option value="" disabled selected>Select a Squad</option>
                ${squads.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="magicAttribute">Magics</label>
              <input type="text" id="magicAttribute" name="magicAttribute" placeholder="e.g., Anti-Magic, Dark Magic, Time Magic" required>
            </div>

            <div class="form-group">
              <label for="strengths">Strengths</label>
              <textarea id="strengths" name="strengths" rows="3" placeholder="Describe the areas you excel in." required></textarea>
            </div>

            <div class="form-group">
              <label for="whyJoin">Why do you want to join this squad?</label>
              <textarea id="whyJoin" name="whyJoin" rows="4" placeholder="Explain why you want to join." required></textarea>
            </div>

            <div class="form-group">
              <label for="whyAccept">Why should we accept you?</label>
              <textarea id="whyAccept" name="whyAccept" rows="4" placeholder="Explain the reason we should accept you into the magic knights." required></textarea>
            </div>
            
            <div class="form-group">
              <label for="level">What is your level in game?</label>
              <input type="text" id="level" name="level" placeholder="In-game Level" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btn-submit-app">Submit Application</button>
          </form>
        </div>
      </div>
    </section>
  `;

  const form = container.querySelector('#apply-form');
  const formCard = container.querySelector('#apply-form-container');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('#btn-submit-app');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Casting spell...';

      const data = {
        username: form.username.value,
        squad: form.squad.value,
        magicAttribute: form.magicAttribute.value,
        strengths: form.strengths.value,
        whyJoin: form.whyJoin.value,
        whyAccept: form.whyAccept.value,
        level: form.level.value
      };

      try {
        await apiFetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Show Success card
        formCard.innerHTML = `
          <div class="success-card">
            <img class="success-logo-img" src="/assets/images/CloverKingdomLogo.png" alt="Success Logo">
            <h3>Application Received!</h3>
            <p>Your application has been submitted. Your captain has been notified and will review it and contact you soon.</p>
            <a href="/" class="btn btn-primary spa-link" style="margin-top: var(--spacing-md);">Return to Capital</a>
          </div>
        `;
      } catch (err) {
        alert(`Application submission failed: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    });
  }
}

/**
 * 3. APPEAL VIEW (Ban Appeal Form)
 */
export async function AppealView(container, router) {
  container.innerHTML = `
    <section class="form-section">
      <div class="container container-narrow">
        <div class="section-header">
          <h2 class="section-title">Magical Ban Appeal</h2>
          <p class="section-subtitle">Request an audience with the Magic Parliament to appeal a server decree.</p>
        </div>

        <div class="glass-form-card" id="appeal-form-container">
          <form id="appeal-form">
            <div class="form-group">
              <label for="username">Discord Username</label>
              <input type="text" id="username" name="username" placeholder="e.g., ._ghost2953_." required>
            </div>

            <div class="form-group">
              <label for="banReason">Ban Reason (Given by Mod/Captain)</label>
              <textarea id="banReason" name="banReason" rows="3" placeholder="State the reason provided when your magic was sealed..." required></textarea>
            </div>

            <div class="form-group">
              <label for="whyAppeal">Why should your appeal be accepted?</label>
              <textarea id="whyAppeal" name="whyAppeal" rows="5" placeholder="Explain what happened, state your defense, and clarify why the seals should be lifted..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btn-submit-appeal">Submit Appeal</button>
          </form>
        </div>
      </div>
    </section>
  `;

  const form = container.querySelector('#appeal-form');
  const formCard = container.querySelector('#appeal-form-container');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('#btn-submit-appeal');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Breaking seal...';

      const data = {
        username: form.username.value,
        banReason: form.banReason.value,
        whyAppeal: form.whyAppeal.value
      };

      try {
        await apiFetch('/api/appeals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Show Success card
        formCard.innerHTML = `
          <div class="success-card">
            <div class="success-icon">⚖️</div>
            <h3>Appeal Submitted!</h3>
            <p>Your appeal has been cataloged in the parliament scroll files. Staff will review the circumstances. If approved, your mana seals will be broken.</p>
            <a href="/" class="btn btn-primary spa-link" style="margin-top: var(--spacing-md);">Return to Capital</a>
          </div>
        `;
      } catch (err) {
        alert(`Appeal submission failed: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Appeal';
      }
    });
  }
}

/**
 * 4. ADMIN VIEW (Dashboard)
 */
export async function AdminView(container, router, activeTabId = 'applications') {
  // Check auth state
  let auth = { loggedIn: false };
  try {
    auth = await apiFetch('/auth/user');
  } catch (err) {
    console.error('Auth verification failed', err);
  }

  // Render Access Restricted if not logged in
  if (!auth.loggedIn) {
    container.innerHTML = `
      <section class="form-section">
        <div class="container container-narrow" style="text-align: center;">
          <div class="glass-form-card" style="padding: var(--spacing-xl) var(--spacing-md)">
            <div class="success-icon" style="filter: hue-rotate(140deg);">🔒</div>
            <h2 class="section-title">Parliament Chamber Restricted</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">
              This section is restricted to Magic Knight Squad Captains and Staff members. Please identify yourself.
            </p>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
              <a href="/auth/discord" class="btn btn-primary btn-block">Sign In with Discord</a>
            </div>
          </div>
        </div>
      </section>
    `;
    return;
  }

  // Render Access Denied if logged in but not a staff member
  if (!auth.user.isStaff) {
    container.innerHTML = `
      <section class="form-section">
        <div class="container container-narrow" style="text-align: center;">
          <div class="glass-form-card" style="padding: var(--spacing-xl) var(--spacing-md)">
            <div class="success-icon" style="filter: hue-rotate(340deg); text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);">⚠️</div>
            <h2 class="section-title">Access Denied</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">
              Logged in as: <strong>${escapeHtml(auth.user.username)}</strong><br><br>
              Unfortunately, your Discord account does not possess the required Magic Knight Captain or Staff roles on this server.
            </p>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
              <button class="btn btn-secondary btn-block" id="btn-logout-denied">Sign Out / Change Account</button>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // Wire up Sign Out button
    container.querySelector('#btn-logout-denied').addEventListener('click', async () => {
      await apiFetch('/auth/logout');
      router.navigate('/admin');
    });
    return;
  }

  // If logged in, fetch lists
  const [apps, appeals, announcements, events] = await Promise.all([
    apiFetch('/api/applications').catch(() => []),
    apiFetch('/api/appeals').catch(() => []),
    apiFetch('/api/announcements').catch(() => []),
    apiFetch('/api/events').catch(() => [])
  ]);

  container.innerHTML = `
    <section class="admin-section">
      <div class="container">
        <!-- Dashboard Header -->
        <div class="admin-header">
          <div>
            <h2 class="section-title text-left">Magic Staff Dashboard</h2>
            <p class="section-subtitle">Logged in as: <strong>${escapeHtml(auth.user.username)}</strong></p>
          </div>
          <div class="staff-profile-card">
            <img class="staff-avatar" src="${auth.user.avatar}" alt="Avatar">
            <button class="btn btn-secondary btn-sm" id="btn-logout">Logout</button>
          </div>
        </div>

        <!-- Tab Controls -->
        <div class="tabs-container">
          <button class="tab-btn ${activeTabId === 'applications' ? 'active' : ''}" data-tab="applications">Squad Applications (${apps.filter(a=>a.status==='pending').length} pending)</button>
          <button class="tab-btn ${activeTabId === 'appeals' ? 'active' : ''}" data-tab="appeals">Ban Appeals (${appeals.filter(a=>a.status==='pending').length} pending)</button>
          <button class="tab-btn ${activeTabId === 'announcements' ? 'active' : ''}" data-tab="announcements">Create Announcement</button>
          <button class="tab-btn ${activeTabId === 'events' ? 'active' : ''}" data-tab="events">Create Event</button>
        </div>

        <!-- Tab: Applications -->
        <div class="tab-content ${activeTabId === 'applications' ? 'active' : ''}" id="tab-applications">
          <div class="dashboard-table-container">
            ${apps.length === 0 ? `<p class="no-data-text">No entrance exam applications recorded.</p>` : `
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Squad</th>
                    <th>Magic</th>
                    <th>Motive</th>
                    <th>Status</th>
                    <th>Action / Reviewer</th>
                  </tr>
                </thead>
                <tbody>
                  ${apps.map(app => `
                    <tr>
                      <td><strong>${escapeHtml(app.username)}</strong></td>
                      <td><span class="squad-badge" style="background: rgba(255,255,255,0.05); color: #fff">${escapeHtml(app.squad)}</span></td>
                      <td><code>${escapeHtml(app.magic_attribute)}</code></td>
                      <td class="cell-expandable" title="Level: ${escapeHtml(app.level)}&#10;Strengths: ${escapeHtml(app.strengths)}&#10;Motive: ${escapeHtml(app.why_join)}&#10;Why Accept: ${escapeHtml(app.why_accept)}">
                        <small><strong>Level:</strong> ${escapeHtml(app.level)}</small><br>
                        <small><strong>Strengths:</strong> ${escapeHtml(app.strengths.substring(0, 45))}...</small><br>
                        <small><strong>Why Join:</strong> ${escapeHtml(app.why_join.substring(0, 45))}...</small><br>
                        <small><strong>Why Accept:</strong> ${escapeHtml(app.why_accept.substring(0, 45))}...</small>
                      </td>
                      <td><span class="status-tag status-${app.status}">${app.status.toUpperCase()}</span></td>
                      <td>
                        ${app.status === 'pending' ? `
                          <div class="review-actions">
                            <button class="btn-review btn-review-approve" data-id="${app.id}" data-type="app" data-status="approved">Accept</button>
                            <button class="btn-review btn-review-deny" data-id="${app.id}" data-type="app" data-status="denied">Deny</button>
                          </div>
                        ` : `<small style="color: var(--color-text-secondary)">By: ${escapeHtml(app.reviewer || 'unknown')}</small>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <!-- Tab: Appeals -->
        <div class="tab-content ${activeTabId === 'appeals' ? 'active' : ''}" id="tab-appeals">
          <div class="dashboard-table-container">
            ${appeals.length === 0 ? `<p class="no-data-text">No ban appeals recorded.</p>` : `
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Ban Reason</th>
                    <th>Appeal Defense</th>
                    <th>Status</th>
                    <th>Action / Reviewer</th>
                  </tr>
                </thead>
                <tbody>
                  ${appeals.map(ap => `
                    <tr>
                      <td><strong>${escapeHtml(ap.username)}</strong></td>
                      <td><small>${escapeHtml(ap.ban_reason)}</small></td>
                      <td><small>${escapeHtml(ap.why_appeal)}</small></td>
                      <td><span class="status-tag status-${ap.status}">${ap.status.toUpperCase()}</span></td>
                      <td>
                        ${ap.status === 'pending' ? `
                          <div class="review-actions">
                            <button class="btn-review btn-review-approve" data-id="${ap.id}" data-type="appeal" data-status="approved">Pardon</button>
                            <button class="btn-review btn-review-deny" data-id="${ap.id}" data-type="appeal" data-status="denied">Reject</button>
                          </div>
                        ` : `<small style="color: var(--color-text-secondary)">By: ${escapeHtml(ap.reviewer || 'unknown')}</small>`}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <!-- Tab: Create Announcement -->
        <div class="tab-content ${activeTabId === 'announcements' ? 'active' : ''}" id="tab-announcements">
          <div class="glass-form-card" style="margin-top: 0">
            <form id="announcement-form">
              <div class="form-group">
                <label for="ann-title">Announcement Title</label>
                <input type="text" id="ann-title" name="title" placeholder="e.g., Royal Capital Defense Drills" required>
              </div>
              <div class="form-group">
                <label for="ann-content">Announcement Content</label>
                <textarea id="ann-content" name="content" rows="6" placeholder="Write the decree text here... This will be published to the homepage feed and sent to the Discord Announcements channel." required></textarea>
              </div>
              <div class="form-group">
                <label for="ann-ping">Discord Role/Mention Ping</label>
                <select id="ann-ping" name="ping" style="background: rgba(18, 18, 22, 0.45); color: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--spacing-sm); width: 100%; font-family: inherit;">
                  <option value="none" selected>None (No Ping)</option>
                  <option value="everyone">@everyone</option>
                  <option value="here">@here</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" id="btn-post-ann">Publish Decree</button>
            </form>
          </div>

          <div class="dashboard-table-container" style="margin-top: var(--spacing-lg);">
            <h3 class="section-title text-left" style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">Manage Decrees</h3>
            ${announcements.length === 0 ? `<p class="no-data-text">No announcements published.</p>` : `
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${announcements.map(ann => `
                    <tr>
                      <td><strong>${escapeHtml(ann.title)}</strong></td>
                      <td><small>${escapeHtml(ann.author)}</small></td>
                      <td><small>${new Date(ann.created_at).toLocaleDateString()}</small></td>
                      <td>
                        <button class="btn-review btn-review-deny btn-delete-ann" data-id="${ann.id}">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <!-- Tab: Create Event -->
        <div class="tab-content ${activeTabId === 'events' ? 'active' : ''}" id="tab-events">
          <div class="glass-form-card" style="margin-top: 0">
            <form id="event-form">
              <div class="form-group">
                <label for="evt-title">Event Title</label>
                <input type="text" id="evt-title" name="title" placeholder="e.g., Magic Knight Squad Selection Exam" required>
              </div>
              <div class="form-group">
                <label for="evt-date">Event Date & Time</label>
                <input type="text" id="evt-date" name="eventDate" placeholder="e.g., July 15th, 14:00 EST" required>
              </div>
              <div class="form-group">
                <label for="evt-description">Event Description</label>
                <textarea id="evt-description" name="description" rows="4" placeholder="Detail the event schedule, rules, and entrance prerequisites..." required></textarea>
              </div>
              <div class="form-group">
                <label for="evt-ping">Discord Role/Mention Ping</label>
                <select id="evt-ping" name="ping" style="background: rgba(18, 18, 22, 0.45); color: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--spacing-sm); width: 100%; font-family: inherit;">
                  <option value="none" selected>None (No Ping)</option>
                  <option value="everyone">@everyone</option>
                  <option value="here">@here</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" id="btn-post-evt">Schedule Event</button>
            </form>
          </div>

          <div class="dashboard-table-container" style="margin-top: var(--spacing-lg);">
            <h3 class="section-title text-left" style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">Manage Events</h3>
            ${events.length === 0 ? `<p class="no-data-text">No events scheduled.</p>` : `
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date/Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${events.map(evt => `
                    <tr>
                      <td><strong>${escapeHtml(evt.title)}</strong></td>
                      <td><small>${escapeHtml(evt.event_date)}</small></td>
                      <td>
                        <button class="btn-review btn-review-deny btn-delete-evt" data-id="${evt.id}">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

      </div>
    </section>
  `;

  // Wire up tabs
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      container.querySelector(`#tab-${tabId}`).classList.add('active');
    });
  });

  // Wire up Logout
  container.querySelector('#btn-logout').addEventListener('click', async () => {
    await apiFetch('/auth/logout');
    router.navigate('/admin');
  });

  // Wire up Review buttons (Approve/Deny)
  container.querySelectorAll('.btn-review:not(.btn-delete-ann):not(.btn-delete-evt)').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type'); // 'app' or 'appeal'
      const status = btn.getAttribute('data-status'); // 'approved' or 'denied'

      const confirmMsg = `Are you sure you want to set this ${type === 'app' ? 'application' : 'appeal'} to ${status.toUpperCase()}?`;
      if (!confirm(confirmMsg)) return;

      const endpoint = type === 'app' 
        ? `/api/applications/${id}/review` 
        : `/api/appeals/${id}/review`;

      try {
        await apiFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        const activeTab = container.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'applications';
        await AdminView(container, router, activeTab);
      } catch (err) {
        alert(`Review failed: ${err.message}`);
      }
    });
  });

  // Wire up Announcement submission
  const annForm = container.querySelector('#announcement-form');
  if (annForm) {
    annForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = annForm.querySelector('#btn-post-ann');
      btn.disabled = true;
      btn.textContent = 'Casting decree...';

      try {
        await apiFetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: annForm.title.value,
            content: annForm.content.value,
            ping: annForm.ping.value
          })
        });
        alert('Announcement published successfully to homepage and Discord!');
        annForm.reset();
        const activeTab = container.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'applications';
        await AdminView(container, router, activeTab);
      } catch (err) {
        alert(`Failed to post announcement: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publish Decree';
      }
    });
  }

  // Wire up Event submission
  const evtForm = container.querySelector('#event-form');
  if (evtForm) {
    evtForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = evtForm.querySelector('#btn-post-evt');
      btn.disabled = true;
      btn.textContent = 'Scheduling...';

      try {
        await apiFetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: evtForm.title.value,
            eventDate: evtForm.eventDate.value,
            description: evtForm.description.value,
            ping: evtForm.ping.value
          })
        });
        alert('Event scheduled successfully and posted to Discord!');
        evtForm.reset();
        const activeTab = container.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'applications';
        await AdminView(container, router, activeTab);
      } catch (err) {
        alert(`Failed to schedule event: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Schedule Event';
      }
    });
  }

  // Wire up delete announcement buttons
  container.querySelectorAll('.btn-delete-ann').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Are you sure you want to delete this announcement?')) return;
      try {
        await apiFetch(`/api/announcements/${id}`, { method: 'DELETE' });
        const activeTab = container.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'applications';
        await AdminView(container, router, activeTab);
      } catch (err) {
        alert(`Delete announcement failed: ${err.message}`);
      }
    });
  });

  // Wire up delete event buttons
  container.querySelectorAll('.btn-delete-evt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Are you sure you want to delete this event?')) return;
      try {
        await apiFetch(`/api/events/${id}`, { method: 'DELETE' });
        const activeTab = container.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'applications';
        await AdminView(container, router, activeTab);
      } catch (err) {
        alert(`Delete event failed: ${err.message}`);
      }
    });
  });
}

/**
 * Escapes raw HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
