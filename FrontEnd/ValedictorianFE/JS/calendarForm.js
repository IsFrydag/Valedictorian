import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const calendarTable = document.getElementById('calendarTable');
    const monthYearSpan = document.getElementById('monthYear');
    let formContainer = null;

    if (!calendarTable) {
        console.error('Error: #calendarTable not found in the DOM');
        return;
    }
    if (!monthYearSpan) {
        console.error('Error: #monthYear not found in the DOM');
        return;
    }

    // Create form HTML structure
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
        console.log('Form created for date:', date);

        // Fetch modules
        fetchModules();
        // Add event listeners
        setupFormListeners(date);
    }

    // Fetch modules from backend
    async function fetchModules() {
        try {
            const response = await apiRequest('/Modules/GetAll', 'GET');
            const moduleSelect = document.getElementById('moduleSelect');
            moduleSelect.innerHTML = '<option value="">Select a module</option>';
            if (response.modules && response.modules.length > 0) {
                response.modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module.id;
                    option.textContent = module.name;
                    moduleSelect.appendChild(option);
                });
            } else {
                moduleSelect.innerHTML = '<option value="">None</option>';
            }
        } catch (err) {
            console.error('Error fetching modules:', err);
            const moduleSelect = document.getElementById('moduleSelect');
            moduleSelect.innerHTML = '<option value="">None</option>';
        }
    }

    // Fetch tutors based on module and session type
    async function fetchTutors(moduleId, sessionType) {
        try {
            const response = await apiRequest('/Tutors/GetByModuleAndType', 'POST', {
                moduleId,
                sessionType
            });
            const tutorSelect = document.getElementById('tutorSelect');
            tutorSelect.innerHTML = '<option value="">Select a tutor</option>';
            tutorSelect.disabled = false;
            if (response.tutors && response.tutors.length > 0) {
                response.tutors.forEach(tutor => {
                    const option = document.createElement('option');
                    option.value = tutor.id;
                    option.textContent = `${tutor.name} ${tutor.surname}`;
                    tutorSelect.appendChild(option);
                });
            } else {
                tutorSelect.innerHTML = '<option value="">No tutors available</option>';
                tutorSelect.disabled = true;
            }
        } catch (err) {
            console.error('Error fetching tutors:', err);
            const tutorSelect = document.getElementById('tutorSelect');
            tutorSelect.innerHTML = '<option value="">No tutors available</option>';
            tutorSelect.disabled = true;
        }
    }

    // Setup form event listeners
    function setupFormListeners(date) {
        const moduleSelect = document.getElementById('moduleSelect');
        const sessionType = document.getElementById('sessionType');
        const tutorSelect = document.getElementById('tutorSelect');
        const form = document.getElementById('sessionForm');
        const cancelButton = document.getElementById('cancelForm');

        moduleSelect.addEventListener('change', () => {
            if (moduleSelect.value && sessionType.value) {
                fetchTutors(moduleSelect.value, sessionType.value);
            } else {
                tutorSelect.innerHTML = '<option value="">Select module and session type first</option>';
                tutorSelect.disabled = true;
            }
        });

        sessionType.addEventListener('change', () => {
            if (moduleSelect.value && sessionType.value) {
                fetchTutors(moduleSelect.value, sessionType.value);
            } else {
                tutorSelect.innerHTML = '<option value="">Select module and session type first</option>';
                tutorSelect.disabled = true;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!moduleSelect.value || !sessionType.value || !tutorSelect.value) {
                alert('Please fill all fields');
                return;
            }

            // Assume StudentId is stored in localStorage after login
            const studentId = localStorage.getItem('studentId'); // Adjust based on your auth setup
            if (!studentId) {
                alert('Error: Student ID not found. Please log in again.');
                return;
            }

            // Convert date to StartTime (e.g., append default time "09:00")
            const startTime = `${date}T09:00:00`; // Adjust time as needed

            try {
                const response = await apiRequest('/TutorSessions/Record', 'POST', {
                    StudentId: parseInt(studentId),
                    TutorId: parseInt(tutorSelect.value),
                    StartTime: startTime
                    // EndTime is optional, omitted here
                });
                alert(response.Message || 'Session booked successfully');
                closeForm();
            } catch (err) {
                alert('Failed to book session: ' + (err.message || 'Unknown error'));
                console.error('Booking error:', err);
            }
        });

        cancelButton.addEventListener('click', closeForm);
    }

    // Close form
    function closeForm() {
        if (formContainer) {
            formContainer.remove();
            formContainer = null;
            console.log('Form closed');
        }
    }

    // Derive date from monthYear and day
    function getDateFromCell(td) {
        const day = td.textContent.trim();
        if (!day || isNaN(parseInt(day))) {
            console.log('Invalid or empty day in td:', td.textContent);
            return null;
        }

        const monthYearText = monthYearSpan.textContent.trim(); // e.g., "October 2025"
        const [monthName, year] = monthYearText.split(' ');
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames.indexOf(monthName) + 1;
        if (month === 0) {
            console.error('Invalid month name:', monthName);
            return null;
        }

        return `${year}-${month.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Add click event to calendar cells with event delegation
    calendarTable.addEventListener('click', (e) => {
        const td = e.target.closest('td');
        if (!td) {
            console.log('Click was not on a td element');
            return;
        }
        if (!td.textContent.trim()) {
            console.log('Clicked td is empty');
            return;
        }

        let date = td.dataset.date;
        if (!date) {
            console.warn('No data-date attribute found on td, attempting to derive date');
            date = getDateFromCell(td);
        }
        if (!date) {
            console.error('Could not determine date for td:', td.textContent);
            return;
        }

        console.log('Calendar cell clicked, date:', date);
        closeForm(); // Close any existing form
        createForm(date);
    });
});