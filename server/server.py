from tornado import web, websocket, ioloop


class MainHandler(web.RequestHandler):
    def get(self):
        self.render("../client/index.html")


class CommunicationHandler(websocket.WebSocketHandler):
    def open(self):
        print('New connection!')

    def on_message(self, message):
        self.write_message("Hello, I'm Server! You said: " + message)

    def on_close(self):
        print('Closed connection!')

    def check_origin(self, origin):
        return True


app = web.Application([
        ('/', MainHandler),
        ('/ws', CommunicationHandler),
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
