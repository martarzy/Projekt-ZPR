var message;
(function (message) {
    message.messageTitle = "message";
    var UsernameChoice = (function () {
        function UsernameChoice() {
        }
        Object.defineProperty(UsernameChoice, "message", {
            get: function () {
                return "myName";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UsernameChoice, "name", {
            get: function () {
                return "myName";
            },
            enumerable: true,
            configurable: true
        });
        return UsernameChoice;
    }());
    message.UsernameChoice = UsernameChoice;
    var UsernameValidation = (function () {
        function UsernameValidation() {
        }
        Object.defineProperty(UsernameValidation, "message", {
            get: function () {
                return "nameAccepted";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UsernameValidation, "decision", {
            get: function () {
                return "valid";
            },
            enumerable: true,
            configurable: true
        });
        return UsernameValidation;
    }());
    message.UsernameValidation = UsernameValidation;
    var UserIsReady = (function () {
        function UserIsReady() {
        }
        Object.defineProperty(UserIsReady, "message", {
            get: function () {
                return "ready";
            },
            enumerable: true,
            configurable: true
        });
        return UserIsReady;
    }());
    message.UserIsReady = UserIsReady;
    var RollDice = (function () {
        function RollDice() {
        }
        Object.defineProperty(RollDice, "message", {
            get: function () {
                return "rollDice";
            },
            enumerable: true,
            configurable: true
        });
        return RollDice;
    }());
    message.RollDice = RollDice;
    var NewTurn = (function () {
        function NewTurn() {
        }
        Object.defineProperty(NewTurn, "message", {
            get: function () {
                return "newTurn";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewTurn, "activePlayer", {
            get: function () {
                return "player";
            },
            enumerable: true,
            configurable: true
        });
        return NewTurn;
    }());
    message.NewTurn = NewTurn;
    var UsernamesObtained = (function () {
        function UsernamesObtained() {
        }
        Object.defineProperty(UsernamesObtained, "message", {
            get: function () {
                return "userList";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UsernamesObtained, "usernamesList", {
            get: function () {
                return "userList";
            },
            enumerable: true,
            configurable: true
        });
        return UsernamesObtained;
    }());
    message.UsernamesObtained = UsernamesObtained;
    var OtherPlayerMoved = (function () {
        function OtherPlayerMoved() {
        }
        Object.defineProperty(OtherPlayerMoved, "message", {
            get: function () {
                return "playerMove";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OtherPlayerMoved, "playerName", {
            get: function () {
                return "player";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OtherPlayerMoved, "movedBy", {
            get: function () {
                return "move";
            },
            enumerable: true,
            configurable: true
        });
        return OtherPlayerMoved;
    }());
    message.OtherPlayerMoved = OtherPlayerMoved;
    var GameReset = (function () {
        function GameReset() {
        }
        Object.defineProperty(GameReset, "message", {
            get: function () {
                return "reset";
            },
            enumerable: true,
            configurable: true
        });
        return GameReset;
    }());
    message.GameReset = GameReset;
    var GameStart = (function () {
        function GameStart() {
        }
        Object.defineProperty(GameStart, "message", {
            get: function () {
                return "start";
            },
            enumerable: true,
            configurable: true
        });
        return GameStart;
    }());
    message.GameStart = GameStart;
})(message || (message = {}));
var controller;
(function (controller) {
    var SocketServer = (function () {
        function SocketServer(uri, consumer) {
            this.socket = new WebSocket(uri);
            this.onMessageCallback = consumer;
            this.socket.onmessage = this.messageConsumerAdapter.bind(this);
        }
        SocketServer.prototype.messageConsumerAdapter = function (ev) {
            this.onMessageCallback(ev.data);
        };
        SocketServer.prototype.sendMessage = function (message) {
            if (this.socketIsReady()) {
                this.socket.send(message);
            }
            else {
                this.delayMessage(message);
            }
        };
        SocketServer.prototype.socketIsReady = function () {
            return this.socket.readyState === 1;
        };
        SocketServer.prototype.delayMessage = function (message) {
            var _this = this;
            setTimeout(function () { return _this.sendMessage(message); }, 1);
        };
        return SocketServer;
    }());
    controller.SocketServer = SocketServer;
})(controller || (controller = {}));
var model;
(function (model) {
    var Model = (function () {
        function Model() {
            this.board_ = new BoardModel();
            this.players_ = new PlayersModel();
        }
        Object.defineProperty(Model.prototype, "board", {
            get: function () {
                return this.board_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "players", {
            get: function () {
                return this.players_;
            },
            enumerable: true,
            configurable: true
        });
        return Model;
    }());
    model.Model = Model;
    var BoardModel = (function () {
        function BoardModel() {
            this.board = new model.Board();
            this.pawnsOwners = new collections.Dictionary();
            this.pawnsPosition = new collections.Dictionary();
        }
        BoardModel.prototype.placePawnsOnBoard = function (usernames) {
            var _this = this;
            for (var _i = 0, usernames_1 = usernames; _i < usernames_1.length; _i++) {
                var username = usernames_1[_i];
                this.pawnsOwners.setValue(username, new model.Pawn(model.Color.BLACK));
            }
            this.pawnsOwners
                .forEach(function (username, pawn) { return _this.pawnsPosition.setValue(pawn, _this.board.startField()); });
        };
        BoardModel.prototype.movePawn = function (ownerUsername, rollResult) {
            var targetPawn = this.pawnsOwners.getValue(ownerUsername);
            var currentField = this.pawnsPosition.getValue(targetPawn);
            var targetField = this.board.fieldInDistanceOf(currentField, rollResult);
            this.pawnsPosition.setValue(targetPawn, targetField);
        };
        return BoardModel;
    }());
    model.BoardModel = BoardModel;
    var PlayersModel = (function () {
        function PlayersModel() {
            this.enemiesUsernames = [];
        }
        PlayersModel.prototype.addNewUser = function (username) {
            this.enemiesUsernames = this.enemiesUsernames.concat(username);
        };
        PlayersModel.prototype.getUsernames = function () {
            return this.enemiesUsernames.concat([this.myUsername]);
        };
        PlayersModel.prototype.setMyUsername = function (myUsername) {
            this.myUsername = myUsername;
        };
        PlayersModel.prototype.getMyUsername = function () {
            return this.myUsername;
        };
        PlayersModel.prototype.setActivePlayer = function (activeUsername) {
            this.activeUsername = activeUsername;
        };
        return PlayersModel;
    }());
    model.PlayersModel = PlayersModel;
})(model || (model = {}));
var controller;
(function (controller) {
    var HandlerManager = (function () {
        function HandlerManager(model) {
            this.model = model;
            this.handlers = new collections.Dictionary();
            this.installHandlers();
        }
        HandlerManager.prototype.installHandlers = function () {
            this.handlers.setValue(message.UsernameValidation.message, this.nameAccepted.bind(this));
            this.handlers.setValue(message.UsernamesObtained.message, this.addNewUsers.bind(this));
            this.handlers.setValue(message.GameStart.message, this.gameStarts.bind(this));
            this.handlers.setValue(message.GameReset.message, this.gameResets.bind(this));
            this.handlers.setValue(message.OtherPlayerMoved.message, this.someoneMoved.bind(this));
            this.handlers.setValue(message.NewTurn.message, this.newTurn.bind(this));
        };
        HandlerManager.prototype.handle = function (msgFromServer) {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        };
        HandlerManager.prototype.nameAccepted = function (object) {
            this.model.players.addNewUser(this.model.players.getMyUsername());
        };
        HandlerManager.prototype.addNewUsers = function (object) {
            var usernames = object[message.UsernamesObtained.usernamesList];
            var alreadyStored = this.model.players.getUsernames();
            var newUsernames = usernames.filter(function (username) { return alreadyStored.indexOf(username) < 0; });
            for (var _i = 0, newUsernames_1 = newUsernames; _i < newUsernames_1.length; _i++) {
                var username = newUsernames_1[_i];
                this.model.players.addNewUser(username);
            }
        };
        HandlerManager.prototype.gameStarts = function (object) {
            this.model.board.placePawnsOnBoard(this.model.players.getUsernames());
        };
        HandlerManager.prototype.gameResets = function (object) {
        };
        HandlerManager.prototype.someoneMoved = function (object) {
            var username = object[message.OtherPlayerMoved.playerName];
            var rollResult = object[message.OtherPlayerMoved.movedBy];
            this.model.board.movePawn(username, rollResult);
        };
        HandlerManager.prototype.newTurn = function (object) {
            var newActive = object[message.NewTurn.activePlayer];
            this.model.players.setActivePlayer(newActive);
        };
        return HandlerManager;
    }());
    controller.HandlerManager = HandlerManager;
})(controller || (controller = {}));
var controller;
(function (controller) {
    var Controller = (function () {
        function Controller(serverUri) {
            this.model = new model.Model();
            this.handler = new controller.HandlerManager(this.model);
            this.createSocketConnection(serverUri);
        }
        Controller.prototype.createSocketConnection = function (uri) {
            this.server = new controller.SocketServer(uri, this.delegateMessageToHandler.bind(this));
        };
        Controller.prototype.sendMessage = function (toSend) {
            this.server.sendMessage(toSend);
        };
        Controller.prototype.delegateMessageToHandler = function (message) {
            console.log(message);
            this.handler.handle(JSON.parse(message));
        };
        Controller.prototype.chooseName = function (name) {
            var toSend = {};
            toSend[message.messageTitle] = message.UsernameChoice.message;
            toSend[message.UsernameChoice.name] = name;
            this.model.players.setMyUsername(name);
            this.sendMessage(this.prepareToSend(toSend));
        };
        Controller.prototype.rollDice = function () {
            var toSend = {};
            toSend[message.messageTitle] = message.RollDice.message;
            this.sendMessage(this.prepareToSend(toSend));
        };
        Controller.prototype.playerIsReady = function () {
            var toSend = {};
            toSend[message.messageTitle] = message.UserIsReady.message;
            this.sendMessage(this.prepareToSend(toSend));
        };
        Controller.prototype.prepareToSend = function (object) {
            return JSON.stringify(object);
        };
        return Controller;
    }());
    controller.Controller = Controller;
})(controller || (controller = {}));
window.onload = function () {
    var wsUri = "ws://localhost:8888/ws";
    var control = new controller.Controller(wsUri);
    var usernameField = document.getElementById("username");
    var usernameButton = document.getElementById("submit-username");
    usernameButton.onclick =
        function (event) {
            control.chooseName(usernameField.value);
            control.playerIsReady();
            control.rollDice();
        };
};
var model;
(function (model) {
    var Board = (function () {
        function Board() {
            this.FIELDS_NUMBER = 40;
            this.START_FIELD_NUMBER = 0;
            this.JAIL_FIELD_NUMBER = 10;
            this.initializeFields();
        }
        Board.prototype.initializeFields = function () {
            this._fields = new Array(this.FIELDS_NUMBER);
            for (var i = 0; i < this.FIELDS_NUMBER; i++) {
                this._fields[i] = new model.Field(i);
            }
        };
        Board.prototype.getField = function (id) {
            return this._fields[id];
        };
        Board.prototype.fieldInDistanceOf = function (field, distance) {
            var newId = (field.number + distance) % this.FIELDS_NUMBER;
            return this._fields[newId];
        };
        Board.prototype.startField = function () {
            return this.getField(this.START_FIELD_NUMBER);
        };
        Board.prototype.jailField = function () {
            return this.getField(this.JAIL_FIELD_NUMBER);
        };
        return Board;
    }());
    model.Board = Board;
})(model || (model = {}));
var model;
(function (model) {
    var Field = (function () {
        function Field(_number) {
            this._number = _number;
        }
        Object.defineProperty(Field.prototype, "number", {
            get: function () {
                return this._number;
            },
            enumerable: true,
            configurable: true
        });
        return Field;
    }());
    model.Field = Field;
})(model || (model = {}));
var model;
(function (model) {
    (function (Color) {
        Color[Color["RED"] = 0] = "RED";
        Color[Color["YELLOW"] = 1] = "YELLOW";
        Color[Color["BLUE"] = 2] = "BLUE";
        Color[Color["GREEN"] = 3] = "GREEN";
        Color[Color["BLACK"] = 4] = "BLACK";
        Color[Color["WHITE"] = 5] = "WHITE";
    })(model.Color || (model.Color = {}));
    var Color = model.Color;
    var Pawn = (function () {
        function Pawn(color_) {
            this.color_ = color_;
        }
        Object.defineProperty(Pawn.prototype, "color", {
            get: function () {
                return this.color_;
            },
            enumerable: true,
            configurable: true
        });
        Pawn.prototype.toString = function () {
            return this.color_.toString();
        };
        return Pawn;
    }());
    model.Pawn = Pawn;
})(model || (model = {}));
var View;
(function (View) {
    var Pawn = (function () {
        function Pawn(startField) {
            this.field = startField;
            this.element = d3.select("svg").append("circle");
            this.element
                .attr("r", 10)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px")
                .style("fill", "lightblue");
        }
        Pawn.prototype.move = function (target, sequencenumber) {
            this.field = target;
            this.element
                .transition()
                .delay(200 * sequencenumber)
                .duration(200)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px");
        };
        Pawn.prototype.getPawnField = function () {
            return this.field;
        };
        return Pawn;
    }());
    View.Pawn = Pawn;
})(View || (View = {}));
var View;
(function (View) {
    var Field = (function () {
        function Field(fieldId) {
            this.fieldId = fieldId;
            this.coordinateX = Field.FieldCoords[fieldId][0];
            this.coordinateY = Field.FieldCoords[fieldId][1];
        }
        Field.prototype.getCoordX = function () {
            return this.coordinateX;
        };
        Field.prototype.getCoordY = function () {
            return this.coordinateY;
        };
        Field.prototype.getFieldId = function () {
            return this.fieldId;
        };
        Field.FieldCoords = [
            [580, 585], [517, 585], [465, 585], [415, 585], [365, 585], [315, 585], [265, 585], [215, 585], [165, 585], [115, 585], [52, 585],
            [52, 522], [52, 472], [52, 422], [52, 372], [52, 322], [52, 272], [52, 222], [52, 172], [52, 122],
            [52, 59], [115, 59], [165, 59], [215, 59], [265, 59], [315, 59], [365, 59], [415, 59], [465, 59], [517, 59], [580, 59],
            [580, 122], [580, 172], [580, 222], [580, 272], [580, 322], [580, 372], [580, 422], [580, 472], [580, 522]
        ];
        return Field;
    }());
    View.Field = Field;
})(View || (View = {}));
var View;
(function (View) {
    var Board = (function () {
        function Board(pawnsNumber) {
            this.pawns = [];
            this.fields = [];
            for (var i = 0; i < 40; i++)
                this.fields[i] = new View.Field(i);
            for (var i = 0; i < pawnsNumber; i++)
                this.pawns[i] = new View.Pawn(this.fields[0]);
        }
        Board.prototype.movePawn = function (pawnNumber, fieldNumber, onMovingEnd) {
            var sequencenumber = 0;
            for (var i = (this.pawns[pawnNumber].getPawnField().getFieldId() + 1) % 40; i <= fieldNumber; i = (i + 1) % 40) {
                this.pawns[pawnNumber].move(this.fields[i], sequencenumber++);
            }
            setTimeout(onMovingEnd, sequencenumber * 200);
        };
        return Board;
    }());
    View.Board = Board;
})(View || (View = {}));
var view;
(function (view) {
    var View = (function () {
        function View(model) {
            this.boardView = new BoardView(model.board);
            this.playersView = new PlayersView(model.players);
        }
        View.prototype.updateBoard = function () {
            this.boardView.update();
        };
        View.prototype.updatePlayers = function () {
            this.playersView.update();
        };
        return View;
    }());
    view.View = View;
    var BoardView = (function () {
        function BoardView(model) {
            this.model = model;
        }
        BoardView.prototype.update = function () { };
        return BoardView;
    }());
    var PlayersView = (function () {
        function PlayersView(model) {
            this.model = model;
        }
        PlayersView.prototype.update = function () { };
        return PlayersView;
    }());
})(view || (view = {}));
//# sourceMappingURL=app.js.map