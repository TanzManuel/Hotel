const db = require('./db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM hotels ORDER BY id ASC');
      return res.status(200).json(rows);
    }
    if (req.method === 'PUT') {
      const { id, price } = req.body;
      await db.query('UPDATE hotels SET price = ? WHERE id = ?', [price, id]);
      return res.status(200).json({ message: 'Harga berhasil diperbarui!' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
