/// <reference path="./controller/controller.ts" />

window.onload = () => {
    const wsUri = "ws://localhost:8888/ws";
    const control = new controller.Controller(wsUri);
    const actions: controller.UserActions = control.actionsMap;

    // adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById("username");
    (<HTMLInputElement>document.getElementById("submit-username"))
        .onclick = (event: MouseEvent) => actions.chooseName(usernameField.value);

    (<HTMLInputElement>document.getElementById("ready-button"))
        .onclick = (event: MouseEvent) => actions.playerIsReady();
    (<HTMLInputElement>document.getElementById("roll-button"))
        .onclick = (event: MouseEvent) => actions.rollDice();
    (<HTMLInputElement>document.getElementById("buy-button"))
        .onclick = (event: MouseEvent) => actions.playerBuysField();
    (<HTMLInputElement>document.getElementById("end-turn-button"))
        .onclick = (event: MouseEvent) => actions.playerEndsTurn();

    (<HTMLInputElement>document.getElementById("build-button"))
        .onclick = (event: MouseEvent) => actions.activateBuildMode();
    (<HTMLInputElement>document.getElementById("sell-button"))
        .onclick = (event: MouseEvent) => actions.activateSellMode();
    (<HTMLInputElement>document.getElementById("mortgage-button"))
        .onclick = (event: MouseEvent) => actions.activateMortgageMode();
    (<HTMLInputElement>document.getElementById("unmortgage-button"))
        .onclick = (event: MouseEvent) => actions.activateUnmortgageMode();

    // TODO button to start trade
    (<HTMLInputElement>document.getElementById("make-bid-button"))
        .onclick = (event: MouseEvent) => actions.offerTrade();
    (<HTMLInputElement>document.getElementById("accept-offer-button"))
        .onclick = (event: MouseEvent) => actions.responseTrade(true);
    (<HTMLInputElement>document.getElementById("decline-offer-button"))
        .onclick = (event: MouseEvent) => actions.responseTrade(false);
    
    (<HTMLInputElement>document.getElementById("jail-pay-button"))
        .onclick = (event: MouseEvent) => actions.exitJailPaying();
    (<HTMLInputElement>document.getElementById("jail-use-card-button"))
        .onclick = (event: MouseEvent) => actions.exitJailUsingChanceCard();  

    (<HTMLInputElement>document.getElementById("bankruptcy-button"))
        .onclick = (event: MouseEvent) => actions.declareBankruptcy(); 
};