import {Badge, Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import React from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ConfirmModal from "../ConfirmModal/ConfirmModal.component";
import EditProductModal from "../EditProductModal/EditProductModal";

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productCount: 0
        }
    }

    GetUpdatedCart = () => {
        fetch(`/api/cart/${this.props.product._id}`)
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
                    this.setState({ productCount: res.quantity | 0 })
                }
            })
    }

    componentDidMount() {
        if (localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === true) {
            this.GetUpdatedCart()
        }
    }

    addToCart = () => {
        fetch('/api/cart', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: {
                    seller: this.props.product.seller,
                    productId: this.props.product._id,
                    quantity: this.state.productCount
                }
            })
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
                }
            })
    }


    productCountHandler = async (operation) => {
        // add to cart
        if(!localStorage.getItem('token')) {
            NotificationManager.info('Please login for adding to cart.')
            document.getElementById('loginModalButton').click()
        } else {
            if (operation === 'inc') {
                if (this.state.productCount >= 0 && this.state.productCount < this.props.product.productQuantity)
                    this.setState({ productCount: this.state.productCount + 1 }, this.addToCart)
            } else if (operation === 'dec') {
                if (this.state.productCount > 0 && this.state.productCount <= this.props.product.productQuantity)
                    this.setState({ productCount: this.state.productCount - 1 }, this.addToCart)
            }
        }
    }

    render() {
        const { productName, productDescription, productPrice, productQuantity, productCategory, brand, productImage } = this.props.product
        return (
            <Card style={{ width: '46%', marginRight: '10px', marginLeft: '10px', marginBottom: '10px', marginTop: '10px', background: productQuantity === 0 ? 'grey' : '' }}>
                <Card.Img variant="top" src={productImage} />
                <Badge style={{ backgroundColor: 'black', color: 'white' }}>{productCategory}</Badge>
                <Card.Body>
                    <Card.Title style={{ textAlign: 'center' }}>
                        {productName}
                        {localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === false && productQuantity > 0 && (
                            <ConfirmModal text={'Remove Product'} removeProduct={true} productId={this.props.product._id} />
                        )}
                    </Card.Title>
                    <Card.Text>
                        {productDescription}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem style={{ textAlign: 'center', backgroundColor: productQuantity > 0 ? 'orange' : 'grey' }}>{brand}</ListGroupItem>
                    <ListGroupItem style={{ textAlign: 'center', backgroundColor: productQuantity > 0 ? '' : 'grey' }}>Price: {productPrice} INR</ListGroupItem>
                </ListGroup>
                {(!localStorage.getItem('token') || (localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === true)) && productQuantity > 0 && (
                    <Card.Body>
                        <div align={'center'}>
                            <Button disabled={this.state.productCount === 0} style={{display: 'inline-block'}}
                                    onClick={this.productCountHandler.bind(this, 'dec')}>-</Button>
                            <p style={{
                                display: 'inline-block',
                                marginRight: '5px',
                                marginLeft: '5px'
                            }}>{this.state.productCount} in Cart</p>
                            <Button disabled={this.state.productCount === productQuantity}
                                    style={{display: 'inline-block'}}
                                    onClick={this.productCountHandler.bind(this, 'inc')}>+</Button>
                        </div>
                    </Card.Body>
                )}
                <Card.Footer style={{ color: productQuantity > 0 ? '' : 'red' }} >
                    <p style={{ textAlign: 'center' }}>
                        {productQuantity > 0 ? `${productQuantity} in Stock` : "Out of Stock"}
                        {localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === false && (
                            <EditProductModal product={this.props.product} />
                        )}
                    </p>
                </Card.Footer>
            </Card>
        )
    }
}

export default Product;