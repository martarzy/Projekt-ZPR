﻿namespace protocols {

    export class UsernameChoice {
        static get message(): string {
            return 'myName';
        }

        static get name(): string {
            return 'myName';
        }
    }

    export class UsernameValidation {
        static get message(): string {
            return 'nameAccepted';
        }

        static get decision(): string {
            return 'valid';
        }
    }

    export class UserIsReady {
        static get message(): string {
            return 'ready';
        }
    }

    export class RollDice {
        static get message(): string {
            return 'rollDice';
        }
    }

    export class RollResult {
        static get message(): string {
            return 'rollResult';
        }

        static get result(): string {
            return 'rollResult';
        }
    }

    export class MyTurn {
        static get message(): string {
            return 'yourTurn';
        }
    }

    export class PlayersConnected {
        static get message(): string {
            return 'userList';
        }

        static get info(): string {
            return 'userList';
        }
    }

    export class OtherPlayerMoved {
        static get message(): string {
            return 'anotherPlayerMove';
        }

        static get playerName(): string {
            return 'player';
        }

        static get movedBy(): string {
            return 'move';
        }
    }

    export class GameReset {
        static get message(): string {
            return 'reset';
        }
    }

    export class GameStart {
        static get message(): string {
            return 'start';
        }
    }

}