# Guam AI Chatbot 🏝️

A cultural preservation platform dedicated to translating, learning, and celebrating the Chamoru language and heritage of Guam.

## About

This project was born from a personal mission to preserve the Chamoru language in the face of colonization's impact on Guam's indigenous culture. As someone born on Guam to a Filipino father and Palauan mother, I understand the "lost in translation" feeling that many Pacific Islanders experience. This tool aims to bridge that gap and keep our languages alive for future generations.

## Features

- **Translation Interface**: Translate between English and Chamoru with literal and natural modes
- **Learning Mode**: Interactive word-of-the-day, gamified badge system, and tap-to-learn functionality
- **Cultural Resources**: Curated links to Guam's cultural, heritage, and language organizations
- **Community Feedback**: Share suggestions and corrections to improve the platform
- **About Page**: Learn about the mission and story behind this project

## Tech Stack

- **Frontend**: React 19.2.3
- **Backend**: Node.js with Express
- **Styling**: Pure CSS with Guam Flag color palette
- **Storage**: File-based JSON (feedback.json)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/guam-ai-chatbot.git
cd guam-ai-chatbot
```

2. Install dependencies

```bash
npm install
```

3. Start the frontend

```bash
npm start
```

4. Start the backend server (in a separate terminal)

```bash
node server.js
```

The app will run on `http://localhost:3000` and the backend on `http://localhost:3001`.

## Project Structure

```
guam-ai-chatbot/
├── public/
│   ├── images/
│   │   └── logo.png
│   └── index.html
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Styling with Guam cultural aesthetic
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── server.js           # Express backend for feedback
├── feedback.json       # Feedback storage (auto-generated)
├── package.json
└── README.md
```

## Cultural Colors

The design uses the colors of the Guam flag:

- Deep Blue (#002147) - Ocean and sky
- Bright Red (#c8102e) - Courage and resilience
- Brown (#8b5e3c) - Connection to land
- Light Blue (#5dadec) - Tropical waters
- Beige (#f4e2d8) - Sandy shores

## Contributing

Feedback and contributions are welcome! This is a community project aimed at cultural preservation. Please feel free to:

- Submit translation corrections
- Suggest new features
- Report bugs
- Share cultural resources

## Mission

To preserve and celebrate the Chamoru language and culture, ensuring that future generations can connect with their heritage despite the erosive effects of colonization.

## License

MIT

## Acknowledgments

Thank you to all the cultural organizations, educators, and community members working tirelessly to preserve Guam's indigenous heritage.

---

**Si Yu'os Ma'åse'** (Thank You) 🌴
