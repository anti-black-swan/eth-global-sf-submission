from dotenv import load_dotenv
import os
from py_clob_client.constants import POLYGON
from py_clob_client.client import ClobClient
from py_clob_client.order_builder.constants import BUY
import json
import logging
from py_clob_client.clob_types import ApiCreds, OrderArgs, OrderType, BookParams

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ClobTrader:
    def __init__(self, threshold: float = 10000, max_slippage: float = 0.01):
        self.threshold = threshold
        self.max_slippage = max_slippage
        self.client = None
        self.initialize_client()

    def initialize_client(self):
        load_dotenv()
        host = "https://clob.polymarket.com"
        key = os.getenv("PK")
        chain_id = POLYGON
        self.client = ClobClient(host, key=key, chain_id=chain_id)
        self.client.set_api_creds(self.client.create_or_derive_api_creds())
        logging.info("CLOB client initialized.")

    def get_markets(self, filename='markets.json'):
        resp = self.client.get_markets(next_cursor="")
        with open(filename, 'w') as json_file:
            json.dump(resp, json_file, indent=4)
        logging.info(f"Saved markets data to {filename}.")

    def get_reward_markets(self, filename='reward_markets.json'):
        resp = self.client.get_sampling_markets(next_cursor="")
        with open(filename, 'w') as json_file:
            json.dump(resp, json_file, indent=4)
        logging.info(f"Saved reward markets data to {filename}.")

    def get_asks(self, black_swan_list: dict) -> dict:
        param_list = [BookParams(token_id=token) for token in black_swan_list.keys()]
        response = self.client.get_order_books(params=param_list)
        response_dict = [book.__dict__ for book in response]

        with open('market_book.json', 'w') as json_file:
            json.dump(response_dict, json_file, indent=4)
        logging.info("Saved market book data to market_book.json.")

        asks = {}
        for book in response:
            asks[book.asset_id] = [(float(ask.price), float(ask.size)) for ask in book.asks]
        return asks

    def place_order(self, token_id: str, ask_price: float, thresholded_size: float) -> bool:
        try:
            rounded_size = int(thresholded_size)
            rounded_price = max(.01, ask_price)

            logging.info(f"Placing order - Token: {token_id}, Price: {rounded_price}, Size: {rounded_size}")

            order_args = OrderArgs(
                price=rounded_price,
                size=rounded_size,
                side=BUY,
                token_id=token_id,
            )
            signed_order = self.client.create_order(order_args)
            response = self.client.post_order(signed_order, OrderType.FOK)

            logging.info(f"Order Response: {response}")
            return response.success
        except Exception as e:
            logging.error(f"Failed to place order: {e}")
            return False

    def get_black_swan_events(self, filename='reward_markets.json') -> dict:
        with open(filename, 'r') as file:
            data = json.load(file)

        black_swan_list = {
            token['token_id']: [token['price'], event['rewards']['min_size']]
            for event in data['data']
            for token in event['tokens']
            if 0 < token['price'] <= 0.005
        }

        with open('black_swan_events.json', 'w') as json_file:
            json.dump(black_swan_list, json_file, indent=4)
        logging.info("Saved black swan events to black_swan_events.json.")
        return black_swan_list

    def calculate_slippage(self, current_price: float, initial_price: float) -> float:
        return abs((current_price - initial_price) / initial_price)

    def load_probabilities_of_winning(self, filepath: str) -> dict:
        with open(filepath, 'r') as file:
            event_data = json.load(file)
        return {token_id: 1 - data[0] for token_id, data in event_data.items()}

    def kelly_criterion(self, probability_of_winning: float, odds: float, min_kelly_fraction: float = 0.0001) -> float:
        probability_of_losing = 1 - probability_of_winning
        net_odds = odds - 1
        kelly_fraction = (net_odds * probability_of_winning - probability_of_losing) / net_odds
        return max(min_kelly_fraction, kelly_fraction)

    def place_live_orders_with_kelly(self):
        MIN_BET_SIZE = 0.001
        MIN_KELLY_FRACTION = 0.0001
        probabilities = self.load_probabilities_of_winning('black_swan_events.json')
        rem_threshold = self.threshold

        while rem_threshold > 0:
            black_swan_list = self.get_black_swan_events()
            asks = self.get_asks(black_swan_list)

            for token, ask_list in asks.items():
                ask_list.sort(key=lambda x: x[0])
                ask_price = ask_list[0][0]
                size_available = ask_list[0][1]

                if token not in probabilities:
                    logging.warning(f"No probability found for token {token}, skipping.")
                    continue

                if not (0.001 <= ask_price <= 0.999):
                    logging.warning(f"Skipping token {token} due to invalid ask price: {ask_price}.")
                    continue

                probability_of_winning = probabilities[token]
                min_order_size = float(black_swan_list[token][1])

                odds = 1 / ask_price
                kelly_fraction = self.kelly_criterion(probability_of_winning, odds, MIN_KELLY_FRACTION)
                optimal_bet_size = rem_threshold * kelly_fraction

                if optimal_bet_size < MIN_BET_SIZE:
                    optimal_bet_size = MIN_BET_SIZE

                if optimal_bet_size < min_order_size:
                    logging.info(f"Skipping token {token} due to minimum order size of {min_order_size}.")
                    continue

                if ask_price * size_available <= optimal_bet_size:
                    order_success = self.place_order(token, ask_price, size_available)
                    if order_success:
                        rem_threshold -= ask_price * size_available
                else:
                    thresholded_size = optimal_bet_size / ask_price
                    if thresholded_size > 0:
                        order_success = self.place_order(token, ask_price, thresholded_size)
                        if order_success:
                            rem_threshold -= ask_price * thresholded_size
                    else:
                        logging.info(f"Skipping token {token} due to zero or very small thresholded size.")

                if rem_threshold <= 0:
                    break

def main():
    trader = ClobTrader()
    trader.place_live_orders_with_kelly()

if __name__ == "__main__":
    main()