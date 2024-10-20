import requests
import pandas as pd

# clob-endpoint
# https://clob.polymarket.com/
# docs: https://docs.polymarket.com/#get-markets


# Define the base URL for the request
base_url = "https://clob.polymarket.com/markets"

# Initialize an empty list to store market data
all_market_data = []

# Initialize the cursor
next_cursor = ""

# Continue to fetch data while the cursor is not empty
while True:
    # Make the request with the current cursor
    url = f"{base_url}?enable_order_book=true&next_cursor={next_cursor}"
    response = requests.get(url)
    
    # Check if the response is successful
    if response.status_code == 200:
        data = response.json()
        # Add the market data to the list
        all_market_data.extend(data['data'])
        
        # Update the cursor
        next_cursor = data.get('next_cursor', "")
        
        # Break the loop if there is no more data to fetch
        if not next_cursor:
            break
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")
        break

df = pd.DataFrame(all_market_data)
df[(df['enable_order_book'] == True) & (df['active']== True) & (df['neg_risk'] == False)].to_json('markets.json', orient='records')