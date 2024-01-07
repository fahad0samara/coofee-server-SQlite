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
  try {
    const { name, email, password, role } = req.body;
    const profileImageBuffer = req.file ? req.file.buffer : null;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email address already exists' });
    }

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUri = null;

    if (profileImageBuffer) {
      // Handle image upload to Cloudinary
      const uploadOptions = {
        folder: 'coffee-user',
        public_id: `coffee-${Date.now()}`,
        overwrite: true,
      };

      try {
        const result = await new Promise<string>((resolve, reject) => {
          cloudinary.uploader.upload_stream(uploadOptions, (error: any, result: { secure_url: any }) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              reject({ error: 'Error uploading image to Cloudinary' });
            } else {
              resolve(result.secure_url);
            }
          }).end(profileImageBuffer);
        });

        imageUri = result;
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // Continue with storing data in the database
    const userId = await insertUser(name, email, hashedPassword, imageUri, role);

    // Send the user details in the response
    const user = {
      id: userId,
      name,
      email,
      role,
      // Include other user details as needed
    };

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error in registration endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Function to insert a user into the database
function insertUser(
  name: string,
  email: string,
  hashedPassword: string,
  imageUri: string | null,
  role: string = 'user',
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email, password, profile_image, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, imageUri, role],
      function (this: { lastID: number }, err: SQLiteError | null) {
        if (err) {
          if (err.errno === sqlite3.CONSTRAINT) {
            reject({ error: 'Email address already exists' });
          } else {
            console.error('Database error:', err);
            reject({ error: 'Internal server error' });
          }
        } else {
          resolve(this.lastID); // Return the inserted user ID
        }
      },
    );
  });
}
// Function to fetch user data by email
async function getUserByEmail(email: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject({ error: 'Error fetching user by email' });
      } else {
        resolve(row ? (row as User) : null);
      }
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
      return res.status(401).json({ error: 'the password is worng' });
    }

    const token = jwt.sign(
      { userId: user.id, userEmail: user.email, userRole: user.role },
      "awafdasfdf",
      { expiresIn: '1h' }
    );

    // Send a success response or the token to the client
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        role: user.role,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_image: user.profile_image,
        },
      },
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


// New endpoint to fetch user info using the stored token
router.get('/getUserInfo', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

  try {
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, 'awafdasfdf'); // Replace with your secret key

    if (!decodedToken || typeof decodedToken !== 'object') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch user data from the database based on the decoded token
    const userId = (decodedToken as any).userId; // Assuming 'userId' is the key used in the token

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const user: User | null = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
      
      },
    });
  } catch (error) {
   
    // Check for specific error conditions and provide appropriate error messages
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});




// Add a new route to fetch user profile by id
router.get('/getUserProfile/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the user from the database based on their ID
    const user: User | null = await getUserById(userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
});



// Function to fetch a user by ID from the database
async function getUserById(id: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row ? (row as User) : null);
    });
  });
}












export default router;
