const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Image classification route
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = path.join(__dirname, "..", req.file.path);
    const pythonProcess = spawn("python", ["ml/classify.py", imagePath]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Classification failed" });
        }

        // Extract only valid classification results
        const predictions = result
            .split("\n")
            .map((line) => line.trim()) // Remove whitespace
            .filter((line) => /^\d+\.\s\S+/.test(line)) // Ensure proper format like "1. label - confidence%"
            .map((line) => {
                const parts = line.split("-");
                return {
                    label: parts[0].replace(/^\d+\.\s*/, "").trim(), // Remove index number
                    confidence: parts[1] ? parseFloat(parts[1].replace("%", "").trim()) : null,
                };
            });

        return res.json({
            message: "Classification successful",
            predictions,
        });
    });
});

module.exports = router;
