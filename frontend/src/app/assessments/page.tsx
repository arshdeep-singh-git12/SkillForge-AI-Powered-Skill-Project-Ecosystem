'use client';

import React, { useEffect, useState } from 'react';
import { getAssessments, submitCode } from '../../services/assessment.service';
import CodeEditor from '../../components/assessments/CodeEditor';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  starterCode: string;
  points: number;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessments();
        setAssessments(data);
        if (data.length > 0) {
          handleSelect(data[0]);
        }
      } catch (error) {
        console.error('Failed to load assessments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const handleSelect = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCode(assessment.starterCode);
    setResult(null);
  };

  const handleRunCode = async () => {
    if (!selectedAssessment) return;
    
    setRunning(true);
    setResult(null);
    try {
      const res = await submitCode(selectedAssessment._id, selectedAssessment.language, code);
      setResult(res);
    } catch (error: any) {
      setResult({ success: false, message: error.response?.data?.message || 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-machined-900 text-cyan flex items-center justify-center font-mono animate-pulse">Loading Challenges...</div>;
  }

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 p-6 flex gap-6 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[150px] pointer-events-none" />

      {/* Sidebar - Challenge Selection */}
      <div className="w-1/4 bg-machined-800/80 backdrop-blur-md border border-machined-600 rounded-2xl flex flex-col overflow-hidden z-10 shadow-2xl">
        <div className="p-6 border-b border-machined-600">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-machined-100 to-machined-400">Coding Challenges</h2>
        </div>
        <div className="overflow-y-auto flex-grow p-4 space-y-3">
          {assessments.map(a => (
            <button
              key={a._id}
              onClick={() => handleSelect(a)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                selectedAssessment?._id === a._id 
                ? 'bg-cyan/10 border-cyan shadow-[0_0_15px_rgba(12,189,232,0.15)]' 
                : 'bg-machined-900 border-machined-700 hover:border-machined-500 hover:bg-machined-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-machined-100">{a.title}</span>
                <span className={`text-xs px-2 py-1 rounded font-mono ${
                  a.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  a.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {a.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-machined-400">
                <span>{a.language}</span>
                <span>{a.points} pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col gap-6 z-10 w-3/4">
        {selectedAssessment ? (
          <>
            {/* Top Bar - Problem Description */}
            <div className="bg-machined-800/80 backdrop-blur-md border border-machined-600 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-machined-100">{selectedAssessment.title}</h1>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_20px_rgba(12,189,232,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? (
                    <span className="animate-pulse">Running...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      Run Code
                    </>
                  )}
                </button>
              </div>
              <p className="text-machined-300 leading-relaxed font-sans">{selectedAssessment.description}</p>
            </div>

            {/* Split View: Editor and Results */}
            <div className="flex gap-6 flex-grow h-[450px]">
              <div className="w-2/3 flex flex-col h-full">
                <CodeEditor 
                  language={selectedAssessment.language} 
                  code={code} 
                  onChange={setCode} 
                />
              </div>

              {/* Results Panel */}
              <div className="w-1/3 bg-machined-900 border border-machined-600 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                <div className="bg-machined-800 px-4 py-3 border-b border-machined-600">
                  <span className="text-sm font-bold text-machined-100 font-mono tracking-wider">OUTPUT TERMINAL</span>
                </div>
                <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed flex-grow bg-[#0f1115]">
                  {!result && !running && (
                    <div className="text-machined-500 italic">Click "Run Code" to see your results here.</div>
                  )}
                  {running && (
                    <div className="text-cyan animate-pulse">Executing code on secure container...</div>
                  )}
                  {result && (
                    <div className="space-y-4">
                      <div className={`text-lg font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.message}
                      </div>
                      
                      {result.results && result.results.map((r: any, idx: number) => (
                        <div key={idx} className="border border-machined-700 rounded-lg overflow-hidden">
                          <div className={`px-3 py-1 text-xs font-bold ${r.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            Test Case {idx + 1}: {r.passed ? 'PASSED' : 'FAILED'}
                          </div>
                          <div className="p-3 bg-machined-900/50 space-y-2 text-xs">
                            <div><span className="text-machined-500">Input:</span> <span className="text-machined-100">{r.input || '(none)'}</span></div>
                            <div><span className="text-machined-500">Expected:</span> <span className="text-machined-100">{r.expectedOutput}</span></div>
                            <div>
                              <span className="text-machined-500">Output:</span> 
                              <span className={r.passed ? 'text-machined-100' : 'text-red-400'}> {r.actualOutput || '(no output)'}</span>
                            </div>
                            {r.stderr && <div className="text-red-400 mt-2 whitespace-pre-wrap">{r.stderr}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-machined-800/50 backdrop-blur-md border border-machined-600 rounded-2xl">
            <p className="text-machined-400 font-mono">Select a challenge from the sidebar to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
