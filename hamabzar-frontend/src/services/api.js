const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/** کلاس خطای یکپارچه برای تشخیص نوع خطا در UI */
export class ApiError extends Error {
  constructor(type, message, status = null) {
    super(message);
    this.type = type;
    this.status = status;
  }
}

/**
 * هلپر برای درخواست‌های HTTP با مدیریت خطا
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // اضافه کردن توکن اگر موجود باشد
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // اگر 401 بود، توکن منقضی شده
    if (response.status === 401) {
      // تلاش برای refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // تلاش مجدد با توکن جدید
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          throw await handleErrorResponse(retryResponse);
        }
        return retryResponse.status === 204 ? null : await retryResponse.json();
      } else {
        // logout کاربر
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new ApiError('unauthorized', 'لطفاً دوباره وارد شوید.', 401);
      }
    }

    if (!response.ok) {
      throw await handleErrorResponse(response);
    }

    // اگر 204 No Content بود
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // خطای شبکه
    throw new ApiError('network_error', 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
  }
}

/**
 * مدیریت پاسخ‌های خطا از سرور
 */
async function handleErrorResponse(response) {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { detail: 'خطای سرور' };
  }

  const message = errorData.detail || errorData.message || 'خطایی رخ داده است';
  
  // تشخیص نوع خطا بر اساس status code
  let type = 'server_error';
  if (response.status === 400) type = 'validation_error';
  if (response.status === 401) type = 'unauthorized';
  if (response.status === 403) type = 'forbidden';
  if (response.status === 404) type = 'not_found';
  
  return new ApiError(type, message, response.status);
}

/**
 * تمدید توکن دسترسی با refresh token
 */
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// TOOLS API
// ============================================================

/**
 * GET /api/tools/?category_id=...&city_id=...&search=...&only_available=...&ordering=...
 * @param {Object} params - { category_id, city_id, search, only_available, ordering }
 */
export async function fetchTools(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.category_id) queryParams.append('category_id', params.category_id);
  if (params.city_id) queryParams.append('city_id', params.city_id);
  if (params.search) queryParams.append('search', params.search);
  if (params.only_available) queryParams.append('only_available', 'true');
  if (params.ordering) queryParams.append('ordering', params.ordering);
  
  const query = queryParams.toString();
  return request(`/tools/${query ? '?' + query : ''}`);
}

/**
 * GET /api/tools/:id/
 */
export async function fetchToolDetail(id) {
  return request(`/tools/${id}/`);
}

/**
 * GET /api/tools/:id/availability/?month=YYYY-MM
 */
export async function fetchToolAvailability(id, month) {
  return request(`/tools/${id}/availability/?month=${month}`);
}

/**
 * GET /api/tools/:id/reviews/
 */
export async function fetchToolReviews(id) {
  return request(`/tools/${id}/reviews/`);
}

/**
 * GET /api/tools/:id/related/
 */
export async function fetchRelatedTools(id) {
  return request(`/tools/${id}/related/`);
}

/**
 * POST /api/tools/
 */
export async function createTool(toolData) {
  return request('/tools/', {
    method: 'POST',
    body: JSON.stringify(toolData),
  });
}

/**
 * PATCH /api/tools/:id/
 */
export async function updateTool(id, toolData) {
  return request(`/tools/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(toolData),
  });
}

/**
 * DELETE /api/tools/:id/
 */
export async function deleteTool(id) {
  return request(`/tools/${id}/`, {
    method: 'DELETE',
  });
}

/**
 * POST /api/tools/:id/images/
 */
export async function uploadToolImage(id, formData) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/tools/${id}/images/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // FormData به صورت خودکار Content-Type را تنظیم می‌کند
  });

  if (!response.ok) {
    throw await handleErrorResponse(response);
  }

  return response.json();
}

// ============================================================
// LOOKUP APIs
// ============================================================

/** GET /api/categories/ */
export async function fetchCategories() {
  return request('/tools/categories/');
}

/** GET /api/cities/ */
export async function fetchCities() {
  return request('/tools/cities/');
}

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * POST /api/auth/request-otp/
 * @param {string} phone - شماره تلفن 10 رقمی (بدون 0)
 */
export async function requestOtp(phone) {
  return request('/auth/request-otp/', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

/**
 * POST /api/auth/verify-otp/
 * @param {string} phone
 * @param {string} code - کد 4 رقمی
 */
export async function verifyOtp(phone, code) {
  const data = await request('/auth/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });

  // ذخیره توکن‌ها
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  return data;
}

/**
 * POST /api/auth/register/
 */
export async function register(userData) {
  const data = await request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // ذخیره توکن‌ها
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  return data;
}

/**
 * POST /api/auth/login/
 */
export async function login(phone, password) {
  const data = await request('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });

  // ذخیره توکن‌ها
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  return data;
}

/**
 * GET /api/auth/me/
 */
export async function fetchCurrentUser() {
  return request('/auth/me/');
}

/**
 * خروج کاربر (فقط local)
 */
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ============================================================
// RENTALS
// ============================================================

/**
 * GET /api/rentals/my/?status=...
 * @param {string|null} statusFilter - pending | active | completed | cancelled
 */
export async function fetchMyRentals(statusFilter = null) {
  const query = statusFilter ? `?status=${statusFilter}` : '';
  return request(`/rentals/my/${query}`);
}

/**
 * GET /api/rentals/my-tools/?status=...
 * @param {string|null} statusFilter
 */
export async function fetchMyToolRentals(statusFilter = null) {
  const query = statusFilter ? `?status=${statusFilter}` : '';
  return request(`/rentals/my-tools/${query}`);
}

/**
 * POST /api/rentals/
 */
export async function createRental(rentalData) {
  return request('/rentals/', {
    method: 'POST',
    body: JSON.stringify(rentalData),
  });
}

// ============================================================
// DISPUTES
// ============================================================

/**
 * GET /api/disputes/
 */
export async function fetchDisputes() {
  return request('/disputes/');
}

/**
 * POST /api/rentals/:rental_id/dispute/
 */
export async function createDispute(rentalId, disputeData) {
  return request(`/rentals/${rentalId}/dispute/`, {
    method: 'POST',
    body: JSON.stringify(disputeData),
  });
}

/**
 * POST /api/disputes/:dispute_id/resolve/
 */
export async function resolveDispute(disputeId, resolutionData) {
  return request(`/disputes/${disputeId}/resolve/`, {
    method: 'POST',
    body: JSON.stringify(resolutionData),
  });
}

// ============================================================
// CHAT (endpoints تخمینی - نیاز به تایید از chat/urls.py)
// ============================================================

/**
 * GET /api/chat/conversations/
 */
export async function fetchConversations() {
  return request('/chat/conversations/');
}

/**
 * GET /api/chat/conversations/:id/messages/
 */
export async function fetchConversationMessages(conversationId) {
  return request(`/chat/conversations/${conversationId}/messages/`);
}

/**
 * POST /api/chat/conversations/:id/messages/
 */
export async function sendMessage(conversationId, messageData) {
  return request(`/chat/conversations/${conversationId}/messages/`, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

// ============================================================
// REVIEWS (endpoints تخمینی - نیاز به تایید)
// ============================================================

/**
 * GET /api/reviews/tags/
 */
export async function fetchReviewTags() {
  return request('/reviews/tags/');
}

/**
 * POST /api/rentals/:rental_id/review/
 * @param {number} rentalId
 * @param {Object} payload - { overall_rating, criteria, tags, comment, photos, is_public }
 */
export async function submitReview(rentalId, payload) {
  return request(`/rentals/${rentalId}/review/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================
// HELPER: check if user is authenticated
// ============================================================

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}
