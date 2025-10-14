import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const calendarTable = document.getElementById('calendarTable');
    const monthYearSpan = document.getElementById('monthYear');
    let formContainer = null;

    if (!calendarTable || !monthYearSpan) {
        console.error('Calendar elements not found in DOM');
        return;
    }

    // ------------------ CREATE FORM ------------------
    function createForm(date) {
        formContainer = document.createElement('div');
        formContainer.className = 'formPopup';
        formContainer.innerHTML = `
            <div class="formContent">
                <h3>Book Session for ${date}</h3>
                <form id="sessionForm">
                    <label for="moduleSelect">Module:</label>
                    <select id="moduleSelect" name="module">
                        <option value="">Loading modules...</option>
                    </select>

                    <label for="sessionType">Session Type:</label>
                    <select id="sessionType" name="sessionType">
                        <option value="">Select session type</option>
                        <option value="Online">Online</option>
                        <option value="Face to Face">Face to Face</option>
                    </select>

                    <label for="tutorSelect">Tutor:</label>
                    <select id="tutorSelect" name="tutor" disabled>
                        <option value="">Select module and session type first</option>
                    </select>

                    <div class="formButtons">
                        <button type="submit">Submit</button>
                        <button type="button" id="cancelForm">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(formContainer);

        fetchModules();
        setupFormListeners(date);
    }

    // ------------------ FETCH MODULES ------------------
    async function fetchModules() {
        const moduleSelect = document.getElementById('moduleSelect');
        try {
            const response = await apiRequest('/Modules/GetAll', 'GET');
            moduleSelect.innerHTML = '<option value="">Select a module</option>';
            if (response.modules?.length) {
                response.modules.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = m.name;
                    moduleSelect.appendChild(opt);
                });
            } else {
                moduleSelect.innerHTML = '<option value="">None</option>';
            }
        } catch (err) {
            console.error('Error fetching modules:', err);
            moduleSelect.innerHTML = '<option value="">None</option>';
        }
    }

    // ------------------ FETCH TUTORS ------------------
    async function fetchTutors(moduleId, sessionType) {
        const tutorSelect = document.getElementById('tutorSelect');
        try {
            const response = await apiRequest('Tutors/GetByModuleAndType', 'GET', {
                moduleId,
                sessionType
            });
            tutorSelect.innerHTML = '<option value="">Select a tutor</option>';
            tutorSelect.disabled = false;

            if (response.tutors?.length) {
                response.tutors.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = `${t.name} ${t.surname}`;
                    tutorSelect.appendChild(opt);
                });
            } else {
                tutorSelect.innerHTML = '<option value="">No tutors available</option>';
                tutorSelect.disabled = true;
            }
        } catch (err) {
            console.error('Error fetching tutors:', err);
            tutorSelect.innerHTML = '<option value="">No tutors available</option>';
            tutorSelect.disabled = true;
        }
    }

    // ------------------ FORM LISTENERS ------------------
    function setupFormListeners(date) {
        const moduleSelect = document.getElementById('moduleSelect');
        const sessionType = document.getElementById('sessionType');
        const tutorSelect = document.getElementById('tutorSelect');
        const form = document.getElementById('sessionForm');
        const cancelButton = document.getElementById('cancelForm');

        moduleSelect.addEventListener('change', () => {
            if (moduleSelect.value && sessionType.value) {
                fetchTutors(moduleSelect.value, sessionType.value);
            }
        });

        sessionType.addEventListener('change', () => {
            if (moduleSelect.value && sessionType.value) {
                fetchTutors(moduleSelect.value, sessionType.value);
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!moduleSelect.value || !sessionType.value || !tutorSelect.value) {
                alert('Please fill all fields');
                return;
            }

            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                alert('Student ID not found. Please log in again.');
                return;
            }

            const startTime = `${date}T09:00:00`;

            try {
                const response = await apiRequest('TutorSessions/Record', 'POST', {
                    StudentId: parseInt(studentId),
                    TutorId: parseInt(tutorSelect.value),
                    StartTime: startTime
                });

                alert(response.Message || 'Session booked successfully!');
                closeForm();
            } catch (err) {
                alert('Failed to book session: ' + (err.message || 'Unknown error'));
                console.error('Booking error:', err);
            }
        });

        cancelButton.addEventListener('click', closeForm);
    }

    // ------------------ CLOSE FORM ------------------
    function closeForm() {
        if (formContainer) {
            formContainer.remove();
            formContainer = null;
        }
    }

    // ------------------ DATE HELPERS ------------------
    function getDateFromCell(td) {
        const day = td.textContent.trim();
        const [monthName, year] = monthYearSpan.textContent.trim().split(' ');
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = months.indexOf(monthName) + 1;
        if (!month) return null;
        return `${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // ------------------ CALENDAR CLICK ------------------
    calendarTable.addEventListener('click', (e) => {
        const td = e.target.closest('td');
        if (!td || !td.textContent.trim()) return;

        let date = td.dataset.date || getDateFromCell(td);
        if (!date) return;

        closeForm();
        createForm(date);
    });
});