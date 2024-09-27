import api from "./index";

export const getSprinters = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const formattedPage = String(page).padStart(2, '0');
        const response = await api.get(`/spirinter/get-all`, {
            params: {
                page: formattedPage,
                per_page,
                search,
            },
        });
        return response.data;

    } catch (error) {
        console.error('Sprinterlarni olishda xatolik:', error);
        throw error;
    }
};

export const addUserToSprinter = async (sprinterId, userIds) => {
    try {
        const response = await api.post('/spirinter/add-user-to-sprinter', {
            sprinter_id: sprinterId,
            users_id: userIds,
        });
        return response.data;
    } catch (error) {
        console.error('Foydalanuvchini sprinterga qo\'shishda xatolik:', error);
        throw error;
    }
};

export const deleteUserFromSprinter = async (sprinterId, userIds) => {
    try {
        const response = await api.post('/spirinter/delete-user-from-sprinter', {
            sprinter_id: sprinterId,
            users_id: userIds,
        });
        return response.data;
    } catch (error) {
        console.error('Foydalanuvchini sprinterdan olib tashlashda xatolik:', error);
        throw error;
    }
};
