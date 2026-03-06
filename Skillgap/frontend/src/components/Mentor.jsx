import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

function Mentor() {
    const [messages, setMessages] = useState([
        { role: 'mentor', text: "Hello Alex! I'm your AI Career Mentor. I've analyzed your SkillGraph and I'm ready to help you reach your goals. What's on your mind today? ✨" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input) return;
        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { advice } = await api.fetchMentorAdvice();
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'mentor', text: advice + " 🎯" }]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch mentor advice", error);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'mentor', text: "I'm having a bit of trouble connecting to my knowledge base 🤖. But based on your current path, I recommend continuing with Neural Networks!" }]);
                setIsTyping(false);
            }, 1000);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>AI Career Mentor</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Get personalized advice powered by AI intelligence. 🤖</p>
            </header>

            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', padding: '40px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.7)' }} ref={scrollRef}>

                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        background: m.role === 'user' ? 'var(--accent-primary)' : '#f8fafc',
                        color: m.role === 'user' ? 'white' : 'var(--text-main)',
                        padding: '16px 20px',
                        borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        maxWidth: '75%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: m.role === 'user' ? 'none' : '1px solid var(--border-color)',
                        lineHeight: '1.5'
                    }}>
                        {m.text}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', background: '#f8fafc', color: 'var(--text-secondary)', padding: '12px 20px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                        Mentor is thinking... ✨
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        background: 'white',
                        border: '2px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    placeholder="Ask about your career roadmap..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn-primary" onClick={sendMessage} style={{ padding: '0 32px' }}>Send 🚀</button>
            </div>
        </div>
    );
}

export default Mentor;
