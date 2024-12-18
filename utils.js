// utils.js
const API_URL = 'https://express-test-api-l0zc.onrender.com';

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
            throw new Error(data.message || 'ไม่พบข้อมูล');
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

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(url, { ...options, headers });
        return await handleResponse(response);
    } catch (error) {
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลที่อยู่
async function fetchProvinces() {
    const response = await fetch(`${API_URL}/provinces`);
    return handleResponse(response);
}

async function fetchDistricts(provinceId) {
    const response = await fetch(`${API_URL}/amphures?provinceId=${provinceId}`);
    return handleResponse(response);
}

async function fetchSubDistricts(districtId) {
    const response = await fetch(`${API_URL}/tambons?amphureId=${districtId}`);
    return handleResponse(response);
}

export {
    API_URL,
    handleResponse,
    fetchWithAuth,
    fetchProvinces,
    fetchDistricts,
    fetchSubDistricts
};