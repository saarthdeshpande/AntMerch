import React from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import {NotificationContainer} from "react-notifications";
import {Tab, Tabs} from "react-bootstrap";
import OrderPageCard from "../../components/OrderPageCard/OrderPageCard";
import NavBar from "../../components/NavBar/NavBar.component";
import LazyLoader from "../../components/LazyLoader.component";

class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            successOrders: [],
            failedOrders: [],
            loading: true
        }
    }

    clearStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        NotificationManager.warning('Token expired. Refreshing in 5 seconds.', 'Timeout', 5000)
        setTimeout(() => {
            window.location.reload()
        }, 5000)
    }

    getOrders = () => {
        fetch(`/api/order/${JSON.parse(localStorage.getItem('user')).type === true ? 'customer' : 'seller'}`)
            .then(res => res.json())
            .then(res => {
                if (res.name === "TokenExpiredError" || res.name === "JsonWebTokenError") {
                    this.clearStorage()
                } else {
                    this.setState({ successOrders: res.successOrders })
                    this.setState({ failedOrders: res.failedOrders })
                    this.setState({ loading: false })
                }
            })
    }

    componentDidMount() {
        this.getOrders()
    }

    render() {
        return (
            <div>
                <NavBar />
                {this.state.loading && <LazyLoader />}
                {!this.state.loading &&
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Success">
                            {this.state.successOrders && this.state.successOrders.map(order => (
                                <OrderPageCard key={order._id} order={order}/>
                            ))}
                            {this.state.successOrders.length === 0 && (
                                <p style={{textAlign: 'center', marginTop: '30px'}}>No orders to show.</p>
                            )}
                        </Tab>
                        <Tab eventKey="profile" title="Failure">
                            {this.state.failedOrders && this.state.failedOrders.map(order => (
                                <OrderPageCard key={order._id} order={order}/>
                            ))}
                            {this.state.failedOrders.length === 0 && (
                                <p style={{textAlign: 'center', marginTop: '30px'}}>No orders to show.</p>
                            )}
                        </Tab>
                    </Tabs>
                }
                <NotificationContainer />
            </div>
        )
    }
}

export default OrderPage;