/// <path reference="../scripts/collections.ts" />

namespace patterns.observer {

    export interface Observer {
        notify(): void;
    }

    export interface Subject {
        registerObserver(observer: Observer): void;
        unregisterObserver(observer: Observer): void;
        notifyObservers(): void;
    }

}