import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form, Card, Spinner, Image } from "react-bootstrap";
import api from "../../api/apiClient";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: null, });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/categories?page=${page}&limit=${limit}`);
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);

      if (formData.image) {
        payload.append("image", formData.image);
      }
      console.log(formData.image);

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created successfully");
      }

      fetchCategories();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Category deleted");
        fetchCategories();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  /* ================= MODAL ================= */
  const handleShow = (category = null) => {
    setEditingCategory(category);
    setFormData({
      name: category?.name || "",
      description: category?.description || "",
      image: null,
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: null });
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h4>Manage Categories</h4>
            <Button onClick={() => handleShow()}>+ Add Category</Button>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length ? (
                  categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>
                        <Image src={`${import.meta.env.VITE_API_URL}${cat.image}`} roundedCircle width={50} height={50} />
                      </td>
                      <td>{cat.name}</td>
                      <td>{cat.description}</td>
                      <td>
                        <Button size="sm" variant="warning" className="me-2" onClick={() => handleShow(cat)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(cat._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center"> No categories found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* PAGINATION */}
          <div className="d-flex justify-content-center">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span className="mx-3 mt-2">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Category Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
              {editingCategory && (
                <small className="text-muted">
                  Leave empty to keep old image
                </small>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingCategory ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
