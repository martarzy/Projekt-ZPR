/// <reference path="./controller/controller.ts" />

window.onload = () => {
    const wsUri = "ws://localhost:8888/ws";
    const control = new controller.Controller(wsUri);

    // adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById("username");
    const submitUser = document.getElementById("submit-username");
    const ready = document.getElementById("ready-button");

    submitUser.onclick = (event: MouseEvent) => control.chooseName(usernameField.value);
    ready.onclick = (event: MouseEvent) => control.playerIsReady();
};