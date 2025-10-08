const calBox = document.querySelector('.calBox');
const monthYear = document.getElementById('monthYear');
const calendarTableBody = document.querySelector('#calendarTable tbody');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(month, year){
    calendarTableBody.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

    let date = 1;
    for (let i = 0; i < 6; i++){
        let row = document.createElement('tr');

        for (let j = 0; j < 7; j++){
            let cell = document.createElement('td');

            if (i === 0 && j < firstDay){
                cell.textContent = '';
            } else if (date > daysInMonth){
                cell.textContent = '';
            } else{
                cell.textContent = date;
                date++;
            }

            row.appendChild(cell);
        }

        calendarTableBody.appendChild(row);
    }
}

prevMonthBtn.addEventListener('click', () =>{
    currentMonth--;
    if (currentMonth < 0){
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () =>{
    currentMonth++;
    if (currentMonth > 11){
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);

