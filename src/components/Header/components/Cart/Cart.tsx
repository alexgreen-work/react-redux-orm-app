import { Avatar, Box, Button, ButtonProps, Icon, IconButton, InputBase, Paper, SvgIcon, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import colors from '../../../../colors/baseColors.module.scss'
import styles from "./Cart.module.scss";
import { cartIcon, searchIcon } from "../../../../icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Link } from "react-router-dom";

interface CartProps {

}

const Cart: React.FC<CartProps> = ({ ...avatarProps }) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    return (
        <Link to="/cart">
            <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "50%", border: `1px solid ${colors.darkBorderColor}` }}>
                <img alt="avatar" src={cartIcon} className={styles.cart} />
                <Box className={styles.cart__length}>{cartItems.length}</Box>
            </Box></Link>
    );
}

export default Cart;