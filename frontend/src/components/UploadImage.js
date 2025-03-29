import { useState } from "react";
import axios from "axios";
import { AiOutlineUpload } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { Box, Button, Card, CardContent, CircularProgress, Typography, Switch, Container } from "@mui/material";
import { motion } from "framer-motion";

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/images/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.predictions && response.data.predictions.length > 0) {
                setPredictions(response.data.predictions);
                toast.success("Image classified successfully!");
            } else {
                setPredictions([]);
                toast.error("No classification results found.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth={false} sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: darkMode ? "#121212" : "#E6E6FA", transition: "background-color 0.3s ease", padding: 2, flexGrow: 1 }}>
            <Toaster position="top-center" reverseOrder={false} />

            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} position="fixed" top={0} left={0} right={0} zIndex={1000} bgcolor={darkMode ? "#121212" : "#E6E6FA"}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? "#FFF" : "#000" }}>
                    ClassifAI
                </Typography>
                <Box display="flex" alignItems="center">
                    <Typography sx={{ color: darkMode ? "#FFF" : "#000", fontWeight: "bold", mr: 1 }}>Dark Mode</Typography>
                    <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="secondary" />
                </Box>
            </Box>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ marginTop: "100px", width: "100%", display: "flex", justifyContent: "center" }}>
                <Card sx={{ width: "90%", maxWidth: 600, padding: 4, textAlign: "center", boxShadow: 5, borderRadius: 3, bgcolor: darkMode ? "#1E1E1E" : "#F8F9FA", transition: "background-color 0.3s ease" }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: darkMode ? "#FFF" : "#6A0DAD" }}>
                            Upload & Classify Image
                        </Typography>

                        {imagePreview && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                                <Box component="img" src={imagePreview} alt="Preview" sx={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: 2, mb: 2 }} />
                            </motion.div>
                        )}

                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="upload-input" />
                        <label htmlFor="upload-input" style={{ cursor: "pointer" }}>
                            <Button variant="contained" component="span" sx={{ mb: 2, bgcolor: "#8E44AD", "&:hover": { bgcolor: "#6A0DAD" }, color: "#FFF" }}>
                                <AiOutlineUpload size={20} style={{ marginRight: 5 }} /> Choose Image
                            </Button>
                        </label>

                        <Button variant="contained" onClick={handleUpload} disabled={loading} sx={{ width: "100%", bgcolor: "#6A0DAD", "&:hover": { bgcolor: "#4A0A8A" }, color: "#FFF" }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Upload & Classify"}
                        </Button>

                        {predictions.length > 0 && (
                            <Box mt={3} sx={{ textAlign: "center" }}>
                                <Typography variant="h6" sx={{ color: darkMode ? "#FFF" : "#6A0DAD" }}>
                                    Classification Result:
                                </Typography>
                                <Box sx={{ backgroundColor: darkMode ? "#222" : "#FFF", padding: 2, borderRadius: 2, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)", maxHeight: "200px", overflowY: "auto" }}>
                                    {predictions.map((item, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} style={{ fontSize: "1rem", padding: "8px 0", fontWeight: "bold", color: darkMode ? "#E0E0E0" : "#333" }}>
                                            {index + 1}. {item.label} - {item.confidence.toFixed(2)}%
                                        </motion.div>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default UploadImage;
