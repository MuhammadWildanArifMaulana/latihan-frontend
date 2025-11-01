import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container className="vh-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6} className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Button as={Link} to="/login" variant="primary">
            Back to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
