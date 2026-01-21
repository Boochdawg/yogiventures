const bookingStorageKey = 'yv_bookings';

const bookingPricing = {
    base: {
        'men-fades': 30,
        'youth-fades': 20,
        'women-fades': 25,
        'mens-haircuts': 25,
        'straight-hair-shear': 45
    },
    addons: {
        beard: { label: 'Facial Hair Grooming', price: 5 },
        'precut-wash': { label: 'Precut Wash', price: 10 },
        enhancements: { label: 'Enhancements', price: 10 },
        steam: { label: 'Steam Service', price: 0 },
        'steam-exfoliation': { label: 'Steam + Exfoliation', price: 20 }
    },
    labels: {
        'men-fades': 'Mens Fade',
        'youth-fades': 'Youth Fades',
        'women-fades': 'Womens Fades',
        'mens-haircuts': 'Mens No Fade',
        'straight-hair-shear': 'Straight Hair Shear Cuts'
    }
};

const bookingForm = document.getElementById('bookingForm');
const summaryContainer = document.getElementById('booking-summary');
const statusMessage = document.getElementById('booking-status');
const serviceSelect = document.getElementById('service-select');

function getStoredBookings() {
    try {
        return JSON.parse(localStorage.getItem(bookingStorageKey)) || [];
    } catch (error) {
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
}

function formatCurrency(amount) {
    return `$${amount}`;
}

function buildSummary() {
    if (!summaryContainer || !serviceSelect) return;

    const serviceValue = serviceSelect.value;
    const selectedAddons = Array.from(document.querySelectorAll('input[name="addon"]:checked'))
        .map((input) => input.value);

    if (!serviceValue) {
        summaryContainer.style.display = 'none';
        summaryContainer.innerHTML = '';
        return;
    }

    let total = bookingPricing.base[serviceValue] || 0;
    let itemsHtml = `
        <div class="summary-item">
            <span>${bookingPricing.labels[serviceValue] || serviceValue}</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;

    selectedAddons.forEach((addonKey) => {
        const addon = bookingPricing.addons[addonKey];
        if (!addon) return;
        total += addon.price;
        itemsHtml += `
            <div class="summary-item">
                <span>+ ${addon.label}</span>
                <span>${addon.price > 0 ? formatCurrency(addon.price) : 'Included'}</span>
            </div>
        `;
    });

    itemsHtml += `
        <div class="summary-total">
            <span>Estimated Total</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;

    summaryContainer.innerHTML = itemsHtml;
    summaryContainer.style.display = 'block';
}

function showStatus(message, isError = false) {
    if (!statusMessage) return;
    statusMessage.style.display = 'block';
    statusMessage.className = `form-status ${isError ? 'error' : 'success'}`;
    statusMessage.textContent = message;
}

if (serviceSelect) {
    serviceSelect.addEventListener('change', buildSummary);
}

document.querySelectorAll('input[name="addon"]').forEach((addon) => {
    addon.addEventListener('change', buildSummary);
});

if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(bookingForm);
        const serviceValue = formData.get('service-select');
        if (!serviceValue) {
            showStatus('Please select a service before submitting.', true);
            return;
        }

        const selectedAddons = formData.getAll('addon');
        let total = bookingPricing.base[serviceValue] || 0;

        selectedAddons.forEach((addonKey) => {
            const addon = bookingPricing.addons[addonKey];
            if (addon) total += addon.price;
        });

        const booking = {
            id: `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date().toISOString(),
            status: 'Requested',
            name: formData.get('client-name'),
            email: formData.get('client-email'),
            phone: formData.get('client-phone'),
            service: bookingPricing.labels[serviceValue] || serviceValue,
            serviceKey: serviceValue,
            date: formData.get('booking-date'),
            time: formData.get('booking-time'),
            addons: selectedAddons.map((addonKey) => bookingPricing.addons[addonKey]?.label || addonKey),
            notes: formData.get('booking-notes') || '',
            total
        };

        const bookings = getStoredBookings();
        bookings.unshift(booking);
        saveBookings(bookings);

        bookingForm.reset();
        if (summaryContainer) {
            summaryContainer.style.display = 'none';
            summaryContainer.innerHTML = '';
        }

        showStatus('Booking request submitted! We will contact you within 24 hours to confirm.', false);
    });
}

