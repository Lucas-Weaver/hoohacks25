import requests

API_KEY = "Put key here"
origin = "38.0356,-78.5034"  # Replace with your friend's lat,lng

# Dictionary of dining hall names → lat,lng coordinates
DINING_HALLS = {
    "Observatory Hill": "38.0333,-78.5075",
    "Runk Dining Hall": "38.0312,-78.5201",
    "The Crossroads": "38.0333,-78.5075",
    "Za'atar at the Castle": "38.036,-78.51",
    "Saxbys": "38.0337,-78.5091",
    "Launch Kitchen": "38.029933,-78.504669",
    "Papa Johns": "38.0441656,-78.5132649"
}

def get_walking_distances(origin, dining_halls, api_key):
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

        print(f"→ {name}: {distance}, {duration}")

# Call the function
get_walking_distances(origin, DINING_HALLS, API_KEY)
