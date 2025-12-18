const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to store feedback
const FEEDBACK_FILE = path.join(__dirname, 'feedback.json');

// Initialize feedback file if it doesn't exist
if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([]));
}

// Read feedback from file
const readFeedback = () => {
    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading feedback:', error);
        return [];
    }
};

// Write feedback to file
const writeFeedback = (feedback) => {
    try {
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing feedback:', error);
        return false;
    }
};

// Submit feedback endpoint
app.post('/api/feedback', (req, res) => {
    const { name, email, message, type } = req.body;

    // Validate input
    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Create feedback object
    const newFeedback = {
        id: Date.now(),
        name: name || 'Anonymous',
        email: email || '',
        message: message.trim(),
        type: type || 'general',
        timestamp: new Date().toISOString(),
        status: 'new'
    };

    // Read existing feedback
    const feedback = readFeedback();

    // Add new feedback
    feedback.push(newFeedback);

    // Save to file
    if (writeFeedback(feedback)) {
        res.json({
            success: true,
            message: 'Feedback submitted successfully!',
            id: newFeedback.id
        });
    } else {
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Get all feedback (optional - for admin purposes)
app.get('/api/feedback', (req, res) => {
    const feedback = readFeedback();
    res.json(feedback);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Feedback server running on http://localhost:${PORT}`);
});
