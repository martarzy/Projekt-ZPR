import unittest
from player import Player
from mocks import MockHandler


class BasicBehavior(unittest.TestCase):
    def setUp(self):
        self.player = Player('julian', MockHandler())

    def test_name_after_init(self):
        self.assertEquals(self.player.name, 'julian')

    def test_error_send(self):
        self.player.error('Oops')
        self.assertDictEqual(self.player.handler.last_msg, {'message': 'invalidOperation', 'error': 'Oops'})

    def test_default_init_state(self):
        self.player.init_state()
        self.assertEqual(self.player.state, self.player.start_state)

    def test_default_init_state_when_user_in_jail(self):
        self.player.goto_jail()
        self.player.init_state()
        self.assertEqual(self.player.state, self.player.jail_state)

    def test_trade_pending_state(self):
        self.player.init_state(True)
        self.assertEqual(self.player.state, self.player.trade_acceptance_state)

    def test_buy_before_rolling_dice(self):
        self.player.init_state()
        self.assertFalse(self.player.update_state('buyField'))

    def test_bankruptcy_at_end_of_turn(self):
        self.player.state = self.player.end_state
        self.assertTrue(self.player.update_state('declareBankruptcy'))


class WaitingForTradeAcceptance(unittest.TestCase):
    def setUp(self):
        self.player = Player('julian', MockHandler())
        self.player.init_state(True)

    def test_common_actions(self):
        self.assertFalse(self.player.update_state('buyHouse'))

    def test_bankruptcy_when_trade_pending(self):
        self.assertFalse(self.player.update_state('declareBankruptcy'))

    def test_trade_decision(self):
        self.assertTrue(self.player.update_state('tradeAcceptance'))


class InJail(unittest.TestCase):
    def setUp(self):
        self.player = Player('julian', MockHandler())
        self.player.goto_jail()
        self.player.init_state()

    def test_bankruptcy(self):
        self.assertTrue(self.player.update_state('declareBankruptcy'))

    def test_common_actions_in_jail(self):
        self.assertTrue(self.player.update_state('buyHouse'))

    def test_get_out(self):
        self.assertTrue(self.player.update_state('getOut'))
        self.assertEqual(self.player.state, self.player.start_state)


class StartState(unittest.TestCase):
    def setUp(self):
        self.player = Player('julian', MockHandler())
        self.player.init_state()

    def test_roll_dice(self):
        self.assertTrue(self.player.update_state('rollDice'))
        self.assertEqual(self.player.state, self.player.buy_state)

    def test_bankruptcy(self):
        self.assertTrue(self.player.update_state('declareBankruptcy'))
        self.assertIsNone(self.player.state)


class BuyState(unittest.TestCase):
    def setUp(self):
        self.player = Player('julian', MockHandler())
        self.player.state = self.player.buy_state

    def test_buy(self):
        self.assertTrue(self.player.update_state('buyField'))
        self.assertEqual(self.player.state, self.player.end_state)

    def test_again_roll_dice(self):
        self.assertFalse(self.player.update_state('rollDice'))

    def test_end_turn(self):
        self.assertTrue(self.player.update_state('endOfTurn'))
        self.assertIsNone(self.player.state)


class EndState(unittest.TestCase):
    def test_buy_house(self):
        self.player = Player('julian', MockHandler())
        self.player.state = self.player.end_state
        self.assertTrue(self.player.update_state('buyHouse'))
        self.assertEqual(self.player.state, self.player.end_state)