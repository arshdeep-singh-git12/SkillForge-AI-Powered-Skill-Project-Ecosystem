'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    // Check if we should show the fullscreen prompt
    const hasSeenPrompt = sessionStorage.getItem('hasSeenFullscreenPrompt');
    if (!hasSeenPrompt && !document.fullscreenElement) {
      // Small delay to ensure render is complete before popup
      setTimeout(() => setShowFullscreenPrompt(true), 1000);
    }
  }, []);

  const handleFullscreenOk = () => {
    sessionStorage.setItem('hasSeenFullscreenPrompt', 'true');
    setShowFullscreenPrompt(false);
    if (!document.fullscreenElement) {
      arenaRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  const handleFullscreenSkip = () => {
    sessionStorage.setItem('hasSeenFullscreenPrompt', 'true');
    setShowFullscreenPrompt(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      arenaRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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

  const [activeLanguage, setActiveLanguage] = useState<string>('python');

  const getStarterCode = (lang: string) => {
    switch (lang) {
      case 'python': return 'def solve():\n    pass';
      case 'java': return 'class Solution {\n    public void solve() {\n        \n    }\n}';
      case 'c++': return 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};';
      case 'javascript': return 'function solve() {\n    \n}';
      default: return '// Write your code here';
    }
  };

  const handleSelect = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setActiveLanguage(assessment.language);
    setCode(assessment.starterCode);
    setResult(null);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setActiveLanguage(newLang);
    setCode(getStarterCode(newLang));
  };

  const handlePreviousQuestion = () => {
    if (!selectedAssessment) return;
    const currentIndex = assessments.findIndex(a => a._id === selectedAssessment._id);
    if (currentIndex > 0) {
      handleSelect(assessments[currentIndex - 1]);
      setShowSuccessModal(false);
    } else {
      // Loop to end
      if (assessments.length > 0) {
        handleSelect(assessments[assessments.length - 1]);
      }
      setShowSuccessModal(false);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedAssessment) return;
    const currentIndex = assessments.findIndex(a => a._id === selectedAssessment._id);
    if (currentIndex !== -1 && currentIndex < assessments.length - 1) {
      handleSelect(assessments[currentIndex + 1]);
      setShowSuccessModal(false);
    } else {
      // Loop back to start or just clear
      if (assessments.length > 0) {
        handleSelect(assessments[0]);
      } else {
        setSelectedAssessment(null);
      }
      setShowSuccessModal(false);
    }
  };

  const handleRunCode = async () => {
    if (!selectedAssessment) return;

    setRunning(true);
    setResult(null);
    try {
      const res = await submitCode(selectedAssessment._id, activeLanguage, code);
      setResult(res);
      if (res.success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setResult({ success: false, message: error.response?.data?.message || 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center font-sans bg-[#020204]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0cbde8] border-t-transparent animate-spin mb-4"></div>
        <div className="eyebrow">Initializing Arena...</div>
      </div>
    );
  }

  return (
    <div ref={arenaRef} className={`flex flex-col bg-[#020204] text-gray-300 font-sans p-4 gap-4 overflow-hidden ${isFullscreen ? 'h-full w-full' : 'h-[calc(100vh-4rem)]'}`}>
      {/* Top Navbar */}
      <div className="card px-6 py-3 flex items-center justify-between flex-shrink-0 flex-row">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-[#0cbde8]/10 flex items-center justify-center text-[#0cbde8]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide">SkillForge Arena</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Live Execution Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={running}
            className="btn-secondary"
          >
            {running ? 'Compiling...' : 'Run Code'}
          </button>
          <button
            onClick={handleRunCode}
            disabled={running}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Submit Solution
          </button>
          <div className="h-6 w-px bg-[#2d333b] mx-1"></div>
          <button
            onClick={handlePreviousQuestion}
            className="px-4 py-2 bg-[#232830] hover:bg-[#2d333b] text-white font-semibold rounded-md transition-colors flex items-center gap-2 border border-[#3d444d]"
            title="Previous Mission"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-[#232830] hover:bg-[#2d333b] text-white font-semibold rounded-md transition-colors flex items-center gap-2 border border-[#3d444d]"
            title="Next Mission"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <div className="h-6 w-px bg-[#2d333b] mx-1"></div>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#232830] hover:bg-[#2d333b] text-white font-semibold rounded-md transition-colors flex items-center border border-[#3d444d]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-grow min-h-0">
        {/* Left Panel: Description */}
        <div className="w-full md:w-[40%] card flex flex-col overflow-hidden p-0">
          <div className="flex gap-6 px-6 py-4 border-b border-[#2d333b] bg-[#161821] text-xs font-semibold uppercase tracking-wider">
            <button className="text-[#0cbde8] border-b-2 border-[#0cbde8] pb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Mission Brief
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow prose prose-invert prose-sm max-w-none">
            {!selectedAssessment ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-[#2d333b] pb-2">Available Missions</h2>
                {assessments.map(a => (
                  <div key={a._id} onClick={() => handleSelect(a)} className="cursor-pointer hover:bg-[#232830] p-4 rounded-md border border-transparent hover:border-[#2d333b] transition-all flex justify-between items-center group">
                    <span className="text-gray-300 group-hover:text-white font-medium">{a.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm ${a.difficulty === 'easy' ? 'text-[#0cbde8] bg-[#0cbde8]/10' :
                        a.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>{a.difficulty}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-white m-0 p-0 leading-tight">{selectedAssessment.title}</h1>
                  <span className="text-xs text-[#0cbde8] font-bold uppercase tracking-wider bg-[#0cbde8]/10 px-3 py-1 rounded-sm">
                    {selectedAssessment.points} XP
                  </span>
                </div>

                <div className="flex gap-2 mb-8 text-xs font-mono">
                  <span className={`px-2.5 py-1 rounded-sm font-semibold uppercase ${selectedAssessment.difficulty === 'easy' ? 'text-green-400 bg-green-400/10 border border-green-400/20' :
                      selectedAssessment.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'
                    }`}>
                    {selectedAssessment.difficulty}
                  </span>
                  <span className="px-2.5 py-1 rounded-sm bg-[#232830] text-gray-300 border border-[#2d333b]">
                    Algorithms
                  </span>
                </div>

                <div
                  className="text-sm text-[#eaedf0] mb-8 prose prose-invert prose-sm max-w-none prose-pre:bg-[#15181d] prose-pre:border prose-pre:border-[#2d333b]"
                  dangerouslySetInnerHTML={{ __html: selectedAssessment.description }}
                />

                <button onClick={() => setSelectedAssessment(null)} className="text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-[#0cbde8] transition-colors mt-8 flex items-center gap-2">
                  <span>&larr;</span> Return to Missions
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Panel: Editor & Console */}
        <div className="w-full md:w-[60%] flex flex-col gap-4 min-w-0 h-full">
          {/* Editor Area */}
          <div className="card flex-grow flex flex-col overflow-hidden p-0 relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161821] border-b border-[#2d333b]">
              <div className="flex items-center gap-3">
                <select
                  value={activeLanguage}
                  onChange={handleLanguageChange}
                  className="bg-[#15181d] border border-[#2d333b] text-[#eaedf0] text-xs font-mono px-3 py-1.5 rounded-sm focus:outline-none focus:border-[#0cbde8]"
                >
                  <option value="python">Python 3</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                  <option value="javascript">Node.js</option>
                </select>
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Editor</div>
            </div>

            <div className="flex-grow">
              <CodeEditor
                language={activeLanguage}
                code={code}
                onChange={setCode}
              />
            </div>
          </div>

          {/* Console Area */}
          <div className="card h-[35%] flex flex-col flex-shrink-0 p-0">
            <div className="flex items-center gap-6 px-6 py-3 border-b border-[#2d333b] text-xs font-semibold uppercase tracking-wider bg-[#161821]">
              <button className="text-gray-500 flex items-center gap-2">
                Telemetry
              </button>
              <button className="text-[#0cbde8] border-b-2 border-[#0cbde8] pb-1 flex items-center gap-2">
                <span className="text-[#0cbde8] font-mono">{'>_'}</span>
                Execution Results
              </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto font-mono text-sm">
              {!result && !running && (
                <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                  System standing by for code execution...
                </div>
              )}
              {running && (
                <div className="text-[#0cbde8] flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#0cbde8] border-t-transparent rounded-full animate-spin"></div>
                  Analyzing outputs...
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div className={`text-lg font-bold tracking-wide uppercase ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? '[ SUCCESS: All Tests Passed ]' : '[ FAILED: Wrong Answer ]'}
                  </div>

                  {(!result.results || result.results.length === 0) && result.message && (
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-sm text-red-300 whitespace-pre-wrap font-mono text-xs">
                      {result.message}
                    </div>
                  )}

                  {result.results && result.results.map((r: any, idx: number) => (
                    <div key={idx} className="space-y-2 bg-[#15181d] border border-[#2d333b] p-4 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Case {idx + 1}</span>
                        {r.passed ? (
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 uppercase">Passed</span>
                        ) : (
                          <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 uppercase">Failed</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Input</div>
                          <div className="bg-[#1c2026] border border-[#2d333b] px-3 py-2 rounded-sm text-[#eaedf0] break-all">{r.input || '(none)'}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Expected</div>
                            <div className="bg-[#1c2026] border border-[#2d333b] px-3 py-2 rounded-sm text-[#eaedf0] break-all">{r.expectedOutput}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Actual</div>
                            <div className={`border px-3 py-2 rounded-sm break-all ${r.passed ? 'bg-[#1c2026] border-[#2d333b] text-[#eaedf0]' : 'bg-red-900/20 border-red-500/30 text-red-200'}`}>
                              {r.actualOutput || '(no output)'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {r.stderr && (
                        <div className="mt-4">
                          <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Runtime Error</div>
                          <div className="bg-red-900/20 border border-red-500/30 px-3 py-2 rounded-sm text-red-300 whitespace-pre-wrap">{r.stderr}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#15181d] border border-[#2d333b] rounded-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-500">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0cbde8]/20 via-transparent to-purple-500/20 opacity-50"></div>
            
            <div className="relative">
              <div className="text-6xl mb-6 animate-bounce" style={{ animationDuration: '1.5s' }}>
                🏆
              </div>
              <div className="absolute inset-0 bg-[#0cbde8] blur-xl opacity-20 rounded-full animate-pulse"></div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Challenge Passed!</h3>
            <p className="text-gray-400 text-sm mb-6 relative z-10">
              Outstanding work! You've earned the <strong>{selectedAssessment?.title}</strong> trophy and boosted your skill radar!
            </p>

            <button
              onClick={handleNextQuestion}
              className="btn-primary w-full relative z-10 hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Next Mission
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Prompt Modal */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#15181d] border border-[#2d333b] rounded-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0cbde8]/10 via-transparent to-transparent opacity-50"></div>
            
            <div className="relative mb-6">
              <svg className="w-16 h-16 text-[#0cbde8] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Maximize Focus</h3>
            <p className="text-gray-400 text-sm mb-8 relative z-10">
              The SkillForge Arena is best experienced in fullscreen mode. Would you like to enter fullscreen now?
            </p>

            <div className="flex gap-3 w-full relative z-10">
              <button
                onClick={handleFullscreenSkip}
                className="flex-1 py-2 px-4 rounded-md font-semibold text-gray-300 bg-[#232830] hover:bg-[#2d333b] transition-colors border border-[#3d444d]"
              >
                Skip
              </button>
              <button
                onClick={handleFullscreenOk}
                className="flex-1 btn-primary"
              >
                Enter Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
