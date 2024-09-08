import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tekuton_test',
  password: 'apaajaboleh',
  port: 5432,
});

const secret = 'secretkey';

const authenticateToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.body.user = user;
    next();
  });
};

app.post('/register', async (req: Request, res: Response) => {
  const { first_name, last_name, age, email, password, confirm_password } = req.body;
  if (password !== confirm_password) return res.status(400).json({ message: 'Passwords do not match' });

  // console.log('Body request:', req.body);
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Kata sandi tidak valid' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, age, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, age, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'User registration failed' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
  res.status(200).json({ token });
});

app.get('/users', authenticateToken, async (req: Request, res: Response) => {
  const result = await pool.query('SELECT id, first_name, last_name, age FROM users');
  res.status(200).json(result.rows);
});

app.post('/hobbies', authenticateToken, async (req: Request, res: Response) => {
  const { name, active } = req.body;
  
  const result = await pool.query(
    'INSERT INTO hobbies (name, active) VALUES ($1, $2) RETURNING *',
    [name, active]
  );
  
  res.status(201).json(result.rows[0]);
});

app.get('/hobbies', authenticateToken, async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM hobbies');
  res.status(200).json(result.rows);
});

app.get('/hobbies/:id', authenticateToken, async (req: Request, res: Response) => {
  const Id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM hobbies WHERE id = $1', [Id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hobby not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hobby details:', error);
    res.status(500).json({ message: 'Failed to fetch hobby details' });
  }
});

app.put('/hobbies/:id', authenticateToken, async (req: Request, res: Response) => {
  const hobbyId = parseInt(req.params.id);
  const { name, active } = req.body;

  if (!name || typeof active === 'undefined') {
    return res.status(400).json({ message: 'Hobby name and active status are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE hobbies SET name = $1, active = $2 WHERE id = $3 RETURNING *',
      [name, active, hobbyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hobby not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hobby:', error);
    res.status(500).json({ message: 'Failed to update hobby' });
  }
});


app.get('/users/:id', authenticateToken, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});


app.post('/users/add', authenticateToken, async (req: Request, res: Response) => {
  const { first_name, last_name, age, email, password, confirm_password, hobby } = req.body;
  if (password !== confirm_password) return res.status(400).json({ message: 'Passwords do not match' });

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Kata sandi tidak valid' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, age, email, password, hobby_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, age, email, hashedPassword, hobby]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'User addition failed' });
  }
});

app.put('/users/:id', authenticateToken, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { first_name, last_name, age, email, password, confirm_password, hobby } = req.body;

  let updateFields = [];
  let values = [];
  
  if (password) {
    if (password !== confirm_password) return res.status(400).json({ message: 'Passwords do not match' });
    const hashedPassword = await bcrypt.hash(password, 10);
    updateFields.push('password = $' + (values.length + 1));
    values.push(hashedPassword);
  }

  if (first_name) {
    updateFields.push('first_name = $' + (values.length + 1));
    values.push(first_name);
  }

  if (last_name) {
    updateFields.push('last_name = $' + (values.length + 1));
    values.push(last_name);
  }

  if (age) {
    updateFields.push('age = $' + (values.length + 1));
    values.push(age);
  }

  if (email) {
    updateFields.push('email = $' + (values.length + 1));
    values.push(email);
  }

  if (hobby) {
    updateFields.push('hobby_id = $' + (values.length + 1));
    values.push(parseInt(hobby));
  }

  if (updateFields.length === 0) return res.status(400).json({ message: 'No fields to update' });

  values.push(userId);
  
  try {
    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'User update failed' });
  }
});

app.post('/logout', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful. Please clear your token.' });
});


async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Koneksi database berhasil');
    client.release();
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
  }
}

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  testDatabaseConnection();
});
