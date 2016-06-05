import unittest
from gamemanager import GameManager
import websocket

class MockHandler:
    def __init__(self):
        self.last_msg = None

    def send_message(self, msg):
        self.last_msg = msg


class TodoName(unittest.TestCase):
    def setUp(self):
        self.gm = GameManager()
        self.gm.add_player('krol_julian', MockHandler())
        self.gm.add_player('martarzy', MockHandler())
        self.gm.add_player('the_bad', MockHandler())

    def test_add_cash(self):
        self.gm.add_cash(self.gm.players[0], 200)
        self.assertEqual(self.gm.players[0].cash, 1700)

    def test_move_with_crossing_the_start(self):
        self.gm.move(self.gm.players[0], 20)    # Free parking field
        self.gm.move(self.gm.players[0], 20)    # Again on Start
        self.assertEqual(self.gm.players[0].cash, 1900)
        self.assertEqual(self.gm.players[0].field_no, 0)

    def test_remove_player(self):
        self.gm.remove_player('martarzy')
        self.assertEqual(len(self.gm.players), 2)
        self.assertEqual(self.gm.players[0].name, 'krol_julian')
        self.assertEqual(self.gm.players[1].name, 'the_bad')

    def test_start_when_players_ready(self):
        for i in range(3):
            self.gm.ready(self.gm.players[i])
        self.assertEqual(self.gm.turn, 0)

    def test_game_over_when_two_players_bankrupted(self):
        self.gm.bankrupt(self.gm.players[0])
        self.gm.bankrupt(self.gm.players[2])
        self.assertTrue(self.gm.players[0].bankrupt)
        self.assertFalse(self.gm.players[1].bankrupt)
        self.assertTrue(self.gm.players[2].bankrupt)
        self.assertDictEqual(self.gm.players[0].handler.last_msg, {'message': 'gameOver'})

    def test_nobody_owns_bankrupts_fields(self):
        self.gm.move(self.gm.players[1], 1)
        self.gm.buy_field(self.gm.players[1])
        self.gm.bankrupt(self.gm.players[1])
        self.assertIsNone(self.gm.fields[1].owner)

    def test_get_out_of_jail_with_card(self):
        self.gm.players[0].get_out_cards_no = 1
        self.gm.players[0].goto_jail()
        self.gm.get_out_of_jail(self.gm.players[0], 'useCard')
        self.assertEqual(self.gm.players[0].get_out_cards_no, 0)
        self.assertFalse(self.gm.players[0].in_jail)


if __name__ == '__main__':
    unittest.main()