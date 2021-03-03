import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import LoginModal from "../LoginModal/LoginModal.component";
import CartModal from "../CartModal/CartModal.component";
import NewProductModal from "../NewProductModal/NewProductModal.component";
import {withRouter} from "react-router";

const LogoutRequest = () => {
    // fetch('/api/logout')
    //     .then(res => res.json())
    //     .then(res => {
    //         console.log(res)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        // })
}

const NavBar = function (props) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">AntMerch</Navbar.Brand>
            <Nav className={"ml-auto"}>

            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className={"m-auto"}>
                    <Nav.Item>
                        {props.products &&
                        <Form inline>
                            <FormControl
                                type="text"
                                placeholder="Search"
                                className="mr-sm-2"
                                onChange={(e) => {
                                    props.filter(props.products.filter(product => product.productName.toLowerCase().includes(e.target.value)))
                                }}
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>}
                    </Nav.Item>
                </Nav>
                <Nav className={'mr-0'}>
                    {localStorage.getItem('token') && JSON.parse(localStorage.getItem('user')).type === false ? <NewProductModal /> : <CartModal />}
                    { !localStorage.getItem('token') && <LoginModal/>}
                    { localStorage.getItem('token') && (
                        <NavDropdown style={{ margin: 'auto' }} title={`Hi, ${JSON.parse(localStorage.getItem('user')).firstName}`} id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.2" onClick={() => {
                                props.products ? props.history.push('/orders') : props.history.push('/')
                            }}>{props.products ? 'Orders' : 'Products'}</NavDropdown.Item>
                            {/*<NavDropdown.Item eventKey="4.3">Settings</NavDropdown.Item>*/}
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => {
                                LogoutRequest()
                                props.history.push('/')
                            }} >Logout</NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default withRouter(NavBar);