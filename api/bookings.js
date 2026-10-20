const db = require('./db');

module.exports = async (req, res) => {
  // Mengizinkan CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { ticket_code, hotel_name, city, final_price, check_in_out } = req.body;
      
      if (!ticket_code || !hotel_name || !final_price) {
        return res.status(400).json({ error: 'Data pesanan tidak lengkap!' });
      }

      await db.query(
        'INSERT INTO bookings (ticket_code, hotel_name, city, final_price, check_in_out) VALUES (?, ?, ?, ?, ?)',
        [ticket_code, hotel_name, city, final_price, check_in_out || '21/10/2026 - 23/10/2026']
      );
      
      return res.status(201).json({ message: 'Pesanan berhasil disimpan ke MariaDB!' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
