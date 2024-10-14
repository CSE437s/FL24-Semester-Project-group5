const express = require('express');
const router = express.Router();
const pool = require('../../../db'); 

router.get('/', async (req, res) => {
    const { id } = req.params;
    try{
        const conversations = await pool.query(`
            SELECT id
            FROM conversations
            WHERE user1_id = $1 OR user2_id = $1;
          `, [id]);
      
          if (conversations.rowCount === 0) {
            return res.status(200).json({ message: 'No conversations found' });
          }
        //   checking if messages exists for a user
          const result = await pool.query(`
            SELECT m.*,
              sender.username AS sender_username, 
              receiver.username AS receiver_username
            FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            JOIN users sender ON m.sender_id = sender.id
            JOIN users receiver ON m.reciever_id = receiver.id
            WHERE (c.user1_id = $1 OR c.user2_id = $1)
            ORDER BY m.timestamp ASC;
          `, [id]);
        res.json(result.rows);
    }catch (err){
        console.error('Error fetching user messages:', err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; 