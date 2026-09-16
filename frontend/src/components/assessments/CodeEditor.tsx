import React from 'react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  const getLanguageComment = () => {
    switch (language) {
      case 'python': return '# Write your Python code below...';
      case 'c++': return '// Write your C++ code below...';
      default: return '// Write your code here...';
    }
  };

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-machined-600 bg-machined-900 shadow-xl relative">
      <div className="bg-machined-800 px-4 py-2 border-b border-machined-600 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-xs font-mono text-machined-400 uppercase tracking-widest">{language}</span>
      </div>
      
      <div className="relative flex-grow h-[400px]">
        {/* Line numbers (mock) */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-machined-800/50 border-r border-machined-700/50 flex flex-col text-right pr-2 py-4 text-machined-600 font-mono text-sm leading-relaxed pointer-events-none select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getLanguageComment()}
          className="absolute inset-0 pl-16 pr-4 py-4 w-full h-full bg-transparent text-machined-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-machined-600"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
