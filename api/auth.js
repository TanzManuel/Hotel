const db = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { action, name, email, password } = req.body;

    // 1. REGISTER (Daftar Akun Baru)
    if (action === 'register') {
      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email sudah terdaftar! Silakan langsung login.' });
      }
      await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
      return res.status(201).json({ message: 'Registrasi berhasil!', user: { name, email } });
    }

    // 2. LOGIN (Masuk Akun)
    if (action === 'login') {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Email atau password salah, atau akun belum terdaftar!' });
      }
      return res.status(200).json({ message: 'Login berhasil', user: { name: rows[0].name, email: rows[0].email } });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
