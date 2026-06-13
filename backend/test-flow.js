const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : undefined;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    const options = {
      hostname: 'localhost',
      port: 8080,
      path,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let respBody = '';
      res.on('data', (chunk) => {
        respBody += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = respBody ? JSON.parse(respBody) : null;
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: respBody });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  try {
    console.log('=== Testing Auth Flow ===\n');

    // Test 1: Register
    const email = 'testuser' + Date.now() + '@example.com';
    console.log('1. Registering user:', email);
    const registerRes = await makeRequest('POST', '/api/auth/register', {
      email,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
    console.log('   Status:', registerRes.status);
    console.log('   Response:', JSON.stringify(registerRes.body, null, 2));

    if (registerRes.status !== 200) {
      console.log('ERROR: Registration failed');
      process.exit(1);
    }

    // Test 2: Login
    console.log('\n2. Logging in with:', email);
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email,
      password: 'password123',
    });
    console.log('   Status:', loginRes.status);
    console.log('   Response:', JSON.stringify(loginRes.body, null, 2));

    if (loginRes.status !== 200 || !loginRes.body.token) {
      console.log('ERROR: Login failed or no token received');
      process.exit(1);
    }

    const token = loginRes.body.token;

    // Test 3: Access protected endpoint
    console.log('\n3. Accessing /api/user/me with token');
    const meHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/user/me',
      method: 'GET',
      headers: meHeaders,
    };

    const meRes = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let respBody = '';
        res.on('data', (chunk) => {
          respBody += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(respBody);
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, body: respBody });
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });

    console.log('   Status:', meRes.status);
    console.log('   Response:', JSON.stringify(meRes.body, null, 2));

    if (meRes.status !== 200) {
      console.log('ERROR: Failed to access protected endpoint');
      process.exit(1);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

runTests();
