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


def get_books():

    response = client.get_order_books(
        params=[
                BookParams(
                    token_id="11015470973684177829729219287262166995141465048508201953575582100565462316088"
                ),
                BookParams(
                    token_id="65444287174436666395099524416802980027579283433860283898747701594488689243696"
                ),
            ]
        )
    # print(response[0])
    # print(response)
    asks = {}
    for book in response:
        asks[book.asset_id] = []
        for ask in book.asks:
            asks[book.asset_id].append((float(ask.price), float(ask.size)))

    print(asks)
    return asks
    
def place_order() :
    
    asks = get_books()
    for token, ask_list in asks.items():
        order_args = OrderArgs(
            price=ask_list[0][0],
            size=100.0, #Add custom size based on conditions
            side=BUY,
            token_id=token,
        )
        signed_order = client.create_order(order_args)

        resp = client.post_order(signed_order)
        print(resp)
        print("Done!")



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
                # black_swan_list[token['token_id']] = [token['price'], token['min_size']]

        # return black_swan_list

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

        # get_books()
        place_order()
        # create_order()
#         print(
#         client.get_price(
#         token_id="106428415972306440805659798821565836957352710901932544423124141186478841559835", side="buy"
#     )
# )
        getBlackSwanEvents()
    
   

# Call the main function if this script is run directly
if __name__ == "__main__":
    main()
