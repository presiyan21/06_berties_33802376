const express = require('express');
const router = express.Router();

// Convert value to number or return null if invalid
function toNumberOrNull(val) {
  if (val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

// GET /api/books
router.get('/books', (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();
    const minprice = toNumberOrNull(req.query.minprice);
    const maxprice = toNumberOrNull(req.query.maxprice);
    const sort = (req.query.sort || '').trim().toLowerCase();

    let sql = 'SELECT * FROM books';
    const whereClauses = [];
    const params = [];

    // Search filter
    if (search) {
      whereClauses.push('name LIKE ?');
      params.push(`%${search}%`);
    }

    // Price filters
    if (minprice !== null) {
      whereClauses.push('price >= ?');
      params.push(minprice);
    }
    if (maxprice !== null) {
      whereClauses.push('price <= ?');
      params.push(maxprice);
    }

    // Combine WHERE clauses
    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Determine sort order 
    const allowedSort = { name: 'name', price: 'price' };
    if (allowedSort[sort]) {
      sql += ` ORDER BY ${allowedSort[sort]} ASC`;
    } else {
      sql += ' ORDER BY id ASC';
    }

    // Execute query
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('API /api/books db error:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // Price is returned as a number
      const rows = result.map(row => ({
        id: row.id,
        name: row.name,
        price: Number(row.price)
      }));

      res.json(rows);
    });
  } catch (ex) {
    next(ex); 
  }
});

module.exports = router;
