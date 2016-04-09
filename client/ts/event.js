var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events;
(function (events) {
    (function (EventType) {
        EventType[EventType["TO_EXECUTE"] = 0] = "TO_EXECUTE";
        EventType[EventType["TO_SEND"] = 1] = "TO_SEND";
    })(events.EventType || (events.EventType = {}));
    var EventType = events.EventType;
    var Event = (function () {
        function Event(type, message) {
            this.type_ = type;
            this.message_ = message;
        }
        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this.type_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "message", {
            get: function () {
                return this.message_;
            },
            enumerable: true,
            configurable: true
        });
        Event.prototype.toJson = function () {
            return JSON.stringify(this);
        };
        return Event;
    })();
    events.Event = Event;
    var UserEvent = (function (_super) {
        __extends(UserEvent, _super);
        function UserEvent(message) {
            _super.call(this, EventType.TO_SEND, message);
        }
        return UserEvent;
    })(Event);
    var ServerEvent = (function (_super) {
        __extends(ServerEvent, _super);
        function ServerEvent(message) {
            _super.call(this, EventType.TO_EXECUTE, message);
        }
        return ServerEvent;
    })(Event);
    var ChooseNameEvent = (function (_super) {
        __extends(ChooseNameEvent, _super);
        function ChooseNameEvent(name) {
            _super.call(this, 'myName');
            this.myName = name;
        }
        return ChooseNameEvent;
    })(UserEvent);
    events.ChooseNameEvent = ChooseNameEvent;
    var RollDiceEvent = (function (_super) {
        __extends(RollDiceEvent, _super);
        function RollDiceEvent() {
            _super.call(this, 'rollDice');
        }
        return RollDiceEvent;
    })(UserEvent);
    events.RollDiceEvent = RollDiceEvent;
    var PlayerReadyEvent = (function (_super) {
        __extends(PlayerReadyEvent, _super);
        function PlayerReadyEvent() {
            _super.call(this, 'ready');
        }
        return PlayerReadyEvent;
    })(UserEvent);
    events.PlayerReadyEvent = PlayerReadyEvent;
    var UsernameValidatedEvent = (function (_super) {
        __extends(UsernameValidatedEvent, _super);
        function UsernameValidatedEvent() {
            _super.call(this, 'nameAccepted');
        }
        Object.defineProperty(UsernameValidatedEvent.prototype, "isValid", {
            get: function () {
                return this.valid_;
            },
            enumerable: true,
            configurable: true
        });
        return UsernameValidatedEvent;
    })(ServerEvent);
    events.UsernameValidatedEvent = UsernameValidatedEvent;
})(events || (events = {}));
//# sourceMappingURL=event.js.map