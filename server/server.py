from tornado import web, ioloop


class MainHandler(web.RequestHandler):
    def get(self):
        self.render("../client/index.html")


app = web.Application([
        ('/', MainHandler),
        ('/js/(.*)', web.StaticFileHandler, dict(path='../client/js')),
        ('/css/(.*)', web.StaticFileHandler, dict(path='../client/css')),
        ('/images/(.*)', web.StaticFileHandler, dict(path='../client/images'))
    ])


def _main_loop():
    import sys
    port = sys.argv[1] if len(sys.argv) == 2 else 8888      # The first command-line argument is the server port
    app.listen(port)
    print('Started Monopoly server on port', port)
    ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    _main_loop()
 
