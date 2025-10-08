function goHome() {
  window.location.href = "../HTML/Home.html";
}

const STORAGE_KEY = 'studentProfileData';
const initialData = {
  bannerUrl: "https://placehold.co/1200x200/DC2626/FBBF24?text=Student+Banner+Image",
  pfpUrl: "https://placehold.co/128x128/FBBF24/DC2626?text=AD",
  aboutText: "Alex is a highly motivated third-year student with a passion for emerging technologies. In addition to excelling in core coursework, Alex volunteers as a peer tutor in introductory programming and leads the university's Robotics Club. Looking forward to applying theoretical knowledge in a practical internship setting next semester."
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
  document.getElementById('bannerImg').src = data.bannerUrl || initialData.bannerUrl;
  document.getElementById('pfpImg').src = data.pfpUrl || initialData.pfpUrl;
  document.getElementById('aboutText').textContent = data.aboutText;
}

function openModal() {
  const modal = document.getElementById('editModal');
  const data = loadProfileData();
  document.getElementById('bannerUrl').value = data.bannerUrl;
  document.getElementById('pfpUrl').value = data.pfpUrl;
  document.getElementById('aboutTextarea').value = data.aboutText;
  // Clear file inputs to avoid stale selections
  document.getElementById('bannerFile').value = '';
  document.getElementById('pfpFile').value = '';
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
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

async function saveProfile(event) {
  event.preventDefault();

  const bannerFile = document.getElementById('bannerFile').files[0];
  const pfpFile = document.getElementById('pfpFile').files[0];
  const bannerUrl = document.getElementById('bannerUrl').value.trim();
  const pfpUrl = document.getElementById('pfpUrl').value.trim();
  const aboutText = document.getElementById('aboutTextarea').value.trim();

  try {
    // Handle file uploads first, fall back to URL inputs if no file is provided
    const newBannerUrl = bannerFile ? await readFileAsDataURL(bannerFile) : (bannerUrl || initialData.bannerUrl);
    const newPfpUrl = pfpFile ? await readFileAsDataURL(pfpFile) : (pfpUrl || initialData.pfpUrl);
    const newAboutText = aboutText || initialData.aboutText;

    const newData = {
      bannerUrl: newBannerUrl,
      pfpUrl: newPfpUrl,
      aboutText: newAboutText
    };

    renderProfile(newData);
    saveProfileData(newData);
    closeModal();
  } catch (error) {
    console.error("Error saving profile:", error);
    alert(error.message || "An error occurred while saving the profile.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const initialRenderData = loadProfileData();
  renderProfile(initialRenderData);
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
      if (e.touches.length === 1) {
        e.preventDefault();
      }
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