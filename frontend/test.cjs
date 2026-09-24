const axios = require('axios');

async function test() {
  try {
    let token = '';
    try {
      const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
        username: 'admin',
        password: 'password'
      });
      token = loginRes.data.token;
    } catch (e) {
      console.log("Login failed", e.response?.status);
      const regRes = await axios.post('http://localhost:8080/api/auth/register', {
        username: 'admin2',
        password: 'password',
        email: 'admin2@example.com',
        role: 'STAFF'
      });
      const loginRes2 = await axios.post('http://localhost:8080/api/auth/login', {
        username: 'admin2',
        password: 'password'
      });
      token = loginRes2.data.token;
    }

    const res = await axios.post('http://localhost:8080/api/items', {
      title: 'Test',
      name: 'Test',
      description: 'Test description',
      location: 'Test location',
      contactInfo: 'Test contact',
      status: 'LOST'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error status:", err.response?.status);
    console.log("Error data:", err.response?.data);
  }
}

test();
