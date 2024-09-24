import api from './index'; // api ni import qilish

// Superadminlarni olish
export const getUsers = async () => {
    return api.get('/user/get');
};

// Rolarni olish
export const getRoles = async () => {
    return api.get('/helper/get-roles');
};

// Foydalanuvchini o‘chirish
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/user/delete/${id}`);
        return response;
    } catch (error) {
        throw new Error('Foydalanuvchini o‘chirishda xatolik yuz berdi');
    }
};

// Foydalanuvchini yangilash
export const updateUser = async (data) => {
    const editedData = {
        ...data,
        full_name: data.full_name,
        phone_number: data.phone_number,
        password: data.password, // Agar parolni yangilash kerak bo'lsa
        role_id: data.role_id,
        district_id: data.district_id
    };
    try {
        const response = await api.put(`/user/update/${editedData.id}`, editedData);
        return response;
    } catch (error) {
        throw new Error('Foydalanuvchini yangilashda xatolik yuz berdi');
    }
};

// Barcha tumanlarni olish
export const getAllDistricts = async () => {
    return api.get('/district/get-all');
};

// Yangi ma'lumot yaratish
export const createData = async (newData) => {
    try {
        const data = await api.post('/helper/set-data', newData);
        return data;
    } catch (error) {
        console.error('Error uploading data:', error);
        throw new Error('Data upload failed');
    }
};

// Superadmin uchun user yaratish
export const createUser = async (data) => {
    return api.post('/auth/register', data);
};

// Barcha sprinterlar uchun QR kod zip faylini yuklab olish
export const downloadAllSprinterQRCodes = async () => {
    return api.get('/helper/download-zip', { responseType: 'blob' });
};

// Tuman uchun QR kod zip faylini yuklab olish
export const downloadDistrictZip = async (districtId) => {
    return api.get(`/helper/download-zip/${districtId}`, { responseType: 'blob' });
};

// Kirish (Sign In) funksiyasi
export const signIn = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);

        // Javobdagi ma'lumotlarni olamiz
        const { token, role, id, district } = response?.data?.result;
        console.log(response?.data?.result);

        // Ma'lumotlarni localStorage'ga saqlaymiz
        localStorage.setItem("role", role?.name);
        localStorage.setItem("token", token);
        localStorage.setItem("workerId", id);
        localStorage.setItem("districtId", district.id);

        // Javob ma'lumotlarini qaytaramiz
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // Xatolikni qaytarish
    }
};