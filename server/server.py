from tornado import web, websocket, ioloop
import json
from random import randint


class MainHandler(web.RequestHandler):
    def get(self):
        self.render("../client/index.html")


class Player:
    def __init__(self):
        self.name = ''
        self.ready = False


class WSHandler(websocket.WebSocketHandler):
    __handlers = []
    __turn = -1

    def open(self):
        self.__player = Player()
        WSHandler.__handlers.append(self)

    def on_message(self, message):
        msg = json.loads(message)

        if msg['message'] == 'myName':
            name = msg['myName']
            if name not in [handler.__player.name for handler in WSHandler.__handlers]:
                self.__player.name = msg['myName']
                self.write_message(json.dumps({'message': 'nameAccepted', 'valid': True}))
                WSHandler.__broadcast({'message': 'reset'})
                WSHandler.__broadcast_pnames()
            else:
                self.write_message({'message': 'nameAccepted', 'valid': False})

        elif msg['message'] == 'ready':
            self.__player.ready = True
            unready = [handler.__player.name for handler in WSHandler.__handlers if handler.__player.ready is False]
            ready = [handler.__player.name for handler in WSHandler.__handlers if handler.__player.ready is True]
            if len(unready) == 0:
                if len(ready) > 1:
                    WSHandler.__broadcast({'message': 'start'})
                    WSHandler.__next_turn()
                else:
                    WSHandler.__broadcast({'message': 'reset'})
                    WSHandler.__broadcast_pnames()

        elif msg['message'] == 'rollDice':
            msg = dict(message='playerMove', player=self.__player.name, move=randint(1, 20))
            WSHandler.__broadcast(msg)
            WSHandler.__next_turn()

    def on_close(self):
        self.__handlers.remove(self)
        WSHandler.__broadcast({'message': 'reset'})
        WSHandler.__broadcast_pnames()

    def check_origin(self, origin):
        return True

    @staticmethod
    def __next_turn():
        WSHandler.__turn = (WSHandler.__turn + 1) % len(WSHandler.__handlers)
        msg = { 'message': 'newTurn', 'player': WSHandler.__handlers[WSHandler.__turn].__player.name }
        WSHandler.__broadcast(msg)

    @staticmethod
    def __broadcast(msg):
        for handler in WSHandler.__handlers:
            handler.write_message(json.dumps(msg))

    @staticmethod
    def __broadcast_pnames():
        pnames = [handler.__player.name for handler in WSHandler.__handlers if handler.__player.name != '']
        WSHandler.__broadcast({'message': 'userList', 'userList': pnames})


app = web.Application([
        ('/', MainHandler),
        ('/ws', WSHandler),
        ('/js/(.*)', web.StaticFileHandler, dict(path='../client/js')),
        ('/css/(.*)', web.StaticFileHandler, dict(path='../client/css')),
        ('/images/(.*)', web.StaticFileHandler, dict(path='../client/images')),
        ('/(.*)', web.StaticFileHandler, dict(path='../client'))   # Not a good solution, should be changed in the future
    ])


def _main_loop():
    import sys
    port = sys.argv[1] if len(sys.argv) == 2 else 8888      # The first command-line argument is the server port
    app.listen(port)
    print('Started Monopoly server on port', port)
    ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    _main_loop()
