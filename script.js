const PRICE = 40;
const STORAGE_KEY = 'foodExpenseData';

let currentDate = new Date();
let selectedDate = null;
let data = {};

// Load data from localStorage
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    data = saved ? JSON.parse(saved) : {};
  } catch {
    data = {};
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplayDate(key) {
  const [y, m, d] = key.split('-');
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthYear = document.getElementById('month-year');
  monthYear.textContent = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'day empty';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'day';
    const key = formatKey(year, month, day);
    const value = data[key];

    if (value === 40) cell.classList.add('lunch');
    else if (value === 0) cell.classList.add('skip');

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add('today');
    }

    const num = document.createElement('span');
    num.className = 'day-num';
    num.textContent = day;
    cell.appendChild(num);

    if (value !== undefined) {
      const status = document.createElement('span');
      status.className = 'day-status';
      status.textContent = value === 40 ? '₹40' : '₹0';
      cell.appendChild(status);
    }

    cell.addEventListener('click', () => openModal(key, day));
    grid.appendChild(cell);
  }

  updateStats();
}

function updateStats() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;

  let monthTotal = 0;
  let lunchDays = 0;
  let skipDays = 0;
  let daysLogged = 0;
  let allTime = 0;

  const recent = [];

  Object.entries(data).forEach(([key, value]) => {
    allTime += value;
    if (key.startsWith(prefix)) {
      monthTotal += value;
      daysLogged++;
      if (value === 40) lunchDays++;
      else skipDays++;
    }
    recent.push({ key, value });
  });

  // Sort recent by date desc
  recent.sort((a, b) => b.key.localeCompare(a.key));
  const recentSlice = recent.slice(0, 6);

  document.getElementById('month-total').textContent = `₹${monthTotal}`;
  document.getElementById('days-logged').textContent = daysLogged;
  document.getElementById('lunch-days').textContent = lunchDays;
  document.getElementById('skip-days').textContent = skipDays;
  document.getElementById('all-time-total').textContent = `₹${allTime}`;

  const list = document.getElementById('recent-entries');
  list.innerHTML = '';
  if (recentSlice.length === 0) {
    list.innerHTML = '<li style="color:var(--text-muted);font-size:13px;">No entries yet</li>';
  } else {
    recentSlice.forEach(({ key, value }) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${formatDisplayDate(key)}</span>
        <span class="amount">${value === 40 ? '₹40' : '₹0'}</span>
      `;
      list.appendChild(li);
    });
  }
}

function openModal(key, day) {
  selectedDate = key;
  const modal = document.getElementById('modal');
  document.getElementById('modal-date').textContent = formatDisplayDate(key);
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  selectedDate = null;
}

function setValue(value) {
  if (!selectedDate) return;
  if (value === null) {
    delete data[selectedDate];
  } else {
    data[selectedDate] = value;
  }
  saveData();
  renderCalendar();
  closeModal();
}

// Event listeners
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById('btn-lunch').addEventListener('click', () => setValue(40));
document.getElementById('btn-skip').addEventListener('click', () => setValue(0));
document.getElementById('btn-clear-day').addEventListener('click', () => setValue(null));
document.getElementById('modal-close').addEventListener('click', closeModal);

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  if (current === 'light') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }
});

document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `food-expense-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('clear-btn').addEventListener('click', () => {
  if (confirm('Clear all expense data? This cannot be undone.')) {
    data = {};
    saveData();
    renderCalendar();
  }
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Init
loadData();
renderCalendar();
