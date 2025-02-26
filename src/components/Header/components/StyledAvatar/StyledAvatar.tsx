import { Box } from "@mui/material";
import React from "react";
import styles from "./StyledAvatar.module.scss";
import avatarImage from "../../../../images/avatar.png";

interface AvatarProps {
}

const StyledAvatar: React.FC<AvatarProps> = ({ ...avatarProps }) => {
    return (
        <Box sx={{ width: 50, height: 50, overflow: "hidden", borderRadius: "50%" }}>
            <img alt="avatar" src={avatarImage} className={styles.avatar} />
        </Box>
    );
}

export default StyledAvatar;