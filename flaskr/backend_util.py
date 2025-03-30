import sqlite3
import itertools
import time
import random
from heapq import nsmallest

def find_best_meal_combinations(numMeals, constraints, diet, time_limit=1):
    DB_PATH = "instance/flaskr.sqlite"
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Query meals based on diet
    if diet != "none":
        cursor.execute(f"SELECT restaurant, meal_description, meal_name, calories, protein, sodium, sugar, fat, fiber, carbohydrates, meal_time, dining_hall FROM meals WHERE {diet} = true")
    else:
        cursor.execute("SELECT restaurant, meal_description, meal_name, calories, protein, sodium, sugar, fat, fiber, carbohydrates, meal_time, dining_hall FROM meals")
    
    meals = cursor.fetchall()
    conn.close()

    # Define important nutrient indices from constraints
    toCheck = {i for i in range(len(constraints)) if constraints[i] != 0}
    
    # Define distance function to measure how close a combination is to target constraints
    # Only consider non-zero constraints
    def distance(nutrients):
        return sum(abs(constraints[i] - nutrients[i]) for i in toCheck)
    
    # Store all valid combinations
    valid_combinations = []
    
    # Start timer
    start_time = time.time()
    
    # Generate combinations with a time limit
    meal_names_seen = set()  # Track unique meal names to avoid duplicates
    
    # Use itertools.combinations to generate all possible meal combinations
    for combo in itertools.combinations(meals, numMeals):
        # Check if time limit exceeded
        if time.time() - start_time > time_limit:
            break
            
        # Check for duplicate meal names in this combination
        meal_names = [meal[2] for meal in combo]
        if len(meal_names) != len(set(meal_names)):
            continue
            
        # Compute total nutrients for this combination
        nutrients = [
            sum(meal[3] for meal in combo),  # calories
            sum(meal[4] for meal in combo),  # protein
            sum(meal[5] for meal in combo),  # sodium
            sum(meal[6] for meal in combo),  # sugar
            sum(meal[7] for meal in combo),  # fat
            sum(meal[8] for meal in combo),  # fiber
            sum(meal[9] for meal in combo)   # carbs
        ]
        
        # Add the combination to our results
        valid_combinations.append(combo)
        
        # Optional: Store combination key to avoid duplicates
        combo_key = frozenset(meal[2] for meal in combo)
        meal_names_seen.add(combo_key)
    
    # If we have too few combinations (or none), we can try with a smaller number of meals
    if len(valid_combinations) < 1000 and numMeals > 1:
        backup_combinations = []
        # Try with one less meal
        for combo in itertools.combinations(meals, numMeals - 1):
            if time.time() - start_time > time_limit:
                break
                
            meal_names = [meal[2] for meal in combo]
            if len(meal_names) != len(set(meal_names)):
                continue
                
            nutrients = [
                sum(meal[3] for meal in combo),
                sum(meal[4] for meal in combo),
                sum(meal[5] for meal in combo),
                sum(meal[6] for meal in combo),
                sum(meal[7] for meal in combo),
                sum(meal[8] for meal in combo),
                sum(meal[9] for meal in combo)
            ]
            
            backup_combinations.append(combo)
        
        # Add backup combinations if needed
        valid_combinations.extend(backup_combinations)
    
    # Select the top 1000 closest combinations to the target constraints
    top_combinations = nsmallest(100, valid_combinations, key=lambda x: distance(x[1]))
    
    # Randomly select 10 combinations from the top 1000
    if len(top_combinations) > 10:
        return random.sample(top_combinations, 10)
    else:
        return top_combinations  # Return all if we have fewer than 10

# Run the function with a 3-second time limit
combinations = find_best_meal_combinations(3, [2500, 40, 0, 0, 0, 0, 0], 'vegan', time_limit=3)

# Print the valid combinations
for combo in combinations[:1]:
    print(combo)
    #print([(meal[2], meal[3]) for meal in combo[0]])  # Print meal names and their calories
import requests

API_KEY = "Put key here"
origin = "38.0356,-78.5034"  # Replace with your friend's lat,lng

# Dictionary of dining hall names → lat,lng coordinates


def get_walking_distances(origin, api_key):
    DINING_HALLS = {
    "Observatory Hill": "38.0333,-78.5075",
    "Runk Dining Hall": "38.0312,-78.5201",
    "The Crossroads": "38.0333,-78.5075",
    "Za'atar at the Castle": "38.036,-78.51",
    "Saxbys": "38.0337,-78.5091",
    "Launch Kitchen": "38.029933,-78.504669",
    "Papa Johns": "38.0441656,-78.5132649"
    }
    destinations = list(dining_halls.values())
    destination_str = "|".join(destinations)

    url = (
        "https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={origin}"
        f"&destinations={destination_str}"
        f"&mode=walking"
        f"&units=imperial"
        f"&key={api_key}"
    )

    response = requests.get(url)
    data = response.json()

    for i, (name, coord) in enumerate(dining_halls.items()):
        element = data['rows'][0]['elements'][i]
        if element['status'] == "OK":
            distance = element['distance']['text']
            duration = element['duration']['text']
        else:
            distance = "Unavailable"
            duration = "Unavailable"

        

# Call the function
