import { Box, Button, ButtonProps, Icon, IconButton, InputBase, Paper, SvgIcon, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import colors from '../../../../colors/baseColors.module.scss'
import styles from "./SearchBar.module.scss";
import { css, cx } from "@emotion/css";
import { searchIcon } from "../../../../icons";

interface SearchBarProps {
    textFieldProps?: TextFieldProps;
}

const SearchBar: React.FC<SearchBarProps> = ({ textFieldProps }) => {
    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 468, borderRadius: 36, border: `1px solid ${colors.borderColor}`, boxShadow: "none" }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, padding: "8px 20px" }}
                placeholder="Поиск бренда, товара, категории..."
                inputProps={{ 'aria-label': 'Поиск бренда, товара, категории...' }}
            />
            <Box>
                <IconButton color="primary" aria-label="directions">
                    <Icon >
                        <Box sx={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                        <img src={searchIcon} />
                        </Box>
                    </Icon>
                </IconButton>
            </Box>
        </Paper>
    );
}

export default SearchBar;