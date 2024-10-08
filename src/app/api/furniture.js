const express = require('express');
const router = express.Router();
const pool = require('../../../db'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT fl.*, bu.rating from public."furniture_listing" fl join public."business_user" bu on bu.user_id = fl."user_id";');

    const furnitures = result.rows.map(furniture => ({
      ...furniture,
      pics: furniture.pics.map(pic => `data:image/jpeg;base64,${Buffer.from(pic).toString('base64')}`),
    }));

    res.json(furnitures); 
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
       JOIN public."business_user" bu ON bu.user_id = fl."user_id" 
       WHERE fl.id = ${id}`
    );    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Furniture item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching furniture item:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload', async (req, res) => {
  try {
    // Destructure the incoming request body
    const { price, description, condition, pics, user_id, colors } = req.body;

    // Ensure pics are processed correctly
    const bufferPics = pics ? pics.map(pic => Buffer.from(pic, 'base64')) : [];

    // Convert colors array to JSON string for PostgreSQL
    const colorsArray = colors ? JSON.stringify(colors) : null; // Use null if colors is not provided

    // Insert the new furniture listing into the database
    const result = await pool.query(
      `INSERT INTO furniture_listing (user_id, price, description, condition, pics, colors)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        user_id,
        price,
        description,
        condition,
        bufferPics,
        colorsArray // Pass as JSON string
      ]
    );

    // Respond with the created listing
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving furniture listing:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message }); // Handle validation errors
    }
    res.status(500).json({ error: 'Internal server error' }); // Handle general errors
  }
});

module.exports = router; 