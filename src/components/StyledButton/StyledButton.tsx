import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import colors from '../../colors/baseColors.module.scss';
import styles from './StyledButton.module.scss';

interface StyledButtonProps {
  bgcolor?: string;
  bordercolor?: string;
  color?: string;
  children?: any;
}

const StyledButton: React.FC<StyledButtonProps & ButtonProps> = ({
  bgcolor,
  bordercolor,
  children,
  color,
  ...buttonProps
}) => {
  return (
    <Button
      variant="contained"
      sx={{
        textTransform: 'none',
        backgroundColor: bgcolor || colors.primaryColor,
        color: color ? color : colors.white,
        boxShadow: 'none',
        border: `1px solid ${bordercolor || colors.primaryColor}`,
        borderRadius: '20px',
        padding: '8px 24px',
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
};

export default StyledButton;
