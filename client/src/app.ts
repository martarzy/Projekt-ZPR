/// <reference path="./controller/controller.ts" />

window.onload = () => {
    const wsUri = "ws://localhost:8888/ws";
    const control = new controller.Controller(wsUri);
    
    // adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById("username");
    const submitUsernameButton = <HTMLInputElement>document.getElementById("submit-username");
    const readyButton = <HTMLInputElement>document.getElementById("ready-button");
    const rollButton = <HTMLInputElement>document.getElementById("roll-button");
    const buyButton = <HTMLInputElement>document.getElementById("buy-button");
    const endTurnButton = <HTMLInputElement>document.getElementById("end-turn-button");

    const actions: controller.UserActions = control.actionsMap;

    submitUsernameButton.onclick = (event: MouseEvent) => actions.chooseName(usernameField.value);
    readyButton.onclick = (event: MouseEvent) => actions.playerIsReady();
    rollButton.onclick = (event: MouseEvent) => actions.rollDice();
    buyButton.onclick = (event: MouseEvent) => actions.playerBuysField();
    endTurnButton.onclick = (event: MouseEvent) => actions.playerEndsTurn();
};