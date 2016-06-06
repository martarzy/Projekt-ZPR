import unittest
from gamemanager import GameManager
from mocks import MockHandler
from gamemanager import Trade


class ScenariosAfterStart(unittest.TestCase):
    def setUp(self):
        self.gm = GameManager()
        self.gm.add_player('krol_julian', MockHandler())
        self.gm.add_player('martarzy', MockHandler())
        self.gm.add_player('the_bad', MockHandler())
        self.p0 = self.gm.players[0]
        self.p1 = self.gm.players[1]
        self.p2 = self.gm.players[2]

    def test_get_players_number(self):
        self.assertEqual(self.gm.get_players_number(), 3)

    def test_after_drawing_all_chance_cards_no_get_out(self):
        for _ in range(20):
            self.gm.chance_stack.get_card()
        cards = [self.gm.chance_stack.get_card() for _ in range(16)]
        get_out_cards = [card for card in cards if card['action'] == 'getOut']
        self.assertEqual(len(get_out_cards), 0)

    def test_add_cash(self):
        self.gm.add_cash(self.p0, 200)
        self.assertEqual(self.p0.cash, 1700)

    def test_move_with_crossing_the_start(self):
        self.gm.move(self.p0, 20)    # Free parking field
        self.gm.move(self.p0, 20)    # Again on Start
        self.assertEqual(self.p0.cash, 1900)
        self.assertEqual(self.p0.field_no, 0)

    def test_remove_player(self):
        self.gm.remove_player('martarzy')
        self.assertEqual(len(self.gm.players), 2)
        self.assertEqual(self.p0.name, 'krol_julian')
        self.assertEqual(self.gm.players[1].name, 'the_bad')

    def test_start_when_players_ready(self):
        for i in range(3):
            self.gm.ready(self.gm.players[i])
        self.assertEqual(self.gm.turn, 0)

    def test_game_over_when_two_players_bankrupted(self):
        self.gm.bankrupt(self.p0)
        self.gm.bankrupt(self.gm.players[2])
        self.assertTrue(self.p0.bankrupt)
        self.assertFalse(self.gm.players[1].bankrupt)
        self.assertTrue(self.gm.players[2].bankrupt)

    def test_nobody_owns_bankrupts_fields(self):
        self.gm.move(self.gm.players[1], 1)
        self.gm.buy_field(self.gm.players[1])
        self.gm.bankrupt(self.gm.players[1])
        self.assertIsNone(self.gm.fields[1].owner)

    def test_get_out_of_jail_with_card(self):
        self.p0.get_out_cards_no = 1
        self.p0.goto_jail()
        self.gm.get_out_of_jail(self.p0, 'useCard')
        self.assertEqual(self.p0.get_out_cards_no, 0)
        self.assertFalse(self.p0.in_jail)

    def test_go_to_jail_after_staying_on_field_30(self):
        self.gm.move(self.p0, 30)
        self.assertTrue(self.p0.in_jail)
        self.assertEqual(self.p0.field_no, 10)

    def test_get_out_of_jail_paying(self):
        self.p0.goto_jail()
        self.gm.get_out_of_jail(self.p0, 'pay')
        self.assertEqual(self.p0.cash, 1450)

    def test_not_existing_message(self):
        self.gm.next_turn()
        self.gm.on_message('krol_julian', {'message': 'notExistingType'})
        self.assertRaises(KeyError)

    def test_stay_on_railroad(self):
        self.gm.move(self.p0, 5)
        self.gm.buy_field(self.p0)
        self.gm.move(self.p1, 5)
        self.assertEqual(self.p0.cash, 1325)
        self.assertEqual(self.p1.cash, 1475)

    def test_simple_trade_accepted(self):
        self.gm.move(self.p0, 5)
        self.gm.buy_field(self.p0)
        p0_cash_before = self.p0.cash
        p1_cash_before = self.p1.cash
        trade = Trade(self.p0, self.p1, [5], 0, [], 400)
        self.gm.trade_offer(trade)
        self.assertEqual(self.gm.trade, trade)

        self.gm.trade_acceptance(True)
        p0_cash_after = self.p0.cash
        p1_cash_after = self.p1.cash
        p0_cash_diff = p0_cash_after - p0_cash_before
        p1_cash_diff = p1_cash_after - p1_cash_before
        self.assertEqual(p0_cash_diff, 400)
        self.assertEqual(p1_cash_diff, -400)
        self.assertEqual(self.gm.fields[5].owner, self.p1)

    def test_mortgage(self):
        self.gm.move(self.p0, 5)
        self.gm.buy_field(self.p0)
        self.gm.mortgage(self.p0, 5)
        self.assertEqual(self.p0.cash, 1400)
        self.assertTrue(self.gm.fields[5].mortgaged)

    def test_unmortgage(self):
        self.gm.move(self.p0, 5)
        self.gm.buy_field(self.p0)
        cash_before = self.p0.cash
        self.gm.mortgage(self.p0, 5)
        self.gm.unmortgage(self.p0, 5)
        cash_after = self.p0.cash
        diff = cash_after - cash_before
        self.assertEqual(diff, -10)
        self.assertFalse(self.gm.fields[5].mortgaged)
if __name__ == '__main__':
    unittest.main()