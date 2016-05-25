from random import randint


class Player:
    def __init__(self, name, handler):
        self.name = name
        self.ready = False
        self.handler = handler  # Handler is a class which must have write_message() function


class GameManager:
    def __init__(self):
        self.players = []
        self.turn = -1
        self.pname_map = {}

    def add_player(self, name, handler):
        new_player = Player(name, handler)
        self.players.append(new_player)
        self.pname_map[name] = new_player
        self.broadcast({'message': 'reset'})
        self.broadcast_pnames()

    def remove_player(self, player_name):
        del self.pname_map[player_name]
        for player in self.players:
            if player.name == player_name:
                self.players.remove(player)
                break

        self.broadcast({'message': 'reset'})
        self.broadcast_pnames()

    def is_valid(self, name):
        return name != '' and name not in [player.name for player in self.players]

    def on_message(self, pname, msg):
        player = self.pname_map[pname] if pname != '' else None

        if msg['message'] == 'ready':
            player.ready = True
            unready = [player.name for player in self.players if player.ready is False]
            ready = [player.name for player in self.players if player.ready is True]
            if len(unready) == 0:
                if len(ready) > 1:
                    self.broadcast({'message': 'start'})
                    self.next_turn()
                else:
                    self.broadcast({'message': 'reset'})
                    self.broadcast_pnames()

        elif msg['message'] == 'rollDice':
            msg = dict(message='playerMove', player=player.name, move=self.roll_dice())
            self.broadcast(msg)
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

    def next_turn(self):
        self.turn = (self.turn + 1) % len(self.players)
        msg = {'message': 'newTurn', 'player': self.players[self.turn].name}
        self.broadcast(msg)

    def broadcast(self, msg):
        for player in self.players:
            player.handler.send_message(msg)

    def broadcast_pnames(self):
        pnames = [player.name for player in self.players]
        self.broadcast({'message': 'userList', 'userList': pnames})
