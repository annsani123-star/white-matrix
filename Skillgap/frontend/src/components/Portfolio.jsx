import React from 'react';

function Portfolio() {
    const verifiedSkills = [
        { name: 'Python Optimization', date: 'Mar 2024', level: 'Expert', badge: '⚡' },
        { name: 'Neural Network Basics', date: 'Feb 2024', level: 'Intermediate', badge: '🧠' },
        { name: 'Docker Containerization', date: 'Jan 2024', level: 'Beginner', badge: '🐳' },
    ];

    return (
        <div style={{ animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Skill Portfolio</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Your verified expertise, ready for the world. 🏆</p>
            </header>

            <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '2px solid rgba(236, 72, 153, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Alex Rivera</h3>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Aspiring AI Engineer</p>
                    </div>
                    <button className="btn-primary">Export PDF 📄</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {verifiedSkills.map((skill, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justify_content: 'space-between',
                            alignItems: 'center',
                            padding: '20px',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '2rem' }}>{skill.badge}</span>
                                <div>
                                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{skill.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verified on {skill.date}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{skill.level}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: VERI-{Math.floor(Math.random() * 10000)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Total XP Earned: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>14,500</span> |
                        Industry Percentile: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Top 12%</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
