const http = require('http');
const user = { email: 'newuser' + Date.now() + '@example.com', password: 'password123', firstName: 'New', lastName: 'User' };
function request(path, data, callback) {
  const body = JSON.stringify(data);
  const options = {
    hostname: 'localhost',
    port: 8080,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };
  const req = http.request(options, (res) => {
    let resp = '';
    res.on('data', chunk => resp += chunk);
    res.on('end', () => callback(res.statusCode, resp));
  });
  req.on('error', err => console.error('error', err));
  req.write(body);
  req.end();
}
request('/api/auth/register', user, (status, body) => {
  console.log('register', status, body);
  request('/api/auth/login', { email: user.email, password: user.password }, (status2, body2) => {
    console.log('login', status2, body2);
  });
});
