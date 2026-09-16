const axios = require('axios');

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

const executeCode = async (language, version, code, stdin = '') => {
  try {
    const response = await axios.post(`${PISTON_API_URL}/execute`, {
      language,
      version,
      files: [{ content: code }],
      stdin
    });
    return response.data;
  } catch (error) {
    console.error('Piston Execute Error:', error.message);
    throw new Error('Failed to execute code');
  }
};

module.exports = {
  getAvailableRuntimes,
  executeCode,
};
