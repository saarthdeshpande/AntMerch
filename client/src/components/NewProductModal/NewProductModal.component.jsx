import React from "react";
import {Modal} from "react-bootstrap";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { IconButton, TextField, Button } from "@material-ui/core";


class NewProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            productImage: null
        }
    }

    modalVisibilityToggler = () => {
        if (!localStorage.getItem('token')) {
            NotificationManager.info('Please login to view Shopping Cart.')
            document.getElementById('loginModalButton').click()
        } else {
            this.setState({showModal: !this.state.showModal})
        }
    }

    handleUpload = (e) => {
        if (e.target.files[0] !== undefined) {
            const productImage = e.target.files[0];
            const reader = new FileReader()
            this.setState({ productImage }, () => {
                reader.onload = (event) => {
                    this.setState({ productImage: event.target.result }, console.log.bind(console, this.state))
                }
                if ( this.state.productImage ) {
                    reader.readAsDataURL(this.state.productImage)
                } else {
                    NotificationManager.warning('Please upload an image of product.', 'Incomplete data.', 2000)
                }
            })

        }
    }

    addProduct = (productName, productImage, productDescription, productPrice, productQuantity, productCategory, brand) => {
        NotificationManager.success('Product added successfully.', 'Success!')
        NotificationManager.info('Refreshing in 2s.')
        fetch('/api/product/seller', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName,
                productImage,
                productDescription,
                productPrice,
                productQuantity,
                productCategory,
                brand
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
                } else {
                    console.log(res)
                    window.location.reload()
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
                        src="https://img.icons8.com/color/48/000000/new-product--v2.png"
                        title={'New Product'}
                        alt={'New Product'}
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
                        <Modal.Title>New Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={e => {
                            e.preventDefault()
                            this.addProduct(
                                document.getElementById('productName').value,
                                this.state.productImage,
                                document.getElementById('productDescription').value,
                                document.getElementById('productPrice').value,
                                document.getElementById('productQuantity').value,
                                document.getElementById('productCategory').value,
                                document.getElementById('brand').value
                            )
                        }} validate="true">
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-photo"
                                onChange={this.handleUpload}
                                type="file"
                                required
                            />
                            <label htmlFor="icon-button-photo">
                                <IconButton
                                    style={{
                                        marginBottom: '20px',
                                        display: 'inline-block',
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        marginRight: 'auto',
                                        marginLeft: 'auto',
                                        width: '80px',
                                        height: '80px'
                                    }}
                                    color="primary"
                                    component="span"
                                >
                                    <img
                                        src="https://img.icons8.com/dusk/64/000000/slr-camera.png"
                                        title={'Upload'}
                                        alt={'Upload'}
                                    />
                                </IconButton>
                            </label>
                            <TextField
                                style={{ marginTop: '60px'}}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productName"
                                type={'text'}
                                label="Product Name"
                                name="productName"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productDescription"
                                type={'text'}
                                label="Product Description"
                                name="productDescription"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="brand"
                                type={'text'}
                                label="Brand"
                                name="productBrand"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productPrice"
                                type={'number'}
                                label="Rate"
                                name="productPrice"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productQuantity"
                                type={'number'}
                                label="Quantity"
                                name="productQuantity"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productCategory"
                                type={'text'}
                                label="Category"
                                name="productCategory"
                                autoFocus
                            />
                            <Button
                                    color="primary"
                                    variant="contained"
                                    type={'submit'}
                                    fullWidth
                            >
                                Add Product
                            </Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default NewProductModal;