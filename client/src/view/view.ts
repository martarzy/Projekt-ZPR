/// <reference path="../model/model.ts" />

/*
* TODO
* - setActiveRollButton(true/false)
* - setActiveSubmitUsername - blokuje przycisk i pole tekstowe (albo je ukrywa)
* - setActiveReadyButton - ukrywa/pokazuje przycisk gotowśości
* - movePawn(username, targetFieldNumber)
* - addUser(username)
* - setUserColor(username, color)
* - setUserCash(username, cash)
* - setActiveUser(username)
*/

namespace view {

	export class View {

        constructor() {
            this.showSignInWindow();
            this.setDisabledReadyButton();
            this.setDisabledRollButton();
        }

        showSignInWindow(): void {
            $("#myModal").modal('show');
        }

        hideSignInWindow(): void {
            $("#myModal").modal('hide');
        }

        setActiveRollButton(): void {
            $('#roll-button').removeAttr('disabled');
        }

        setDisabledRollButton(): void {
            $('#roll-button').removeAttr('active');
            $('#roll-button').attr('disabled', 1);
        }

        setActiveReadyButton(): void {
            $('#ready-button').removeAttr('disabled');
        }

        setDisabledReadyButton(): void {
            $('#ready-button').removeAttr('active');
            $('#ready-button').attr('disabled', 1);
        }
	}

}