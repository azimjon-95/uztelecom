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
        const { token, role, id } = response?.data?.result;

        // Ma'lumotlarni localStorage'ga saqlaymiz
        localStorage.setItem("role", role?.name);
        localStorage.setItem("token", token);
        localStorage.setItem("workerId", id);

        // Javob ma'lumotlarini qaytaramiz
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // Xatolikni qaytarish
    }
};

















// import axios from 'axios';

// const API_URL = 'https://api.uztelecom.dadabayev.uz';


// // Token olish funksiyasi
// const getAuthToken = () => {
//     return `Bearer ${localStorage.getItem("token")}`;
// };

// // Superadminlarni olish
// export const getUsers = async () => {
//     return axios.get(`${API_URL}/api/user/get`, {
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };

// // Rolarni olish
// export const getRoles = async () => {
//     return axios.get(`${API_URL}/api/helper/get-roles`, {
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };
// // deleteUser API chaqiruvi
// export const deleteUser = async (id) => {
//     try {
//         const response = await axios.delete(`${API_URL}/api/user/delete/${id}`, {
//             headers: {
//                 Authorization: getAuthToken(),
//             },
//         });
//         return response;
//     } catch (error) {
//         throw new Error('Foydalanuvchini o‘chirishda xatolik yuz berdi');
//     }
// };
// // Update user API request
// export const updateUser = async (data) => {
//     const editedData = {
//         ...data,
//         full_name: data.full_name,
//         phone_number: data.phone_number,
//         password: data.password, // Agar parolni yangilash kerak bo'lsa
//         role_id: data.role_id,
//         district_id: data.district_id
//     }
//     try {
//         const response = await axios.put(`${API_URL}/api/user/update/${editedData.id}`, editedData, {
//             headers: {
//                 Authorization: `Bearer ${getAuthToken()}`
//             }
//         });
//         console.log(response);
//         return response;
//     } catch (error) {
//         throw new Error('Foydalanuvchini yangilashda xatolik yuz berdi');
//     }
// };

// // Barcha tumanlarni olish
// export const getAllDistricts = async () => {
//     return axios.get(`${API_URL}/api/district/get-all`, {
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };
// export const createData = async (newData) => {
//     try {
//         const data = await axios.post(`${API_URL}/api/helper/set-data`, newData, {
//             headers: {
//                 Authorization: `Bearer ${getAuthToken()}`
//             }
//         });
//         return data;
//     } catch (error) {
//         console.error('Error uploading data:', error);
//         throw new Error('Data upload failed');
//     }
// };

// // Superadmin uchun user yaratish
// export const createUser = async (data) => {
//     return axios.post(`${API_URL}/api/auth/register`, data, {
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };

// // Barcha sprinterlar uchun QR kod zip faylini yuklab olish
// export const downloadAllSprinterQRCodes = async () => {
//     return axios.get(`${API_URL}/api/helper/download-zip`, {
//         responseType: 'blob',
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };

// // ZIP faylini yuklab olish
// export const downloadDistrictZip = async (districtId) => {
//     return axios.get(`${API_URL}/api/helper/download-zip/${districtId}`, {
//         responseType: 'blob', // Fayl yuklash uchun blob tipidan foydalaniladi
//         headers: {
//             Authorization: getAuthToken(),
//         },
//     });
// };


// export const signIn = async (credentials) => {
//     console.log(credentials);
//     try {
//         // Kirish so'rovini yuboramiz va natijani kutamiz
//         const response = await axios.post(`${API_URL}/api/auth/login`, credentials);

//         // Javobdagi ma'lumotlarni olamiz
//         const { token, role, id } = response?.data?.result;

//         // Ma'lumotlarni localStorage'ga saqlaymiz
//         localStorage.setItem("role", role?.name);
//         localStorage.setItem("token", token);
//         localStorage.setItem("workerId", id);

//         // Javob ma'lumotlarini qaytaramiz
//         return response.data;
//     } catch (error) {
//         console.error("Login failed:", error);
//         throw error; // Xatolikni qaytarib yuborish
//     }
// }

