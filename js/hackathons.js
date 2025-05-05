// Hackathons functionality

/**
 * Initialize hackathons functionality
 */
export function initHackathons() {
    // Load existing hackathons from localStorage
    loadHackathons();
    
    // Add event listener for the add event button
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) {
      addEventBtn.addEventListener('click', () => {
        const name = document.getElementById('event-name')?.value;
        const organizer = document.getElementById('event-organizer')?.value;
        const startTime = document.getElementById('event-start')?.value;
        const endTime = document.getElementById('event-end')?.value;
        const url = document.getElementById('event-url')?.value;
        const description = document.getElementById('event-description')?.value;
        
        if (!name || !startTime || !endTime) {
          alert('Please fill in all required fields (Name, Start Time, End Time)');
          return;
        }
        
        addHackathon({
          name,
          organizer,
          startTime,
          endTime,
          url,
          description
        });
        
        // Clear form
        if (document.getElementById('event-name')) document.getElementById('event-name').value = '';
        if (document.getElementById('event-organizer')) document.getElementById('event-organizer').value = '';
        if (document.getElementById('event-start')) document.getElementById('event-start').value = '';
        if (document.getElementById('event-end')) document.getElementById('event-end').value = '';
        if (document.getElementById('event-url')) document.getElementById('event-url').value = '';
        if (document.getElementById('event-description')) document.getElementById('event-description').value = '';
      });
    }
  }
  
  /**
   * Add a new hackathon
   * @param {Object} hackathon Hackathon object
   */
  function addHackathon(hackathon) {
    const hackathons = getHackathons();
    hackathons.push({
      ...hackathon,
      id: Date.now().toString()
    });
    
    // Sort hackathons by start time
    hackathons.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    // Save to localStorage
    localStorage.setItem('hackathons', JSON.stringify(hackathons));
    
    // Render hackathons
    renderHackathons();
    updateNextEvent();
  }
  
  /**
   * Get hackathons from localStorage
   * @returns {Array} Array of hackathon objects
   */
  export function getHackathons() {
    const hackathons = localStorage.getItem('hackathons');
    return hackathons ? JSON.parse(hackathons) : [];
  }
  
  /**
   * Load and render hackathons
   */
  function loadHackathons() {
    renderHackathons();
    updateNextEvent();
  }
  
  /**
   * Update the next event display and countdown
   */
  function updateNextEvent() {
    const nextEventEl = document.getElementById('next-event');
    if (!nextEventEl) return;
  
    const hackathons = getHackathons();
    const now = new Date();
    const upcomingEvents = hackathons.filter(h => new Date(h.startTime) > now);
  
    if (upcomingEvents.length === 0) {
      nextEventEl.innerHTML = '<div class="no-contests">No upcoming events</div>';
      return;
    }
  
    const nextEvent = upcomingEvents[0];
    const startTime = new Date(nextEvent.startTime);
  
    nextEventEl.innerHTML = `
      <div class="hackathon-card">
        <h3>${nextEvent.name}</h3>
        ${nextEvent.organizer ? `<div class="hackathon-organizer">Organized by ${nextEvent.organizer}</div>` : ''}
        <div class="hackathon-dates">
          ${formatDateTime(startTime)} - 
          ${formatDateTime(new Date(nextEvent.endTime))}
        </div>
        ${nextEvent.description ? `<div class="hackathon-description">${nextEvent.description}</div>` : ''}
        <div class="countdown" data-start-time="${startTime.getTime()}">
          <div class="countdown-unit">
            <div class="countdown-value" id="countdown-days">--</div>
            <div class="countdown-label">Days</div>
          </div>
          <div class="countdown-unit">
            <div class="countdown-value" id="countdown-hours">--</div>
            <div class="countdown-label">Hours</div>
          </div>
          <div class="countdown-unit">
            <div class="countdown-value" id="countdown-minutes">--</div>
            <div class="countdown-label">Minutes</div>
          </div>
          <div class="countdown-unit">
            <div class="countdown-value" id="countdown-seconds">--</div>
            <div class="countdown-label">Seconds</div>
          </div>
        </div>
        ${nextEvent.url ? `<a href="${nextEvent.url}" target="_blank" class="hackathon-url">Visit Event Page</a>` : ''}
      </div>
    `;
  }
  
  /**
   * Update the countdown timer
   */
  export function updateCountdown() {
    const countdown = document.querySelector('.countdown');
    if (!countdown) return;
  
    const startTime = parseInt(countdown.dataset.startTime, 10);
    const now = Date.now();
    const diff = startTime - now;
  
    if (diff <= 0) {
      updateNextEvent();
      return;
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
  
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  /**
   * Render hackathons in the UI
   */
  function renderHackathons() {
    const hackathonsList = document.getElementById('hackathons-list');
    if (!hackathonsList) return;
    
    const hackathons = getHackathons();
    
    if (hackathons.length === 0) {
      hackathonsList.innerHTML = '<div class="no-contests">No hackathons or events added yet</div>';
      return;
    }
    
    hackathonsList.innerHTML = hackathons
      .map(hackathon => `
        <div class="hackathon-card">
          <h3>${hackathon.name}</h3>
          ${hackathon.organizer ? `<div class="hackathon-organizer">Organized by ${hackathon.organizer}</div>` : ''}
          <div class="hackathon-dates">
            ${formatDateTime(new Date(hackathon.startTime))} - 
            ${formatDateTime(new Date(hackathon.endTime))}
          </div>
          ${hackathon.description ? `<div class="hackathon-description">${hackathon.description}</div>` : ''}
          ${hackathon.url ? `<a href="${hackathon.url}" target="_blank" class="hackathon-url">Visit Event Page</a>` : ''}
        </div>
      `)
      .join('');
  }
  
  /**
   * Format date and time for display
   * @param {Date} date Date to format
   * @returns {string} Formatted date and time
   */
  function formatDateTime(date) {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }