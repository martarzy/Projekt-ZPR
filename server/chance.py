from random import shuffle
from collections import deque


class ChanceCard:
    def __init__(self):
        self.message = {'message': 'chance'}


class GotoCard(ChanceCard):
    def __init__(self, field_no):
        ChanceCard.__init__(self)
        self.message['action'] = 'goto'
        self.message['field'] = field_no


class MoveCard(ChanceCard):
    def __init__(self, move):
        ChanceCard.__init__(self)
        self.message['action'] = 'move'
        self.message['move'] = move


class CashCard(ChanceCard):
    def __init__(self, cash, reason):
        ChanceCard.__init__(self)
        self.message['action'] = 'cash'
        self.message['cash'] = cash
        self.message['reason'] = reason


class GetOutCard(ChanceCard):
    def __init__(self):
        ChanceCard.__init__(self)
        self.message['action'] = 'getOut'


class GotoJailCard(ChanceCard):
    def __init__(self):
        ChanceCard.__init__(self)
        self.message['action'] = 'gotoJail'


class ChanceStack:
    def __init__(self):
        self.cards = deque()

        self.cards.append(GotoCard(5))
        self.cards.append(GotoCard(15))
        self.cards.append(GotoCard(25))
        self.cards.append(GotoCard(35))

        self.cards.append(MoveCard(2))
        self.cards.append(MoveCard(4))
        self.cards.append(MoveCard(-2))
        self.cards.append(MoveCard(-4))

        self.cards.append(CashCard(50, 'birthday'))
        self.cards.append(CashCard(100, 'investment'))
        self.cards.append(CashCard(-50, 'treatment'))
        self.cards.append(CashCard(-100, 'accident'))

        for _ in range(4):
            self.cards.append(GetOutCard())
            self.cards.append(GotoJailCard())

        shuffle(self.cards)

    def get_card(self):
        card = self.cards[-1]
        if card.message['action'] == 'getOut':
            return self.cards.pop().message
        else:
            self.cards.rotate(1)
            return card.message

    def return_get_out_card(self):
        self.cards.appendleft(GetOutCard())
