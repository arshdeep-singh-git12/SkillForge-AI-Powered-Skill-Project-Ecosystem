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
    <div className="w-full flex flex-col rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-xl relative">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language}</span>
      </div>
      
      <div className="relative flex-grow h-[400px]">
        {/* Line numbers (mock) */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 flex flex-col text-right pr-3 py-4 text-gray-400 font-mono text-sm leading-relaxed pointer-events-none select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getLanguageComment()}
          className="absolute inset-0 pl-16 pr-4 py-4 w-full h-full bg-transparent text-gray-900 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-400"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
