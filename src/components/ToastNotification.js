import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function ToastNotification({ show, message, type = "success", onClose }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        bg={type === "success" ? "success" : "danger"}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {type === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body className={type === "success" ? "text-white" : ""}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;
