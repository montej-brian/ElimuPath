const axios = require('axios');

async function runTest() {
  try {
    console.log('1. Submitting Manual Grade Entry...');
    // Create a mock submission
    const postRes = await axios.post('http://localhost:3000/api/results/manual', {
      subjects: {
        'MAT': 'B+',
        'ENG': 'A',
        'KIS': 'B',
        'BIO': 'A-',
        'CHEM': 'B+',
        'PHY': 'B',
        'HIST': 'A'
      },
      meanGrade: 'B+',
      meanPoints: 10.2,
      aggregatePoints: 74
    }, {
      headers: {
        'x-session-id': 'test-session-123'
      }
    });

    const resultId = postRes.data.data.id;
    console.log(`Success! Result ID generated: ${resultId}`);

    console.log('\n2. Fetching Mapped Matches Array (GET /matches)...');
    const matchRes = await axios.get(`http://localhost:3000/api/matches/${resultId}/matches?limit=3`);
    console.log(JSON.stringify(matchRes.data.data, null, 2));

    console.log('\n3. Fetching Raw Mathematical Points (GET /points)...');
    const pointRes = await axios.get(`http://localhost:3000/api/matches/${resultId}/points`);
    console.log(JSON.stringify(pointRes.data, null, 2));

  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

runTest();
