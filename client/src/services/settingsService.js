import axiosInstance from "../api/axiosInstance";

export const getSettings = () => axiosInstance.get("/settings");

export const updateSettings = (data) =>
  axiosInstance.put("/settings", data);

export const uploadProfileImage = (formData) =>
  axiosInstance.post("/settings/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProfileImage = () =>
  axiosInstance.delete("/settings/profile-image");
