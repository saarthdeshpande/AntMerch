import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import SignUpForm from './SignUpForm'
import LoginForm from "./LoginForm";

const LoginModal = (props) => {
    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = () => setShowModal(!showModal);

    const [login, toggleLogin] = useState(true);

    const handleLogin = () => toggleLogin(!login);

    return (
        <>
            <Button variant="primary" id={'loginModalButton'} onClick={handleModalOpen}>
                Login / Sign Up
            </Button>

            <Modal
                show={showModal}
                onHide={handleModalOpen}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{login ? "Login" : "Sign Up"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {login ? <LoginForm /> : <SignUpForm />}
                </Modal.Body>
                <Modal.Footer>
                    <p
                        style={{
                            position: 'absolute',
                            left: '12px',
                            color: 'blue',
                            cursor: 'pointer'
                        }}
                        onClick={handleLogin}
                    >
                        {login ? "Don't have an account yet? Sign Up!" : "Already a user? Login!"}
                    </p>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LoginModal;