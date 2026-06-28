import axiosClient from "./axiosClient";

const getData = (response) => response.data;

const saveAuthTokens = (data) => {
  const accessToken = data.access || data.access_token;
  const refreshToken = data.refresh || data.refresh_token;

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
};

const removeEmptyParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

export const requestOtp = async (phone) => {
  const response = await axiosClient.post("/accounts/request-otp/", { phone });
  return getData(response);
};

export const verifyOtp = async (phone, code) => {
  const response = await axiosClient.post("/accounts/verify-otp/", {
    phone,
    code,
    otp: code,
  });

  saveAuthTokens(response.data);
  return response.data;
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  const response = await axiosClient.post("/accounts/refresh/", { refresh });

  saveAuthTokens(response.data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getUserProfile = async () => {
  const response = await axiosClient.get("/accounts/me/");
  return getData(response);
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosClient.patch("/accounts/me/", profileData);
  return getData(response);
};

export const registerUser = async (payload) => {
  const response = await axiosClient.post("/accounts/register/", payload);
  saveAuthTokens(response.data);
  return response.data;
};

export const loginWithPassword = async (payload) => {
  const response = await axiosClient.post("/accounts/login/", payload);
  saveAuthTokens(response.data);
  return response.data;
};

export const fetchTools = async (params = {}) => {
  const response = await axiosClient.get("/tools/", {
    params: removeEmptyParams(params),
  });
  return getData(response);
};

export const fetchToolDetail = async (id) => {
  const response = await axiosClient.get(`/tools/${id}/`);
  return getData(response);
};

export const fetchToolAvailability = async (id, month) => {
  const response = await axiosClient.get(`/tools/${id}/availability/`, {
    params: removeEmptyParams({ month }),
  });
  return getData(response);
};

export const fetchCategories = async () => {
  const response = await axiosClient.get("/categories/");
  return getData(response);
};

export const fetchCities = async () => {
  const response = await axiosClient.get("/cities/");
  return getData(response);
};

export const fetchToolReviews = async (id) => {
  const response = await axiosClient.get(`/tools/${id}/reviews/`);
  return getData(response);
};

export const fetchRelatedTools = async (id) => {
  const response = await axiosClient.get(`/tools/${id}/related/`);
  return getData(response);
};

export const fetchToolConditions = async () => {
  const response = await axiosClient.get("/tools/conditions/");
  return getData(response);
};

export const createTool = async (payload) => {
  const response = await axiosClient.post("/tools/", payload);
  return getData(response);
};

export const updateTool = async (id, payload) => {
  const response = await axiosClient.patch(`/tools/${id}/`, payload);
  return getData(response);
};

export const deleteTool = async (id) => {
  const response = await axiosClient.delete(`/tools/${id}/`);
  return getData(response);
};

export const fetchMyRentals = async (statusFilter) => {
  const response = await axiosClient.get("/rentals/my/", {
    params: removeEmptyParams({ status: statusFilter }),
  });
  return getData(response);
};

export const fetchMyToolRentals = async (statusFilter) => {
  const response = await axiosClient.get("/rentals/my-tools/", {
    params: removeEmptyParams({ status: statusFilter }),
  });
  return getData(response);
};

export const createRental = async (payload) => {
  const response = await axiosClient.post("/rentals/", payload);
  return getData(response);
};

export const fetchRentalDetail = async (id) => {
  const response = await axiosClient.get(`/rentals/${id}/`);
  return getData(response);
};

export const updateRental = async (id, payload) => {
  const response = await axiosClient.patch(`/rentals/${id}/`, payload);
  return getData(response);
};

export const submitReview = async (rentalId, payload) => {
  const response = await axiosClient.post(`/rentals/${rentalId}/review/`, payload);
  return getData(response);
};

export const fetchReviewTags = async () => {
  const response = await axiosClient.get("/reviews/tags/");
  return getData(response);
};

export const fetchConversations = async () => {
  const response = await axiosClient.get("/chat/conversations/");
  return getData(response);
};

export const fetchConversationMessages = async (conversationId) => {
  const response = await axiosClient.get(`/chat/conversations/${conversationId}/messages/`);
  return getData(response);
};

export const sendConversationMessage = async (conversationId, payload) => {
  const response = await axiosClient.post(`/chat/conversations/${conversationId}/messages/`, payload);
  return getData(response);
};

export const fetchAdminDashboard = async () => {
  const response = await axiosClient.get("/admin/dashboard/");
  return getData(response);
};

export const fetchAdminToolsQueue = async (statusFilter) => {
  const response = await axiosClient.get("/admin/tools/", {
    params: removeEmptyParams({ status: statusFilter }),
  });
  return getData(response);
};

export const approveAdminTool = async (toolId) => {
  const response = await axiosClient.post(`/admin/tools/${toolId}/approve/`);
  return getData(response);
};

export const rejectAdminTool = async (toolId, reason) => {
  const response = await axiosClient.post(`/admin/tools/${toolId}/reject/`, { reason });
  return getData(response);
};

export const deleteAdminTool = async (toolId) => {
  const response = await axiosClient.delete(`/admin/tools/${toolId}/`);
  return getData(response);
};

export default {
  requestOtp,
  verifyOtp,
  refreshToken,
  logout,
  getUserProfile,
  updateUserProfile,
  registerUser,
  loginWithPassword,
  fetchTools,
  fetchToolDetail,
  fetchToolAvailability,
  fetchCategories,
  fetchCities,
  fetchToolReviews,
  fetchRelatedTools,
  fetchToolConditions,
  createTool,
  updateTool,
  deleteTool,
  fetchMyRentals,
  fetchMyToolRentals,
  createRental,
  fetchRentalDetail,
  updateRental,
  submitReview,
  fetchReviewTags,
  fetchConversations,
  fetchConversationMessages,
  sendConversationMessage,
  fetchAdminDashboard,
  fetchAdminToolsQueue,
  approveAdminTool,
  rejectAdminTool,
  deleteAdminTool,
};
