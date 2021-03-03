import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";

const HorizontalProductCard = (props) => {
    return (
        <Card style={{ display: 'flex', marginBottom: '5px' }}>
            <img
                style={{ width: 100, height: 76, marginTop: '15px' }}
                src={props.product.productId.productImage}
                title={props.product.productId.productName}
                alt={props.product.productId.productName}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <CardContent style={{ flex: '1 0 auto' }}>
                    <Typography component="h5" variant="h5">
                        {props.product.productId.productName}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.product.productId.brand}
                    </Typography>
                </CardContent>
            </div>
            <CardContent style={{ right: '10px', position: 'absolute' }}>
                <Typography variant="h6" color="textSecondary">
                     {props.product.productId.productPrice} INR x{props.product.quantity} <br/>
                     = {props.product.quantity * props.product.productId.productPrice} INR
                </Typography>
            </CardContent>
        </Card>
    )
}

export default HorizontalProductCard;