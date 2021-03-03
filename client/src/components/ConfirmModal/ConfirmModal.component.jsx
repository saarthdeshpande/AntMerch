import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";

const emptyCart = async () => {
    await fetch('/api/cart', {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(res => {
            if (res.name === "TokenExpiredError" || res.name === "JsonWebTokenError") {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                NotificationManager.warning('Token expired. Refreshing in 5 seconds.', 'Timeout', 5000)
                setTimeout(() => {
                    window.location.reload()
                }, 5000)
            } else {
                window.location.reload()
            }
        })
}

const removeProduct = async (productId) => {
    await fetch(`/api/product/${productId}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(res => {
            if (res.name === "TokenExpiredError" || res.name === "JsonWebTokenError") {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                NotificationManager.warning('Token expired. Refreshing in 5 seconds.', 'Timeout', 5000)
                setTimeout(() => {
                    window.location.reload()
                }, 5000)
            } else {
                window.location.reload()
            }
        })
}



const ConfirmModal = (props) => {
    const [show, setShow] = useState(false);

    const modalVisibilityToggler = () => setShow(!show);
    return (
        <>
            <Button
                onClick={modalVisibilityToggler}
                variant={props.removeProduct ? '' : "secondary"}
                style={{
                    position: props.removeProduct ? 'absolute' : '',
                    right: '10px'
                }} >
                {props.removeProduct ?
                    <img
                        src="https://img.icons8.com/officel/30/000000/trash.png"
                        alt="Delete Product"
                    /> :
                    props.text
                }
            </Button>
            <Modal show={show} onHide={modalVisibilityToggler}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.text}?</Modal.Title>
                </Modal.Header>
                <Modal.Footer
                    style={{left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', position: 'absolute'}}>
                    <Button variant="secondary" onClick={modalVisibilityToggler}>
                        No
                    </Button>
                    <Button variant="primary" onClick={props.removeProduct ? removeProduct.bind(this, props.productId) : emptyCart}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmModal;