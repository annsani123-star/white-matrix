import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const progress = await api.fetchProgress();
                setData(progress);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 className="title-gradient">✨ Analyzing your success...</h2>
        </div>
    );

    if (!data) return (
        <div className="glass-card" style={{ color: 'var(--warning)', textAlign: 'center' }}>
            ⚠️ System sync in progress. Please wait.
        </div>
    );

    return (
        <div style={{ animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.8rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '12px', letterSpacing: '-1px' }}>
                    Welcome Back =)
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: '500' }}>
                    Ready to reach the peaks of learning? Your path is right here. ✨
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: 'var(--text-main)' }}>Current Skill Level 📈</h3>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{data.progress}%</span>
                    </div>
                    <div style={{ background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{
                            background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                            width: `${data.progress}%`,
                            height: '100%',
                            transition: 'width 1.5s ease-out'
                        }}></div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '24px', fontSize: '0.95rem' }}>
                        You've unlocked **12 new sub-skills** this month. Keep the momentum! ✨
                    </p>
                </div>

                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '20px' }}>Target Gaps 🎯</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.gaps.map((gap, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>🚩</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{gap.skill}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deficit: {gap.gap} units</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '32px', borderLeft: '4px solid var(--accent-primary)', background: 'linear-gradient(to right, #fdf2f8, #ffffff)' }}>
                <h3 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Recommended Quick Win ⚡</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Your path for **Neural Networks** is open. Take the "List Comprehension Mastery" challenge now to earn **+500 XP** and reach level 8! 🏆
                </p>
                <button className="btn-primary" style={{ marginTop: '20px' }}>
                    Claim Challenge →
                </button>
            </div>

            <footer style={{ marginTop: '60px', textAlign: 'center', opacity: 0.6 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>VERIFIED PARTNERSHIPS</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '1.5rem', filter: 'grayscale(1)' }}>
                    <span>Facebook</span>
                    <span>Google</span>
                    <span>Apple</span>
                </div>
            </footer>
        </div>
    );
}


export default Dashboard;
