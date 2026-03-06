import React from 'react';

function SkillGraph() {
    const nodes = [
        { name: 'AI Engineer 🚀', color: 'var(--accent-primary)', x: 300, y: 200, r: 50 },
        { name: 'Python 🐍', color: '#3776ab', x: 150, y: 100, r: 35 },
        { name: 'Neural Nets 🧠', color: '#ff6b6b', x: 450, y: 100, r: 35 },
        { name: 'MLOps ⚙️', color: '#4ecdc4', x: 300, y: 350, r: 35 },
        { name: 'Mathematics 🔢', color: '#f7d794', x: 100, y: 250, r: 30 },
    ];

    const edges = [
        { x1: 150, y1: 100, x2: 260, y2: 170 }, // Python -> AI Eng
        { x1: 450, y1: 100, x2: 340, y2: 170 }, // Neural -> AI Eng
        { x1: 300, y1: 350, x2: 300, y2: 250 }, // MLOps -> AI Eng
        { x1: 100, y1: 250, x2: 140, y2: 130 }, // Math -> Python (dependency)
    ];

    return (
        <div style={{ animation: 'modal-slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Interactive Skill Graph</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Visualize your path to mastery. ✨</p>
            </header>

            <div className="glass-card" style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                <svg width="600" height="450" style={{ cursor: 'grab' }}>
                    {/* Edges */}
                    {edges.map((e, i) => (
                        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    ))}

                    {/* Nodes */}
                    {nodes.map((n, i) => (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} style={{ opacity: 0.9, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" pointerEvents="none">
                                {n.name}
                            </text>
                        </g>
                    ))}
                </svg>

                <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                        <span>Career Goal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                        <span>Required Skill</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillGraph;
