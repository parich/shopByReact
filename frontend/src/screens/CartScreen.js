import React from "react";

export default function CartScreen(props) {
    const productId = props.match.params.id;
    const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
    return (
        <div>
            <hi>Cart Screen</hi>
            <p>Add to cart : produtID : {productId} Qty : {qty} </p>
        </div>
    );
}