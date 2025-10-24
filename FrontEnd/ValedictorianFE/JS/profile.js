import { apiRequest } from '../JS/api.js';

function goHome() {
  window.location.href = "../HTML/Home.html";
}

const STORAGE_KEY = 'studentProfileData';
const initialData = {
  bannerUrl: "https://placehold.co/1200x200/DC2626/FBBF24?text=Student+Banner+Image",
  pfpUrl: "https://placehold.co/128x128/FBBF24/DC2626?text=AD",
  aboutText: "Tell us about yourself",
  course: "Which course are you enrolled in?",
  focus: "Whats your focus stream in bc?"
};

function loadProfileData() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : initialData;
  } catch (error) {
    console.error("Error loading profile data:", error);
    return initialData;
  } 
}

function saveProfileData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving profile data:", error);
  }
}

function renderProfile(data) {
  const banner = document.getElementById('bannerImg');
  const pfp = document.getElementById('pfpImg');
  const about = document.getElementById('aboutText');
  const course = document.querySelector('.infoTitle'); // "Computer Science"
  const focus = document.querySelector('.infoSub'); // "Focus on Software Engineering"

  if (banner) banner.src = data.bannerUrl || initialData.bannerUrl;
  if (pfp) pfp.src = data.pfpUrl || initialData.pfpUrl;
  if (about) about.textContent = data.aboutText;
  if (course) course.textContent = data.course || initialData.course;
  if (focus) focus.textContent = data.focus || initialData.focus;
}
function openModal() {
  const modal = document.getElementById('editModal');
  const data = loadProfileData();

  document.getElementById('bannerUrl').value = data.bannerUrl;
  document.getElementById('pfpUrl').value = data.pfpUrl;
  document.getElementById('aboutTextarea').value = data.aboutText;
  document.getElementById('courseInput').value = data.course || '';
  document.getElementById('focusInput').value = data.focus || '';

  document.getElementById('bannerFile').value = '';
  document.getElementById('pfpFile').value = '';
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.style.display = 'none';
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsDataURL(file);
  });
}

async function notifyProfileSaved() {
  try {
    const data = await apiRequest('/Profile/SaveProfileInfo', 'GET');
    if (data && data.message) {
      alert(data.message);
    } else {
      alert("Profile information saved, but no message received from server.");
    }
  } catch (error) {
    console.error("Profile notification fetch error:", error);
    alert("Profile saved locally, but could not confirm server save.");
  }
}

async function saveProfile(event) {
  event.preventDefault();

  const bannerFile = document.getElementById('bannerFile').files[0];
  const pfpFile = document.getElementById('pfpFile').files[0];
  const bannerUrl = document.getElementById('bannerUrl').value.trim();
  const pfpUrl = document.getElementById('pfpUrl').value.trim();
  const aboutText = document.getElementById('aboutTextarea').value.trim();
  const course = document.getElementById('courseInput').value.trim();
  const focus = document.getElementById('focusInput').value.trim();

  try {
    const newBannerUrl = bannerFile ? await readFileAsDataURL(bannerFile) : (bannerUrl || initialData.bannerUrl);
    const newPfpUrl = pfpFile ? await readFileAsDataURL(pfpFile) : (pfpUrl || initialData.pfpUrl);
    const newAboutText = aboutText || initialData.aboutText;

    const newData = {
      bannerUrl: newBannerUrl,
      pfpUrl: newPfpUrl,
      aboutText: newAboutText,
      course: course || initialData.course,
      focus: focus || initialData.focus
    };

    renderProfile(newData);
    saveProfileData(newData);
    closeModal();

    // call backend to notify/save (uses your apiRequest wrapper)
    await notifyProfileSaved();
  } catch (error) {
    console.error("Error saving profile:", error);
    alert(error.message || "An error occurred while saving the profile.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // initial render
  const initialRenderData = loadProfileData();
  renderProfile(initialRenderData);

  // wire up buttons/forms
  const homeBtn = document.querySelector('.homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', goHome);

  const editBtn = document.querySelector('.editBtn');
  if (editBtn) editBtn.addEventListener('click', openModal);

  const cancelBtn = document.querySelector('.cancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  const profileForm = document.getElementById('profileEditForm');
  if (profileForm) profileForm.addEventListener('submit', saveProfile);

  // card tilt interactions (unchanged)
  const card = document.getElementById('profileCard');
  if (card) {
    const handleTilt = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -1;
      const rotateY = ((x - centerX) / centerX) * 1;
      card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleReset = () => {
      card.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', handleReset);
    card.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) e.preventDefault();
      card.style.transition = 'transform 0.1s ease-out';
      card.style.transform = 'perspective(2000px) scale(1.005)';
    }, { passive: false });

    card.addEventListener('touchend', () => {
      card.style.transition = 'transform 0.3s ease-out';
      handleReset();
    });

    card.addEventListener('touchcancel', () => {
      card.style.transition = 'transform 0.3s ease-out';
      handleReset();
    });
  }
});

// =======================
// DYNAMIC USER DETAILS (Fixed)
// =======================
document.addEventListener('DOMContentLoaded', () => {
  const fullNameEl = document.getElementById('profileFullName');
  const roleEl = document.getElementById('profileRole');

  const storedName = localStorage.getItem('userName') || '';
  const storedSurname = localStorage.getItem('userSurname') || '';
  const storedRole = localStorage.getItem('userType') || '';

  // Update name (e.g., "Heiner Freitag")
  if (fullNameEl) {
    fullNameEl.innerHTML = `${storedName}<span class="highlight-text"> ${storedSurname}</span>`;
  }

  // Update role (Student / Tutor / Admin)
  if (roleEl) {
    roleEl.textContent = storedRole || 'Unknown Role';
    roleEl.className = 
      storedRole.toLowerCase() === 'admin' ? 'statusYellow' :
      storedRole.toLowerCase() === 'tutor' ? 'statusOrange' :
      'statusRed';
  }
});