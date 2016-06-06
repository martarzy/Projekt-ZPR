from tornado import web, websocket, ioloop
from gamemanager import GameManager
import json


gm = GameManager()


class MainHandler(web.RequestHandler):
    def get(self):
        self.render("../client/index.html")


class WSHandler(websocket.WebSocketHandler):

    def open(self):
        self.player_name = ''

    def on_message(self, msg):
        msg = json.loads(msg)

        # Negotiate player name
        try:
            if msg['message'] == 'myName':
                name = msg['myName']

                if gm.game_started():
                    self.write_message(json.dumps({'message': 'nameAccepted', 'valid': False, 'error': 'gameStarted'}))
                elif gm.get_players_number() > 5:     # Max. 6 players allowed
                    self.write_message(json.dumps({'message': 'nameAccepted', 'valid': False, 'error': 'tooManyUsers'}))

                elif gm.is_valid(name):
                    self.player_name = name
                    self.write_message(json.dumps({'message': 'nameAccepted', 'valid': True}))
                    gm.add_player(name, self)
                else:
                    self.write_message(json.dumps({'message': 'nameAccepted', 'valid': False, 'error': 'notUniqueName'}))

            # Other messages are handled by game manager
            else:
                gm.on_message(self.player_name, msg)

        except KeyError:
            self.send_message(json.dumps({'message': 'invalidOperation', 'error': 'notAllowedMessage'}))

    def on_close(self):
        if self.player_name != '':
            gm.remove_player(self.player_name)

    def check_origin(self, origin):
        return True

    def send_message(self, json_msg):
        self.write_message(json.dumps(json_msg))

app = web.Application([
        ('/', MainHandler),
        ('/ws', WSHandler),
        ('/js/(.*)', web.StaticFileHandler, dict(path='../client/js')),
        ('/lib/(.*)', web.StaticFileHandler, dict(path='../client/lib')),
        ('/css/(.*)', web.StaticFileHandler, dict(path='../client/css')),
        ('/images/(.*)', web.StaticFileHandler, dict(path='../client/images')),
        ('/src/(.*)', web.StaticFileHandler, dict(path='../client/src'))
    ])


def _main_loop():
    import sys
    port = sys.argv[1] if len(sys.argv) == 2 else 8888      # The first command-line argument is the server port
    app.listen(port)
    print('Started Monopoly server on port', port)
    ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    _main_loop()
