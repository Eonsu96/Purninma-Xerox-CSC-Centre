// --- Initial Mock Data & State Management ---
const initialData = {
    users: [
        { id: 1, name: 'Super Admin', email: 'admin@csccentre.com', password: 'Admin123', role: 'admin' },
        { id: 2, name: 'Rahul Das', email: 'operator@csccentre.com', password: 'Operator123', role: 'operator' },
        { id: 4, name: 'Priya Devi', email: 'priya@csccentre.com', password: 'Operator123', role: 'operator' },
        { id: 3, name: 'Eonsu', email: 'customer@csccentre.com', password: 'Customer123', role: 'customer' }
    ],
    services: [
        { 
            id: 'SRV-PAN', name: 'PAN Card Application', cost: 250, tatkaalCost: 500, time: '7-14 Days', 
            link: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
            docs: ['Aadhaar Card', 'Passport Size Photo', 'Signature']
        },
        { 
            id: 'SRV-PASS', name: 'Passport Application / Renewal', cost: 1500, tatkaalCost: 3500, time: '30 Days', 
            link: 'https://portal2.passportindia.gov.in/',
            docs: ['Aadhaar Card', 'Voter ID Card', 'PAN Card', 'Birth Certificate', 'Electricity/Water Bill']
        }
    ],
    requests: [
        { id: 'CSC-2026-1001', customerId: 3, customerName: 'Eonsu', service: 'PAN Card Application (General)', operator: 'Rahul Das', status: 'processing', date: '2026-08-28', docs: ['Aadhaar_Card.pdf', 'Photo.jpg'], payment: 'Full', totalPaid: 250 },
        { id: 'CSC-2026-1002', customerId: 3, customerName: 'Eonsu', service: 'Income Certificate (General)', operator: 'Unassigned', status: 'new', date: '2026-08-27', docs: [], payment: 'Full', totalPaid: 150 }
    ],
    stats: { revenue: 145650, customers: 1842 }
};

// --- Database Initialization ---
function initDB() {
    const currentData = localStorage.getItem('csc_data');
    let needsReset = false;
    
    if (currentData) {
        const parsed = JSON.parse(currentData);
        if (!parsed.services || parsed.services.length === 0) needsReset = true;
    } else {
        needsReset = true;
    }

    if (needsReset) {
        localStorage.setItem('csc_data', JSON.stringify(initialData));
        localStorage.removeItem('csc_user'); 
    }
}

function getDB() { return JSON.parse(localStorage.getItem('csc_data')); }
function saveDB(data) { localStorage.setItem('csc_data', JSON.stringify(data)); }

// --- UI Utilities ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date().toLocaleDateString('en-IN', options);
}

function closeUIModal() {
    const modal = document.getElementById('global-modal');
    if (modal) modal.remove();
}

// --- Application Router & Renderer ---
const appDiv = document.getElementById('app');

function renderApp() {
    const currentUser = JSON.parse(localStorage.getItem('csc_user'));
    if (!currentUser) return renderLandingPage();
    renderDashboard(currentUser);
    lucide.createIcons();
}

// --- LANDING PAGE ---
function renderLandingPage() {
    appDiv.innerHTML = `
        <div class="landing-page">
            <header class="landing-header">
                <div class="landing-logo">
                    <i data-lucide="monitor" style="color: var(--primary); width: 32px; height: 32px;"></i>
                    <div>
                        <h2>CSC Centre</h2>
                        <span>Digital Seva, Aapke Dwar</span>
                    </div>
                </div>
                <nav class="landing-nav">
                    <a href="#" class="active">Home</a>
                    <a href="#">About Us</a>
                    <a href="#">Services</a>
                    <a href="#">How It Works</a>
                    <a href="#">Contact Us</a>
                    <a href="#">Help & Support</a>
                </nav>
                <div class="landing-actions">
                    <span><i data-lucide="phone" style="display:inline; width:16px; margin-right:4px;"></i> +91 98765 43210</span>
                    <button class="btn btn-primary" onclick="openAuthModal('customer')"><i data-lucide="user" style="display:inline; width:16px;"></i> Login</button>
                </div>
            </header>

            <section class="hero-section">
                <div class="hero-content">
                    <h1>Digital Services,<br>Simplified.</h1>
                    <p>Your trusted CSC Centre for government services, documents, payments, and more.</p>
                    <button class="btn btn-primary" style="padding: 12px 24px; font-size: 1.1rem;"><i data-lucide="info" style="display:inline; margin-right:8px;"></i> Learn More</button>
                </div>
                <div class="hero-image-placeholder"></div>
                <div class="wave-bottom">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style="fill: #ffffff;"></path>
                    </svg>
                </div>
            </section>

            <section class="portals-section">
                <h2>Choose Your Portal</h2>
                <p>Login according to your role and access the services designed for you.</p>
                
                <div class="portal-grid">
                    <div class="portal-card admin">
                        <div class="portal-icon"><i data-lucide="shield"></i></div>
                        <h3>Admin Portal</h3>
                        <p>Login to access the admin dashboard and manage the centre.</p>
                        <button class="btn" onclick="openAuthModal('admin')"><i data-lucide="user"></i> Login as Admin</button>
                    </div>
                    
                    <div class="portal-card operator">
                        <div class="portal-icon"><i data-lucide="users"></i></div>
                        <h3>Operator Portal</h3>
                        <p>Login to access your dashboard and manage daily operations.</p>
                        <button class="btn" onclick="openAuthModal('operator')"><i data-lucide="user"></i> Login as Operator</button>
                    </div>
                    
                    <div class="portal-card customer">
                        <div class="portal-icon"><i data-lucide="user"></i></div>
                        <h3>Customer Portal</h3>
                        <p>Login or register to request services and track your requests.</p>
                        <button class="btn" onclick="openAuthModal('customer')"><i data-lucide="user"></i> Login / Register</button>
                    </div>
                </div>

                <div class="info-strip">
                    <div class="info-item">
                        <div class="icon"><i data-lucide="map-pin"></i></div>
                        <div>
                            <h4>Visit Our Centre</h4>
                            <p>Main Road, Your Town,<br>Your District - 123456</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon"><i data-lucide="clock"></i></div>
                        <div>
                            <h4>Working Hours</h4>
                            <p>Mon - Sat: 9:00 AM - 6:00 PM<br>Sunday: Closed</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon"><i data-lucide="headphones"></i></div>
                        <div>
                            <h4>Need Help?</h4>
                            <p>+91 98765 43210<br>support@csccentre.in</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon"><i data-lucide="shield-check"></i></div>
                        <div>
                            <h4>100% Secure</h4>
                            <p>Your information is safe<br>and protected with us.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
    lucide.createIcons();
}

// --- Authentication UI & Logic ---
window.openAuthModal = function(role, mode = 'login') {
    closeUIModal();
    const title = role.charAt(0).toUpperCase() + role.slice(1);
    
    // Admins and Operators can only login. Customers can login or register.
    const isRegister = (role === 'customer' && mode === 'register');
    
    let defaultEmail = '';
    if(mode === 'login') {
        if(role === 'admin') defaultEmail = 'admin@csccentre.com';
        if(role === 'operator') defaultEmail = 'operator@csccentre.com';
        if(role === 'customer') defaultEmail = 'customer@csccentre.com';
    }

    const modalHtml = `
        <div class="modal-overlay" id="global-modal">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>${isRegister ? 'Register Account' : `${title} Login`}</h2>
                    <button class="btn" onclick="closeUIModal()">✕</button>
                </div>
                
                <form id="authForm">
                    <input type="hidden" id="authRole" value="${role}">
                    <input type="hidden" id="authMode" value="${mode}">
                    
                    ${isRegister ? `
                        <label>Full Name</label>
                        <input type="text" id="authName" required placeholder="John Doe">
                    ` : ''}

                    <label>Email Address</label>
                    <input type="email" id="authEmail" value="${defaultEmail}" required placeholder="email@example.com">
                    
                    <label>Password</label>
                    <input type="password" id="authPassword" value="${mode === 'login' ? title + '123' : ''}" required placeholder="••••••••">
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
                        ${isRegister ? 'Create Account' : 'Login to Dashboard'}
                    </button>
                </form>

                ${role === 'customer' ? `
                    <div class="auth-toggle">
                        ${isRegister 
                            ? `Already have an account? <a onclick="openAuthModal('customer', 'login')">Login here</a>` 
                            : `New user? <a onclick="openAuthModal('customer', 'register')">Register here</a>`}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    lucide.createIcons();

    // Handle Form Submission
    document.getElementById('authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const submittedRole = document.getElementById('authRole').value;
        const submittedMode = document.getElementById('authMode').value;
        const email = document.getElementById('authEmail').value;
        const pass = document.getElementById('authPassword').value;
        const db = getDB();

        if (submittedMode === 'register') {
            const name = document.getElementById('authName').value;
            // Check if user exists
            if (db.users.find(u => u.email === email)) {
                showToast('Email already registered!');
                return;
            }
            // Create new customer
            const newUser = { id: db.users.length + 1, name: name, email: email, password: pass, role: 'customer' };
            db.users.push(newUser);
            saveDB(db);
            localStorage.setItem('csc_user', JSON.stringify(newUser));
            closeUIModal();
            showToast('Registration successful! Welcome.');
            renderApp();
        } else {
            // Login check - Ensure role matches
            const user = db.users.find(u => u.email === email && u.password === pass && u.role === submittedRole);
            if (user) {
                localStorage.setItem('csc_user', JSON.stringify(user));
                closeUIModal();
                showToast(`Welcome back, ${user.name}!`);
                renderApp();
            } else {
                showToast('Invalid credentials or incorrect portal!');
            }
        }
    });
}


// --- DASHBOARDS ---
// (Dashboard logic remains structurally exactly as previously implemented)
function renderDashboard(user) {
    appDiv.innerHTML = `
        <div class="layout">
            <aside class="sidebar">
                <div class="sidebar-header"><i data-lucide="monitor" style="display:inline; margin-right:8px;"></i> CSC Portal</div>
                <div class="nav-menu">
                    <div class="nav-item active"><i data-lucide="layout-dashboard"></i> Dashboard</div>
                    ${user.role === 'admin' || user.role === 'operator' ? '<div class="nav-item"><i data-lucide="users"></i> Customers</div>' : ''}
                    <div class="nav-item"><i data-lucide="file-text"></i> Requests</div>
                    <div class="nav-item"><i data-lucide="settings"></i> Settings</div>
                </div>
                <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-weight: 600; color: white;">${user.name}</div>
                    <div style="font-size: 0.8rem; text-transform: capitalize;">${user.role} • Online</div>
                    <button id="logoutBtn" class="btn" style="margin-top: 12px; width: 100%; background: rgba(255,255,255,0.1); color: white;">Logout</button>
                </div>
            </aside>
            <main class="main-content">
                <header class="topbar">
                    <div style="display:flex; align-items:center; gap: 16px;">
                        <i data-lucide="search" style="color: var(--text-muted)"></i>
                        <input type="text" placeholder="Search anything (Ctrl+K)..." style="margin:0; border:none; outline:none; background:transparent; width:300px;">
                    </div>
                    <div style="display:flex; align-items:center; gap: 16px; color: var(--text-muted)">
                        <span>${formatDate()}</span>
                        <i data-lucide="bell"></i>
                    </div>
                </header>
                <div class="content-area" id="main-content-area"></div>
            </main>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('csc_user');
        renderApp(); // Sends back to Landing Page
    });

    const contentArea = document.getElementById('main-content-area');
    const db = getDB();

    if (user.role === 'admin') renderAdminView(contentArea, db);
    if (user.role === 'operator') renderOperatorView(contentArea, db, user);
    if (user.role === 'customer') renderCustomerView(contentArea, db, user);
}

// ... (Keep the rest of the file EXACTLY as it was in the previous valid response: renderAdminView, assignOperator, renderOperatorView, updateStatus, renderCustomerView, showDocumentsModal, renderServiceDetails, updatePaymentUI) ...

function showDocumentsModal(reqId) {
    const db = getDB();
    const req = db.requests.find(r => r.id === reqId);

    const modalHtml = `
        <div class="modal-overlay" id="global-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Documents for ${req.id}</h2>
                    <button class="btn" onclick="closeUIModal()">✕</button>
                </div>
                <div class="doc-list">
                    ${req.docs && req.docs.length > 0 ? req.docs.map(doc => `
                        <div class="doc-item">
                            <i data-lucide="file-text"></i>
                            <div style="flex:1;">
                                <strong>${doc}</strong>
                            </div>
                            <button class="btn btn-primary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="showToast('Downloading ${doc}...')">View</button>
                        </div>
                    `).join('') : '<p>No documents uploaded.</p>'}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    lucide.createIcons();
}

function renderAdminView(container, db) {
    const operators = db.users.filter(u => u.role === 'operator');

    const workloadHtml = operators.map(op => {
        const assigned = db.requests.filter(r => r.operator === op.name).length;
        const completed = db.requests.filter(r => r.operator === op.name && r.status === 'completed').length;
        const pending = assigned - completed;
        return `
            <div class="doc-item" style="flex-direction: column; align-items: start;">
                <strong>${op.name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted)">Pending: ${pending} | Completed: ${completed}</span>
            </div>
        `;
    }).join('');

    let html = `
        <h1 style="margin-bottom: 24px;">Admin Dashboard</h1>
        
        <div class="kpi-grid">
            <div class="card kpi-card">
                <h3>Operator Workload</h3>
                <div class="doc-list" style="margin-top: 12px;">${workloadHtml}</div>
            </div>
            <div class="card kpi-card">
                <h3>Today's Revenue</h3>
                <div class="value">₹1,45,650</div>
                <span style="color: var(--success-text); font-size: 0.875rem;">↑ 22.4% vs last week</span>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 16px;">Service Requests Pipeline</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Assign Operator</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.requests.map(req => `
                            <tr>
                                <td><strong>${req.id}</strong><br><small>${req.customerName}</small></td>
                                <td>${req.service} <br><small>Paid: ${req.payment} (₹${req.totalPaid})</small></td>
                                <td><span class="badge ${req.status}">${req.status.toUpperCase()}</span></td>
                                <td>
                                    <select onchange="assignOperator('${req.id}', this.value)" style="margin:0; padding:6px;">
                                        <option value="Unassigned" ${req.operator === 'Unassigned' ? 'selected' : ''}>-- Assign --</option>
                                        ${operators.map(op => `<option value="${op.name}" ${req.operator === op.name ? 'selected' : ''}>${op.name}</option>`).join('')}
                                    </select>
                                </td>
                                <td>
                                    <button class="btn btn-primary" onclick="showDocumentsModal('${req.id}')" style="font-size:0.75rem; padding: 6px 12px;">View Docs</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

window.assignOperator = function(reqId, opName) {
    const db = getDB();
    const req = db.requests.find(r => r.id === reqId);
    if(req) {
        req.operator = opName;
        req.status = opName !== 'Unassigned' ? 'processing' : 'new';
        saveDB(db);
        showToast(`Assigned ${reqId} to ${opName}`);
        renderApp();
    }
}

function renderOperatorView(container, db, user) {
    const myRequests = db.requests.filter(r => r.operator === user.name || (r.status === 'new' && r.operator === 'Unassigned'));

    let html = `
        <h1 style="margin-bottom: 24px;">Operator Workspace</h1>
        <div class="card">
            <h3 style="margin-bottom: 16px;">Assigned & Pending Tasks</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service</th>
                            <th>Customer Docs</th>
                            <th>Action & Processing</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${myRequests.map(req => {
                            const baseServiceName = req.service.split(' (')[0];
                            const serviceMeta = db.services.find(s => s.name === baseServiceName);
                            
                            return `
                            <tr>
                                <td><strong>${req.id}</strong><br><small>${req.customerName}</small></td>
                                <td>${req.service}</td>
                                <td>
                                    <button class="btn" style="border: 1px solid var(--border);" onclick="showDocumentsModal('${req.id}')">View Docs</button>
                                </td>
                                <td style="display: flex; gap: 8px;">
                                    ${serviceMeta ? `<a href="${serviceMeta.link}" target="_blank" class="btn" style="background: var(--info-bg); color: var(--info-text); text-decoration:none;">Open Portal</a>` : ''}
                                    <button class="btn btn-primary" onclick="updateStatus('${req.id}', 'completed')" ${req.status==='completed'?'disabled':''}>
                                        ${req.status==='completed' ? 'Completed' : 'Mark Complete'}
                                    </button>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

window.updateStatus = function(reqId, newStatus) {
    const db = getDB();
    const req = db.requests.find(r => r.id === reqId);
    if(req) {
        req.status = newStatus;
        if(newStatus === 'processing' && req.operator === 'Unassigned') {
            const currentUser = JSON.parse(localStorage.getItem('csc_user'));
            req.operator = currentUser.name; 
        }
        saveDB(db);
        showToast('Status updated to ' + newStatus);
        renderApp();
    }
}

function renderCustomerView(container, db, user) {
    const myRequests = db.requests.filter(r => r.customerId === user.id);

    let html = `
        <h1 style="margin-bottom: 24px;">Welcome back, ${user.name.split(' ')[0]}</h1>
        
        <div class="card" style="margin-bottom: 24px;">
            <h3>Request New Service</h3>
            <form id="newRequestForm" style="margin-top: 16px;">
                <label>Select Service</label>
                <select id="serviceType" required onchange="renderServiceDetails(this.value)">
                    <option value="" disabled selected>-- Select a Service --</option>
                    ${db.services.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
                
                <div id="dynamicServiceDetails"></div>
            </form>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 16px;">My Request History</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Service</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Docs</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${myRequests.map(req => `
                            <tr>
                                <td><strong>${req.id}</strong></td>
                                <td>${req.service}</td>
                                <td>${req.payment} (₹${req.totalPaid})</td>
                                <td><span class="badge ${req.status}">${req.status.toUpperCase()}</span></td>
                                <td><button class="btn" style="font-size:0.75rem; padding: 4px 8px; border: 1px solid var(--border);" onclick="showDocumentsModal('${req.id}')">View</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;

    setTimeout(() => {
        const form = document.getElementById('newRequestForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const serviceId = document.getElementById('serviceType').value;
                const service = db.services.find(s => s.id === serviceId);
                const variant = document.getElementById('serviceVariant').value;
                const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
                
                let totalCost = variant === 'Tatkaal' ? service.tatkaalCost : service.cost;
                let amountPaid = paymentType === 'Half' ? totalCost / 2 : totalCost;

                let uploadedDocs = [];
                document.querySelectorAll('.doc-upload-input').forEach(input => {
                    if(input.files.length > 0) uploadedDocs.push(input.files[0].name);
                });

                const newId = 'CSC-2026-' + (1000 + db.requests.length + 1);
                
                db.requests.unshift({
                    id: newId,
                    customerId: user.id,
                    customerName: user.name,
                    service: `${service.name} (${variant})`,
                    operator: 'Unassigned',
                    status: 'new',
                    date: new Date().toISOString().split('T')[0],
                    docs: uploadedDocs,
                    payment: paymentType,
                    totalPaid: amountPaid
                });
                
                saveDB(db);
                showToast(`Payment of ₹${amountPaid} successful. Request submitted!`);
                renderApp();
            });
        }
    }, 0);
}

window.renderServiceDetails = function(serviceId) {
    const db = getDB();
    const service = db.services.find(s => s.id === serviceId);
    if (!service) return;

    const container = document.getElementById('dynamicServiceDetails');
    
    const docUploadsHtml = service.docs.map((doc) => `
        <div style="margin-top: 12px;">
            <label>Upload ${doc} <span style="color:red">*</span></label>
            <input type="file" class="doc-upload-input" required accept=".pdf,.jpg,.png" style="margin-bottom: 0;">
        </div>
    `).join('');

    container.innerHTML = `
        <div class="service-info-box">
            <strong>Service Details:</strong>
            <ul>
                <li>Estimated Time: ${service.time}</li>
                <li>General Cost: ₹${service.cost}</li>
                <li>Tatkaal (Fast-Track) Cost: ₹${service.tatkaalCost}</li>
            </ul>
        </div>
        
        <label>Application Type</label>
        <select id="serviceVariant" onchange="updatePaymentUI('${service.id}')">
            <option value="General">General Processing</option>
            <option value="Tatkaal">Tatkaal (Fast-Track)</option>
        </select>
        
        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px;">
            <h4>Required Documents</h4>
            ${docUploadsHtml}
        </div>

        <div class="payment-section">
            <h4 style="margin-bottom: 8px;">Payment Details</h4>
            <div id="costDisplay" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">Total Cost: ₹${service.cost}</div>
            
            <label>Payment Plan required to initiate request:</label>
            <div class="payment-options">
                <label>
                    <input type="radio" name="paymentType" value="Full" checked onchange="updatePaymentUI('${service.id}')"> 
                    Pay Full (₹<span id="fullPayAmt">${service.cost}</span>)
                </label>
                <label>
                    <input type="radio" name="paymentType" value="Half" onchange="updatePaymentUI('${service.id}')"> 
                    Pay Half Now (₹<span id="halfPayAmt">${service.cost / 2}</span>)
                </label>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 16px; width: 100%;">Pay & Submit Request</button>
        </div>
    `;
}

window.updatePaymentUI = function(serviceId) {
    const db = getDB();
    const service = db.services.find(s => s.id === serviceId);
    const variant = document.getElementById('serviceVariant').value;
    const cost = variant === 'Tatkaal' ? service.tatkaalCost : service.cost;
    
    document.getElementById('costDisplay').innerText = `Total Cost: ₹${cost}`;
    document.getElementById('fullPayAmt').innerText = cost;
    document.getElementById('halfPayAmt').innerText = cost / 2;
}

// --- Initialize ---
initDB();
renderApp();