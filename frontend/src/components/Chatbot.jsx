import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'assistant', content: 'Welcome to BidVerse Premium. How may I assist you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [conversation, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:6001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation: conversation.slice(1).map(msg => ({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content })) // exclude initial greeting for tokens saving, or keep it, Groq can handle it. Let's send the latest msgs.
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setConversation(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setConversation(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error connecting to the concierge.' }]);
      }
    } catch (error) {
      setConversation(prev => [...prev, { role: 'assistant', content: 'I apologize, but the connection was lost. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-glass-card border border-glass-border rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-gold p-4 flex justify-between items-center text-bg-deep">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-display font-bold">BidVerse Concierge</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-bg-deep/20 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gold/20 border border-gold/30 text-text-primary rounded-tr-none'
                        : 'bg-bg-deep border border-glass-border text-text-secondary rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-deep border border-glass-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-gold animate-spin" />
                    <span className="text-xs text-text-muted">Concierge is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-glass-border bg-bg-deep/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[#111111] border border-[#1F1F1F] rounded-xl py-2 px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-gold/30 focus:shadow-[0_0_0_2px_rgba(250,204,21,0.06)] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="btn-gold p-2 md:px-3 md:py-2 flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold transition-transform hover:scale-105 hover:shadow-gold-lg"
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-bg-deep" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Bot className="w-6 h-6 text-bg-deep" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default Chatbot;
