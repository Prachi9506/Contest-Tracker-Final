import { initCalendar } from './calendar.js';
import { toggleTheme } from './ui.js';
import { initHackathons, getHackathons, updateCountdown } from './hackathons.js';

// Initialize the hackathons page
function initHackathonsPage() {
  // Initialize theme
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }

  // Initialize theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Initialize hackathons
  initHackathons();

  // Initialize calendar with hackathons
  const hackathons = getHackathons();
  initCalendar(hackathons.map(hackathon => ({
    ...hackathon,
    platform: 'hackathon',
    name: hackathon.name,
    startTime: new Date(hackathon.startTime),
    endTime: new Date(hackathon.endTime)
  })));

  // Update countdown every second
  setInterval(updateCountdown, 1000);
}

// Start the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initHackathonsPage);