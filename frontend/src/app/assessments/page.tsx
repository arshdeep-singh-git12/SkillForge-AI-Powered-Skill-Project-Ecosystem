'use client';
import React, { useState } from 'react';

// Yuvraj Sharma UI Component: Coding Challenges Sandbox Workspace
function CodingSandbox() {
    const [userCode, setUserCode] = useState('# Write your Python or C++ solution here\nprint(\'SkillForge Active\')');
    const [lang, setLang] = useState('python');
    const [terminalOutput, setTerminalOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const triggerCodeExecution = async () => {
        setIsRunning(true);
        setTerminalOutput('Connecting to sandboxed execution environment...');
        try {
            // Hit our freshly configured backend assessment router endpoint
            const response = await fetch('/api/assessments/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: lang, code: userCode }),
            });
            const result = await response.json();
            
            if (result.success) {
                // Prioritize standard error output if runtime syntax breaks
                setTerminalOutput(result.stderr || result.output);
            } else {
                setTerminalOutput('Engine error: ' + result.error);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setTerminalOutput('Network fail: ' + errorMessage);
        }
        setIsRunning(false);
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#0d1117', color: '#c9d1d9', borderRadius: '12px', border: '1px solid #30363d' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#58a6ff', marginBottom: '16px' }}>Interactive Coding Environment</h2>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                <label htmlFor="lang-select" style={{ fontSize: '0.9rem', color: '#8b949e' }}>Select Language:</label>
                <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', cursor: 'pointer' }}>
                    <option value="python">Python 3</option>
                    <option value="c">C (GCC)</option>
                    <option value="cpp">C++ (G++)</option>
                </select>
            </div>

            <textarea 
                value={userCode} 
                onChange={(e) => setUserCode(e.target.value)} 
                rows={12} 
                style={{ width: '100%', fontFamily: 'Consolas, monospace', fontSize: '14px', backgroundColor: '#161b22', color: '#7ee787', padding: '14px', borderRadius: '8px', border: '1px solid #30363d', resize: 'vertical' }}
            />

            <button onClick={triggerCodeExecution} disabled={isRunning} style={{ marginTop: '14px', padding: '10px 24px', backgroundColor: '#238636', color: '#ffffff', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
                {isRunning ? 'Compiling...' : 'Run Code Tests'}
            </button>

            <div style={{ marginTop: '24px', backgroundColor: '#010409', padding: '16px', borderRadius: '8px', border: '1px solid #30363d', minHeight: '100px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#8b949e', display: 'block', borderBottom: '1px solid #21262d', paddingBottom: '6px', marginBottom: '10px' }}>Console Terminal View:</span>
                <pre style={{ color: '#f0f6fc', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: '0' }}>{terminalOutput}</pre>
            </div>
        </div>
    );
}

/**
 * Assessments Page
 */
export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Coding Assessments</h1>
        <CodingSandbox />
      </div>
    </div>
  );
}