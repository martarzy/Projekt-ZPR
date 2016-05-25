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
            //$('#submit-username').attr("disabled");
            $("#myModal").modal('hide');
        }

        setActiveRollButton(): void {
            $('#roll-button').removeClass('disabled');
            $('#roll-button').addClass('active');
        }

        setDisabledRollButton(): void {
            $('#roll-button').removeClass('active');
            $('#roll-button').addClass('disabled');
        }

        setActiveReadyButton(): void {
            $('#ready-button').removeClass('disabled');
            $('#ready-button').addClass('active');
        }

        setDisabledReadyButton(): void {
            $('#ready-button').removeClass('active');
            $('#ready-button').addClass('disabled');
        }
	}

}