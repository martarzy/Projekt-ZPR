var model;
(function (model) {
    var Round = (function () {
        function Round() {
            this.playerMoved_ = false;
        }
        Object.defineProperty(Round.prototype, "movementPerformed", {
            get: function () {
                return this.playerMoved_;
            },
            enumerable: true,
            configurable: true
        });
        Round.prototype.playerMoved = function () {
            this.playerMoved_ = true;
        };
        Round.prototype.reset = function () {
            this.playerMoved_ = false;
        };
        return Round;
    }());
    model.Round = Round;
})(model || (model = {}));
var model;
(function (model) {
    var Player = (function () {
        function Player(username_) {
            this.username_ = username_;
            this.cash_ = 0;
        }
        Object.defineProperty(Player.prototype, "username", {
            get: function () {
                return this.username_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "cash", {
            get: function () {
                return this.cash_;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.setCash = function (amount) {
            this.cash_ = amount;
        };
        return Player;
    }());
    model.Player = Player;
})(model || (model = {}));
var model;
(function (model) {
    var Field = (function () {
        function Field(id_, description_, cost_, buyable_) {
            this.id_ = id_;
            this.description_ = description_;
            this.cost_ = cost_;
            this.buyable_ = buyable_;
            this.ownerUsername_ = "";
        }
        Object.defineProperty(Field.prototype, "id", {
            get: function () {
                return this.id_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "description", {
            get: function () {
                return this.description_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "cost", {
            get: function () {
                return this.cost_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "buyable", {
            get: function () {
                return this.buyable_;
            },
            enumerable: true,
            configurable: true
        });
        Field.prototype.hasOwner = function () {
            return this.ownerUsername_ !== "";
        };
        Field.prototype.markAsBought = function (owner) {
            if (this.buyable_)
                this.ownerUsername_ = owner;
        };
        Field.prototype.ownerUsername = function () {
            return this.ownerUsername_;
        };
        return Field;
    }());
    model.Field = Field;
})(model || (model = {}));
test("round test", function () {
    var round = new model.Round();
    equal(round.movementPerformed, false);
    round.playerMoved();
    equal(round.movementPerformed, true);
    round.reset();
    equal(round.movementPerformed, false);
});
test("player test", function () {
    var player = new model.Player("Tester");
    equal(player.username, "Tester");
    equal(player.cash, 0);
    player.setCash(1000);
    equal(player.cash, 1000);
});
test("buyable field test", function () {
    var field = new model.Field(0, "My test field", 500, true);
    equal(field.id, 0);
    equal(field.description, "My test field");
    equal(field.cost, 500);
    equal(field.buyable, true);
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
    field.markAsBought("Tester");
    equal(field.hasOwner(), true);
    equal(field.ownerUsername(), "Tester");
});
test("not buyable field test", function () {
    var field = new model.Field(0, "My test field", 500, false);
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
    field.markAsBought("Tester");
    equal(field.hasOwner(), false);
    equal(field.ownerUsername(), "");
});
