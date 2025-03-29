import React, { useState } from "react";
import UploadImage from "../components/UploadImage";
import { Box, Switch, Typography } from "@mui/material";

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <Box sx={{ bgcolor: darkMode ? "#121212" : "#E6E6FA", minHeight: "100vh", transition: "background-color 0.3s ease" }}>
            {/* Dark Mode Toggle */}
            <Box display="flex" alignItems="center" justifyContent="center" padding={2}>
                <Typography sx={{ color: darkMode ? "#FFF" : "#6A0DAD", fontWeight: "bold" }}>Dark Mode</Typography>
                <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="secondary" />
            </Box>

            {/* Image Upload Component */}
            <UploadImage />
        </Box>
    );
};

export default Home;
