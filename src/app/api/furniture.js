const express = require('express');
const router = express.Router();
const pool = require('../../../db'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT fl.*, bu.rating from public."furniture_listing" fl join public."business_user" bu on bu.user_id = fl."user-id";');
    res.json(result.rows); 
  } catch (err) {
    console.error('Error fetching furniture data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT fl.*, bu.rating 
       FROM public."furniture_listing" fl 
       JOIN public."business_user" bu ON bu.user_id = fl."user-id" 
       WHERE fl.id = 1`
    );    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Furniture item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching furniture item:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router; 


