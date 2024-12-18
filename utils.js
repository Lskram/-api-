// utils.js
const API_URL = 'http://localhost:3000';

async function handleAPIError(response) {
    const data = await response.json();
    switch (response.status) {
        case 401:
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            throw new Error(data.message || 'กรุณาเข้าสู่ระบบ');
        case 403:
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            throw new Error(data.message || 'Token ไม่ถูกต้องหรือหมดอายุ');
        case 404:
            throw new Error(data.message || 'ไม่พบผู้ใช้งาน');
        case 500:
            throw new Error(data.message || 'เกิดข้อผิดพลาดในการดำเนินการ');
        default:
            throw new Error(data.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
}

async function handleResponse(response) {
    if (!response.ok) {
        await handleAPIError(response);
    }
    return await response.json();
}

function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
}

// สำหรับแสดง Alert
function showAlert(alertElement, message, isError = false) {
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    alertElement.classList.add(isError ? 'alert-danger' : 'alert-success');
    alertElement.classList.remove(isError ? 'alert-success' : 'alert-danger');
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// สำหรับเรียก API ที่อยู่
async function fetchProvinces() {
    const response = await fetch(`${API_URL}/provinces/all`);
    return handleResponse(response);
}

async function fetchDistricts(provinceId) {
    const response = await fetch(`${API_URL}/provinces/${provinceId}`);
    return handleResponse(response);
}

async function fetchSubDistricts(provinceId, districtId) {
    const response = await fetch(`${API_URL}/provinces/${provinceId}/${districtId}`);
    return handleResponse(response);
}

export {
    API_URL,
    handleAPIError,
    handleResponse,
    checkTokenExpiration,
    showAlert,
    fetchProvinces,
    fetchDistricts,
    fetchSubDistricts
};