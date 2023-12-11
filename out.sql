PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE coffeeData (
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
    );
INSERT INTO coffeeData VALUES('1','Espresso','Espresso Shot','A strong and concentrated coffee shot.','[object Object]','$2.99','Coffee beans','1 oz','65 mg','Various','Dark');
INSERT INTO coffeeData VALUES('2','Cappuccino','Classic Cappuccino','A balanced combination of espresso, steamed milk, and foam.','[object Object]','$4.49','Espresso, milk, foam','8 oz','75 mg','Various','Medium');
INSERT INTO coffeeData VALUES('3','Latte','Vanilla Latte','Smooth espresso with steamed milk and vanilla flavor.','[object Object]','$4.99','Espresso, milk, vanilla syrup','12 oz','55 mg','Various','Light');
INSERT INTO coffeeData VALUES('4','Mocha','Chocolate Mocha','Espresso with chocolate syrup and steamed milk.','[object Object]','$5.49','Espresso, chocolate syrup, milk','16 oz','60 mg','Various','Medium');
INSERT INTO coffeeData VALUES('5','Americano','Classic Americano','Diluted espresso with hot water.','[object Object]','$3.99','Espresso, hot water','10 oz','70 mg','Various','Dark');
INSERT INTO coffeeData VALUES('6','Flat White','Australian Flat White','Espresso with steamed microfoam milk.','[object Object]','$5.99','Espresso, microfoam milk','12 oz','65 mg','Various','Medium');
INSERT INTO coffeeData VALUES('7','Espresso','Double Espresso','A double shot of strong and concentrated coffee.','[object Object]','$4.99','Coffee beans','2 oz','130 mg','Various','Dark');
INSERT INTO coffeeData VALUES('8','Cappuccino','Hazelnut Cappuccino','Cappuccino with a hint of hazelnut flavor.','[object Object]','$5.99','Espresso, milk, hazelnut syrup, foam','10 oz','80 mg','Various','Medium');
INSERT INTO coffeeData VALUES('9','Latte','Caramel Latte','Latte with sweet caramel syrup.','[object Object]','$5.49','Espresso, milk, caramel syrup','14 oz','60 mg','Various','Light');
INSERT INTO coffeeData VALUES('10','Mocha','White Chocolate Mocha','Mocha with creamy white chocolate.','[object Object]','$6.49','Espresso, white chocolate syrup, steamed milk','16 oz','70 mg','Various','Medium');
INSERT INTO coffeeData VALUES('11','Americano','Iced Americano','Chilled diluted espresso with ice.','[object Object]','$4.99','Espresso, cold water, ice','16 oz','75 mg','Various','Dark');
INSERT INTO coffeeData VALUES('12','Flat White','Coconut Flat White','Flat White with a touch of coconut flavor.','[object Object]','$6.49','Espresso, steamed coconut milk, microfoam','12 oz','70 mg','Various','Medium');
INSERT INTO coffeeData VALUES('13','Espresso','Macchiato','Espresso with a dollop of frothy milk.','[object Object]','$3.49','Espresso, frothy milk','2 oz','50 mg','Various','Dark');
INSERT INTO coffeeData VALUES('14','Cappuccino','Vanilla Cappuccino','Cappuccino with a hint of vanilla sweetness.','[object Object]','$5.49','Espresso, milk, vanilla syrup, foam','10 oz','70 mg','Various','Medium');
INSERT INTO coffeeData VALUES('15','Latte','Matcha Latte','Latte with Japanese matcha green tea powder.','[object Object]','$6.99','Espresso, milk, matcha powder','12 oz','40 mg','Various','Light');
INSERT INTO coffeeData VALUES('16','Mocha','Peppermint Mocha','Mocha with a refreshing hint of peppermint.','[object Object]','$5.99','Espresso, chocolate syrup, milk, peppermint extract','16 oz','65 mg','Various','Medium');
INSERT INTO coffeeData VALUES('17','Americano','Espresso Tonic','Sparkling espresso with tonic water over ice.','[object Object]','$4.99','Espresso, tonic water, ice','12 oz','55 mg','Various','Dark');
INSERT INTO coffeeData VALUES('18','Flat White','Maple Pecan Flat White','Flat White with a touch of maple and pecan flavor.','[object Object]','$6.99','Espresso, steamed milk, maple pecan syrup, microfoam','12 oz','75 mg','Various','Medium');
INSERT INTO coffeeData VALUES('19','Espresso','Cubano','Espresso sweetened with demerara sugar.','[object Object]','$3.99','Espresso, demerara sugar','2 oz','70 mg','Various','Dark');
INSERT INTO coffeeData VALUES('20','Cappuccino','Almond Cappuccino','Cappuccino with almond milk for a nutty flavor.','[object Object]','$5.99','Espresso, almond milk, foam','10 oz','65 mg','Various','Medium');
COMMIT;
