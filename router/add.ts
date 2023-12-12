import express, {Request, Response} from 'express';
import multer, {FileFilterCallback} from 'multer';
import path from 'path';
import sqlite3 from 'sqlite3';


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

const storage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({storage});
















db.serialize(() => {
  db.run(`
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
  `);
});







router.post('/add-coffee', upload.single('image'), async (req, res) => {
  const coffeeItem = req.body;
  let imageUri = null;

  if (req.file) {
    const uploadOptions = {
      folder: 'coffee-images', // Specify the folder in Cloudinary
      public_id: `coffee-${Date.now()}`, // Specify the public ID for the image
      overwrite: true, // Overwrite existing image if necessary
    };

    const result = await cloudinary.uploader
      .upload_stream(uploadOptions, async (error:any, result:any) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          res.status(500).json({error: 'Internal server error'});
        } else {
          imageUri = result.secure_url;

          // Continue with storing data in the database
          const sql = `
          INSERT INTO coffeeData
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          const values = [
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

          db.run(sql, values, dbError => {
            if (dbError) {
              console.error(
                'Error adding coffee item to the database:',
                dbError,
              );
              res.status(500).json({error: 'Internal server error'});
            } else {
              res.status(200).json({
                message: 'Successfully added coffee item to the database',
                


            });
            }
          });
        }
      })
      .end(req.file.buffer);
  }
});

router.get('/coffee-items', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM coffeeData';

  db.all(sql, [], (error: Error | null, rows: any[]) => {
    if (error) {
      console.error('Error fetching coffee items:', error);
      res.status(500).json({error: 'Internal server error'});
    } else {
      res.status(200).json(rows);
    }
  });
});

// Define a route to delete a coffee item by ID
router.delete('/delete-coffee/:id', (req: Request, res: Response) => {
  const {id} = req.params;

  // Create an SQL DELETE statement to delete the coffee item by its ID
  const sql = 'DELETE FROM coffeeData WHERE id = ?';

  // Run the SQL query to delete the item
  db.run(sql, [id], (error: Error | null) => {
    if (error) {
      console.error('Error deleting coffee item:', error);
      res.status(500).json(
        error
      );
    } else {
      res.status(200).json({message: 'Successfully deleted coffee item'});
    }
  });
});
router.put(
  '/update-coffee/:id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    const {id} = req.params;
    const updatedCoffeeItem = req.body;
    let imageUri = null;

    // Check if a new image is provided
    if (req.file) {
      const uploadOptions = {
        folder: 'coffee-images', // Specify the folder in Cloudinary
        public_id: `coffee-${Date.now()}`, // Specify the public ID for the image
        overwrite: true, // Overwrite existing image if necessary
      };

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader
        .upload_stream(uploadOptions, async (error: any, result: any) => {
          if (error) {
            console.error('Error uploading image to Cloudinary:', error);
            res.status(500).json({error: 'Internal server error'});
          } else {
            imageUri = result.secure_url;
            updatedCoffeeItem.imageUri = imageUri; // Update the image URI in the coffee item data

            // Continue with updating data in the database
            // ...
          }
        })
        .end(req.file.buffer);
    }

    // Update the data in the database, including the imageUri
    const sql = `
    UPDATE coffeeData
    SET categoryId = ?, name = ?, description = ?, imageUri = ?, 
        price = ?, ingredients = ?, servingSize = ?, caffeineContent = ?, 
        origin = ?, roastLevel = ?
    WHERE id = ?
  `;

    const values = [
      updatedCoffeeItem.categoryId,
      updatedCoffeeItem.name,
      updatedCoffeeItem.description,
      updatedCoffeeItem.imageUri, // Always update the imageUri
      updatedCoffeeItem.price,
      updatedCoffeeItem.ingredients,
      updatedCoffeeItem.servingSize,
      updatedCoffeeItem.caffeineContent,
      updatedCoffeeItem.origin,
      updatedCoffeeItem.roastLevel,
      id, // Coffee item ID to identify the item to update
    ];

    db.run(sql, values, dbError => {
      if (dbError) {
        console.error('Error updating coffee item:', dbError);
        res.status(500).json({error: 'Internal server error'});
      } else {
        res.status(200).json({message: 'Successfully updated coffee item'});
      }
    });
  },
);


router.get('/api', (req, res, next) => {
  res.send('<h1>Hello world<h1>');
});


export default router;
