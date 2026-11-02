const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

const getAvailableRuntimes = async () => {
  try {
    const response = await axios.get(`${PISTON_API_URL}/runtimes`);
    return response.data;
  } catch (error) {
    console.error('Piston API Error:', error.message);
    throw new Error('Failed to fetch runtimes');
  }
};

const executeCode = (language, version, code, stdin = '') => {
  return new Promise((resolve, reject) => {
    try {
      // Local execution fallback for Python to bypass 401 API limits
      if (language === 'python' || language === 'py') {
        // Write code to a temp file because passing massive code strings via -c can fail on Windows
        const tmpFile = path.join(os.tmpdir(), `execute_${Date.now()}.py`);
        fs.writeFileSync(tmpFile, code);

        const child = spawn('python', [tmpFile]);
        
        let stdout = '';
        let stderr = '';

        if (stdin) {
          child.stdin.write(stdin);
          child.stdin.end();
        }

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code) => {
          // Cleanup
          try { fs.unlinkSync(tmpFile); } catch(e){}
          
          resolve({
            run: {
              stdout,
              stderr,
              code
            }
          });
        });
        
        child.on('error', (err) => {
          try { fs.unlinkSync(tmpFile); } catch(e){}
          reject(new Error('Failed to spawn python process: ' + err.message));
        });
      } else {
        // If they still try to run something else, use API (which might 401)
        axios.post(`${PISTON_API_URL}/execute`, {
          language,
          version,
          files: [{ content: code }],
          stdin
        }).then(response => {
          resolve(response.data);
        }).catch(err => {
          reject(new Error(err.response?.data?.message || err.message));
        });
      }
    } catch (error) {
      console.error('Execute Error:', error.message);
      reject(new Error('Failed to execute code'));
    }
  });
};

module.exports = {
  getAvailableRuntimes,
  executeCode,
};
