const http = require('http');
const data = JSON.stringify({
  email: `debug${Date.now()}@example.com`,
  password: 'validPassword123',
  firstName: 'Debug',
  lastName: 'User',
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', body);
    try {
      console.log('parsed', JSON.parse(body));
    } catch (e) {
      console.error('parseError', e.message);
    }
  });
});

req.on('error', (err) => {
  console.error('err', err);
});
req.write(data);
req.end();
