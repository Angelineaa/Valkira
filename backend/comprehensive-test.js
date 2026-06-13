const http = require('http');

function makeRequest(method, path, data, token = null) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : undefined;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body);
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
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
    console.log('=== Complete Auth & Profile Flow Tests ===\n');

    const email = 'profiletest' + Date.now() + '@example.com';

    // Test 1: Register
    console.log('✅ TEST 1: Register new user');
    const registerRes = await makeRequest('POST', '/api/auth/register', {
      email,
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    console.log(`   Status: ${registerRes.status} (expected 200)`);
    if (registerRes.status !== 200) throw new Error('Register failed');
    console.log(`   ✓ User registered\n`);

    // Test 2: Try to register same email (should get 409 CONFLICT)
    console.log('✅ TEST 2: Try to register duplicate email (should fail with 409)');
    const duplicateRes = await makeRequest('POST', '/api/auth/register', {
      email,
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
    });
    console.log(`   Status: ${duplicateRes.status} (expected 409)`);
    console.log(`   Error: ${duplicateRes.body.error}`);
    if (duplicateRes.status !== 409) throw new Error('Should return 409 for duplicate email');
    console.log(`   ✓ Correctly rejected duplicate email\n`);

    // Test 3: Login
    console.log('✅ TEST 3: Login with correct credentials');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email,
      password: 'password123',
    });
    console.log(`   Status: ${loginRes.status} (expected 200)`);
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Login failed');
    const token = loginRes.body.token;
    console.log(`   ✓ Login successful, token received\n`);

    // Test 4: Try login with wrong password (should get 401)
    console.log('✅ TEST 4: Try to login with wrong password (should fail with 401)');
    const wrongPassRes = await makeRequest('POST', '/api/auth/login', {
      email,
      password: 'wrongpassword',
    });
    console.log(`   Status: ${wrongPassRes.status} (expected 401)`);
    console.log(`   Error: ${wrongPassRes.body.error}`);
    if (wrongPassRes.status !== 401) throw new Error('Should return 401 for wrong password');
    console.log(`   ✓ Correctly rejected wrong password\n`);

    // Test 5: Get current user
    console.log('✅ TEST 5: Get current user profile');
    const meRes = await makeRequest('GET', '/api/user/me', null, token);
    console.log(`   Status: ${meRes.status} (expected 200)`);
    console.log(`   User: ${meRes.body.firstName} ${meRes.body.lastName} (${meRes.body.email})`);
    if (meRes.status !== 200) throw new Error('Failed to get user');
    console.log(`   ✓ Profile retrieved\n`);

    // Test 6: Update profile
    console.log('✅ TEST 6: Update user profile');
    const updateRes = await makeRequest('PUT', '/api/user/profile', {
      firstName: 'Jonathan',
      lastName: 'Smith',
      gender: 'M',
      profilePhoto: 'https://example.com/photo.jpg',
    }, token);
    console.log(`   Status: ${updateRes.status} (expected 200)`);
    console.log(`   Updated: ${updateRes.body.firstName} ${updateRes.body.lastName}`);
    if (updateRes.status !== 200) throw new Error('Failed to update profile');
    console.log(`   ✓ Profile updated\n`);

    // Test 7: Verify update
    console.log('✅ TEST 7: Verify profile update');
    const meRes2 = await makeRequest('GET', '/api/user/me', null, token);
    console.log(`   Status: ${meRes2.status}`);
    console.log(`   Verified: ${meRes2.body.firstName} ${meRes2.body.lastName}`);
    if (meRes2.body.firstName !== 'Jonathan') throw new Error('Profile not updated');
    console.log(`   ✓ Profile update verified\n`);

    // Test 8: Access protected endpoint without token (should fail)
    console.log('✅ TEST 8: Try to access /api/user/me without token (should fail)');
    const noTokenRes = await makeRequest('GET', '/api/user/me', null, null);
    console.log(`   Status: ${noTokenRes.status} (expected 401 or 403)`);
    if (noTokenRes.status < 400 || noTokenRes.status >= 500) throw new Error('Should reject request without token');
    console.log(`   ✓ Correctly rejected request without token\n`);

    console.log('✅ ALL TESTS PASSED! 🎉\n');
    console.log('Summary:');
    console.log('  ✓ Registration working');
    console.log('  ✓ Duplicate email validation (409 CONFLICT)');
    console.log('  ✓ Login flow with JWT');
    console.log('  ✓ Invalid credentials rejection (401 UNAUTHORIZED)');
    console.log('  ✓ Protected endpoints working');
    console.log('  ✓ Profile update working');
    console.log('  ✓ Error handling with proper HTTP status codes');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

runTests();
