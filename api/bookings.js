const db = require('./db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { ticket_code, hotel_name, city, final_price, check_in_out } = req.body;
      await db.query(
        'INSERT INTO bookings (ticket_code, hotel_name, city, final_price, check_in_out) VALUES (?, ?, ?, ?, ?)',
        [ticket_code, hotel_name, city, final_price, check_in_out]
      );
      return res.status(201).json({ message: 'Pesanan tersimpan!' });
    }
    if (req.method === 'DELETE') {
      await db.query('TRUNCATE TABLE bookings');
      return res.status(200).json({ message: 'Semua pesanan direset!' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
