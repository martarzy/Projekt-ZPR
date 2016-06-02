from random import randint


class Player:
    def __init__(self, name, handler):
        self.name = name
        self.handler = handler  # Handler is a class which must have write_message() function
        self.ready = False
        self.cash = 1500
        self.field_no = 0
        self.last_roll = 0

    def error(self, error_code):
        self.handler.send_message({'message': 'invalidOperation', 'error': error_code})


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


class GameManager:
    def __init__(self):
        self.players = []
        self.turn = -1
        self.pname_map = {}
        self.started = False
        self.fields = []

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

        if self.turn != -1 and self.players[self.turn] is not player:
            player.error('NotYourTurn')

        elif msg['message'] == 'ready':
            self.ready(player)

        elif msg['message'] == 'rollDice':
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

    def roll_dice(self, player):
        player.last_roll = self.generate_roll()
        msg = dict(message='playerMove', player=player.name, move=player.last_roll)
        self.broadcast(msg)
        player.field_no += player.last_roll
        if player.field_no >= 40:
            player.cash += 400
            player.field_no -= 40
            self.broadcast_cash_info(player)
        self.stay_fee(player)

    @staticmethod
    def generate_roll():
        return 1
        result = 0

        for _ in range(3):
            first = randint(1, 6)
            second = randint(1, 6)
            result += first + second
            if first != second:
                break

        return result

    def reset(self):
        for player in self.players:
            player.ready = False
        self.turn = -1
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
        self.turn = (self.turn + 1) % len(self.players)
        msg = {'message': 'newTurn', 'player': self.players[self.turn].name}
        self.broadcast(msg)

    def buy_field(self, player):
        field = self.fields[player.field_no]
        if field.buyable and field.owner is None and player.cash >= field.price:
            player.cash -= field.price
            self.broadcast_cash_info(player)
            field.owner = player
            self.broadcast_field_buy(player)
        else:
            player.error('notAbleToBuy')

    def buy_house(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.buildable and field.houses_no < 5 and player.cash >= field.price and self.uniform_building(field, +1) and self.own_all_in_group(player, field) and field.mortgaged is False:
            player.cash -= field.house_price
            self.broadcast_cash_info(player)
            field.houses_no += 1
            self.broadcast_house_buy_info(player, field_no)
        else:
            player.error('notAbleToBuyHouse')

    def sell_house(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.buildable and field.houses_no > 0 and self.uniform_building(field, -1) and self.own_all_in_group(player, field):
            player.cash += field.house_price / 2
            self.broadcast_cash_info(player)
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

            player.cash -= fee
            self.broadcast_cash_info(player)
            field.owner.cash += fee
            self.broadcast_cash_info(field.owner)

        elif field.group_name == 'Income Tax':
            player.cash -= 200
            self.broadcast_cash_info(player)

        elif field.group_name == 'Luxury Tax':
            player.cash -= 100
            self.broadcast_cash_info(player)

    def mortgage(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.mortgaged is False and field.houses_no == 0:
            player.cash += field.price / 2
            self.broadcast_cash_info(player)
            field.mortgaged = True
            self.broadcast_mortgage(field_no)

    def unmortgage(self, player, field_no):
        field = self.fields[field_no]
        unmortgage_price = 1.1 * (field.price / 2)
        if field.owner is player and field.mortgaged is True and player.cash >= unmortgage_price:
            player.cash -= unmortgage_price
            self.broadcast_cash_info(player)
            field.mortgaged = False
            self.broadcast_unmortgage(field_no)

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

    def broadcast(self, msg):
        for player in self.players:
            player.handler.send_message(msg)

    def get_players_number(self):
        return len(self.players)

    def broadcast_pnames(self):
        pnames = [player.name for player in self.players]
        self.broadcast({'message': 'userList', 'userList': pnames})
