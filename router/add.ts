import express, {Request, Response} from 'express';
import multer, {FileFilterCallback} from 'multer';
import path from 'path';
import sqlite3 from 'sqlite3';
import { sampleCoffeeData } from './data';
const router = express.Router();
const db = new sqlite3.Database("coffee.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the database");
  }
});
const cloudinary = require('cloudinary').v2;
// Define the storage for image uploads using Multer
cloudinary.config({
  cloud_name: 'dh5w04awz',
  api_key: '154856233692976',
  api_secret: 'sD9lI3ztLqo62It9mEias2Cqock',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });



// Function to handle Cloudinary upload
const handleCloudinaryUpload = async (
  uploadOptions: any,
  fileBuffer: Buffer,
  res: Response
): Promise<string | null> => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream(uploadOptions, (error: any, result: any) => {
      if (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).json({ error: 'Internal server error' });
        resolve(null);
      } else {
        resolve(result.secure_url);
      }
    }).end(fileBuffer);
  });
};

// Function to handle database insert/update
const handleDatabaseOperation = (
  sql: string,
  values: any[],
  res: Response,
  successMessage: string
): void => {
  db.run(sql, values, (dbError) => {
    if (dbError) {
      console.error(`Error: ${successMessage}`, dbError);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: successMessage });
    }
  });
};

// Function to handle common database query
const queryDatabase = (sql: string, res: Response): void => {
  db.all(sql, [], (error: Error | null, rows: any[]) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(rows);
    }
  });
};

// Define the table creation query
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS coffeeData (
    id TEXT PRIMARY KEY,
    categoryId TEXT,
    name TEXT,
    description TEXT,
    imageUri TEXT,
    price TEXT,
    ingredients TEXT,
    servingSize TEXT,
    caffeineContent TEXT,
    origin TEXT,
    roastLevel TEXT
  )
`;

// Create the table if not exists
db.serialize(() => {
  db.run(createTableQuery);
});



// Handle common route for adding/updating a coffee item
const handleAddUpdateCoffee = async (req: Request, res: Response, isUpdate: boolean): Promise<void> => {
  const coffeeItem = req.body;
  let imageUri = null;

  if (req.file) {
    const uploadOptions = {
      folder: 'coffee/coffee-images',
      public_id: `coffee-${Date.now()}`,
      overwrite: true,
    };

    imageUri = await handleCloudinaryUpload(uploadOptions, req.file.buffer, res);
  }

  const successMessage = isUpdate ? 'Successfully updated coffee item' : 'Successfully added coffee item to the database';

  const sql = isUpdate
    ? `
      UPDATE coffeeData
      SET categoryId = ?,
          name = ?,
          description = ?,
          imageUri = ?,
          price = ?,
          ingredients = ?,
          servingSize = ?,
          caffeineContent = ?,
          origin = ?,
          roastLevel = ?
      WHERE id = ?
    `
    : `
      INSERT INTO coffeeData
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = isUpdate
    ? [
        coffeeItem.categoryId,
        coffeeItem.name,
        coffeeItem.description,
        imageUri,
        coffeeItem.price,
        coffeeItem.ingredients,
        coffeeItem.servingSize,
        coffeeItem.caffeineContent,
        coffeeItem.origin,
        coffeeItem.roastLevel,
        coffeeItem.id,
      ]
    : [
        coffeeItem.id,
        coffeeItem.categoryId,
        coffeeItem.name,
        coffeeItem.description,
        imageUri,
        coffeeItem.price,
        coffeeItem.ingredients,
        coffeeItem.servingSize,
        coffeeItem.caffeineContent,
        coffeeItem.origin,
        coffeeItem.roastLevel,
      ];

  handleDatabaseOperation(sql, values, res, successMessage);
};

// Handle route for adding a coffee item
router.post('/add-coffee', upload.single('image'), (req, res) => {
  handleAddUpdateCoffee(req, res, false);
});

// Handle route for updating a coffee item
router.put('/update-coffee/:id', upload.single('image'), (req, res) => {
  handleAddUpdateCoffee(req, res, true);
});



// Handle common route for fetching coffee items
router.get('/coffee-items', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM coffeeData';
  queryDatabase(sql, res);
});

// Handle common route for deleting a coffee item
router.delete('/delete-coffee/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sql = 'DELETE FROM coffeeData WHERE id = ?';
  handleDatabaseOperation(sql, [id], res, 'Successfully deleted coffee item');
});

// Define a route for testing purposes
router.get('/', (req, res, next) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 800px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #333;
          }

          p {
            color: #555;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          li {
            margin-bottom: 10px;
          }

          a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
          }

          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Coffee API</h1>
          <p>This is a sample API for managing coffee items.</p>
          <p>Explore the following endpoints:</p>
          <ul>
            <li><a href="/api/coffee-items">/api/coffee-items</a> - Get a list of coffee items</li>
            <li><a href="/api/add-coffee">/api/add-coffee</a> - Add a new coffee item</li>
            <li><a href="/api/delete-coffee/{id}">/api/delete-coffee/{id}</a> - Delete a coffee item by ID</li>
            <li><a href="/api/update-coffee/{id}">/api/update-coffee/{id}</a> - Update a coffee item by ID</li>
            <!-- Add more URIs and instructions as needed -->
          </ul>
          <p>Feel free to use the provided endpoints to interact with the API.</p>
        </div>
      </body>
    </html>
  `);
});


const uploadToCloudinary = async (fileBuffer: Buffer) => {
  try {
    const result = await cloudinary.uploader
      .upload_stream(
        {
          folder: "coffee-images", // Specify the folder in Cloudinary
          public_id: `coffee-${Date.now()}`, // Specify the public ID for the image
          overwrite: true, // Overwrite existing image if necessary
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Error uploading image to Cloudinary");
          }
          return result;
        }
      )
      .end(fileBuffer);

    return result.secure_url;
  } catch (error) {
    console.error("Upload to Cloudinary error:", error);
    throw error;
  }
};


// Create a function to insert coffee data into the database
const insertCoffeeData = async (coffeeData: { id: string; categoryId: string; name: string; description: string; imageUri: any; price: string; ingredients: string; servingSize: string; caffeineContent: string; origin: string; roastLevel: string; }[]) => {
  const stmt = db.prepare(`
    INSERT INTO coffeeData (
      id, categoryId, name, description, imageUri, price, ingredients,
      servingSize, caffeineContent, origin, roastLevel
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const coffee of coffeeData) {
    const {
      id, categoryId, name, description, imageUri,
      price, ingredients, servingSize, caffeineContent, origin, roastLevel,
    } = coffee;


const image =
  "https://images.unsplash.com/photo-1640389085228-323113fae2cd?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  


    stmt.run(
      id, categoryId, name, description, image,
      price, ingredients, servingSize, caffeineContent, origin, roastLevel
    );
  }

  stmt.finalize();
};

// Insert the sample data into the database
insertCoffeeData(sampleCoffeeData)





export default router;
