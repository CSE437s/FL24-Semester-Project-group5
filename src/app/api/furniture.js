const express = require('express');
const router = express.Router();
const pool = require('../../../db'); 

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  try {
    const query = user_id
      ? `SELECT fl.*, bu.rating 
    FROM public."furniture_listing" fl 
    JOIN public."business_user" bu 
    ON bu.user_id = fl."user_id"
    WHERE fl."user_id" = $1;`
      : `SELECT fl.*, bu.rating 
    FROM public."furniture_listing" fl 
    JOIN public."business_user" bu 
    ON bu.user_id = fl."user_id";`;
    const result = await pool.query(query, user_id ? [user_id]: []);

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
  console.log("two")
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT fl.*, bu.rating, u.name
       FROM public."furniture_listing" fl 
       JOIN public."business_user" bu ON bu.user_id = fl."user_id" 
       JOIN public."User" u on u.id = fl."user_id"
       WHERE fl.id = $1`, [id] 
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Furniture item not found' });
    }

    const furniture = {
      ...result.rows[0],
      pics: result.rows[0].pics.map(pic => `data:image/jpeg;base64,${Buffer.from(pic).toString('base64')}`),
      
    };

    res.json(furniture); 
  } catch (err) {
    console.error(`Error fetching furniture item:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/check-or-add-user', async (req, res) => {
  const { user_id } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM public."business_user" WHERE user_id = $1', [user_id]);

    if (userCheck.rows.length === 0) {
      const insertUser = await pool.query(
        'INSERT INTO public."business_user" (user_id, rating) VALUES ($1, $2) RETURNING *',
        [user_id, 5] 
      );

      if (insertUser.rows.length === 0) {
        return res.status(500).json({ error: 'Failed to insert user into business_user table' });
      }
      return res.status(201).json({ message: 'User added successfully', user: insertUser.rows[0] });
    }

    return res.status(200).json({ message: 'User already exists', user: userCheck.rows[0] });
  } catch (error) {
    console.error('Error checking or adding user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload', async (req, res) => {
  try {

    const { price, description, condition, pics, user_id, location, colors } = req.body;

    const bufferPics = pics ? pics.map(pic => Buffer.from(pic, 'base64')) : [];

    const colorsArray = colors ? JSON.stringify(colors) : null; 

    const result = await pool.query(
      `INSERT INTO furniture_listing (user_id, price, description, condition, pics, colors, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        user_id,
        price,
        description,
        condition,
        bufferPics,
        colorsArray,
        location
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving furniture listing:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message }); 
    }
    res.status(500).json({ error: 'Internal server error' }); 
  }
});


router.post('/check-or-add-user', async (req, res) => {
  const { user_id } = req.body;
console.log(user_id);
  try {
    const userCheck = await pool.query('SELECT * FROM public."business_user" WHERE user_id = $1', [user_id]);

    if (userCheck.rows.length === 0) {
      // If the user doesn't exist, insert them into the business_user table
      const insertUser = await pool.query(
        'INSERT INTO public."business_user" (user_id, rating) VALUES ($1, $2) RETURNING *',
        [user_id, 5]  // Default rating of 5
      );

      if (insertUser.rows.length === 0) {
        return res.status(500).json({ error: 'Failed to insert user into business_user table' });
      }
      return res.status(201).json({ message: 'User added successfully', user: insertUser.rows[0] });
    }

    return res.status(200).json({ message: 'User already exists', user: userCheck.rows[0] });
  } catch (error) {
    console.error('Error checking or adding user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { price, description, condition, colors, location } = req.body;

  try {
    const colorsArray = colors ? JSON.stringify(colors) : null;

    const result = await pool.query(
      `UPDATE public."furniture_listing"
       SET price = $1, description = $2, condition = $3, colors = $4, location = $5
       WHERE id = $6 RETURNING *`,
      [price, description, condition, colorsArray, location, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router; 