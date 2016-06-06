from player import Player
from chance import ChanceStack
from random import randint


class Field:
    def __init__(self, group_name, price=0, house_price=0, visit_cost=(0,)):
        self.owner = None
        self.group_name = group_name
        self.price = price
        self.house_price = house_price
        self.visit_cost = visit_cost
        self.mortgaged = False

        self.buyable = price > 0
        self.buildable = house_price > 0

        self.bought = False
        self.houses_no = 0


class Trade:
    def __init__(self, player, other_player, offered_fields_nos, offered_cash, demanded_fields_nos, demanded_cash):
        self.player = player
        self.other_player = other_player
        self.offered_fields_nos = offered_fields_nos
        self.offered_cash = offered_cash
        self.demanded_fields_nos = demanded_fields_nos
        self.demanded_cash = demanded_cash


class GameManager:
    def __init__(self):
        self.players = []
        self.turn = -1
        self.pname_map = {}
        self.started = False
        self.fields = []
        self.trade = None
        self.chance_stack = ChanceStack()

        self.fields.append(Field("Go"))
        self.fields.append(Field("Brown", 60, 50, (2, 10, 30, 90, 160, 250)))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Brown", 60, 50, (4, 20, 60, 180, 320, 450)))
        self.fields.append(Field("Income Tax"))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Azure", 100, 50, (6, 30, 90, 270, 400, 550)))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Azure", 100, 50, (6, 30, 90, 270, 400, 550)))
        self.fields.append(Field("Azure", 120, 50, (8, 40, 100, 300, 450, 600)))

        self.fields.append(Field("Jail"))
        self.fields.append(Field("Pink", 140, 100, (10, 50, 150, 450, 625, 750)))
        self.fields.append(Field("Utility", 150))
        self.fields.append(Field("Pink", 140, 100, (10, 50, 150, 450, 625, 750)))
        self.fields.append(Field("Pink", 160, 100, (12, 60, 180, 500, 700, 900)))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Orange", 160, 100, (14, 70, 200, 550, 750, 950)))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Orange", 160, 100, (14, 70, 200, 550, 750, 950)))
        self.fields.append(Field("Orange", 180, 100, (16, 80, 220, 600, 800, 1000)))

        self.fields.append(Field("Parking"))
        self.fields.append(Field("Red", 220, 150, (18, 90, 250, 700, 875, 1050)))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Red", 220, 150, (18, 90, 250, 700, 875, 1050)))
        self.fields.append(Field("Red", 240, 150, (20, 100, 300, 750, 925, 1100)))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Yellow", 260, 150, (22, 110, 330, 800, 975, 1150)))
        self.fields.append(Field("Yellow", 260, 150, (22, 110, 330, 800, 975, 1150)))
        self.fields.append(Field("Utility", 150))
        self.fields.append(Field("Yellow", 280, 150, (24, 120, 360, 850, 1025, 1200)))

        self.fields.append(Field("Go to jail"))
        self.fields.append(Field("Green", 300, 200, (26, 130, 390, 900, 1100, 1275)))
        self.fields.append(Field("Green", 300, 200, (26, 130, 390, 900, 1100, 1275)))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Green", 320, 200, (28, 150, 450, 1000, 1200, 1400)))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Blue", 350, 200, (35, 175, 500, 1100, 1300, 1500)))
        self.fields.append(Field("Luxury tax"))
        self.fields.append(Field("Blue", 350, 200, (50, 200, 600, 1400, 1700, 2000)))

    def add_player(self, name, handler):
        new_player = Player(name, handler)
        self.players.append(new_player)
        self.pname_map[name] = new_player
        self.reset()

    def remove_player(self, player_name):
        self.players.remove(self.pname_map[player_name])
        del self.pname_map[player_name]
        self.reset()

    def is_valid(self, name):
        return name != '' and name not in [player.name for player in self.players]

    def game_started(self):
        return self.started

    def on_message(self, pname, msg):
        player = self.pname_map[pname] if pname != '' else None

        if self.trade is not None and player is not self.trade.other_player:
            player.error('WaitingForTradeDecision')

        elif self.trade is None and self.turn != -1 and self.players[self.turn] is not player:
            player.error('NotYourTurn')

        elif msg['message'] == 'ready':
            self.ready(player)

        else:
            if self.trade is not None:
                player.init_state(True)

            if player.update_state(msg['message']):

                if msg['message'] == 'rollDice':
                    self.roll_dice(player)

                elif msg['message'] == 'buyField':
                    self.buy_field(player)

                elif msg['message'] == 'buyHouse':
                    self.buy_house(player, msg['field'])

                elif msg['message'] == 'sellHouse':
                    self.sell_house(player, msg['field'])

                elif msg['message'] == 'mortgage':
                    self.mortgage(player, msg['field'])

                elif msg['message'] == 'unmortgage':
                    self.unmortgage(player, msg['field'])

                elif msg['message'] == 'endOfTurn':
                    self.next_turn()

                elif msg['message'] == 'trade':
                    other_player = self.pname_map[msg['otherUsername']]
                    trade = Trade(player, other_player, msg['offeredFields'], msg['offeredCash'], msg['demandedFields'], msg['demandedCash'])
                    self.trade_offer(trade)

                elif msg['message'] == 'tradeAcceptance':
                    self.trade_acceptance(msg['accepted'])

                elif msg['message'] == 'getOut':
                    self.get_out_of_jail(player, msg['method'])

                elif msg['message'] == 'declareBankruptcy':
                    self.bankrupt(player)

                else:
                    player.error('wrongMessageKey')

            else:
                player.error('invalidMessage')

    def roll_dice(self, player):
        roll = [randint(1, 6), (randint(1, 6))]
        player.last_roll = roll[0] + roll[1]
        self.broadcast({'message': 'playerMove', 'player': player.name, 'move': roll})
        self.move(player, player.last_roll)

    @staticmethod
    def generate_roll():
        first = randint(1, 6)
        second = randint(1, 6)
        return [first, second]

    def reset(self):
        for player in self.players:
            player.ready = False
        self.turn = -1
        self.started = False
        self.broadcast_pnames()

    def ready(self, player):
        player.ready = True
        unready = [player.name for player in self.players if player.ready is False]
        ready = [player.name for player in self.players if player.ready is True]
        if len(unready) == 0 and len(ready) > 1:
            self.start_game()

    def start_game(self):
        self.started = True
        self.broadcast({'message': 'start'})
        for player in self.players:
            self.broadcast_cash_info(player)
        self.next_turn()

    def next_turn(self):
        while True:
            self.turn = (self.turn + 1) % len(self.players)
            if not self.players[self.turn].bankrupt:
                self.players[self.turn].init_state()
                msg = {'message': 'newTurn', 'player': self.players[self.turn].name}
                self.broadcast(msg)
                break

    def buy_field(self, player):
        field = self.fields[player.field_no]
        if field.buyable and field.owner is None and player.cash >= field.price:
            self.add_cash(player, -field.price)
            field.owner = player
            self.broadcast_field_buy(player)
        else:
            player.error('notAbleToBuy')

    def buy_house(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.buildable and field.houses_no < 5 and player.cash >= field.price and self.uniform_building(field, +1) and self.own_all_in_group(player, field) and field.mortgaged is False:
            self.add_cash(player, -field.house_price)
            field.houses_no += 1
            self.broadcast_house_buy_info(player, field_no)
        else:
            player.error('notAbleToBuyHouse')

    def sell_house(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.buildable and field.houses_no > 0 and self.uniform_building(field, -1) and self.own_all_in_group(player, field):
            self.add_cash(player, field.house_price / 2)
            field.houses_no -= 1
            self.broadcast_house_sell_info(player, field_no)
        else:
            player.error('notAbleToSell')

    def uniform_building(self, field, diff):
        houses_numbers = [f.houses_no for f in self.fields if f is not field and f.group_name == field.group_name]
        houses_numbers.append(field.houses_no + diff)
        if max(houses_numbers) - min(houses_numbers) <= 1:
            return True
        return False

    def own_all_in_group(self, player, field):
        owners = [f.owner for f in self.fields if f.group_name == field.group_name]

        for owner in owners:
            if owner is not player:
                break
        else:
            return True
        return False

    def stay_fee(self, player):
        field = self.fields[player.field_no]
        if field.owner is not None and field.owner is not player:
            if field.group_name == 'Railroad':
                fee = 25 * 2 ** (len([f for f in self.fields if f.group_name == 'Railroad' and f.owner is field.owner]) - 1)

            elif field.group_name == 'Utility':
                if len([f for f in self.fields if f.group_name == 'Utility' and f.owner is field.owner]) == 2:
                    fee = 10 * player.last_roll
                else:
                    fee = 4 * player.last_roll

            else:
                fee = field.visit_cost[field.houses_no]

            self.add_cash(player, -fee)
            self.add_cash(field.owner, fee)

        elif field.group_name == 'Income Tax':
            self.add_cash(player, -200)

        elif field.group_name == 'Luxury Tax':
            self.add_cash(player, -100)

    def mortgage(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.mortgaged is False and field.houses_no == 0:
            self.add_cash(player, field.price / 2)
            field.mortgaged = True
            self.broadcast_mortgage(field_no)

    def unmortgage(self, player, field_no):
        field = self.fields[field_no]
        unmortgage_price = 1.1 * (field.price / 2)
        if field.owner is player and field.mortgaged is True and player.cash >= unmortgage_price:
            self.add_cash(player, -unmortgage_price)
            field.mortgaged = False
            self.broadcast_unmortgage(field_no)

    def trade_offer(self, trade):
        offered_fields_owners = [self.fields[i].owner for i in trade.offered_fields_nos]
        demanded_fields_owners = [self.fields[i].owner for i in trade.demanded_fields_nos]
        offered_fields_without_houses = [self.fields[i] for i in trade.offered_fields_nos if self.fields[i].houses_no == 0]
        demanded_fields_without_houses = [self.fields[i] for i in trade.demanded_fields_nos if self.fields[i].houses_no == 0]
        offered_fields_valid = len(offered_fields_owners) == offered_fields_owners.count(trade.player) == len(offered_fields_without_houses)
        demanded_fields_valid = len(demanded_fields_owners) == demanded_fields_owners.count(trade.other_player) == len(demanded_fields_without_houses)

        if trade.player.cash >= trade.offered_cash and trade.other_player.cash >= trade.demanded_cash and offered_fields_valid and demanded_fields_valid:
            self.trade = trade
            self.broadcast_trade_offer(trade)
        else:
            trade.player.error('ImproperTradeOffer')

    def trade_acceptance(self, accepted):
        if accepted:
            self.trade.player.cash -= self.trade.offered_cash
            self.trade.player.cash += self.trade.demanded_cash
            self.broadcast_cash_info(self.trade.player)
            self.trade.other_player.cash += self.trade.offered_cash
            self.trade.other_player.cash -= self.trade.demanded_cash
            self.broadcast_cash_info(self.trade.other_player)

            for field_no in self.trade.offered_fields_nos:
                self.fields[field_no].owner = self.trade.other_player

            for field_no in self.trade.demanded_fields_nos:
                self.fields[field_no].owner = self.trade.player

        self.trade = None
        self.broadcast_trade_acceptance(accepted)

    def chance(self, player):
        card = self.chance_stack.get_card()
        self.broadcast(card)
        if card['action'] == 'goto':
            move = card['field'] - player.field_no
            if move < 0:
                move += 40
            self.move(player, move)
        elif card['action'] == 'move':
            self.move(player, card['move'])
        elif card['action'] == 'cash':
            player.cash += card['cash']
            self.broadcast_cash_info(player)
        elif card['action'] == 'getOut':
            player.get_out_cards_no += 1
        elif card['action'] == 'gotoJail':
            player.goto_jail()

    def get_out_of_jail(self, player, method):
        if method == 'useCard' and player.get_out_cards_no > 0:
            player.get_out_cards_no -= 1
            self.chance_stack.return_get_out_card()
            player.in_jail = False
        elif method == 'pay' and player.cash >= 50:
            self.add_cash(player, -50)
            player.in_jail = False
        else:
            player.error('ImproperGetOutMethod')

    def bankrupt(self, player):
        player.bankrupt = True
        for field in self.fields:
            field.owner = field.owner if field.owner is not player else None
        self.broadcast({'message': 'declareBankruptcy'})
        if len([player for player in self.players if not player.bankrupt]) == 1:
            self.broadcast({'message': 'gameOver'})

    def add_cash(self, player, cash):
        player.cash += cash
        self.broadcast_cash_info(player)

    def move(self, player, move):
        player.field_no += move
        if player.field_no >= 40:
            self.add_cash(player, 400)
            player.field_no -= 40
        elif player.field_no < 0:
            player.field_no += 40

        self.stay_fee(player)
        if self.fields[player.field_no].group_name == 'Chance':
            self.chance(player)
        elif self.fields[player.field_no].group_name == 'Go to jail':
            player.goto_jail()
            self.broadcast({'message': 'chance', 'action': 'gotoJail'})

    def broadcast_field_buy(self, player):
        self.broadcast({'message': 'userBought', 'username': player.name})

    def broadcast_cash_info(self, player):
        self.broadcast({'message': 'setCash', 'cash': player.cash, 'player': player.name})

    def broadcast_house_buy_info(self, player, field_no):
        self.broadcast({'message': 'userBoughtHouse', 'username': player.name, 'field': field_no})

    def broadcast_house_sell_info(self, player, field_no):
        self.broadcast({'message': 'userSoldHouse', 'username': player.name, 'field': field_no})

    def broadcast_mortgage(self, field_no):
        self.broadcast({'message': 'userMortgaged', 'field': field_no})

    def broadcast_unmortgage(self, field_no):
        self.broadcast({'message': 'userUnmortgaged', 'field': field_no})

    def broadcast_trade_offer(self, trade):
        self.broadcast({'message': 'trade',
                        'otherUsername': trade.other_player.name,
                        'offeredFields': trade.offered_fields_nos,
                        'offeredCash': trade.offered_cash,
                        'demandedFields': trade.demanded_fields_nos,
                        'demandedCash': trade.demanded_cash})

    def broadcast_trade_acceptance(self, accepted):
        self.broadcast({'message': 'tradeAcceptance', 'accepted': accepted})

    def broadcast(self, msg):
        for player in self.players:
            player.handler.send_message(msg)

    def get_players_number(self):
        return len(self.players)

    def broadcast_pnames(self):
        pnames = [player.name for player in self.players]
        self.broadcast({'message': 'userList', 'userList': pnames})
