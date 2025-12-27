
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../ChatBot.css';
import { GoogleGenAI } from '@google/genai';
import { X } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


function ChatBot() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Gemini. How can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date();
    const userMessage = { sender: 'user', text: input, time: now };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
      });
      const botText = response?.text || 'Sorry, I could not understand.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botText, time: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to Gemini API.', time: new Date() }]);
    }
    setLoading(false);
  };

  // Chat bot icon SVG
  const chatIcon = (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="url(#paint0_linear_1_2)"/>
      <path d="M12 15C12 13.3431 13.3431 12 15 12H23C24.6569 12 26 13.3431 26 15V23C26 24.6569 24.6569 26 23 26H15C13.3431 26 12 24.6569 12 23V15Z" fill="white"/>
      <circle cx="16" cy="19" r="1.5" fill="#8C57FF"/>
      <circle cx="19" cy="19" r="1.5" fill="#8C57FF"/>
      <circle cx="22" cy="19" r="1.5" fill="#8C57FF"/>
      <defs>
        <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C57FF"/>
          <stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <>
      {/* Floating chat icon button */}
      {!open && (
        <button
          className="chatbot-float-btn"
          onClick={() => setOpen(true)}
          aria-label="Open chat bot"
        >
          {chatIcon}
        </button>
      )}
      {/* Chat bot UI */}
      {open && (
        <div className={`chatbot-popup chatbot-animate-in${expanded ? ' expanded' : ''}`}>
          <div className="chatbot-header">
            <span>Gemini ChatBot</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                className="chatbot-expand-btn"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? 'Collapse chat bot' : 'Expand chat bot'}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {/* Custom expand/collapse icon SVG */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="6" height="2" rx="1" fill="currentColor"/>
                  <rect x="3" y="3" width="2" height="6" rx="1" fill="currentColor"/>
                  <rect x="13" y="3" width="6" height="2" rx="1" fill="currentColor"/>
                  <rect x="17" y="3" width="2" height="6" rx="1" fill="currentColor"/>
                  <rect x="3" y="17" width="6" height="2" rx="1" fill="currentColor"/>
                  <rect x="3" y="13" width="2" height="6" rx="1" fill="currentColor"/>
                  <rect x="13" y="17" width="6" height="2" rx="1" fill="currentColor"/>
                  <rect x="17" y="13" width="2" height="6" rx="1" fill="currentColor"/>
                </svg>
              </button>
              <button className="chatbot-close-btn" onClick={() => setOpen(false)} aria-label="Close chat bot">
                <X size={22} />
              </button>
            </div>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}> 
                <div className="chatbot-bubble">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  <div className="chatbot-time">{msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble chatbot-loader">
                  <span className="loader-typing">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" className="chatbot-send-btn" disabled={loading || !input.trim()}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
