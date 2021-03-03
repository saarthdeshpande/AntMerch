import React from 'react'
import NavBar from '../../components/NavBar/NavBar.component'
import { NotificationContainer } from "react-notifications";
import Product from "../../components/ProductCard/ProductCard.component";
import {CardColumns} from "react-bootstrap";
import './ProductPage.styles.css'
import LazyLoader from "../../components/LazyLoader.component";

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filteredProducts: [],
            loading: true
        }
        this.filterProducts = this.filterProducts.bind(this)
    }

    filterProducts = (filteredProducts) => this.setState({ filteredProducts })

    componentDidMount() {
        fetch(`/api/product/${(localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === false) ? 'seller' : 'customer'}`)
            .then(res => res.json())
            .then(res => {
                this.setState({ products: res.products })
                this.setState({ filteredProducts: res.products })
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <div>
                <NavBar products={this.state.products} filter={this.filterProducts} />
                {this.state.loading && <LazyLoader />}
                {!this.state.loading && <CardColumns style={{marginTop: '40px'}}>
                    {/*<Row id={'product-card-row'}>*/}
                    {this.state.filteredProducts.map(product => (
                        // <Col id={'productCard'} key={product._id}>
                        <Product key={product._id} product={product}/>
                        // </Col>
                    ))}
                    {/*</Row>*/}
                </CardColumns>}
                <NotificationContainer />
            </div>
        )
    };
}

export default ProductPage;