import { Button, ButtonProps } from "@mui/material";
import React from "react";
import colors from '../../colors/baseColors.module.scss'
import styles from "./StyledButton.module.scss";

interface StyledButtonProps {
    bgcolor?: string;
    bordercolor?: string;
    children?: string;
    buttonProps?: ButtonProps;
  }

const StyledButton: React.FC<StyledButtonProps> = ({ bgcolor, bordercolor, children, buttonProps }) => {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: bgcolor || colors.primaryColor,
          color: colors.white,
          boxShadow: 'none',
          border: `1px solid ${bordercolor || colors.primaryColor}`,
          borderRadius: '20px',
          padding: '10px 14px',
          fontSize: '16px',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: bgcolor ? `${bgcolor}CC` : 'none',
          },
        }}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  }

export default StyledButton;