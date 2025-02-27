
import React from 'react';
import { cx } from '@emotion/css';
import styles from './Badge.module.scss';

interface BadgeProps {
    content: string | React.ReactNode;
    onClick: () => void;
    isSelected?: boolean;
}

const Badge = ({ content, onClick, isSelected }: BadgeProps) => {
    return (
        <button
            onClick={onClick}
            className={cx(styles.badgeButton, { [styles.active]: !!isSelected })}
        >
            {content}
        </button>
    )
}

export default Badge