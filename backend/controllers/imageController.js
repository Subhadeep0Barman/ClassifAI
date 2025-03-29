const path = require("path");
const { spawn } = require("child_process");

// Function to handle image uploads and classification
const classifyUploadedImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded!" });
    }

    const imagePath = path.join(__dirname, "../uploads", req.file.filename);
    const pythonProcess = spawn("python", [
        path.join(__dirname, "../ml/classify.py"),
        imagePath,
    ]);

    let resultData = "";

    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(resultData.replace(/'/g, '"'));
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: "Error parsing classification result." });
            }
        } else {
            res.status(500).json({ error: "Classification process failed." });
        }
    });
};

module.exports = { classifyUploadedImage };
