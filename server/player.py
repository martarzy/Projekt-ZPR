class Player:
    def __init__(self, name, handler):
        self.name = name
        self.handler = handler  # Handler is a class which must have write_message() function
        self.ready = False
        self.cash = 1000
        self.field_no = 0
        self.last_roll = 0
        self.get_out_cards_no = 0
        self.in_jail = False
        self.bankrupt = False
        self.state = None

    common_actions = {'buyHouse', 'sellHouse', 'mortgage', 'unmortgage', 'trade'}

    def error(self, error_code):
        self.handler.send_message({'message': 'invalidOperation', 'error': error_code})

    def goto_jail(self):
        self.field_no = 10
        self.in_jail = True

    def init_state(self, trade_pending=False):
        if trade_pending:
            self.state = self.trade_acceptance_state
        else:
            self.state = self.jail_state if self.in_jail else self.start_state

    def update_state(self, action):
        return self.state(action)

    def trade_acceptance_state(self, action):
        if action == 'tradeAcceptance':
            self.state = None
            return True
        return False

    def jail_state(self, action):
        if action == 'getOut':
            self.state = self.start_state
        elif action == 'declareBankruptcy':
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def start_state(self, action):
        if action == 'rollDice':
            self.state = self.buy_state
        elif action == 'declareBankruptcy':
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def buy_state(self, action):
        if action == 'buyField' and self.cash >= 0:
            self.state = self.end_state
        elif action == 'declareBankruptcy' or (action == 'endOfTurn' and self.cash >= 0):
            self.state = None
        else:
            return action in Player.common_actions
        return True

    def end_state(self, action):
        if action == 'declareBankruptcy' or (action == 'endOfTurn' and self.cash >= 0):
            self.state = None
        else:
            return action in Player.common_actions
        return True

