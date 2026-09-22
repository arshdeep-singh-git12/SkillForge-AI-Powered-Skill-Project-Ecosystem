'use client';
import React, { useState } from 'react';

export default function AssessmentRunnerPage() {
    const [userCode, setUserCode] = useState(
`def solve_two_sum(nums, target):
    # Test your solution here
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

print("Output:", solve_two_sum([2, 7, 11, 15], 9))`);
    
    const [lang, setLang] = useState('python');
    const [terminalOutput, setTerminalOutput] = useState('// System ready. Click "Run Code Tests" to execute against test suite.');
    const [isRunning, setIsRunning] = useState(false);
    const [execStats, setExecStats] = useState<{ time?: string; memory?: string; status?: string }>({});
    const [userScore, setUserScore] = useState(0);
    const [testsPassedCount, setTestsPassedCount] = useState(0);

    const triggerCodeExecution = async () => {
        setIsRunning(true);
        setTerminalOutput('Executing sandbox container runner...');
        setExecStats({});
        
        const startTime = performance.now();

        // Simulate secure Piston API / backend execution response
        setTimeout(() => {
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(0);

            // Optimistic simulation result
            const isSuccess = userCode.includes('solve_two_sum') || userCode.includes('print');
            
            if (isSuccess) {
                setTerminalOutput(`[stdout] Output: [0, 1]\n[info] Process exited with code 0.\n[success] All 4 assertions passed successfully.`);
                setExecStats({
                    time: `${duration} ms`,
                    memory: '12.4 MB',
                    status: 'PASSED'
                });
                setUserScore(150);
                setTestsPassedCount(4);
            } else {
                setTerminalOutput(`[stderr] SyntaxError: invalid syntax or unhandled exception.`);
                setExecStats({
                    time: `${duration} ms`,
                    memory: 'N/A',
                    status: 'FAILED'
                });
                setUserScore(0);
                setTestsPassedCount(1);
            }
            setIsRunning(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#15181d] text-[#eaedf0] bg-grid-pattern p-4 md:p-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            
            {/* Top Navigation & Score Telemetry Bar */}
            <header className="card flex flex-wrap items-center justify-between py-4 px-6 gap-4 border border-[#2d333b]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#0cbde8] animate-pulse" />
                <span className="font-mono text-xs font-bold text-[#0cbde8]">SKILLFORGE // INTERACTIVE CODING ENVIRONMENT</span>
              </div>

              {/* Graphical Score & Points Counter */}
              <div className="flex items-center gap-6 font-mono text-xs">
                <div className="flex items-center gap-2 bg-[#15181d] px-3 py-1.5 rounded border border-[#2d333b]">
                  <span className="text-[#7a889b]">SCORE:</span>
                  <span className="text-[#0cbde8] font-bold text-sm">{userScore} PTS</span>
                </div>
                <div className="flex items-center gap-2 bg-[#15181d] px-3 py-1.5 rounded border border-[#2d333b]">
                  <span className="text-[#7a889b]">TEST SUITE:</span>
                  <span className={testsPassedCount === 4 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {testsPassedCount} / 4 PASSED
                  </span>
                </div>
              </div>
            </header>

            {/* Graphical Progress Bar Section */}
            <div className="card space-y-3 py-4 border border-[#2d333b]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#7a889b] uppercase">Task Completion Progress</span>
                <span className="text-[#0cbde8]">{Math.round((testsPassedCount / 4) * 100)}% COMPLETED</span>
              </div>
              <div className="w-full bg-[#15181d] h-3 rounded-full overflow-hidden border border-[#2d333b] p-0.5">
                <div 
                  className="bg-gradient-to-r from-[#0cbde8] to-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(testsPassedCount / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Main Workspace */}
            <div className="card space-y-4 border border-[#2d333b]">
              <div className="flex flex-wrap items-center justify-between border-b border-[#2d333b] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0cbde8]" />
                  <span className="font-mono text-xs text-[#eaedf0] uppercase font-bold">Interactive Coding Environment</span>
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="lang-select" className="font-mono text-[11px] text-[#7a889b] uppercase">Select Language:</label>
                  <select
                    id="lang-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-[#15181d] border border-[#2d333b] text-[#eaedf0] py-1 px-2.5 text-xs font-mono rounded"
                  >
                    <option value="python">Python 3</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>

              {/* Code Editor */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={10}
                className="w-full bg-[#15181d] border border-[#2d333b] rounded p-4 font-mono text-xs text-[#0cbde8] leading-relaxed resize-y focus:outline-none focus:border-[#0cbde8]"
              />

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between pt-1 gap-4">
                <button
                  onClick={triggerCodeExecution}
                  disabled={isRunning}
                  className="px-6 py-2.5 rounded bg-gradient-to-r from-[#0cbde8] to-blue-600 text-[#111418] font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isRunning ? 'Running Tests...' : 'Run Code Tests'}
                </button>

                {execStats.status && (
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#7a889b]">Time: <strong className="text-[#eaedf0]">{execStats.time}</strong></span>
                    <span className="text-[#7a889b]">Memory: <strong className="text-[#eaedf0]">{execStats.memory}</strong></span>
                    <span className={`px-2.5 py-1 rounded font-bold ${execStats.status === 'PASSED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                      {execStats.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Terminal View */}
              <div className="bg-[#15181d] border border-[#2d333b] rounded p-4 font-mono text-xs space-y-2 mt-4">
                <div className="text-[#7a889b] border-b border-[#2d333b] pb-2 font-bold">
                  Console Terminal View:
                </div>
                <pre className="text-[#eaedf0] whitespace-pre-wrap min-h-[60px] overflow-x-auto">
                  {terminalOutput}
                </pre>
              </div>
            </div>

          </div>
        </div>
    );
}