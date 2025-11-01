require("dotenv").config();
const axios = require("axios");

const base = "http://localhost:5000";

(async () => {
  try {
    console.log("POST /auth/register");
    const regPayload = {
      name: "apitest-axios",
      email: "apitest-axios@example.com",
      password: "test123",
    };
    const regRes = await axios.post(`${base}/auth/register`, regPayload, {
      timeout: 5000,
    });
    console.log("Register status:", regRes.status);
    console.log("Register body:", regRes.data);
  } catch (err) {
    console.error("Register error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
      console.error(err.stack);
    }
  }

  try {
    console.log("\nPOST /auth/login");
    const loginPayload = {
      email: "apitest-axios@example.com",
      password: "test123",
    };
    const loginRes = await axios.post(`${base}/auth/login`, loginPayload, {
      timeout: 5000,
    });
    console.log("Login status:", loginRes.status);
    console.log("Login body:", loginRes.data);
    if (loginRes.data && loginRes.data.token) {
      console.log(
        "Token saved (simulated) ->",
        loginRes.data.token.substring(0, 20) + "..."
      );
    }
  } catch (err) {
    console.error("Login error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
      console.error(err.stack);
    }
  }
})();
