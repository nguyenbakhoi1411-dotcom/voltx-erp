// Utility Functions

// ===== NOTIFICATIONS =====
function showSuccess(message, duration = 3000) {
    showNotification(message, 'success', duration);
}

function showError(message, duration = 5000) {
    showNotification(message, 'error', duration);
}

function showWarning(message, duration = 4000) {
    showNotification(message, 'warning', duration);
}

function showInfo(message, duration = 3000) {
    showNotification(message, 'info', duration);
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">✕</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ===== FORMATTING =====
function formatCurrency(value) {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value, decimals = 0) {
    if (!value) return '0';
    return parseFloat(value).toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function formatDate(date, format = 'DD/MM/YYYY') {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)
        .replace('HH', hours)
        .replace('mm', minutes);
}

function formatDateTime(date) {
    return formatDate(date, 'DD/MM/YYYY HH:mm');
}

function formatPercent(value, decimals = 2) {
    if (!value) return '0%';
    return parseFloat(value).toFixed(decimals) + '%';
}

function formatPhone(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
}

// ===== BADGES & STATUSES =====
function getStatusBadge(status) {
    const statusMap = {
        ACTIVE: '<span class="badge badge-success">Hoạt động</span>',
        INACTIVE: '<span class="badge badge-danger">Ngừng hoạt động</span>',
        PENDING: '<span class="badge badge-warning">Chờ xử lý</span>',
        COMPLETED: '<span class="badge badge-success">Hoàn thành</span>',
        CANCELLED: '<span class="badge badge-danger">Đã huỷ</span>',
        FAILED: '<span class="badge badge-danger">Thất bại</span>',
        SHIPPED: '<span class="badge badge-info">Đã gửi</span>',
        DELIVERED: '<span class="badge badge-success">Đã giao</span>',
        RETURNED: '<span class="badge badge-warning">Hoàn trả</span>',
        VIP: '<span class="badge badge-primary">VIP</span>',
        NEW: '<span class="badge badge-info">Mới</span>',
        POTENTIAL: '<span class="badge badge-warning">Tiềm năng</span>'
    };
    return statusMap[status] || `<span class="badge">${status}</span>`;
}

function getPaymentMethodBadge(method) {
    const methodMap = {
        CASH: '<span class="badge badge-success">Tiền mặt</span>',
        BANK_TRANSFER: '<span class="badge badge-info">Chuyển khoản</span>',
        INSTALLMENT: '<span class="badge badge-warning">Trả góp</span>',
        CARD: '<span class="badge badge-primary">Thẻ</span>',
        MIXED: '<span class="badge badge-secondary">Kết hợp</span>'
    };
    return methodMap[method] || `<span class="badge">${method}</span>`;
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone.replace(/\D/g, ''));
}

function validateRequired(value) {
    return value && value.trim() !== '';
}

function validateMinLength(value, min) {
    return value && value.length >= min;
}

function validateMaxLength(value, max) {
    return value && value.length <= max;
}

function validateNumber(value) {
    return !isNaN(value) && isFinite(value);
}

// ===== TABLE UTILS =====
function createTable(data, columns) {
    if (!data || data.length === 0) {
        return '<tr><td colspan="' + columns.length + '" class="text-center">Không có dữ liệu</td></tr>';
    }

    return data.map(row => {
        return '<tr>' + columns.map(col => {
            const value = col.render ? col.render(row) : row[col.key];
            return '<td>' + (value || '') + '</td>';
        }).join('') + '</tr>';
    }).join('');
}

function getPaginationHTML(currentPage, totalPages, pageSize = 10) {
    let html = '<div class="pagination">';

    if (currentPage > 1) {
        html += `<button onclick="goToPage(1)" class="btn btn-sm">« Đầu</button>`;
        html += `<button onclick="goToPage(${currentPage - 1})" class="btn btn-sm">‹ Trước</button>`;
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        html += `<button onclick="goToPage(${i})" class="btn btn-sm ${i === currentPage ? 'active' : ''}">${i}</button>`;
    }

    if (currentPage < totalPages) {
        html += `<button onclick="goToPage(${currentPage + 1})" class="btn btn-sm">Sau ›</button>`;
        html += `<button onclick="goToPage(${totalPages})" class="btn btn-sm">Cuối »</button>`;
    }

    html += '</div>';
    return html;
}

// ===== SEARCH & FILTER =====
function searchArray(array, keyword, fields) {
    if (!keyword) return array;

    keyword = keyword.toLowerCase();
    return array.filter(item => {
        return fields.some(field => {
            const value = String(item[field] || '').toLowerCase();
            return value.includes(keyword);
        });
    });
}

function filterArray(array, filters) {
    return array.filter(item => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            if (!filterValue) return true;
            return String(item[key]).toLowerCase().includes(String(filterValue).toLowerCase());
        });
    });
}

function sortArray(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (typeof aVal === 'string') {
            return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
}

// ===== FILE UTILS =====
function downloadCSV(data, filename = 'data.csv') {
    if (!data || data.length === 0) {
        showError('Không có dữ liệu để tải');
        return;
    }

    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        csv += headers.map(header => {
            let value = row[header];
            // Escape quotes and wrap in quotes if contains comma or newline
            if (value && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
                value = '"' + String(value).replace(/"/g, '""') + '"';
            }
            return value || '';
        }).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

function downloadPDF(content, filename = 'document.pdf') {
    // In real app, use a library like jsPDF
    showInfo('Tính năng tải PDF sẽ được cập nhật');
}

function openPrint(content) {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
}

// ===== STORAGE =====
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

function clearLocalStorage() {
    localStorage.clear();
}

// ===== MISC =====
function generateID(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
