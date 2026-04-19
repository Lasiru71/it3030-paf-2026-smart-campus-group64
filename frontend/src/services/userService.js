import axiosInstance from "./axiosInstance";

export const userService = {
    /**
     * Fetch user details by ID
     */
    getUserById: async (id) => {
        try {
            const resp = await axiosInstance.get(`/api/users/${id}`);
            return resp.data;
        } catch (err) {
            console.error("Error fetching user profile:", err);
            throw err;
        }
    },

    /**
     * Update user profile details
     */
    updateProfile: async (id, profileData) => {
        try {
            const resp = await axiosInstance.put(`/api/users/${id}/profile`, profileData);
            return resp.data;
        } catch (err) {
            console.error("Error updating user profile:", err);
            throw err;
        }
    }
};
