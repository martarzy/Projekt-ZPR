import unittest
import websocket
import json


class SinglePlayerCase(unittest.TestCase):
    def setUp(self):
        self.ws = websocket.create_connection("ws://localhost:8888/ws")

    def test_empty_name(self):
        msg = {'message': 'myName', 'myName': ''}
        self.ws.send(json.dumps(msg))
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False})

    def test_give_name(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        self.ws.send(json.dumps(msg))
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': True})
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'reset'})
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'userList', 'userList': ['krolJulian']})

    def test_ready(self):
        self.test_give_name()
        msg = {'message': 'ready'}
        self.ws.send(json.dumps(msg))
        recv = json.loads(self.ws.recv())
        self.assertDictEqual(recv, {'message': 'reset'})

    def tearDown(self):
        self.ws.close()


class TwoPlayerCase(unittest.TestCase):
    def setUp(self):
        self.ws = websocket.create_connection("ws://localhost:8888/ws")
        self.ws2 = websocket.create_connection("ws://localhost:8888/ws")

    def tearDown(self):
        self.ws.close()
        self.ws2.close()

    def test_same_name(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        self.ws.send(json.dumps(msg))
        self.ws2.recv()     # Reset message received
        self.ws2.recv()     # Connected users list received
        self.ws2.send(json.dumps(msg))
        recv = json.loads(self.ws2.recv())
        self.assertDictEqual(recv, {'message': 'nameAccepted', 'valid': False})

    def test_game_start(self):
        msg = {'message': 'myName', 'myName': 'krolJulian'}
        msg2 = {'message': 'myName', 'myName': 'martarzy'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg2))
        msg = {'message': 'ready'}
        self.ws.send(json.dumps(msg))
        self.ws2.send(json.dumps(msg))

        for i in range(5):  # Skip initial messages: nameAccepted, reset (2x), userList(2x)
            self.ws2.recv()
            self.ws.recv()

        recv = json.loads(self.ws.recv())
        self.assertEqual(recv, {'message': 'start'})
        recv = json.loads(self.ws2.recv())
        self.assertEqual(recv, {'message': 'start'})

if __name__ == '__main__':
    unittest.main()