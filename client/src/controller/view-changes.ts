/// <reference path="../view/view.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    export enum ViewElement {
        ROLL_BTN, READY_BTN, END_TURN_BTN, BUY_FIELD_BTN,
        JOIN_MODAL
    }

    export class ViewChanges {
        private enablers_: collections.Dictionary<ViewElement, () => void>;
        private disablers_: collections.Dictionary<ViewElement, () => void>;

        constructor(private view_: view.View) {
            this.initialiseButtonEnablers();
        }

        private initialiseButtonEnablers() {
            this.enablers_ = new collections.Dictionary<ViewElement, () => void>();
            this.disablers_ = new collections.Dictionary<ViewElement, () => void>();
            this.enablers_.setValue(ViewElement.ROLL_BTN, this.view_.setActiveRollButton);
            this.disablers_.setValue(ViewElement.ROLL_BTN, this.view_.setDisabledRollButton);
            this.enablers_.setValue(ViewElement.READY_BTN, this.view_.setActiveReadyButton);
            this.disablers_.setValue(ViewElement.READY_BTN, this.view_.setDisabledReadyButton);
            this.enablers_.setValue(ViewElement.END_TURN_BTN, this.view_.setActiveEndTurnButton);
            this.disablers_.setValue(ViewElement.END_TURN_BTN, this.view_.setDisabledEndTurnButton);
            this.enablers_.setValue(ViewElement.BUY_FIELD_BTN, this.view_.setActiveBuyButton);
            this.disablers_.setValue(ViewElement.BUY_FIELD_BTN, this.view_.setDisabledBuyButton);
            this.enablers_.setValue(ViewElement.JOIN_MODAL, this.view_.showSignInWindow);
            this.disablers_.setValue(ViewElement.JOIN_MODAL, this.view_.hideSignInWindow);
        }

        show(name: ViewElement, visible: boolean) {
            const map = visible ? this.enablers_ : this.disablers_;
            map.getValue(name).call(this.view_);
        }

        errorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons() {
            this.disablers_.forEach((k, v) => v.call(this.view_));
        }

        updatePlayerList(players: Array<view.PlayerDTO>) {
            this.view_.updateUserList(players);
        }

        startGame(players: Array<view.PlayerDTO>) {
            this.view_.initPawnsDictionary(players);
        }

        // TODO strange callback?
        movePawn(player: string, targetField: number) {
            this.view_.movePawn(player, targetField, () => { });
        }
    }

}