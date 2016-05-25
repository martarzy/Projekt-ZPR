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

        showSignInWindow(): void {
            $("#myModal").modal('show');
        }

        hideSignInWindow(): void {
            $("#myModal").modal('hide');
        }

        setActiveRollButton(): void {
            $('#roll-button').removeAttr('disabled');
            $('#roll-button').attr('active');
        }

        setDisabledRollButton(): void {
            $('#roll-button').removeAttr('active');
            $('#roll-button').attr('disabled', 1);
        }

        setActiveReadyButton(): void {
            $('#ready-button').removeAttr('disabled');
            $('#ready-button').attr('active', 1);
        }

        setDisabledReadyButton(): void {
            $('#ready-button').removeAttr('active');
            $('#ready-button').attr('disabled', 1);
        }
	}

}