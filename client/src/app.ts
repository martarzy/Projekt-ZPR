/// <reference path="./controller/controller.ts" />

window.onload = () => {
    const wsUri = "ws://localhost:8888/ws";
    const control = new controller.Controller(wsUri);

    // adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById("username");
    const submitUsernameButton = document.getElementById("submit-username");
    const readyButton = document.getElementById("ready-button");
    const rollButton = document.getElementById("roll-button");

    submitUsernameButton.onclick = (event: MouseEvent) => control.chooseName(usernameField.value);
    readyButton.onclick = (event: MouseEvent) => control.playerIsReady();
    rollButton.onclick = (event: MouseEvent) => control.rollDice();
};