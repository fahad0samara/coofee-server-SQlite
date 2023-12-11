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










// Sample coffee data with local file paths
const sampleCoffeeData = [


  {
    "id": "1",
    "categoryId": "Espresso",
    "name": "Espresso Shot",
    "description": "A strong and concentrated coffee shot.",
    "imageUri": "../image/Espresso Shot.jpg",
    "price": "$2.99",
    "ingredients": "Coffee beans",
    "servingSize": "1 oz",
    "caffeineContent": "65 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "2",
    "categoryId": "Cappuccino",
    "name": "Classic Cappuccino",
    "description": "A balanced combination of espresso, steamed milk, and foam.",
    "imageUri": "cappuccino_image.jpg",
    "price": "$4.49",
    "ingredients": "Espresso, milk, foam",
    "servingSize": "8 oz",
    "caffeineContent": "75 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "3",
    "categoryId": "Latte",
    "name": "Vanilla Latte",
    "description": "Smooth espresso with steamed milk and vanilla flavor.",
    "imageUri": "latte_image.jpg",
    "price": "$4.99",
    "ingredients": "Espresso, milk, vanilla syrup",
    "servingSize": "12 oz",
    "caffeineContent": "55 mg",
    "origin": "Various",
    "roastLevel": "Light"
  },
  {
    "id": "4",
    "categoryId": "Mocha",
    "name": "Chocolate Mocha",
    "description": "Espresso with chocolate syrup and steamed milk.",
    "imageUri": "mocha_image.jpg",
    "price": "$5.49",
    "ingredients": "Espresso, chocolate syrup, milk",
    "servingSize": "16 oz",
    "caffeineContent": "60 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "5",
    "categoryId": "Americano",
    "name": "Classic Americano",
    "description": "Diluted espresso with hot water.",
    "imageUri": "americano_image.jpg",
    "price": "$3.99",
    "ingredients": "Espresso, hot water",
    "servingSize": "10 oz",
    "caffeineContent": "70 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "6",
    "categoryId": "Flat White",
    "name": "Australian Flat White",
    "description": "Espresso with steamed microfoam milk.",
    "imageUri": "flat_white_image.jpg",
    "price": "$5.99",
    "ingredients": "Espresso, microfoam milk",
    "servingSize": "12 oz",
    "caffeineContent": "65 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "7",
    "categoryId": "Espresso",
    "name": "Double Espresso",
    "description": "A double shot of strong and concentrated coffee.",
    "imageUri": "double_espresso_image.jpg",
    "price": "$4.99",
    "ingredients": "Coffee beans",
    "servingSize": "2 oz",
    "caffeineContent": "130 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "8",
    "categoryId": "Cappuccino",
    "name": "Hazelnut Cappuccino",
    "description": "Cappuccino with a hint of hazelnut flavor.",
    "imageUri": "hazelnut_cappuccino_image.jpg",
    "price": "$5.99",
    "ingredients": "Espresso, milk, hazelnut syrup, foam",
    "servingSize": "10 oz",
    "caffeineContent": "80 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "9",
    "categoryId": "Latte",
    "name": "Caramel Latte",
    "description": "Latte with sweet caramel syrup.",
    "imageUri": "caramel_latte_image.jpg",
    "price": "$5.49",
    "ingredients": "Espresso, milk, caramel syrup",
    "servingSize": "14 oz",
    "caffeineContent": "60 mg",
    "origin": "Various",
    "roastLevel": "Light"
  },
  {
    "id": "10",
    "categoryId": "Mocha",
    "name": "White Chocolate Mocha",
    "description": "Mocha with creamy white chocolate.",
    "imageUri": "white_chocolate_mocha_image.jpg",
    "price": "$6.49",
    "ingredients": "Espresso, white chocolate syrup, steamed milk",
    "servingSize": "16 oz",
    "caffeineContent": "70 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "11",
    "categoryId": "Americano",
    "name": "Iced Americano",
    "description": "Chilled diluted espresso with ice.",
    "imageUri": "iced_americano_image.jpg",
    "price": "$4.99",
    "ingredients": "Espresso, cold water, ice",
    "servingSize": "16 oz",
    "caffeineContent": "75 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "12",
    "categoryId": "Flat White",
    "name": "Coconut Flat White",
    "description": "Flat White with a touch of coconut flavor.",
    "imageUri": "coconut_flat_white_image.jpg",
    "price": "$6.49",
    "ingredients": "Espresso, steamed coconut milk, microfoam",
    "servingSize": "12 oz",
    "caffeineContent": "70 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "13",
    "categoryId": "Espresso",
    "name": "Macchiato",
    "description": "Espresso with a dollop of frothy milk.",
    "imageUri": "macchiato_image.jpg",
    "price": "$3.49",
    "ingredients": "Espresso, frothy milk",
    "servingSize": "2 oz",
    "caffeineContent": "50 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "14",
    "categoryId": "Cappuccino",
    "name": "Vanilla Cappuccino",
    "description": "Cappuccino with a hint of vanilla sweetness.",
    "imageUri": "vanilla_cappuccino_image.jpg",
    "price": "$5.49",
    "ingredients": "Espresso, milk, vanilla syrup, foam",
    "servingSize": "10 oz",
    "caffeineContent": "70 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "15",
    "categoryId": "Latte",
    "name": "Matcha Latte",
    "description": "Latte with Japanese matcha green tea powder.",
    "imageUri": "matcha_latte_image.jpg",
    "price": "$6.99",
    "ingredients": "Espresso, milk, matcha powder",
    "servingSize": "12 oz",
    "caffeineContent": "40 mg",
    "origin": "Various",
    "roastLevel": "Light"
  },
  {
    "id": "16",
    "categoryId": "Mocha",
    "name": "Peppermint Mocha",
    "description": "Mocha with a refreshing hint of peppermint.",
    "imageUri": "peppermint_mocha_image.jpg",
    "price": "$5.99",
    "ingredients": "Espresso, chocolate syrup, milk, peppermint extract",
    "servingSize": "16 oz",
    "caffeineContent": "65 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "17",
    "categoryId": "Americano",
    "name": "Espresso Tonic",
    "description": "Sparkling espresso with tonic water over ice.",
    "imageUri": "espresso_tonic_image.jpg",
    "price": "$4.99",
    "ingredients": "Espresso, tonic water, ice",
    "servingSize": "12 oz",
    "caffeineContent": "55 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "18",
    "categoryId": "Flat White",
    "name": "Maple Pecan Flat White",
    "description": "Flat White with a touch of maple and pecan flavor.",
    "imageUri": "maple_pecan_flat_white_image.jpg",
    "price": "$6.99",
    "ingredients": "Espresso, steamed milk, maple pecan syrup, microfoam",
    "servingSize": "12 oz",
    "caffeineContent": "75 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  },
  {
    "id": "19",
    "categoryId": "Espresso",
    "name": "Cubano",
    "description": "Espresso sweetened with demerara sugar.",
    "imageUri": "cubano_espresso_image.jpg",
    "price": "$3.99",
    "ingredients": "Espresso, demerara sugar",
    "servingSize": "2 oz",
    "caffeineContent": "70 mg",
    "origin": "Various",
    "roastLevel": "Dark"
  },
  {
    "id": "20",
    "categoryId": "Cappuccino",
    "name": "Almond Cappuccino",
    "description": "Cappuccino with almond milk for a nutty flavor.",
    "imageUri": "almond_cappuccino_image.jpg",
    "price": "$5.99",
    "ingredients": "Espresso, almond milk, foam",
    "servingSize": "10 oz",
    "caffeineContent": "65 mg",
    "origin": "Various",
    "roastLevel": "Medium"
  }
  ];





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

const uploadToCloudinary = async (fileBuffer: any) => {
  try {
    const result = await cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "image",
        },
        async (error: any, result: any) => {
          if (error) {
            console.error(error);
            throw new Error("Error uploading image to Cloudinary");
          }
          return result;
        }
      )
      .end(fileBuffer);

    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Create a function to insert coffee data into the database
const insertCoffeeData = async (coffeeData: { id: string; categoryId: string; name: string; description: string; imageUri: string; price: string; ingredients: string; servingSize: string; caffeineContent: string; origin: string; roastLevel: string; }[]) => {
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

    // Upload image to Cloudinary and get the URL
       const cloudinaryUrl = await uploadToCloudinary;

    stmt.run(
      id, categoryId, name, description, cloudinaryUrl,
      price, ingredients, servingSize, caffeineContent, origin, roastLevel
    );
  }

  stmt.finalize();
};
// Insert the sample data into the database
insertCoffeeData(sampleCoffeeData)

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
      res.status(500).json({error: 'Internal server error'});
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
