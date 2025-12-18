import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isGuamLanguage, setIsGuamLanguage] = useState(false);
  const [translationOutput, setTranslationOutput] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationMode, setTranslationMode] = useState('natural');
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordExplanation, setWordExplanation] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mascotAnimating, setMascotAnimating] = useState(false);
  const [wordOfDay, setWordOfDay] = useState({
    chamoru: 'Hafa Adai',
    english: 'Hello/Welcome',
    definition: 'A traditional Chamoru greeting meaning "hello" or "welcome to our island"',
    culturalContext: 'Used daily in Guam as a warm greeting to visitors and locals alike.'
  });
  const [badges, setBadges] = useState(['Latte Explorer', 'Sea Turtle Learner']);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [unlockedBadgesCount, setUnlockedBadgesCount] = useState(2);
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general'
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleTranslate = () => {
    if (inputValue.trim()) {
      const translation = isGuamLanguage
        ? `English translation of: "${inputValue}"`
        : `Chamoru translation of: "${inputValue}"`;
      setTranslationOutput(translation);
      setShowTranslation(true);
      triggerMascotAnimation();
    }
  };

  const handleMicClick = () => {
    alert('Voice input feature coming soon!');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setWordExplanation({
      word: word,
      definition: `Definition of "${word}"`,
      partOfSpeech: 'Noun',
      example: `Example: Using "${word}" in a sentence.`,
      culturalContext: 'This word is part of Chamoru heritage.'
    });
  };

  const closeWordModal = () => {
    setSelectedWord(null);
    setWordExplanation(null);
  };

  const triggerMascotAnimation = () => {
    setMascotAnimating(true);
    setTimeout(() => setMascotAnimating(false), 1000);
  };

  const suggestCorrection = () => {
    alert('Thank you for helping us improve! Your feedback is valuable.');
    setShowFeedbackForm(false);
  };

  const unlockBadge = (badge) => {
    if (!badges.includes(badge)) {
      setBadges([...badges, badge]);
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackData.message.trim()) {
      alert('Please enter your feedback message');
      return;
    }

    setFeedbackSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackData({
          name: '',
          email: '',
          message: '',
          type: 'general'
        });
        setTimeout(() => {
          setFeedbackSuccess(false);
          setCurrentPage('home');
        }, 3000);
      } else {
        alert('Failed to submit feedback: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please make sure the server is running.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header with Language Toggle and Navigation */}
      <header className="app-header">
        <div className="header-top">
          <div className="language-toggle">
            <button
              className={`paddle-toggle ${isGuamLanguage ? 'active' : ''}`}
              onClick={() => setIsGuamLanguage(!isGuamLanguage)}
              title="Toggle Language"
            >
              <span className="paddle-red"></span>
              <span className="paddle-blue"></span>
            </button>
            <span className="language-label">
              {isGuamLanguage ? "Chamoru → English" : "English → Chamoru"}
            </span>
          </div>
          <nav className="header-nav">
            <button
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Translate
            </button>
            <button
              className={`nav-btn ${currentPage === 'learn' ? 'active' : ''}`}
              onClick={() => setCurrentPage('learn')}
            >
              Learn
            </button>
            <button
              className={`nav-btn ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => setCurrentPage('about')}
            >
              About
            </button>
            <button
              className={`nav-btn ${currentPage === 'community' ? 'active' : ''}`}
              onClick={() => setCurrentPage('community')}
            >
              Community
            </button>
            <button
              className={`nav-btn ${currentPage === 'feedback' ? 'active' : ''}`}
              onClick={() => setCurrentPage('feedback')}
            >
              Feedback
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="gradient-background"></div>

        {/* TRANSLATE PAGE */}
        {currentPage === 'home' && (
          <>
            {/* Logo Section */}
            <div className="logo-section">
              <img
                src="/images/logo.png"
                alt="Guam Logo"
                className={`logo-image-centered ${mascotAnimating ? 'animate-wave' : ''}`}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h1 className="app-title-centered">Guam AI Translator</h1>
            </div>

            {/* Translation Interface */}
            <div className="translation-container">
              {/* Input Section */}
              <div className="input-section">
                <div className="input-wrapper">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isGuamLanguage ? "Sangani hao..." : "Type or speak..."}
                    className="translation-input"
                    rows="3"
                  />
                  <button
                    onClick={handleMicClick}
                    className="mic-button"
                    title="Voice input"
                  >
                    🎤
                  </button>
                </div>
                <button
                  onClick={handleTranslate}
                  className="translate-button"
                  disabled={!inputValue.trim()}
                >
                  Translate
                </button>
              </div>

              {/* Results Panel */}
              {showTranslation && (
                <div className="results-panel">
                  {/* Translation Output */}
                  <div className="translation-output">
                    <h3 className="output-label">
                      {isGuamLanguage ? "English" : "Chamoru"}
                    </h3>
                    <div className="output-text">
                      {translationOutput.split(' ').map((word, idx) => (
                        <span
                          key={idx}
                          className="output-word"
                          onClick={() => handleWordClick(word)}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle: Literal | Natural */}
                  <div className="mode-toggle">
                    <button
                      className={`mode-btn ${translationMode === 'literal' ? 'active' : ''}`}
                      onClick={() => setTranslationMode('literal')}
                    >
                      Literal
                    </button>
                    <button
                      className={`mode-btn ${translationMode === 'natural' ? 'active' : ''}`}
                      onClick={() => setTranslationMode('natural')}
                    >
                      Natural
                    </button>
                  </div>

                  {/* Dictionary Citation */}
                  <div className="dictionary-citation">
                    <p>📚 Source: Guam Dictionary & Cultural Database</p>
                  </div>

                  {/* Feedback Button */}
                  <button
                    className="feedback-btn"
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  >
                    💬 Suggest Correction
                  </button>

                  {showFeedbackForm && (
                    <div className="feedback-form">
                      <textarea
                        placeholder="Help us improve..."
                        className="feedback-textarea"
                      />
                      <button
                        className="feedback-submit"
                        onClick={suggestCorrection}
                      >
                        Send Feedback
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* End Translation Container */}
          </>
        )}

        {/* LEARNING PAGE */}
        {currentPage === 'learn' && (
          <div className="learning-page">
            {/* Word of the Day */}
            <div className="word-of-day">
              <div className="word-of-day-mascot">
                <img
                  src="/images/logo.png"
                  alt="Mascot"
                  className="mascot-small"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="mascot-text">Word of the Day</p>
              </div>

              <div className="word-of-day-content">
                <h2 className="word-chamoru">{wordOfDay.chamoru}</h2>
                <p className="word-english">({wordOfDay.english})</p>
                <p className="word-definition">{wordOfDay.definition}</p>
                <p className="word-cultural">🏝️ {wordOfDay.culturalContext}</p>
              </div>
            </div>

            {/* Badges Section */}
            <div className="badges-section">
              <div className="badges-header">
                <h3>🏆 Your Badges</h3>
                <span className="badge-counter">{badges.length}/3 Unlocked</span>
              </div>
              <div className="badges-grid">
                {badges.map((badge, idx) => (
                  <div key={idx} className="badge">
                    {badge === 'Latte Explorer' && '🗿'}
                    {badge === 'Sea Turtle Learner' && '🐢'}
                    {badge === 'Coconut Master' && '🥥'}
                    <p>{badge}</p>
                  </div>
                ))}
                <button
                  className="badge-unlock"
                  onClick={() => {
                    unlockBadge('Coconut Master');
                    setUnlockedBadgesCount(unlockedBadgesCount + 1);
                  }}
                >
                  + Unlock
                </button>
              </div>
            </div>

            {/* Tap-to-Explain Section */}
            <div className="learning-words">
              <h3>📚 Tap Words to Learn</h3>
              <div className="learning-words-list">
                {['Guam', 'Chamoru', 'Latte', 'CHamoru'].map((word, idx) => (
                  <button
                    key={idx}
                    className="learn-word-btn"
                    onClick={() => handleWordClick(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {currentPage === 'about' && (
          <div className="about-page">
            <div className="about-hero">
              <div className="about-logo">
                <img
                  src="/images/logo.png"
                  alt="Guam Logo"
                  className="about-logo-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <h1 className="about-title">Why This Matters</h1>
              <p className="about-subtitle">A Journey to Preserve Our Heritage</p>
            </div>

            <div className="about-content">
              <div className="about-section">
                <h2 className="section-title">🏝️ My Story</h2>
                <p className="about-text">
                  I was born on Guam to a Filipino father and a Palauan mother. Growing up in this
                  beautiful intersection of Pacific cultures, I experienced firsthand what it means
                  to feel lost in translation. On an island where our indigenous Chamoru language
                  has been slowly wearing away under centuries of colonization, I watched as words,
                  stories, and traditions faded with each passing generation.
                </p>
                <p className="about-text">
                  I saw my friends struggle to speak with their grandparents. I witnessed the quiet
                  sadness in elders' eyes when young people couldn't understand the wisdom being
                  shared in our native tongue. I felt the disconnect between who we are and who
                  we're becoming.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">💙 The Mission</h2>
                <p className="about-text">
                  This Chamoru AI translator isn't just a tool—it's a bridge. A bridge between
                  generations, between cultures, between our past and our future. Every word
                  translated is a thread reconnecting us to our ancestors. Every definition learned
                  is a piece of our heritage reclaimed.
                </p>
                <p className="about-text">
                  Language is more than communication; it's identity. It carries our values, our
                  humor, our way of seeing the world. When a language dies, we don't just lose
                  words—we lose entire universes of thought, entire ways of being human.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">🌺 For Our People</h2>
                <p className="about-text">
                  This app is for every child of Guam who wants to speak to their grandparents in
                  the language of the land. It's for every parent who wants their children to know
                  where they come from. It's for every islander who carries the ocean in their
                  blood and wants to speak the language that has named these waters for millennia.
                </p>
                <p className="about-text">
                  To my fellow children of colonization—whether Chamoru, Filipino, Palauan, or any
                  of the beautiful cultures that call the Pacific home—this is for us. We can't
                  change history, but we can shape the future. We can ensure that our children's
                  children will still know the words that describe the color of the sunset over
                  Tumon Bay, the feeling of red earth beneath their feet, and the love that binds
                  our island families together.
                </p>
              </div>

              <div className="about-section">
                <h2 className="section-title">🌟 Together We Rise</h2>
                <p className="about-text">
                  Every translation you make, every word you learn, every time you share this
                  knowledge—you're part of a revolution. A peaceful, beautiful revolution where we
                  take back what was nearly lost and give it new life for generations to come.
                </p>
                <p className="about-text emphasis">
                  Hafa Adai isn't just a greeting—it's a promise. A promise that we're still here,
                  still strong, still speaking the language of our land. Let's keep that promise
                  alive together.
                </p>
                <p className="about-signature">
                  With love for our islands,<br />
                  <strong>— Maka</strong>
                </p>
              </div>

              <div className="about-cta">
                <button
                  className="cta-button"
                  onClick={() => setCurrentPage('home')}
                >
                  Start Learning 🌴
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY PAGE */}
        {currentPage === 'community' && (
          <div className="community-page">
            <div className="community-hero">
              <h1 className="community-title">🌺 Community Resources</h1>
              <p className="community-subtitle">Connect with Guam's Cultural Heritage</p>
            </div>

            <div className="community-content">
              <div className="community-intro">
                <p>
                  Our island's rich culture and language are kept alive by dedicated organizations,
                  educators, and community members. Here are valuable resources to deepen your
                  connection to Chamoru heritage.
                </p>
              </div>

              {/* Language & Education Organizations */}
              <div className="resource-category">
                <h2 className="category-title">📚 Language & Education</h2>
                <div className="resource-grid">
                  <a href="https://www.guampedia.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">📖</div>
                    <h3>Guampedia</h3>
                    <p>The Encyclopedia of Guam - comprehensive resource for history, culture, and language</p>
                    <span className="resource-link">Visit Website →</span>
                  </a>

                  <a href="https://www.guam.net/culture/chamorro-language/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🗣️</div>
                    <h3>Chamorro Language Resources</h3>
                    <p>Learn basic phrases, grammar, and pronunciation guides</p>
                    <span className="resource-link">Learn More →</span>
                  </a>

                  <a href="http://www.kumisionchamoru.guam.gov/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🏛️</div>
                    <h3>Kumision I Fino' CHamoru</h3>
                    <p>Chamorro Language Commission - official language preservation efforts</p>
                    <span className="resource-link">Explore →</span>
                  </a>
                </div>
              </div>

              {/* Cultural Heritage Organizations */}
              <div className="resource-category">
                <h2 className="category-title">🏝️ Cultural Heritage</h2>
                <div className="resource-grid">
                  <a href="https://guammuseum.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🏛️</div>
                    <h3>Guam Museum</h3>
                    <p>Senator Antonio M. Palomo Guam Museum & Chamorro Educational Facility</p>
                    <span className="resource-link">Visit Website →</span>
                  </a>

                  <a href="https://www.facebook.com/GuahanCoalition/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🌊</div>
                    <h3>Guåhan Coalition for Peace & Justice</h3>
                    <p>Advocacy for indigenous rights and cultural preservation</p>
                    <span className="resource-link">Connect →</span>
                  </a>

                  <a href="https://www.nps.gov/wapa/index.htm" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🗿</div>
                    <h3>War in the Pacific National Park</h3>
                    <p>Preserving Guam's WWII history and ancient Chamoru sites</p>
                    <span className="resource-link">Discover →</span>
                  </a>
                </div>
              </div>

              {/* Arts & Performance */}
              <div className="resource-category">
                <h2 className="category-title">🎭 Arts & Performance</h2>
                <div className="resource-grid">
                  <a href="https://www.facebook.com/InahanGuahan/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">💃</div>
                    <h3>Inetnon Gefpå'go</h3>
                    <p>Traditional Chamoru dance and cultural performances</p>
                    <span className="resource-link">Watch →</span>
                  </a>

                  <a href="https://www.guamarts.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🎨</div>
                    <h3>Guam Council on the Arts & Humanities</h3>
                    <p>Supporting local artists and cultural programs</p>
                    <span className="resource-link">Explore →</span>
                  </a>

                  <a href="https://www.facebook.com/GuamMuseumFoundation/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🎵</div>
                    <h3>Chamoru Cultural Arts</h3>
                    <p>Music, crafts, and traditional arts workshops</p>
                    <span className="resource-link">Learn More →</span>
                  </a>
                </div>
              </div>

              {/* Youth & Education Programs */}
              <div className="resource-category">
                <h2 className="category-title">👨‍👩‍👧‍👦 Youth & Community Programs</h2>
                <div className="resource-grid">
                  <a href="https://www.guamcedders.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🌱</div>
                    <h3>Guam CEDDERS</h3>
                    <p>Center for Excellence in Developmental Disabilities Education</p>
                    <span className="resource-link">Visit →</span>
                  </a>

                  <a href="https://www.facebook.com/groups/chamorrolanguage/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">👥</div>
                    <h3>Chamorro Language Learning Groups</h3>
                    <p>Community-led language learning and practice sessions</p>
                    <span className="resource-link">Join →</span>
                  </a>

                  <a href="https://www.uog.edu/" target="_blank" rel="noopener noreferrer" className="resource-card">
                    <div className="resource-icon">🎓</div>
                    <h3>University of Guam - CHamoru Studies</h3>
                    <p>Academic programs in Chamoru language and Micronesian studies</p>
                    <span className="resource-link">Learn More →</span>
                  </a>
                </div>
              </div>

              <div className="community-cta">
                <p className="cta-text">
                  Know of a resource that should be listed here? Help us grow this community!
                </p>
                <button
                  className="cta-button"
                  onClick={() => setCurrentPage('about')}
                >
                  Contact Us 💌
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK PAGE */}
        {currentPage === 'feedback' && (
          <div className="feedback-page">
            <div className="feedback-hero">
              <h1 className="feedback-title">💬 We Value Your Feedback</h1>
              <p className="feedback-subtitle">Help us improve and preserve our heritage together</p>
            </div>

            <div className="feedback-content">
              {feedbackSuccess ? (
                <div className="feedback-success">
                  <div className="success-icon">✅</div>
                  <h2>Thank You!</h2>
                  <p>Your feedback has been submitted successfully. We appreciate your contribution to improving our platform!</p>
                </div>
              ) : (
                <form className="feedback-form-container" onSubmit={submitFeedback}>
                  <div className="form-intro">
                    <p>
                      Your thoughts and suggestions help us build a better tool for preserving and
                      learning the Chamoru language. Whether it's a bug report, feature request, or
                      just sharing your experience, we'd love to hear from you!
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Name (Optional)</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={feedbackData.name}
                      onChange={handleFeedbackChange}
                      placeholder="Enter your name"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email (Optional)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={feedbackData.email}
                      onChange={handleFeedbackChange}
                      placeholder="your.email@example.com"
                      className="form-input"
                    />
                    <span className="form-helper">We'll only use this to follow up if needed</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Feedback Type</label>
                    <select
                      id="type"
                      name="type"
                      value={feedbackData.type}
                      onChange={handleFeedbackChange}
                      className="form-select"
                    >
                      <option value="general">General Feedback</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="translation">Translation Correction</option>
                      <option value="content">Content Suggestion</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={feedbackData.message}
                      onChange={handleFeedbackChange}
                      placeholder="Share your thoughts, suggestions, or concerns..."
                      className="form-textarea"
                      rows="6"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={feedbackSubmitting}
                  >
                    {feedbackSubmitting ? '✉️ Sending...' : '🌴 Submit Feedback'}
                  </button>

                  <p className="form-note">
                    * Required field. Your feedback helps us preserve and share Chamoru culture!
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Word Explanation Modal */}
      {wordExplanation && (
        <div className="modal-overlay" onClick={closeWordModal}>
          <div className="word-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeWordModal}>×</button>
            <h3 className="word-title">{wordExplanation.word}</h3>
            <p className="word-pos">
              <strong>Part of Speech:</strong> {wordExplanation.partOfSpeech}
            </p>
            <p className="word-definition">
              <strong>Definition:</strong> {wordExplanation.definition}
            </p>
            <p className="word-example">
              <strong>Example:</strong> {wordExplanation.example}
            </p>
            {wordExplanation.culturalContext && (
              <p className="word-cultural-context">
                <strong>🏝️ Cultural Context:</strong> {wordExplanation.culturalContext}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <button onClick={() => setCurrentPage('about')} className="footer-link-btn">About</button>
            <button onClick={() => setCurrentPage('community')} className="footer-link-btn">Community</button>
            <button onClick={() => setCurrentPage('feedback')} className="footer-link-btn">Feedback</button>
          </div>
          <div className="footer-motif">
            🏝️ 🌴 Guam Cultural Heritage 🌴 🏝️
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
