class Player:
    def __init__(self, name, handler):
        self.name = name
        self.handler = handler  # Handler is a class which must have write_message() function
        self.ready = False
        self.cash = 1500
        self.field_no = 0
        self.last_roll = 0
        self.get_out_cards_no = 0
        self.in_jail = False
        self.state = None

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
        accepted = {'tradeAcceptance'}
        if action in accepted:
            self.state = None
            return True
        return False

    def jail_state(self, action):
        accepted1 = {'getOut'}
        accepted2 = {'declareBankruptcy'}
        if action in accepted1:
            self.state = self.start_state
            return True
        if action in accepted2:
            self.state = None
            return True
        return False

    def start_state(self, action):
        accepted1 = {'rollDice'}
        accepted2 = {'buyHouse', 'sellHouse', 'mortgage', 'unmortgage', 'trade'}
        accepted3 = {'declareBankruptcy'}
        if action in accepted1:
            self.state = self.buy_state
            return True
        if action in accepted2:
            return True
        if action in accepted3:
            self.state = None
            return True
        return False

    def buy_state(self, action):
        accepted1 = {'buyField'}
        accepted2 = {'endOfTurn', 'declareBankruptcy'}
        accepted3 = {'buyHouse', 'sellHouse', 'mortgage', 'unmortgage', 'trade'}
        if action in accepted1:
            self.state = self.end_state
            return True
        if action in accepted2:
            self.state = None
            return True
        if action in accepted3:
            return True
        return False

    def end_state(self, action):
        accepted1 = {'endOfTurn', 'declareBankruptcy'}
        accepted2 = {'buyHouse', 'sellHouse', 'mortgage', 'unmortgage', 'trade'}
        if action in accepted1:
            self.state = None
            return True
        if action in accepted2:
            return True
        return False
