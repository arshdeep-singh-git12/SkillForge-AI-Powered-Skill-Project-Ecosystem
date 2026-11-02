import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (_code: string) => void;
}

export default function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  // Map our language strings to Monaco's expected language IDs
  const getMonacoLanguage = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'c++') return 'cpp';
    if (l === 'js') return 'javascript';
    if (l === 'java') return 'java';
    return l;
  };

  return (
    <div data-no-invert="true" className="w-full flex flex-col h-full overflow-hidden bg-[#1e1e1e] relative border border-[#2d333b] rounded-md shadow-sm">
      <div className="flex-grow relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}
