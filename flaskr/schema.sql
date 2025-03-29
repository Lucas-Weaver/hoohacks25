DROP TABLE IF EXISTS meals;

CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_name TEXT NOT NULL,
    meal_description TEXT NOT NULL,

    calories INTEGER NOT NULL,
    protein INTEGER NOT NULL,
    sodium INTEGER NOT NULL,
    sugar INTEGER NOT NULL,
    fat INTEGER NOT NULL,
    fiber INTEGER NOT NULL,
    carbohydrates INTEGER NOT NULL,

    vegan BOOLEAN NOT NULL,
    vegetarian BOOLEAN NOT NULL,
    gluten_free BOOLEAN NOT NULL,


    
    meal_time TEXT NOT NULL,
    dining_hall TEXT NOT NULL,
    restaurant TEXT NOT NULL,

    eggs BOOLEAN,
    fish BOOLEAN,
    milk BOOLEAN,
    peanuts BOOLEAN,
    sesame BOOLEAN,
    shellfish BOOLEAN,
    soy BOOLEAN,
    treenuts BOOLEAN,
    wheat BOOLEAN




);