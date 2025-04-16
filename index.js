const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware для проверки X-Account-Phone
const checkPhoneHeader = async (req, res, next) => {
  const phone = req.headers['x-account-phone'];
  if (!phone) {
    return res.status(401).json({ error: 'X-Account-Phone header is required' });
  }
  
  const user = await prisma.user.findUnique({
    where: { phone }
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
};

// GET /wallet
app.get('/wallet', checkPhoneHeader, async (req, res) => {
  try {
    const { id, balance, phone, active_method, active_card_id } = req.user;
    res.json({ id, balance, phone, active_method, active_card_id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /cards
app.get('/cards', checkPhoneHeader, async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      where: { user_id: req.user.id }
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /cards
app.post('/cards', checkPhoneHeader, async (req, res) => {
  try {
    const { number, expire_date } = req.body;
    if (!number || !expire_date) {
      return res.status(400).json({ error: 'Number and expire_date are required' });
    }

    const card = await prisma.card.create({
      data: {
        number,
        expire_date,
        user_id: req.user.id
      }
    });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /promocode
app.post('/promocode', checkPhoneHeader, async (req, res) => {
  try {
    const { code } = req.body;
    // Здесь будет логика обработки промокода
    res.status(200).json({ message: 'Promocode received' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /wallet/method
app.put('/wallet/method', checkPhoneHeader, async (req, res) => {
  try {
    const { active_method, active_card_id } = req.body;
    
    if (!active_method) {
      return res.status(400).json({ error: 'active_method is required' });
    }
    
    if (active_method === 'card' && !active_card_id) {
      return res.status(400).json({ error: 'active_card_id is required when active_method is card' });
    }
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { active_method, active_card_id }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /users - создание пользователя
app.post('/users', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this phone number already exists' });
    }

    // Создаем нового пользователя
    const user = await prisma.user.create({
      data: { phone }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 