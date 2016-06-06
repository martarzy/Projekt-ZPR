"""
Module containing Player class.
"""


class Player:
    """
    Class representing game players. Contains information about player and turn state.
    """
    def __init__(self, name, handler):
        """
        Creates new player with given name and stores player's handler.
        Handler is a class which have implemented write_message() function.
        """
        self.name = name
        self.handler = handler  #
        self.ready = False
        self.cash = 1500
        self.field_no = 0
        self.last_roll = 0
        self.get_out_cards_no = 0
        self.in_jail = False
        self.bankrupt = False
        self.state = None

    common_actions = {'buyHouse', 'sellHouse', 'mortgage', 'unmortgage', 'trade'}

    def error(self, error_code):
        """
        Sends information about illegal operation to client application.
        """
        self.handler.send_message({'message': 'invalidOperation', 'error': error_code})

    def goto_jail(self):
        """
        Sets proper state when player goes to jail.
        """
        self.field_no = 10
        self.in_jail = True

    def init_state(self, trade_pending=False):
        """
        Initializes turn state.
        This function is invoked at the start of player's turn.
        """
        if trade_pending:
            self.state = self.trade_acceptance_state
        else:
            self.state = self.jail_state if self.in_jail else self.start_state

    def update_state(self, action):
        """
        Function updating player's turn state.
        Returns boolean, False if action is not possible in the current state, True otherwise.
        """
        return self.state(action)

    def trade_acceptance_state(self, action):
        """
        Function representing a state when player have to accept or decline trade offer.
        """
        if action == 'tradeAcceptance':
            self.state = None
            return True
        return False

    def jail_state(self, action):
        """
        Function representing a state when player is in jail.
        """
        if action == 'getOut':
            self.state = self.start_state
        elif action == 'declareBankruptcy':
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def start_state(self, action):
        """
        Function representing the state of "normal" start of turn.
        """
        if action == 'rollDice':
            self.state = self.buy_state
        elif action == 'declareBankruptcy':
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def buy_state(self, action):
        """
        Function representing the state after rolling dice - possibly player can buy field now.
        """
        if action == 'buyField' and self.cash >= 0:
            self.state = self.end_state
        elif action == 'declareBankruptcy' or (action == 'endOfTurn' and self.cash >= 0):
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def end_state(self, action):
        """
        Function representing the state when player can only end turn (or declare bankruptcy)
        """
        if action == 'declareBankruptcy' or (action == 'endOfTurn' and self.cash >= 0):
            self.state = None
        else:
            return action in Player.common_actions
        return True

