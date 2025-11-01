(async () => {
  const url = "http://localhost:5000/auth/register";
  const payload = {
    name: "apitest",
    email: "apitest2@example.com",
    password: "test123",
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
})();
