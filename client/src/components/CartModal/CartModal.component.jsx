import React from "react";
import {Button, Modal} from "react-bootstrap";
import HorizontalProductCard from "../ProductCard/HorizontalProductCard.component";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ConfirmModal from "../ConfirmModal/ConfirmModal.component";
import LazyLoader from "../LazyLoader.component";

class CartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            cart: [],
            cartCost: 0,
            loading: true
        }
        this.modalVisibilityToggler = this.modalVisibilityToggler.bind(this)
    }

    modalVisibilityToggler = () => {
        if (!localStorage.getItem('token')) {
            NotificationManager.info('Please login to view Shopping Cart.')
            document.getElementById('loginModalButton').click()
        } else {
            this.getCart()
            this.setState({showModal: !this.state.showModal}, () => {
                if (this.state.showModal === false) {
                    this.setState({ loading: true })
                }
            })
        }
    }

    placeOrder = async () => {
        await fetch('/api/order', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                if (res.name === "TokenExpiredError" || res.name === "JsonWebTokenError") {
                    this.clearStorage()
                } else {
                    console.log(res)
                    NotificationManager.success('Transaction successful', 'Success!')
                    setTimeout(() => window.location.reload(), 2000)
                }
            })
    }

    clearStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        NotificationManager.warning('Token expired. Refreshing in 5 seconds.', 'Timeout', 5000)
        setTimeout(() => {
            window.location.reload()
        }, 5000)
    }

    getCart = () => {
        fetch('/api/cart')
            .then(res => res.json())
            .then(res => {
                if (res.name === "TokenExpiredError" || res.name === "JsonWebTokenError") {
                    this.clearStorage()
                } else {
                    this.setState({cart: res.cart}, () => {
                        if (this.state.cart.products) {
                            let cartCost = 0;
                            this.state.cart.products.forEach(details => {
                                cartCost += (details.productId.productPrice * details.quantity)
                            })
                            this.setState({ cartCost })
                        }
                        this.setState({ loading: false })
                    })
                }
            })
    }

    render() {
        return (
            <>
                <Button
                    style={{
                        backgroundColor: 'transparent',
                        outline: 'none',
                        border: 'none',
                        marginRight: '20px'
                    }}
                    onClick={this.modalVisibilityToggler}
                >
                    <img
                        width={'50'}
                        height={'50'}
                        src="https://img.icons8.com/fluent/96/000000/fast-cart.png"
                        title={'View Cart / Checkout'}
                        alt={'Cart'}
                    />
                </Button>

                <Modal
                    show={this.state.showModal}
                    onHide={this.modalVisibilityToggler}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Your Shopping Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {!this.state.loading && (
                            <>
                                {this.state.cart.products && this.state.cart.products.map(product => (
                                    <HorizontalProductCard key={product._id} product={product}/>
                                ))
                                }
                                {!this.state.cart.products && (
                                    <h6 style={{textAlign: 'center'}}>Your cart is empty.</h6>
                                    )}
                            </>
                        )}
                        {this.state.loading && <LazyLoader />}
                    </Modal.Body>
                    {this.state.cart.products && (
                        <Modal.Footer>
                        <Modal.Title style={{flex: '1 0 auto'}}>Total: {this.state.cartCost} INR</Modal.Title>
                        <ConfirmModal text={'Empty Cart'} />
                        <Button onClick={this.placeOrder} variant="primary">
                        Checkout
                        </Button>
                        </Modal.Footer>
                        )}
                </Modal>
            </>
        );
    }
}

export default CartModal;