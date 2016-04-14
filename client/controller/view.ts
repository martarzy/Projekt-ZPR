/// <reference path="observer.ts" />
/// <reference path="model.ts" />

namespace view {

    type Observer = patterns.observer.Observer;

    class BoardView implements Observer {
        /* the callback is passed instead of string to avoid 
           duplicating information in the system. The overhead
           should not be a problem. */
        private myUsername: () => string;
        private enemiesUsernames: () => Array<string>;

        constructor(private model: model.BoardModel) {
            model.registerObserver(this);
        };

        notify(): void {
            // check model and update something in the browser
            this.model.getPawnPosition(this.myUsername());
        }
    }

}