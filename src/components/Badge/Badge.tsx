
import React from 'react';
import { cx } from '@emotion/css';
import styles from './Badge.module.scss';
import colors from '../../colors/baseColors.module.scss';
import { ColorsById } from './types';

interface BadgeProps {
    content: string | React.ReactNode;
    colorId?: number;
    onClick?: () => void;
    isSelected?: boolean;
}

const Badge = ({ content, onClick, isSelected, colorId = 0 }: BadgeProps) => {
    const colorsById: ColorsById = {
        0: colors.primaryColor,
        1: colors.pink,
        2: colors.secondaryColor,
        3: colors.orange,
        4: colors.pink,
        5: colors.secondaryColor,
        6: colors.secondaryColor,
    };

    return (
        <button
            onClick={onClick}
            className={cx(styles.badgeButton, { [styles.active]: !!isSelected })}
            style={{
                borderColor: colorsById[colorId] || colors.primaryColor,
                background: isSelected ? colorsById[colorId] || colors.primaryColor : undefined,
            }}
        >
            {content}
        </button>
    )
}

export default Badge