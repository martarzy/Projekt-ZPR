from random import randint


class Player:
    def __init__(self, name, handler):
        self.name = name
        self.handler = handler  # Handler is a class which must have write_message() function
        self.ready = False
        self.cash = 1500
        self.field_no = 0

    def error(self, error_code):
        self.handler.send_message({'message': 'invalidOperation', 'error': error_code})


class Field:
    def __init__(self, group_name, price=0, house_price=0):
        self.owner = None
        self.group_name = group_name
        self.price = price
        self.house_price = house_price

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
        self.fields.append(Field("Brown", 60, 50))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Brown", 60, 50))
        self.fields.append(Field("Income Tax"))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Azure", 100, 50))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Azure", 100, 50))
        self.fields.append(Field("Azure", 120, 50))

        self.fields.append(Field("Jail"))
        self.fields.append(Field("Pink", 140, 100))
        self.fields.append(Field("Utility", 150))
        self.fields.append(Field("Pink", 140, 100))
        self.fields.append(Field("Pink", 160, 100))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Orange", 160, 100))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Orange", 160, 100))
        self.fields.append(Field("Orange", 180, 100))

        self.fields.append(Field("Parking"))
        self.fields.append(Field("Red", 220, 150))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Red", 220, 150))
        self.fields.append(Field("Red", 240, 150))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Yellow", 260, 150))
        self.fields.append(Field("Yellow", 260, 150))
        self.fields.append(Field("Utility", 150))
        self.fields.append(Field("Yellow", 280, 150))

        self.fields.append(Field("Go to jail"))
        self.fields.append(Field("Green", 300, 200))
        self.fields.append(Field("Green", 300, 200))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Green", 320, 200))
        self.fields.append(Field("Railroad", 200))
        self.fields.append(Field("Chance"))
        self.fields.append(Field("Blue", 350, 200))
        self.fields.append(Field("Luxury tax"))
        self.fields.append(Field("Blue", 350, 200))

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
            result = self.roll_dice()
            msg = dict(message='playerMove', player=player.name, move=result)
            self.broadcast(msg)
            player.field_no += result
            if player.field_no >= 40:
                player.cash += 400
                player.field_no -= 40
                self.broadcast_cash_info(player)

        elif msg['message'] == 'buyField':
            self.buy_field(player)

        elif msg['message'] == 'buyHouse':
            self.buy_house(player, msg['field'])

        elif msg['message'] == 'sellHouse':
            self.sell_house(player, msg['field'])

        elif msg['message'] == 'endOfTurn':
            self.next_turn()

    @staticmethod
    def roll_dice():
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
        if field.owner is player and field.buildable and field.houses_no < 5 and player.cash >= field.price and self.uniform_building(field, +1) and self.own_all_in_group(player, field):
            player.cash -= field.house_price
            self.broadcast_cash_info(player)
            field.houses_no += 1
            self.broadcast_house_buy_info(player, field_no)
        else:
            player.error('notAbleToBuyHouse')

    def sell_house(self, player, field_no):
        field = self.fields[field_no]
        if field.owner is player and field.buildable and field.houses_no > 0 and self.uniform_building(field, -1) and self.own_all_in_group(player, field_no):
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

    def broadcast_field_buy(self, player):
        self.broadcast({'message': 'userBought', 'username': player.name})

    def broadcast_cash_info(self, player):
        self.broadcast({'message': 'setCash', 'cash': player.cash, 'player': player.name})

    def broadcast_house_buy_info(self, player, field_no):
        self.broadcast({'message': 'userBoughtHouse', 'username': player.name, 'field': field_no})

    def broadcast_house_sell_info(self, player, field_no):
        self.broadcast({'message': 'userSoldHouse', 'username': player.name, 'field': field_no})

    def broadcast(self, msg):
        for player in self.players:
            player.handler.send_message(msg)

    def get_players_number(self):
        return len(self.players)

    def broadcast_pnames(self):
        pnames = [player.name for player in self.players]
        self.broadcast({'message': 'userList', 'userList': pnames})
