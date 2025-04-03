const { spawn } = require('child_process');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Route to handle document generation
app.post('/generate-document', (req, res) => {
    const { sections, blueprint, format } = req.body;
    
    // Spawn Python process
    const pythonProcess = spawn('python', [
        'questionPaperGenerator.py',
        JSON.stringify(sections),
        JSON.stringify(blueprint),
        format
    ]);

    let outputPath = '';

    pythonProcess.stdout.on('data', (data) => {
        outputPath = data.toString().trim();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0 && outputPath) {
            res.json({ success: true, filePath: outputPath });
        } else {
            res.status(500).json({ success: false, error: 'Failed to generate document' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});