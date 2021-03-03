import React from "react";
import {Modal} from "react-bootstrap";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { TextField, Button } from "@material-ui/core";


class EditProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
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

    editProduct = (productName, productDescription, productPrice, productQuantity, productCategory, brand) => {
        fetch(`/api/product/${this.props.product._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName,
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
                }
            })
    }

    render() {
        const { productName, productDescription, productPrice, productQuantity, productCategory, brand, productImage } = this.props.product
        return (
            <>
                <Button
                    style={{
                        backgroundColor: 'transparent',
                        outline: 'none',
                        border: 'none',
                        position: 'absolute', right: '10px'
                    }}
                    onClick={this.modalVisibilityToggler}
                >
                    <img
                        src="https://img.icons8.com/officel/30/000000/edit-property.png"
                        alt={'Edit Product'}
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
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div align={'center'}>
                           <img src={productImage} width={'25%'} height={'25%'} alt="Existing"/>
                        </div>
                        <form onSubmit={e => {
                            e.preventDefault()
                            this.editProduct(
                                document.getElementById('productName').value,
                                document.getElementById('productDescription').value,
                                document.getElementById('productPrice').value,
                                document.getElementById('productQuantity').value,
                                document.getElementById('productCategory').value,
                                document.getElementById('brand').value
                            )
                            window.location.reload()
                        }} validate="true">
                            <TextField
                                style={{ marginTop: '60px'}}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="productName"
                                defaultValue={productName}
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
                                defaultValue={productDescription}
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
                                defaultValue={brand}
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
                                defaultValue={productPrice}
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
                                defaultValue={productQuantity}
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
                                defaultValue={productCategory}
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
                                Edit Product
                            </Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default EditProductModal;