import axiosInstance from "../api/axiosInstance";

export const getMediaUsage = () => axiosInstance.get("/media/usage");
