import {Button, Modal} from "react-bootstrap";
import HorizontalProductCard from "../ProductCard/HorizontalProductCard.component";
import React, {useState} from "react";

const OrderModal = (props) => {

    const [modalVisible, setModalVisible] = useState(false);

    const modalVisibilityToggler = () => setModalVisible(!modalVisible)

    return (
        <>
            <Button
                style={{
                    backgroundColor: 'transparent',
                    outline: 'none',
                    border: 'none',
                    marginLeft: '-10px',
                    marginRight: '20px',
                    color: 'blue'
                }}
                onClick={modalVisibilityToggler}
            >
                {props.orderId}
            </Button>

            <Modal
                show={modalVisible}
                onHide={modalVisibilityToggler}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Order ID: {props.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.products && props.products.map(product => (
                        <HorizontalProductCard key={product._id} product={product} />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Title style={{ flex: '1 0 auto' }}>Total: {props.orderAmount} INR</Modal.Title>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default OrderModal;