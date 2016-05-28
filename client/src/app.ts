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

    submitUsernameButton.onclick = (event: MouseEvent) => control.chooseName(usernameField.value);
    readyButton.onclick = (event: MouseEvent) => control.playerIsReady();
    rollButton.onclick = (event: MouseEvent) => control.rollDice();
    buyButton.onclick = (event: MouseEvent) => control.playerBuysField();
    endTurnButton.onclick = (event: MouseEvent) => control.playerEndsTurn();
};