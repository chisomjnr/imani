const calendarContainer = document.querySelector('.days');
const monthYearDisplay = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const pinnedContainer = document.querySelector('.pinned-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let events = JSON.parse(localStorage.getItem('sharedEvents')) || {
    '2024-07-13': 'School Sports Day',
    '2024-07-25': 'Parent-Teacher Meeting'
};
let pinnedEvents = JSON.parse(localStorage.getItem('sharedPinnedEvents')) || {};

function renderCalendar(month, year, searchTerm = '') {
    calendarContainer.innerHTML = '';
    monthYearDisplay.textContent = `${months[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        let event = events[formattedDate] || 'No special events';
        const isPinned = pinnedEvents[formattedDate];

        // Check if event has star icon already
        let hasStar = false;
        if (event.startsWith('<i class="fas fa-star"></i> ')) {
            hasStar = true;
            event = event.substring('<i class="fas fa-star"></i> '.length); // Remove star icon for display
        }

        if (searchTerm && !event.toLowerCase().includes(searchTerm.toLowerCase())) {
            continue; // Skip rendering if event does not match search term
        }

        const dayItem = document.createElement('li');
        dayItem.classList.add('calendar-event'); // Add event class

        if (formattedDate === todayStr) {
            dayItem.classList.add('today');
        }

        const dateElement = document.createElement('h1');
        dateElement.textContent = `${daysOfWeek[date.getDay()]} ${i}th`;

        const eventElement = document.createElement('h3');
        eventElement.innerHTML = `${hasStar ? '<i class="fas fa-star"></i> ' : ''}${event}`;

        const pinButton = document.createElement('button');
        pinButton.textContent = isPinned ? 'Unpin Event' : 'Pin Event';
        pinButton.classList.add('pin-btn');
        pinButton.addEventListener('click', () => {
            if (isPinned) {
                delete pinnedEvents[formattedDate];
            } else {
                pinnedEvents[formattedDate] = event;
            }
            localStorage.setItem('sharedPinnedEvents', JSON.stringify(pinnedEvents));
            renderCalendar(currentMonth, currentYear, searchTerm);
            renderPinnedEvents();
        });

        dayItem.appendChild(dateElement);
        dayItem.appendChild(eventElement);
        dayItem.appendChild(pinButton);

        calendarContainer.appendChild(dayItem);
    }
}

function renderPinnedEvents() {
    pinnedContainer.innerHTML = '';

    for (const [date, event] of Object.entries(pinnedEvents)) {
        const pinnedItem = document.createElement('div');
        pinnedItem.classList.add('pinned-item');

        const dateElement = document.createElement('h4');
        dateElement.textContent = date;

        const eventElement = document.createElement('p');
        eventElement.innerHTML = `<i class="fas fa-star"></i> ${event}`;

        pinnedItem.appendChild(dateElement);
        pinnedItem.appendChild(eventElement);

        pinnedContainer.appendChild(pinnedItem);
    }
}

prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear, searchInput.value);
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear, searchInput.value);
});

searchButton.addEventListener('click', () => {
    renderCalendar(currentMonth, currentYear, searchInput.value);
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        renderCalendar(currentMonth, currentYear, searchInput.value);
    }
});

renderCalendar(currentMonth, currentYear);
renderPinnedEvents();
