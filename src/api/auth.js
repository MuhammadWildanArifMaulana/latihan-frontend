import api from "./api";

export const login = async (credentials) => {
  const { email, password } = credentials;

  // Validate email format
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error("Please enter a valid email address");
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const res = await api.post("/auth/login", {
      email: email.trim(),
      password: password,
    });

    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      return res.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const register = async (userData) => {
  const { name, fullname, email, password } = userData;

  // Validate email format
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error("Please enter a valid email address");
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Validate required fields
  if (!name.trim() || !fullname.trim()) {
    throw new Error("All fields are required");
  }

  try {
    const res = await api.post("/auth/register", {
      name: name.trim(),
      fullname: fullname.trim(),
      email: email.trim(),
      password: password,
    });
    return res.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};
