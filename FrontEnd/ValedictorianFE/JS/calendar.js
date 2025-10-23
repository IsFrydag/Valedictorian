import { apiRequest } from "./api.js";

let currentDate = new Date();
let selectedDate = null;
let currentStep = 1;
let bookingData = {};
let bookedMeetings = [];

// ----------------- INIT -----------------
document.addEventListener("DOMContentLoaded", () => {
  initCalendar();
  initParticles();
  loadModules();
  loadSessions();
});

// ----------------- CALENDAR -----------------
function initCalendar() {
  generateCalendar();
  renderMeetings();

  document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
  });
  document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
  });

  // module selection
  document.getElementById("module-select").addEventListener("change", function () {
    const val = this.value;
    const nextBtn = document.getElementById("next-1");
    if (val) {
      bookingData.moduleId = parseInt(val, 10);
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  });
  
  function ymdLocal(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}


  // meeting type
  document.querySelectorAll(".meeting-type-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".meeting-type-option").forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      bookingData.tutorType = this.dataset.type;
      document.getElementById("next-2").disabled = false;
    });
  });

  // issue description
  document.getElementById("issue-description").addEventListener("input", function () {
    const bookBtn = document.getElementById("book-btn");
    if (this.value.trim().length > 10) {
      bookBtn.disabled = false;
      bookingData.description = this.value.trim();
    } else {
      bookBtn.disabled = true;
    }
  });
}

function generateCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthYear = document.getElementById("current-month");
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  grid.innerHTML = "";
  const headers = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  headers.forEach((d) => {
    const h = document.createElement("div");
    h.className = "calendar-day-header";
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isToday = date.toDateString() === new Date().toDateString();
    const dateKey = date.toISOString().split("T")[0];
    const hasMeeting = bookedMeetings.some((m) => m.requestedDate?.startsWith(dateKey));

    const day = document.createElement("div");
    day.className = "calendar-day";
    if (!isCurrentMonth) day.classList.add("other-month");
    else day.classList.add("available");
    if (hasMeeting) day.classList.add("has-meeting");
    if (isToday) day.style.border = "2px solid var(--gold)";
    day.innerHTML = `<div class="day-number">${date.getDate()}</div>${hasMeeting ? "<div class='day-meetings'>• Meeting</div>" : ""}`;
    if (isCurrentMonth && date >= new Date()) day.addEventListener("click", () => selectDate(date));
    grid.appendChild(day);
  }
}

function selectDate(date) {
  selectedDate = date;
  document.getElementById("empty-state").style.display = "none";
  document.getElementById("booking-form").classList.add("active");
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.getElementById("selected-date-text").textContent = `Booking for ${date.toLocaleDateString("en-US", opts)}`;
  bookingData.date = date.toISOString().split("T")[0];
  resetBookingForm();
}

function resetBookingForm() {
  currentStep = 1;
  bookingData = { date: bookingData.date };
  document.querySelectorAll(".form-step").forEach((s) => s.classList.remove("active"));
  document.getElementById("step-1").classList.add("active");
  document.getElementById("module-select").value = "";
  document.getElementById("issue-description").value = "";
  document.querySelectorAll(".meeting-type-option, .tutor-option").forEach((el) => el.classList.remove("selected"));
  document.getElementById("next-1").disabled = true;
  document.getElementById("next-2").disabled = true;
  document.getElementById("next-3").disabled = true;
  document.getElementById("book-btn").disabled = true;
}

function nextStep(step) {
  if (step === 3) populateTutors();
  document.querySelectorAll(".form-step").forEach((s) => s.classList.remove("active"));
  document.getElementById(`step-${step}`).classList.add("active");
  currentStep = step;
}

function prevStep(step) {
  document.querySelectorAll(".form-step").forEach((s) => s.classList.remove("active"));
  document.getElementById(`step-${step}`).classList.add("active");
  currentStep = step;
}

// ----------------- API CALLS -----------------
async function loadModules() {
  const select = document.getElementById("module-select");
  select.innerHTML = "<option value=''>Loading modules...</option>";

  try {
    const modules = await apiRequest("/Modules/GetModules", "GET");
    select.innerHTML = "<option value=''>Choose a module...</option>";
    modules.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.moduleID;
      opt.textContent = m.moduleName;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load modules:", err.message);
    select.innerHTML = "<option value=''>Failed to load modules</option>";
  }
}

async function populateTutors() {
  const tutorGrid = document.getElementById("tutor-grid");
  tutorGrid.innerHTML = "<p>Loading tutors...</p>";

  try {
    const tutors = await apiRequest("/Tutors/All", "GET");
    tutorGrid.innerHTML = "";
    tutors.forEach((tutor) => {
      const div = document.createElement("div");
      div.className = "tutor-option";
      div.innerHTML = `
        <div class="tutor-avatar">${tutor.fullName[0]}</div>
        <div class="tutor-info">
          <div class="tutor-name">${tutor.fullName}</div>
          <div class="tutor-specialty">${tutor.userEmail}</div>
        </div>`;
      div.addEventListener("click", () => {
        document.querySelectorAll(".tutor-option").forEach((o) => o.classList.remove("selected"));
        div.classList.add("selected");
        bookingData.tutorId = tutor.userID;
        document.getElementById("next-3").disabled = false;
      });
      tutorGrid.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to fetch tutors:", err.message);
    tutorGrid.innerHTML = "<p style='color:red;'>Failed to load tutors</p>";
  }
}

async function loadSessions() {
  try {
    const sessions = await apiRequest("/TutorSessions/All", "GET");

    bookedMeetings = sessions.map(s => ({
      id: s.sessionID || s.SessionID,
      date: s.requestedDate || s.RequestedDate?.split("T")[0],
      moduleID: s.moduleID || s.ModuleID,
      tutorID: s.tutorID || s.TutorID,
      tutorType: s.tutorType || s.TutorType,
      status: s.status || s.Status || "Pending",
      description: s.description || s.Description || ""
    }));

    console.log("Loaded sessions:", bookedMeetings);

    renderMeetings();
    generateCalendar();
  } catch (e) {
    console.warn("Could not load sessions:", e.message);
    renderMeetings();
  }
}


async function bookSession() {
  if (!bookingData.date || !bookingData.moduleId || !bookingData.tutorId || !bookingData.tutorType) {
    alert("Please complete all steps.");
    return;
  }

  const payload = {
    studentID: 1,
    tutorID: bookingData.tutorId,
    moduleID: bookingData.moduleId,
    tutorType: bookingData.tutorType,
    requestedDate: `${bookingData.date}T09:00:00`,
    status: "pending",
  };

  try {
    await apiRequest("/TutorSessions/Create", "POST", payload);
    alert("Session booked successfully.");
    bookedMeetings.push(payload);
    document.getElementById("booking-form").classList.remove("active");
    document.getElementById("empty-state").style.display = "block";
    generateCalendar();
    renderMeetings();
  } catch (e) {
    console.error("Booking error:", e.message);
    alert("Failed to book session. Ensure backend is running.");
  }
}

// ----------------- RENDER -----------------
function renderMeetings() {
  const container = document.getElementById("meetings-container");
  const now = new Date();

  const upcoming = bookedMeetings
    .filter((m) => {
      if (!m.requestedDate) return false;
      const sessionDate = new Date(m.requestedDate);
      // Compare only by date (ignore time)
      return (
        sessionDate.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0)
      );
    })
    .sort((a, b) => new Date(a.requestedDate) - new Date(b.requestedDate))
    .slice(0, 5);

  if (upcoming.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:rgba(255,255,255,0.7);'>No upcoming sessions</p>";
    return;
  }

  container.innerHTML = upcoming
    .map((m) => {
      const d = new Date(m.requestedDate);
      const dateStr = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return `
      <div class="meeting-item">
        <div class="meeting-header">
          <div class="meeting-title">Module #${m.moduleID}</div>
          <div class="meeting-status status-${m.status.toLowerCase()}">${m.status}</div>
        </div>
        <div class="meeting-details">
          <strong>${dateStr}</strong> • Tutor #${m.tutorID}<br>
          ${m.tutorType === "face-to-face" ? "🏫 Face to Face" : "💻 Online"}<br>
          <em>${m.description}</em>
        </div>
      </div>`;
    })
    .join("");
}


// ----------------- PARTICLES -----------------
function initParticles() {
  if (typeof p5 !== "undefined") {
    new p5((p) => {
      let particles = [];
      p.setup = () => {
        const container = document.getElementById("particle-bg");
        if (container) {
          const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
          canvas.parent(container);
        }
        for (let i = 0; i < 80; i++) particles.push(new Particle());
      };
      p.draw = () => {
        p.clear();
        particles.forEach((particle) => {
          particle.move();
          particle.display();
        });
      };
      p.windowResized = () => {
        const container = document.getElementById("particle-bg");
        if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      };
      class Particle {
        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(2, 4);
          this.speedX = p.random(-1, 1);
          this.speedY = p.random(-1, 1);
        }
        move() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < 0 || this.x > p.width) this.speedX *= -1;
          if (this.y < 0 || this.y > p.height) this.speedY *= -1;
        }
        display() {
          p.noStroke();
          p.fill(255, 215, 0, 180);
          p.circle(this.x, this.y, this.size);
        }
      }
    });
  }
}
window.nextStep = nextStep;
window.prevStep = prevStep;
window.bookSession = bookSession;
