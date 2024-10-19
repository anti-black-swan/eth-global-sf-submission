from dotenv import load_dotenv
import os
from py_clob_client.constants import POLYGON
from py_clob_client.client import ClobClient
from py_clob_client.order_builder.constants import BUY
import httpx
import asyncio
import json
from py_clob_client.clob_types import ApiCreds, OrderArgs, OrderType, BookParams

# Global client variable
client = None
threshold = 10000 # Hard limit of $10,000 (for now)
max_slippage = 0.01 # 1% max slippage

# Initialize CLOB
def initialize():
    global client
    # Load .env file
    load_dotenv()
    
    host = "https://clob.polymarket.com"
    key = os.getenv("PK")
    chain_id = POLYGON

    # Create CLOB client and get/set API credentials
    client = ClobClient(host, key=key, chain_id=chain_id)
    client.set_api_creds(client.create_or_derive_api_creds())

def get_api_keys():
    global client
    # Create or derive API credentials (this is where the API key, secret, and passphrase are generated)
    try:
        api_creds = client.create_or_derive_api_creds()
        print("API Key:", api_creds.api_key)
        print("Secret:", api_creds.api_secret)
        print("Passphrase:", api_creds.api_passphrase)
        # You should now save these securely (e.g., store them in your .env file)
    except Exception as e:
        print("Error creating or deriving API credentials:", e)

# Function to get and save markets
def get_markets():
    global client
    resp = client.get_markets(next_cursor="")

    # Save the response to a JSON file
    with open('markets.json', 'w') as json_file:
        json.dump(resp, json_file, indent=4)  

    print("Saved to markets.json")

# Function to get and save reward-enabled markets
def get_reward_markets():
    global client
    resp = client.get_sampling_markets(next_cursor="")

    with open('reward_markets.json', 'w') as json_file:
        json.dump(resp, json_file, indent=4)  

    print("Saved to reward_markets.json")


def get_market_spreads():
    resp = client.get_spreads(
        params=[
            BookParams(
                token_id="11015470973684177829729219287262166995141465048508201953575582100565462316088"
            ),
            BookParams(
                token_id="65444287174436666395099524416802980027579283433860283898747701594488689243696"
            ),
        ]
    )
    with open('spreads.json', 'w') as json_file:
        json.dump(resp, json_file, indent=4)  

    print("Saved to spreads.json")


def get_asks(black_swan_list):

    param_list = []
    for token in black_swan_list:
        param_list.append(BookParams(token_id=token))

    response = client.get_order_books(
            params=param_list
        )
    
    response_dict = [book.__dict__ for book in response]
    with open('market_book.json', 'w') as json_file:
        json.dump(response_dict, json_file, indent=4)  

    print("Saved to market_book.json")
    asks = {}
    for book in response:
        asks[book.asset_id] = []
        for ask in book.asks:
            asks[book.asset_id].append((float(ask.price), float(ask.size)))

    print(asks)
    return asks
    
# def place_order(token_id, ask_price, thresholded_size) :
#     # This function's arguments should now only take specific values from asks, not whole list
#     order_args = OrderArgs(
#         price=ask_price,
#         size=thresholded_size,
#         side=BUY,
#         token_id=token_id,
#     )
#     signed_order = client.create_order(order_args)

#     response = client.post_order(signed_order, OrderType.FOK)  # Does FOK count as MO?, trying to do this here
#     print(response.success)

#     return response.success

def place_order(token_id, ask_price, thresholded_size):
    try:
        # Create the order arguments
        order_args = OrderArgs(
            price=ask_price,
            size=thresholded_size,
            side=BUY,
            token_id=token_id,
        )
        
        # Create and sign the order
        signed_order = client.create_order(order_args)

        # Send the order and get the response
        response = client.post_order(signed_order, OrderType.FOK)
        
        # Print the response success or error for debugging
        print("Order Response:", response)
        print("Order Success:", response.success)
        
        return response.success

    except Exception as e:
        # Print the error message for further debugging
        print(f"Failed to place order: {e}")
        return False




def getBlackSwanEvents() :
    # Load the JSON file (assuming the JSON data is stored in a file called 'markets.json')
    with open('reward_markets.json', 'r') as file:
        data = json.load(file)
    black_swan_list = {}
    # Iterate over the data to check the token prices
    for event in data['data']:
        for token in event['tokens']:
            if token['price'] <= 0.005 and token['price'] > 0:
                # print(f"Market Question: {event['question']}")
                # print(f"Outcome: {token['outcome']}")
                # print(f"Price: {token['price']}")
                # print("-" * 40)
                # print(token['token_id'])
                print(event['rewards']['min_size'])
                black_swan_list[token['token_id']] = [token['price'], event['rewards']['min_size']]


    with open('black_swan_events.json', 'w') as json_file:
        json.dump(black_swan_list, json_file, indent=4)  

    print("Saved to black_swan_events.json")    
    return black_swan_list

def calculate_slippage(current_price, initial_price):
    # Calculate the slippage percentage between two price levels.
    return abs((current_price - initial_price) / initial_price)


def place_live_orders():
    # Place orders until you run out of threshold

    global max_slippage
    global threshold

    rem_threshold = threshold

    while rem_threshold > 0:
        black_swan_list = getBlackSwanEvents()
        asks = get_asks(black_swan_list)

        # Perform logic/checking here?
        for token, ask_list in asks.items():

            ask_list.sort(key=lambda x: x[0])  # Sort by price (ascending)

            # For now get the last element directly which is the min price
            ask_price  = asks[token][:-1][0][0]
            size_available = asks[token][:-1][0][1]

            # Check how many shares can be bought
            if ask_price * size_available <= rem_threshold:
                order_success = place_order(token, ask_price, size_available)
            
            else:
                thresholded_size = rem_threshold/ask_price
                order_success = place_order(token, ask_price, thresholded_size)
            
            if order_success:
                rem_threshold -= thresholded_size * ask_price

def test_connection():
    try:
        response = client.get_markets(next_cursor="")
        print("Connection successful. Markets response:", response)
    except Exception as e:
        print(f"Connection failed: {e}")

        


# Main function that calls the other functions
def main():
    # Initialize the client
    initialize()

    #Run for the first time to get your keys
    #get_api_keys()

    if client:
        # Get all markets
        # get_markets()

        # # Get reward-enabled markets
        # get_reward_markets()
        # getBlackSwanEvents()
        place_live_orders()
        # test_connection()
        # place_order("88027839609243624193415614179328679602612916497045596227438675518749602824929", 0.001, 200)
    
   

# Call the main function if this script is run directly
if __name__ == "__main__":
    main()
