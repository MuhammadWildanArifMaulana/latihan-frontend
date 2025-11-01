const base = "http://localhost:5000";

async function request(path, opts) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch (e) {}
  return { status: res.status, ok: res.ok, data };
}

(async () => {
  try {
    console.log("Logging in...");
    const login = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "verifyadmin@example.com",
        password: "VerifyPass123",
      }),
    });
    console.log("Login:", login.status, login.data);
    if (!login.ok) return;
    const token = login.data.token;

    console.log("\nCreating product...");
    const create = await request("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Scripted Shirt",
        description: "from test script",
        price: 123456,
        stock: 7,
        category_id: 1,
      }),
    });
    console.log("Create:", create.status, create.data);
    if (!create.ok) return;
    const id = create.data.id;

    console.log("\nFetching products...");
    const all = await request("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      "GET /products:",
      all.status,
      Array.isArray(all.data) ? all.data.length + " items" : all.data
    );

    console.log("\nUpdating product...");
    const upd = await request(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Scripted Shirt - Updated",
        description: "updated by script",
        price: 111111,
        stock: 9,
        category_id: 1,
      }),
    });
    console.log("Update:", upd.status, upd.data);

    console.log("\nFetching product detail...");
    const detail = await request(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Detail:", detail.status, detail.data);

    console.log("\nDeleting product...");
    const del = await request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Delete:", del.status, del.data);

    console.log("\nFinal GET /products...");
    const final = await request("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      "Final products count:",
      final.status,
      Array.isArray(final.data) ? final.data.length + " items" : final.data
    );
  } catch (err) {
    console.error("Script error", err);
  }
})();
