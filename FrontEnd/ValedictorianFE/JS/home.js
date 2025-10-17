import { apiRequest } from '../JS/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const mainBox = document.querySelector('.mainBox');
  const calBox  = document.querySelector('.calBox');
  const mesBox  = document.querySelector('.mesBox');

  const tabCal  = document.querySelector('.tabCal') || document.querySelector('[data-tab="cal"]');
  const tabHome = document.querySelector('.tabHome') || document.querySelector('[data-tab="home"]');
  const tabMes  = document.querySelector('.tabMes') || document.querySelector('[data-tab="mes"]');
  const navLinks = document.querySelector('.navLinks');

  if (!mainBox || !calBox || !mesBox) {
    console.error('Error: .mainBox, .calBox, or .mesBox not found in the DOM.');
    return;
  }

  // Initial state
  mainBox.style.display = 'grid';
  calBox.style.display  = 'none';
  mesBox.style.display  = 'none';

  function showCalendar() {
    mainBox.style.display = 'none';
    calBox.style.display  = 'grid';
    mesBox.style.display  = 'none';
    setActiveTab('cal');
  }

  function showHome() {
    mainBox.style.display = 'grid';
    calBox.style.display  = 'none';
    mesBox.style.display  = 'none';
    setActiveTab('home');
  }

  function showMessages() {
    mainBox.style.display = 'none';
    calBox.style.display  = 'none';
    mesBox.style.display  = 'grid';
    setActiveTab('mes');
  }

  function goToModules() {
    window.location.href = '../HTML/moduleList.html';
  }

  function setActiveTab(tabName) {
    document.querySelectorAll('.navLinks li').forEach(li => li.classList.remove('active'));
    const activeLi = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLi) activeLi.classList.add('active');
  }

  if (tabCal)  tabCal.addEventListener('click', showCalendar);
  if (tabHome) tabHome.addEventListener('click', showHome);
  if (tabMes)  tabMes.addEventListener('click', showMessages);

  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const tab = li.dataset.tab;

      if (tab === 'cal') showCalendar();
      else if (tab === 'home') showHome();
      else if (tab === 'mes') showMessages();
      else if (tab === 'mod') goToModules();
    });
  }
});

// Parallax logo animation
document.addEventListener("DOMContentLoaded", () => {
  const parallaxLogo = document.querySelector(".parallaxLogo");

  const strength = 30;
  const glowStrength = 40;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    const rect = parallaxLogo.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

    targetX = -deltaX * strength;
    targetY = -deltaY * strength;
    glowX = deltaX * glowStrength;
    glowY = deltaY * glowStrength;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    parallaxLogo.style.setProperty("--moveX", `${currentX}px`);
    parallaxLogo.style.setProperty("--moveY", `${currentY}px`);
    parallaxLogo.style.setProperty("--glowX", `${glowX}px`);
    parallaxLogo.style.setProperty("--glowY", `${glowY}px`);

    requestAnimationFrame(animate);
  }

  animate();
});

// Notification bell
document.addEventListener('DOMContentLoaded', () => {
  const bell = document.getElementById('bell');

  if (bell) {
    bell.addEventListener('click', async () => {
      try {
        const response = await apiRequest('/Notif/NotificationReceived', 'GET');
        alert(response.message);
      } catch (err) {
        console.error('Notification fetch error:', err);
        alert('Failed to retrieve notifications');
      }
    });
  } else {
    console.warn('Notification bell element not found');
  }
});