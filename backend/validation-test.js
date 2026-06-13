const http = require('http');

const BASE_URL = 'http://localhost:8080';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando pruebas de validación\n');

  const tests = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Contraseña muy corta
  console.log('Test 1: Registro con contraseña < 8 caracteres');
  const test1 = await makeRequest('POST', '/api/auth/register', {
    email: 'short@example.com',
    password: 'short',
    firstName: 'Test',
    lastName: 'User',
  });
  const test1Pass = test1.status === 400 && test1.body.errors;
  if (test1Pass) passed++; else failed++;
  console.log(`  Status: ${test1.status} (esperado: 400)`);
  console.log(`  Errors: ${test1.body.errors ? '✓ Present' : '✗ Missing'}`);
  if (test1.body.errors) {
    console.log(`  Details: ${JSON.stringify(test1.body.errors)}`);
  }
  console.log(`  Result: ${test1Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 2: Email inválido
  console.log('Test 2: Registro con email inválido');
  const test2 = await makeRequest('POST', '/api/auth/register', {
    email: 'notanemail',
    password: 'validPassword123',
    firstName: 'Test',
    lastName: 'User',
  });
  const test2Pass = test2.status === 400 && test2.body.errors;
  if (test2Pass) passed++; else failed++;
  console.log(`  Status: ${test2.status} (esperado: 400)`);
  console.log(`  Errors: ${test2.body.errors ? '✓ Present' : '✗ Missing'}`);
  if (test2.body.errors) {
    console.log(`  Details: ${JSON.stringify(test2.body.errors)}`);
  }
  console.log(`  Result: ${test2Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 3: Registro válido
  console.log('Test 3: Registro válido');
  const email = `user${Date.now()}@example.com`;
  const test3 = await makeRequest('POST', '/api/auth/register', {
    email: email,
    password: 'validPassword123',
    firstName: 'Test',
    lastName: 'User',
  });
  const test3Pass = test3.status === 200 && test3.body.token;
  if (test3Pass) passed++; else failed++;
  console.log(`  Status: ${test3.status} (esperado: 200)`);
  console.log(`  Token present: ${test3.body.token ? '✓' : '✗'}`);
  console.log(`  Result: ${test3Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 4: Login válido
  console.log('Test 4: Login válido');
  const loginResponse = await makeRequest('POST', '/api/auth/login', {
    email: email,
    password: 'validPassword123',
  });
  const test4Pass = loginResponse.status === 200 && loginResponse.body.token;
  if (test4Pass) passed++; else failed++;
  console.log(`  Status: ${loginResponse.status} (esperado: 200)`);
  console.log(`  Token present: ${loginResponse.body.token ? '✓' : '✗'}`);
  console.log(`  Result: ${test4Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  const token = loginResponse.body.token;

  // Test 5: GET /api/user/me
  console.log('Test 5: Obtener perfil actual (GET /api/user/me)');
  const test5Response = await makeRequest('GET', '/api/user/me', null, token);
  const test5Pass = test5Response.status === 200 && test5Response.body && test5Response.body.id;
  if (test5Pass) passed++; else failed++;
  console.log(`  Status: ${test5Response.status} (esperado: 200)`);
  console.log(`  User profile: ${test5Response.body && test5Response.body.id ? '✓' : '✗'}`);
  if (test5Response.body && test5Response.body.id) {
    console.log(`  Fields: email=${test5Response.body.email}, firstName=${test5Response.body.firstName}`);
  } else {
    console.log(`  Body: ${JSON.stringify(test5Response.body)}`);
  }
  console.log(`  Result: ${test5Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 6: Actualizar perfil con género inválido
  console.log('Test 6: Actualizar perfil con género inválido');
  const test6 = await new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/user/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.write(
      JSON.stringify({
        firstName: 'UpdatedName',
        lastName: 'UpdatedLast',
        gender: 'INVALID_GENDER',
      })
    );
    req.end();
  });
  const test6Pass = test6.status === 400 && test6.body.errors;
  if (test6Pass) passed++; else failed++;
  console.log(`  Status: ${test6.status} (esperado: 400)`);
  console.log(`  Errors: ${test6.body.errors ? '✓ Present' : '✗ Missing'}`);
  if (test6.body.errors) {
    console.log(`  Details: ${JSON.stringify(test6.body.errors)}`);
  }
  console.log(`  Result: ${test6Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 7: Actualizar perfil válido
  console.log('Test 7: Actualizar perfil con datos válidos');
  const test7 = await new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/user/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.write(
      JSON.stringify({
        firstName: 'UpdatedName',
        lastName: 'UpdatedLast',
        gender: 'MALE',
      })
    );
    req.end();
  });
  const test7Pass = test7.status === 200 && test7.body.firstName === 'UpdatedName';
  if (test7Pass) passed++; else failed++;
  console.log(`  Status: ${test7.status} (esperado: 200)`);
  console.log(`  Profile updated: ${test7.status === 200 ? '✓' : '✗'}`);
  if (test7.body) {
    console.log(`  New name: ${test7.body.firstName} ${test7.body.lastName}`);
  }
  console.log(`  Result: ${test7Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 8: Campo vacío en firstName
  console.log('Test 8: Actualizar perfil con firstName vacío');
  const test8 = await new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/user/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.write(
      JSON.stringify({
        firstName: '',
        lastName: 'UpdatedLast',
        gender: 'MALE',
      })
    );
    req.end();
  });
  const test8Pass = test8.status === 400 && test8.body.errors;
  if (test8Pass) passed++; else failed++;
  console.log(`  Status: ${test8.status} (esperado: 400)`);
  console.log(`  Errors: ${test8.body.errors ? '✓ Present' : '✗ Missing'}`);
  if (test8.body.errors) {
    console.log(`  Details: ${JSON.stringify(test8.body.errors)}`);
  }
  console.log(`  Result: ${test8Pass ? '✅ PASS' : '❌ FAIL'}\n`);

  // Resumen
  console.log('═'.repeat(50));
  console.log(`\n📊 RESUMEN: ${passed} ✅ PASS, ${failed} ❌ FAIL (Total: ${passed + failed})`);
  console.log(`Éxito: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Error en tests:', err);
  process.exit(1);
});
