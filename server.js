const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3001;
const OLLAMA_API = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
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

// Translation endpoint using Ollama
app.post('/api/translate', async (req, res) => {
    const { text, sourceLanguage, targetLanguage, mode } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const isToGuam = targetLanguage === 'chamoru';
        const translationMode = mode || 'natural';

        // Create prompt for Ollama
        const prompt = `You are an expert translator specializing in Chamoru (Guam) and English languages. 
Translate the following ${sourceLanguage} text to ${targetLanguage}.

${translationMode === 'literal'
                ? 'Provide a LITERAL word-for-word translation that maintains grammatical structure.'
                : 'Provide a NATURAL, culturally appropriate translation that sounds fluent in the target language.'}

Text to translate: "${text}"

Respond ONLY with the translation, no explanations or additional text.`;

        // Call Ollama API
        const response = await axios.post(OLLAMA_API, {
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false
        }, {
            timeout: 30000 // 30 second timeout
        });

        const translation = response.data.response.trim();

        res.json({
            success: true,
            translation: translation,
            mode: translationMode,
            sourceLanguage: sourceLanguage,
            targetLanguage: targetLanguage
        });

    } catch (error) {
        console.error('Translation error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Ollama is not running. Please start Ollama first.',
                details: 'Run "ollama serve" in your terminal'
            });
        }

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                error: `Ollama model "${OLLAMA_MODEL}" not found.`,
                details: `Pull it with: ollama pull ${OLLAMA_MODEL}`
            });
        }

        res.status(500).json({
            error: 'Translation failed',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Feedback server running on http://localhost:${PORT}`);
    console.log(`Translation API ready at http://localhost:${PORT}/api/translate`);
});
