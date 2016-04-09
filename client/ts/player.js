var model;
(function (model) {
    var Player = (function () {
        function Player(username) {
            this.cash = new Cash();
            this.username = username;
        }
        ;
        Player.prototype.whatsYourName = function () {
            return this.username;
        };
        Player.prototype.earn = function (amount) {
            this.cash.add(amount);
        };
        Player.prototype.pay = function (amount) {
            this.cash.remove(amount);
        };
        return Player;
    })();
    model.Player = Player;
    var Cash = (function () {
        function Cash() {
            this.amount = Cash.INITIAL_VALUE;
        }
        Cash.prototype.add = function (amount) {
            this.amount += amount;
        };
        Cash.prototype.remove = function (amount) {
            this.amount -= amount;
            if (this.amount <= 0)
                throw new PlayerWentBankrupt();
        };
        Cash.INITIAL_VALUE = 1500;
        return Cash;
    })();
    var PlayerWentBankrupt = (function () {
        function PlayerWentBankrupt() {
        }
        return PlayerWentBankrupt;
    })();
    model.PlayerWentBankrupt = PlayerWentBankrupt;
})(model || (model = {}));
//# sourceMappingURL=player.js.map