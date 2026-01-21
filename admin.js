const adminStorageKey = 'yv_bookings';
const adminSessionKey = 'yv_admin_authed';
const ACCESS_CODE = 'yv-admin';

const loginSection = document.getElementById('admin-login');
const loginForm = document.getElementById('adminLoginForm');
const loginStatus = document.getElementById('admin-login-status');
const dashboard = document.getElementById('admin-dashboard');
const bookingsTableBody = document.getElementById('admin-bookings');
const emptyState = document.getElementById('admin-empty');
const exportCsvButton = document.getElementById('exportCsv');
const logoutButton = document.getElementById('logoutAdmin');

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(adminStorageKey)) || [];
    } catch (error) {
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem(adminStorageKey, JSON.stringify(bookings));
}

function formatDateTime(date, time) {
    if (!date && !time) return '—';
    return `${date || ''} ${time || ''}`.trim();
}

function setLoginStatus(message, isError = false) {
    if (!loginStatus) return;
    loginStatus.style.display = 'block';
    loginStatus.className = `form-status ${isError ? 'error' : 'success'}`;
    loginStatus.textContent = message;
}

function renderBookings() {
    if (!bookingsTableBody || !emptyState) return;

    const bookings = getBookings();
    bookingsTableBody.innerHTML = '';

    if (bookings.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    bookings.forEach((booking) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td>${booking.name || '—'}</td>
            <td>${booking.service || '—'}</td>
            <td>${formatDateTime(booking.date, booking.time)}</td>
            <td>${booking.addons && booking.addons.length ? booking.addons.join(', ') : 'None'}</td>
            <td>$${booking.total || 0}</td>
            <td>
                <div>${booking.phone || ''}</div>
                <div>${booking.email || ''}</div>
            </td>
            <td>${booking.notes || '—'}</td>
            <td class="admin-actions-col">
                <button class="admin-action" data-action="confirm" data-id="${booking.id}">Confirm</button>
                <button class="admin-action" data-action="complete" data-id="${booking.id}">Complete</button>
                <button class="admin-action" data-action="cancel" data-id="${booking.id}">Cancel</button>
                <button class="admin-action danger" data-action="delete" data-id="${booking.id}">Delete</button>
            </td>
        `;
        bookingsTableBody.appendChild(row);
    });
}

function setStatus(bookingId, newStatus) {
    const bookings = getBookings();
    const updated = bookings.map((booking) => {
        if (booking.id !== bookingId) return booking;
        return { ...booking, status: newStatus };
    });
    saveBookings(updated);
    renderBookings();
}

function deleteBooking(bookingId) {
    const bookings = getBookings().filter((booking) => booking.id !== bookingId);
    saveBookings(bookings);
    renderBookings();
}

function exportCsv() {
    const bookings = getBookings();
    if (!bookings.length) return;

    const headers = [
        'Status',
        'Name',
        'Service',
        'Date',
        'Time',
        'Add-ons',
        'Total',
        'Phone',
        'Email',
        'Notes',
        'Created At'
    ];

    const rows = bookings.map((booking) => [
        booking.status,
        booking.name,
        booking.service,
        booking.date,
        booking.time,
        (booking.addons || []).join('; '),
        booking.total,
        booking.phone,
        booking.email,
        booking.notes,
        booking.createdAt
    ]);

    const csvContent = [headers, ...rows]
        .map((row) => row.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'yv_bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    sessionStorage.setItem(adminSessionKey, 'true');
    renderBookings();
}

function logout() {
    sessionStorage.removeItem(adminSessionKey);
    if (dashboard) dashboard.style.display = 'none';
    if (loginSection) loginSection.style.display = 'block';
}

if (sessionStorage.getItem(adminSessionKey) === 'true') {
    showDashboard();
}

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const codeInput = document.getElementById('admin-code');
        const code = codeInput ? codeInput.value.trim() : '';

        if (code === ACCESS_CODE) {
            setLoginStatus('Access granted. Loading dashboard...', false);
            showDashboard();
        } else {
            setLoginStatus('Incorrect access code. Please try again.', true);
        }
    });
}

if (bookingsTableBody) {
    bookingsTableBody.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.getAttribute('data-action');
        const bookingId = target.getAttribute('data-id');
        if (!action || !bookingId) return;

        if (action === 'confirm') setStatus(bookingId, 'Confirmed');
        if (action === 'complete') setStatus(bookingId, 'Completed');
        if (action === 'cancel') setStatus(bookingId, 'Canceled');
        if (action === 'delete') deleteBooking(bookingId);
    });
}

if (exportCsvButton) {
    exportCsvButton.addEventListener('click', exportCsv);
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

