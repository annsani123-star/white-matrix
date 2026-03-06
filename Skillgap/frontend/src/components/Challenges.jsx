import React, { useState } from 'react';
import { useModal } from './ModalContext';

function Challenges() {
    const { openModal } = useModal();

    const mockChallenges = [
        { id: 1, title: 'Python Optimization ⚡', skill: 'Python', difficulty: 'Intermediate', xp: 500 },
        { id: 2, title: 'Neural Net Architecture 🧠', skill: 'Neural Networks', difficulty: 'Hard', xp: 1200 },
        { id: 3, title: 'Docker Mastery 🐳', skill: 'MLOps', difficulty: 'Beginner', xp: 300 },
    ];

    const handleStartChallenge = (challenge) => {
        openModal(<ChallengeModal challenge={challenge} />);
    };

    return (
        <div style={{ animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Skill Challenges</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Level up your skills with interactive tasks. ⚡</p>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                {mockChallenges.map((c) => (
                    <div key={c.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: 'var(--accent-primary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{c.difficulty}</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>+{c.xp} XP</span>
                            </div>
                            <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>{c.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Level up your **{c.skill}** through this interactive assessment.</p>
                        </div>
                        <button className="btn-primary" style={{ marginTop: '24px', width: '100%' }} onClick={() => handleStartChallenge(c)}>
                            Launch Challenge 🚀
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChallengeModal({ challenge }) {
    const [solved, setSolved] = useState(false);
    const { closeModal } = useModal();

    return (
        <div style={{ textAlign: 'center' }}>
            <h2 className="title-gradient" style={{ marginBottom: '16px' }}>{challenge.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Complete this task to verify your expertise in **{challenge.skill}**.
            </p>

            {!solved ? (
                <div style={{ textAlign: 'left' }}>
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                        <p style={{ marginBottom: '12px', fontWeight: '500' }}>Task Outline:</p>
                        <code style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                            # Optimize this loop into a list comprehension<br />
                            result = []<br />
                            for i in range(100):<br />
                            &nbsp;&nbsp;if i % 5 == 0: result.append(i * 2)
                        </code>
                    </div>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => setSolved(true)}>
                        Verify Solution 🔍
                    </button>
                </div>
            ) : (
                <div style={{ animation: 'modal-slide-up 0.3s ease-out' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                    <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>Challenge Mastered!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>You've earned **+{challenge.xp} XP** and strengthened your portfolio.</p>
                    <button className="btn-primary" style={{ marginTop: '24px', width: '100%' }} onClick={closeModal}>
                        Awesome! 🏆
                    </button>
                </div>
            )}
        </div>
    );
}

export default Challenges;
