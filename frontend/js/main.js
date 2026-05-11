// Main Application Logic

// ===== PAGE NAVIGATION =====
const menuItems = document.querySelectorAll('.menu-item');
const pageContents = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');

// Page title mapping
const pageTitleMap = {
    dashboard: 'Dashboard',
    branches: 'Quản lý Chi nhánh',
    products: 'Quản lý Sản phẩm',
    inventory: 'Quản lý Kho hàng',
    sales: 'Quản lý Bán hàng',
    customers: 'Quản lý Khách hàng',
    warranty: 'Quản lý Bảo hành',
    employees: 'Quản lý Nhân viên',
    reports: 'Báo cáo & Thống kê',
    suppliers: 'Quản lý Nhà cung cấp',
    settings: 'Cài đặt Hệ thống'
};

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active from all menu items
        menuItems.forEach(m => m.classList.remove('active'));
        this.classList.add('active');

        // Hide all page contents
        pageContents.forEach(p => p.classList.remove('active'));

        // Show selected page
        const pageName = this.dataset.page;
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            pageTitle.textContent = pageTitleMap[pageName] || 'Page';
        }

        // Close sidebar on mobile
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    });
});

// ===== SIDEBAR TOGGLE =====
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// ===== MODAL MANAGEMENT =====
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

function openModal(title, content, confirmText = 'Xác nhận', onConfirm = null) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    if (confirmText) modalConfirm.textContent = confirmText;
    modal.style.display = 'flex';

    if (onConfirm) {
        modalConfirm.onclick = () => {
            onConfirm();
            closeModal();
        };
    }
}

function closeModal() {
    modal.style.display = 'none';
}

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
        AuthManager.logout();
    }
});

// ===== LOAD USER INFO =====
function loadUserInfo() {
    const userInfo = AuthManager.getUserInfo();
    if (userInfo) {
        document.getElementById('userName').textContent = userInfo.fullName || userInfo.username;
    }
}

// ===== API TEST =====
async function testAPI() {
    try {
        const response = await api.health();
        console.log('API Status:', response);
        showSuccess('API hoạt động bình thường!');
    } catch (error) {
        console.error('API Error:', error);
        showError('Lỗi kết nối API: ' + error.message);
    }
}

// ===== BRANCHES MANAGEMENT =====
const addBranchBtn = document.getElementById('addBranchBtn');
const branchesTable = document.getElementById('branchesTable');

addBranchBtn.addEventListener('click', () => {
    const formHTML = `
        <div class="form-group">
            <label>Tên chi nhánh</label>
            <input type="text" id="branchName" class="form-control" placeholder="Nhập tên chi nhánh">
        </div>
        <div class="form-group">
            <label>Mã chi nhánh</label>
            <input type="text" id="branchCode" class="form-control" placeholder="VD: HN-001">
        </div>
        <div class="form-group">
            <label>Địa chỉ</label>
            <input type="text" id="branchAddress" class="form-control" placeholder="Nhập địa chỉ">
        </div>
        <div class="form-group">
            <label>Điện thoại</label>
            <input type="tel" id="branchPhone" class="form-control" placeholder="Nhập số điện thoại">
        </div>
    `;

    openModal('Thêm Chi nhánh', formHTML, 'Thêm', async () => {
        const name = document.getElementById('branchName').value;
        const code = document.getElementById('branchCode').value;
        const address = document.getElementById('branchAddress').value;
        const phone = document.getElementById('branchPhone').value;

        if (!name || !code) {
            showError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            await api.createBranch({
                name, code, address, phoneNumber: phone,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
            showSuccess('Thêm chi nhánh thành công!');
            loadBranches();
        } catch (error) {
            showError('Lỗi khi thêm chi nhánh: ' + error.message);
        }
    });
});

async function loadBranches() {
    try {
        const branches = await api.getBranches();
        branchesTable.innerHTML = branches.map(branch => `
            <tr>
                <td>${branch.name}</td>
                <td>${branch.code}</td>
                <td>${branch.address}</td>
                <td>${branch.phoneNumber}</td>
                <td>${getStatusBadge(branch.isActive ? 'ACTIVE' : 'INACTIVE')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editBranch(${branch.id})">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBranchConfirm(${branch.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading branches:', error);
        branchesTable.innerHTML = '<tr><td colspan="6" class="text-center">Lỗi tải dữ liệu</td></tr>';
    }
}

async function editBranch(id) {
    try {
        const branch = await api.getBranch(id);
        const formHTML = `
            <div class="form-group">
                <label>Tên chi nhánh</label>
                <input type="text" id="branchName" class="form-control" value="${branch.name}">
            </div>
            <div class="form-group">
                <label>Mã chi nhánh</label>
                <input type="text" id="branchCode" class="form-control" value="${branch.code}" readonly>
            </div>
            <div class="form-group">
                <label>Địa chỉ</label>
                <input type="text" id="branchAddress" class="form-control" value="${branch.address || ''}">
            </div>
            <div class="form-group">
                <label>Điện thoại</label>
                <input type="tel" id="branchPhone" class="form-control" value="${branch.phoneNumber || ''}">
            </div>
        `;

        openModal('Sửa Chi nhánh', formHTML, 'Cập nhật', async () => {
            const name = document.getElementById('branchName').value;
            const address = document.getElementById('branchAddress').value;
            const phone = document.getElementById('branchPhone').value;

            if (!name) {
                showError('Vui lòng nhập tên chi nhánh!');
                return;
            }

            try {
                await api.updateBranch(id, {
                    name, address, phoneNumber: phone,
                    updatedAt: Date.now()
                });
                showSuccess('Cập nhật chi nhánh thành công!');
                loadBranches();
            } catch (error) {
                showError('Lỗi khi cập nhật: ' + error.message);
            }
        });
    } catch (error) {
        showError('Lỗi tải dữ liệu chi nhánh: ' + error.message);
    }
}

async function deleteBranchConfirm(id) {
    if (confirm('Bạn chắc chắn muốn xóa chi nhánh này?')) {
        try {
            await api.deleteBranch(id);
            showSuccess('Xóa chi nhánh thành công!');
            loadBranches();
        } catch (error) {
            showError('Lỗi khi xóa: ' + error.message);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    testAPI();
    loadBranches();
});

// Global functions for inline onclick
window.editBranch = editBranch;
window.deleteBranchConfirm = deleteBranchConfirm;
window.openModal = openModal;
window.closeModal = closeModal;
