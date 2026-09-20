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
    return <div className="h-full w-full flex items-center justify-center font-sans text-gray-500 animate-pulse">Loading Challenges...</div>;
  }

  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 h-full relative">
      {/* Sidebar - Challenge Selection */}
      <div className="w-full md:w-1/3 lg:w-1/4 interior-panel flex flex-col overflow-hidden h-[calc(100vh-6rem)]">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl interior-heading">Coding Challenges</h2>
        </div>
        <div className="overflow-y-auto flex-grow p-4 space-y-3">
          {assessments.map(a => (
            <button
              key={a._id}
              onClick={() => handleSelect(a)}
              className={`w-full text-left p-4 rounded-[16px] border transition-all duration-300 ${
                selectedAssessment?._id === a._id 
                ? 'bg-gray-100 border-gray-300 shadow-sm' 
                : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-900">{a.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  a.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  a.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {a.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans text-gray-500">
                <span>{a.language}</span>
                <span className="font-bold bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">{a.points} pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col gap-6 w-full md:w-2/3 lg:w-3/4 h-[calc(100vh-6rem)]">
        {selectedAssessment ? (
          <>
            {/* Top Bar - Problem Description */}
            <div className="interior-panel p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl interior-heading">{selectedAssessment.title}</h1>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="interior-pill interior-pill-active shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? (
                    <span className="animate-pulse">Running...</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      Run Code
                    </>
                  )}
                </button>
              </div>
              <p className="interior-text leading-relaxed text-sm">{selectedAssessment.description}</p>
            </div>

            {/* Split View: Editor and Results */}
            <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
              <div className="w-full lg:w-2/3 flex flex-col h-full interior-panel overflow-hidden">
                <CodeEditor 
                  language={selectedAssessment.language} 
                  code={code} 
                  onChange={setCode} 
                />
              </div>

              {/* Results Panel */}
              <div className="w-full lg:w-1/3 interior-panel flex flex-col overflow-hidden bg-gray-50">
                <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 tracking-wider">Output</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md">Terminal</span>
                </div>
                <div className="p-5 overflow-y-auto font-mono text-sm leading-relaxed flex-grow">
                  {!result && !running && (
                    <div className="text-gray-400 italic text-center mt-10">Click &quot;Run Code&quot; to see results</div>
                  )}
                  {running && (
                    <div className="text-cyan font-bold animate-pulse text-center mt-10">Executing...</div>
                  )}
                  {result && (
                    <div className="space-y-4">
                      <div className={`text-lg font-bold pb-2 border-b border-gray-200 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.message}
                      </div>
                      
                      {result.results && result.results.map((r: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-[12px] overflow-hidden shadow-sm">
                          <div className={`px-4 py-2 text-xs font-bold ${r.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            Test Case {idx + 1}: {r.passed ? 'PASSED' : 'FAILED'}
                          </div>
                          <div className="p-4 space-y-3 text-xs bg-white text-gray-700">
                            <div><span className="text-gray-400 font-semibold block mb-1">Input:</span> <span className="bg-gray-100 px-2 py-1 rounded">{r.input || '(none)'}</span></div>
                            <div><span className="text-gray-400 font-semibold block mb-1">Expected:</span> <span className="bg-gray-100 px-2 py-1 rounded">{r.expectedOutput}</span></div>
                            <div>
                              <span className="text-gray-400 font-semibold block mb-1">Output:</span> 
                              <span className={`px-2 py-1 rounded ${r.passed ? 'bg-gray-100' : 'bg-red-100 text-red-800 font-bold'}`}> {r.actualOutput || '(no output)'}</span>
                            </div>
                            {r.stderr && <div className="text-red-600 mt-3 p-2 bg-red-50 rounded border border-red-100 whitespace-pre-wrap">{r.stderr}</div>}
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
          <div className="flex-grow flex items-center justify-center interior-panel border-dashed border-2 border-gray-200">
            <p className="interior-text font-medium">Select a challenge from the sidebar to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
