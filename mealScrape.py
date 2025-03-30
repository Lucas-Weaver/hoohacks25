import requests
from bs4 import BeautifulSoup
import json

# Replace with the actual UVA dining website URL
UVA_DINING_URL = "https://virginia.campusdish.com/en/locationsandmenus/"  

# Zyte API credentials
ZYTE_API_KEY=zyte_key
ZYTE_PROXY_URL = f"http://proxy.zyte.com:8011"

# Headers to mimic a real browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

def fetch_page(url):
    """Fetches a webpage using Zyte Smart Proxy"""
    proxies = {
        "http": ZYTE_PROXY_URL,
        "https": ZYTE_PROXY_URL
    }
    auth = (ZYTE_API_KEY, "")

    response = requests.get(url, headers=HEADERS, proxies=proxies, auth=auth)
    if response.status_code == 200:
        return response.text
    else:
        print(f"Failed to fetch page. Status code: {response.status_code}")
        return None

def parse_meals(html):
    """Extracts meal details using BeautifulSoup"""
    soup = BeautifulSoup(html, "html.parser")
    meals = []

    # Example: Adjust this selector based on the actual structure of the UVA dining website
    for item in soup.select(".meal-item"):
        meal_name = item.select_one(".meal-name").text.strip()
        calories = item.select_one(".calories").text.strip()
        protein = item.select_one(".protein").text.strip()
        carbs = item.select_one(".carbohydrates").text.strip()
        fat = item.select_one(".fat").text.strip()

        meal_data = {
            "name": meal_name,
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fat
        }
        meals.append(meal_data)

    return meals

def save_results(data, filename="uva_meals.json"):
    """Saves extracted meals data to a JSON file"""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print(f"Data saved to {filename}")

def main():
    print("Fetching UVA dining menu...")
    html = fetch_page(UVA_DINING_URL)

    if html:
        print("Parsing meals...")
        meals = parse_meals(html)
        
        if meals:
            print(f"Extracted {len(meals)} meals")
            save_results(meals)
        else:
            print("No meals found.")
    else:
        print("Failed to retrieve webpage.")

if __name__ == "__main__":
    main()
