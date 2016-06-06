import unittest
import websocket
import json
from urllib.request import urlopen


SERVER_PORT = 8888


class LoadAppPage(unittest.TestCase):
    def test_load_page(self):
        response = urlopen('http://localhost:' + str(SERVER_PORT)).getcode()
        self.assertEqual(response, 200)


class SinglePlayerConnectCase(unittest.TestCase):
    def setUp(self):
        self.ws = websocket.create_connection('ws://localhost:' + str(SERVER_PORT) + '/ws')

    def test_empty_name(self):
        msg = {'message': 'myName', 'myName': ''}
        self.ws.send(json.dumps(msg))
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False, 'error': 'notUniqueName'})

    def test_give_name(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        self.ws.send(json.dumps(msg))
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': True})
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'userList', 'userList': ['krolJulian']})

    def tearDown(self):
        self.ws.close()


class TwoPlayersConnectCase(unittest.TestCase):
    def setUp(self):
        self.ws = websocket.create_connection('ws://localhost:' + str(SERVER_PORT) + '/ws')
        self.ws2 = websocket.create_connection('ws://localhost:' + str(SERVER_PORT) + '/ws')

    def tearDown(self):
        self.ws.close()
        self.ws2.close()

    def test_same_name(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg))
        recv = json.loads(self.ws2.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False, 'error': 'notUniqueName'})

    def test_game_start(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        msg2 = {'message': 'myName', 'myName': 'martarzy'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg2))
        msg = {'message': 'ready'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg))

        self.ws.recv()
        self.ws.recv()
        self.ws.recv()
        self.ws2.recv()
        self.ws2.recv()

        recv = json.loads(self.ws.recv())
        self.assertEqual(recv, {'message': 'start'})
        recv = json.loads(self.ws2.recv())
        self.assertEqual(recv, {'message': 'start'})

    def test_connect_after_start(self):
        self.ws.send(json.dumps({'message': 'myName', 'myName': 'martarzy'}))
        self.ws2.send(json.dumps({'message': 'myName', 'myName': 'krolJulian'}))

        msg = {'message': 'ready'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg))

        self.ws3 = websocket.create_connection('ws://localhost:' + str(SERVER_PORT) + '/ws')
        self.ws3.send(json.dumps({'message': 'myName', 'myName': 'thirdPlayer'}))
        recv = json.loads(self.ws3.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False, 'error': 'gameStarted'})


class TooManyPlayersConnectCase(unittest.TestCase):
    def setUp(self):
        self.ws = []
        for _ in range(7):
            self.ws.append(websocket.create_connection('ws://localhost:' + str(SERVER_PORT) + '/ws'))

    def test_try_connect_too_many(self):
        names = ['player' + str(i) for i in range(7)]
        for i in range(7):
            self.ws[i].send(json.dumps({'message': 'myName', 'myName': names[i]}))

        recv = json.loads(self.ws[6].recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False, 'error': 'tooManyUsers'})

    def tearDown(self):
        for i in range(7):
            self.ws[i].close()

if __name__ == '__main__':
    unittest.main()
