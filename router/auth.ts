import express, {Request, Response} from 'express';
import multer from 'multer';
import path from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  profile_image: string;
  role: string; // Add the 'role' property
}

// Define a custom type for SQLite error
type SQLiteError = Error & {errno?: number};

const router = express.Router();
const db = new sqlite3.Database('auth.db');
const cloudinary = require('cloudinary').v2;

// Define the storage for image uploads using Multer
cloudinary.config({
  cloud_name: 'dh5w04awz',
  api_key: '154856233692976',
  api_secret: 'sD9lI3ztLqo62It9mEias2Cqock', // Replace with your Cloudinary API secret
});

const storage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({storage});

// Create a users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      profile_image TEXT,
     role TEXT DEFAULT 'user' 
    )
  `);
});

// Registration endpoint
router.post('/register', upload.single('profile_image'), async (req, res) => {
  const {name, email, password, role} = req.body;
  const profileImageBuffer = req.file ? req.file.buffer : null;

  try {
    // Generate a salt
    const saltRounds = 10; // You can adjust the number of rounds as needed
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUri = null;

    // Check if the user uploaded an image
    if (profileImageBuffer) {
      const uploadOptions = {
        folder: 'coffee-user', // Specify the folder in Cloudinary
        public_id: `coffee-${Date.now()}`, // Specify the public ID for the image
        overwrite: true, // Overwrite existing image if necessary
      };
         const result = await cloudinary.uploader
      .upload_stream(uploadOptions, async (error:any, result:any) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          res.status(500).json(error);
        } else {
    imageUri = result.secure_url;
    // Continue with storing data in the database
    insertUser(name, email, hashedPassword, imageUri, res);
        }
      }
      )
      .end(profileImageBuffer);
    }
    else {
      // Continue with storing data in the database
      insertUser(name, email, hashedPassword, imageUri, res, role);
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json(error);
  }
}
);



// Function to insert a user into the database
function insertUser(
  name: string,
  email: string,
  hashedPassword: string,
  imageUri: string | null,
  res: Response,
  role: string = 'user',
) {
 db.run(
   'INSERT INTO users (name, email, password, profile_image, role) VALUES (?, ?, ?, ?, ?)',
   [name, email, hashedPassword, imageUri, role],
   (err: SQLiteError | null) => {
     if (err) {
       if (err.errno === sqlite3.CONSTRAINT) {
         return res.status(400).json({error: 'Email address already exists'});
       }
       console.error('Database error:', err);
       return res.status(500).json({error: 'Internal server error'});
     }

     return res.status(201).json({message: 'User registered successfully'});
   },
 );
}

// Function to fetch user data by email
async function getUserByEmail(email: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row ? (row as User) : null);
    });
  });
}



// In the login route, specify the type of user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user data from the database based on the provided email
    const user: User | null = await getUserByEmail(email);

    // Check if a user with the provided email exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email, userRole: user.role },
      "awafdasfdf",
      
      
      { expiresIn: '1h' }
    );

    // Send a success response or the token to the client
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      role: user.role,
      user: user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users: User[] = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Function to fetch all users from the database
async function getUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows: User[]) => { // Specify the type here
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

router.delete('/delete/:id', async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the URL parameter

  try {
    // Delete the user from the database based on their ID
    await deleteUserById(userId);

    return res.status(204).send(); // Send a success response with no content
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
});

// Function to delete a user by ID from the database
async function deleteUserById(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}















export default router;
