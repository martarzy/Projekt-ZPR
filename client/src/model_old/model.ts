/// <reference path="../Scripts/collections.ts" />
/// <reference path="./board.ts" />
/// <reference path="./pawn.ts" />
/// <reference path="./player.ts" />

namespace model {

    import Dict = collections.Dictionary;
    import Player = player.Player;
    export type PlayersInfo = Array<string>;


    

    export class Model2 {
        private board: Board = new Board();

        private pawnsPositions: Dict<Pawn, Field>;
        private playersPawns: Dict<string, Pawn>;
        private players: Dict<string, Player>;

        private activePlayer: string;

        constructor() {
            this.pawnsPositions = new Dict<Pawn, Field>();
            this.playersPawns = new Dict<string, Pawn>();
            this.players = new Dict<string, Player>();
        }

        updateUserList(players: PlayersInfo): void {
            if (this.newPlayerJoined(players)) {
                const newPlayers = this.findNewPlayers(players);
                this.addNewPlayers(newPlayers);
            }
        }

        private newPlayerJoined(players: PlayersInfo): boolean {
            return players.length !== this.players.size();
        }

        private findNewPlayers(players: PlayersInfo) {
            return players.filter((username, index, array) => !this.players.containsKey(username));
        }

        private addNewPlayers(players: PlayersInfo) {
            for (const username of players) {
                this.players.setValue(username, new Player(username));
                this.playersPawns.setValue(username, new Pawn(PawnColor.RED));
            }   
        }

        placeAllPawnsOnStart() {
            this.playersPawns.forEach(
                (username, pawn) => this.pawnsPositions.setValue(pawn, this.board.startField()));
        }

        movePawn(movingPlayer: string, diceResult: number): void {
            let movedPawn = this.playersPawns.getValue(movingPlayer);
            let currentField = this.pawnsPositions.getValue(movedPawn);
            let targetField = this.board.fieldInDistanceOf(currentField, diceResult);
            this.pawnsPositions.setValue(movedPawn, targetField);
        } 

        updateTurn(activePlayer: string) {
            this.players.getValue(activePlayer).endsTurn();
            this.activePlayer = activePlayer;
            this.players.getValue(activePlayer).startsTurn();
        }

        gameStarted() {
            model.gameState = GameState.IN_PROGRESS;
        }
        
    }
        
}