import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Roadmap() {
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const data = await api.fetchRoadmap('AI Engineer');
                setPhases(data);
            } catch (error) {
                console.error("Failed to load roadmap", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, []);

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 className="title-gradient">🏗️ Engineering your career path...</h2>
        </div>
    );

    return (
        <div style={{ animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Learning Roadmap</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Your step-by-step guide to AI mastery. 🗺️</p>
            </header>


            <div style={{ position: 'relative', paddingLeft: '40px' }}>
                {/* Timeline Line */}
                <div style={{
                    position: 'absolute',
                    left: '19px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), #e2e8f0)'
                }}></div>

                {phases.map((phase, idx) => (
                    <div key={idx} style={{ marginBottom: '48px', position: 'relative' }}>
                        {/* Timeline Dot */}
                        <div style={{
                            position: 'absolute',
                            left: '-29px',
                            top: '0',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'white',
                            border: '4px solid var(--accent-primary)',
                            zIndex: 1
                        }}></div>

                        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ color: 'var(--text-main)', fontWeight: '700' }}>Phase {idx + 1}: {phase.phase} 🚩</h3>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>{idx === 0 ? 'Current' : 'Upcoming'}</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {phase.skills.map((skill, sIdx) => (
                                    <div key={sIdx} style={{
                                        padding: '8px 16px',
                                        background: '#f1f5f9',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <span>🔹</span> {skill}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View Resources 📚</button>
                                <button style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Take Assessment 📝</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Roadmap;
