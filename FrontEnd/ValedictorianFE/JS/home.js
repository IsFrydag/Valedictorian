document.addEventListener('DOMContentLoaded', () => {
  const mainBox = document.querySelector('.mainBox');
  const calBox  = document.querySelector('.calBox');

  // support both old class-based selectors and your current data-tab attributes
  const tabCal  = document.querySelector('.tabCal') || document.querySelector('[data-tab="cal"]');
  const tabHome = document.querySelector('.tabHome') || document.querySelector('[data-tab="home"]');

  const navLinks = document.querySelector('.navLinks');

  if (!mainBox || !calBox) {
    console.error('Error: .mainBox or .calBox not found in the DOM.');
    return;
  }

  // initial state: show main, hide calendar
  mainBox.style.display = 'grid';
  calBox.style.display  = 'none';

  function showCalendar() {
    mainBox.style.display = 'none';
    calBox.style.display  = 'grid';
    // update active class visually (works for data-tab li or class selectors)
    document.querySelectorAll('.navLinks li').forEach(li => li.classList.remove('active'));
    const calLi = document.querySelector('[data-tab="cal"]');
    if (calLi) calLi.classList.add('active');
  }

  function showHome() {
    mainBox.style.display = 'grid';
    calBox.style.display  = 'none';
    document.querySelectorAll('.navLinks li').forEach(li => li.classList.remove('active'));
    const homeLi = document.querySelector('[data-tab="home"]');
    if (homeLi) homeLi.classList.add('active');
  }

  if (tabCal)  tabCal.addEventListener('click', showCalendar);
  if (tabHome) tabHome.addEventListener('click', showHome);

  // extra: event-delegation fallback in case clicks land on inner text nodes
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const tab = li.dataset.tab;
      if (tab === 'cal') showCalendar();
      if (tab === 'home') showHome();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const parallaxLogo = document.querySelector(".parallaxLogo");

  const strength = 30; // parallax motion strength (px)
  const glowStrength = 40; // how far glow shifts (px)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener("mousemove", (e) => {
    const rect = parallaxLogo.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

    // Opposite parallax movement
    targetX = -deltaX * strength;
    targetY = -deltaY * strength;

    // Glow follows cursor (same direction as mouse)
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