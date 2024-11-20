const express = require('express');
const router = express.Router();
const pool = require('../../../db'); 
const { buffer } = require('stream/consumers');



// Endpoint to fetch all apartments
router.get('/', async (req, res) => {
  const { user_id } = req.query;

  try {
    const query =  await pool.query(`SELECT fl.*, 
       bu.rating, 
       '{}'::bytea[] AS pics
FROM public."apartment_listing" fl
JOIN public."business_user" bu
  ON bu.user_id = fl."user_id"
LEFT JOIN public."ApartmentImage" fi
  ON fi."ApartmentListingId" = fl.id
WHERE fi."imageData" IS NULL
GROUP BY fl.id, bu.rating
UNION 
SELECT fl.*, 
       bu.rating, 
       ARRAY_AGG(fi."imageData") AS pics
FROM public."apartment_listing" fl
JOIN public."business_user" bu
  ON bu.user_id = fl."user_id"
JOIN public."ApartmentImage" fi
  ON fi."ApartmentListingId" = fl.id
GROUP BY fl.id, bu.rating;
`,[user_id]);

const result = await pool.query(query);

const apartments = result.rows.map(apartment => {
 
  return {
    ...apartment,
    pics: apartment.pics.map(pic => {
      return `data:image/jpeg;base64,${Buffer.from(pic[0]).toString('base64')}`; 
    }),
  };
});
    
    res.json(apartments); 
  } catch (err) {
    console.error('Error fetching apartment data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch a specific apartment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    const result = await pool.query(
      `SELECT fl.*, 
       bu.rating, 
       '{}'::bytea[] AS pics, u.name
FROM public."apartment_listing" fl
JOIN public."business_user" bu
  ON bu.user_id = fl."user_id"
LEFT JOIN public."ApartmentImage" fi
  ON fi."ApartmentListingId" = fl.id
JOIN public."User" u on u.id = fl."user_id"
WHERE fi."imageData" IS NULL AND fl.id = $1
GROUP BY fl.id, bu.rating,u.name
UNION 
SELECT fl.*, 
       bu.rating, 
       ARRAY_AGG(fi."imageData") AS pics, u.name
FROM public."apartment_listing" fl
JOIN public."business_user" bu
  ON bu.user_id = fl."user_id"
JOIN public."ApartmentImage" fi
  ON fi."ApartmentListingId" = fl.id
 JOIN public."User" u on u.id = fl."user_id"
 WHERE fl.id = $1
GROUP BY fl.id, bu.rating,u.name;`, [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing item not found' });
    }

    const apartment = {
      ...result.rows[0],
      pics: result.rows[0].pics.map(pic => `data:image/jpeg;base64,${Buffer.from(pic).toString('base64')}`),
      
    };
    
    res.json(apartment);
  } catch (err) {
    console.error(`Error fetching listing item:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload', async (req, res) => {
  try {


    const { price, location, amenities, description, availability, policies, pics, bedrooms, bathrooms, user_id } = req.body;
    console.log(pics);
    // Ensure pics are processed correctly
    const bufferPics = pics ? pics.map(pic => Buffer.from(pic, 'base64')) : [];
    console.log("Buffer size:", bufferPics);
    const result = await pool.query(
      `INSERT INTO apartment_listing (user_id, price, location, amenities, description, availability, policies, pics, bedrooms, bathrooms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id,
        price,
        location,
        amenities,
        description,
        availability,
        policies,
        bufferPics,
        bedrooms,
        bathrooms,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving listing:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message }); // Validation error
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, price, location, availability, bedrooms, bathrooms, amenities, policies, pics } = req.body;
  const bufferPics = pics ? pics.map(pic => Buffer.from(pic, 'base64')) : [];

  try {
    const result = await pool.query(
      `UPDATE public."apartment_listing"
       SET description = $1, price = $2, location = $3, availability = $4, 
           bedrooms = $5, bathrooms = $6, amenities = $7, policies = $8, pics = $9
       WHERE id = $10 RETURNING *`,
      [description, price, location, availability, bedrooms, bathrooms, amenities, policies, bufferPics, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Apartment listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating apartment listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
  
    const result = await pool.query('DELETE FROM public."apartment_listing" WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length) {
      res.json({ message: 'Listing deleted successfully' });
    } else {
      res.status(404).json({ error: 'Listing not found' });
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
