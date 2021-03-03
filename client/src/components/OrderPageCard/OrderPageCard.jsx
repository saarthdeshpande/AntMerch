import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import OrderModal from "../OrderModal/OrderModal.component";

const OrderPageCard = (props) => {
    const { purchasedItems, orderAmount, _id, purchaseDate } = props.order
    return (
        <Card style={{ display: 'flex', marginBottom: '5px' }}>
            <img
                style={{ width: 100, height: 76, marginTop: '15px' }}
                src={purchasedItems[0].productId.productImage}
                title={_id}
                alt={_id}
            />
            <div style={{ display: 'flex',
                flexDirection: 'column' }}>
                <CardContent style={{ flex: '1 0 auto' }}>
                    <Typography component="h5" variant="h6">
                        <b>Order ID:</b> <OrderModal products={purchasedItems} orderId={_id} orderAmount={orderAmount} />
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Purchase Date: {String(purchaseDate).split('T')[0]}
                    </Typography>
                </CardContent>
            </div>
            <CardContent style={{ right: '10px', position: 'absolute' }}>
                <Typography variant="h6" color="textSecondary">
                    {orderAmount} INR
                </Typography>
            </CardContent>
        </Card>
    )
}

export default OrderPageCard;