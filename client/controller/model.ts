/// <reference path="observer.ts" />

namespace model {

    export class Model {
        private board_ = new BoardModel();
        private players_ = new PlayersModel();

        get board(): BoardModel {
            return this.board_;
        }

        get players(): PlayersModel {
            return this.players_;
        }
    }

    type Subject = patterns.observer.Subject;
    type Observer = patterns.observer.Observer;

    abstract class ObservableModel implements Subject {
        private observers = new collections.LinkedList<Observer>();

        registerObserver(observer: Observer): void {
            this.observers.add(observer);
        }

        unregisterObserver(observer: Observer): void {
            this.observers.remove(observer);
        }

        notifyObservers(): void {
            this.observers.forEach(this.adaptNotify);
        }

        private adaptNotify(observer: Observer): boolean {
            observer.notify();
            return true;
        }
    }

    export enum GameState {
        NOT_ENOUGH_PLAYERS,
        PLAYERS_NOT_READY,
        IN_PROGRESS
    }

    let state = GameState.NOT_ENOUGH_PLAYERS;

    export function gameState(): GameState {
        return state;
    }

    export class BoardModel extends ObservableModel {
        movePawn(user: string, rollResult: number): void { };
        getPawnPosition(user: string): void { };
    }

    export class PlayersModel extends ObservableModel {
        private myUsername: string;
        private enemiesUsernames: Array<string>;
        setActive(username: string): void { }
        getMyUsername(): string { return ""; }
        getUsernames(): Array<string> { return new Array<string>(); }
    }

}