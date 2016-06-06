class MockHandler:
    def __init__(self):
        self.last_msg = None

    def send_message(self, msg):
        self.last_msg = msg
