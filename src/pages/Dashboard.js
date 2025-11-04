import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../components/ToastNotification";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
  });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [validated, setValidated] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchCategories = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      const res = await api.get("/categories", { headers });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [getAuthHeaders, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      const res = await api.get("/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [getAuthHeaders, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!formElement.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const data = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: form.category_id ? Number(form.category_id) : null,
      };

      if (editId) {
        await api.put(`/products/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({
          show: true,
          message: "Product updated successfully!",
          type: "success",
        });
      } else {
        await api.post("/products", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({
          show: true,
          message: "Product added successfully!",
          type: "success",
        });
      }
      // reset form and close modal
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
      });
      setEditId(null);
      setValidated(false);
      setShow(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setToast({
        show: true,
        message: err.response?.data?.message || "Error saving product",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        show: true,
        message: "Product deleted successfully!",
        type: "success",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setToast({
        show: true,
        message: err.response?.data?.message || "Error deleting product",
        type: "error",
      });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id?.toString() || "",
    });
    setEditId(product.id);
    setShow(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts, navigate]);

  return (
    <Container className="py-4">
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Product Management</h3>
        <div>
          <Button onClick={() => setShow(true)} className="me-2">
            Add Product
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
              setToast({
                show: true,
                message: "Successfully logged out",
                type: "success",
              });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr key={product.id}>
              <td>{i + 1}</td>
              <td>{product.name}</td>
              <td>
                {product.description
                  ? product.description.length > 100
                    ? product.description.slice(0, 100) + "..."
                    : product.description
                  : "-"}
              </td>
              <td>{product.category_name || "No Category"}</td>
              <td>${Number(product.price).toLocaleString()}</td>
              <td>{product.stock}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={show}
        onHide={() => {
          // reset form and close modal when user cancels/closes
          setShow(false);
          setForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            category_id: "",
          });
          setEditId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
                setForm({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  category_id: "",
                });
                setEditId(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Dashboard;
