/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */


$(document).ready(() => {
    $('.preferences').click(preferences);
    $('#main').click(main);
    $('#app-body').show();
    $('#linkedin-button').click(linkedInLogin);
    $('#linkedin-logout').click(linkedInLogout);
});

// The initialize function must be run each time a new page is loaded
Office.initialize = (reason) => {
    $('#app-body').show();

    var CheckBoxElements = document.querySelectorAll(".ms-CheckBox");
	for (var i = 0; i < CheckBoxElements.length; i++) {
		new fabric['CheckBox'](CheckBoxElements[i]);
	}

	var DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
  	for (var i = 0; i < DropdownHTMLElements.length; ++i) {
	    var Dropdown = new fabric['Dropdown'](DropdownHTMLElements[i]);
	}

	var FacePileElements = document.querySelectorAll(".ms-FacePile");
	for (var i = 0; i < FacePileElements.length; i++) {
	    new fabric['FacePile'](FacePileElements[i]);
	}
	getDataWithoutAuthChallenge();
};

async function preferences() {
	$('#intro-body').hide();
	$('#main-body').hide();
    $('#preferences-body').show();
}

async function main() {
	$('#intro').hide();
	$('#preferences-body').hide();
	$('#main-body').show();
}

// Login with LinkedIn
function linkedInLogin() {
	IN.User.authorize(undefined, this);
}

function linkedInLogout() {
	IN.User.logout(setLinkedinButtons, this);
}

// Setup an event listener to make an API call once auth is complete
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", linkedinLoggedIn);
    setLinkedinButtons();
}

function setLinkedinButtons() {
	if (IN.User.isAuthorized()) {
    	$('#linkedin-button').hide();
    	$('#linkedin-logout').show();
    	$('#welcome').hide();
    	$('#profile').show();
    } else {
    	$('#linkedin-button').show();
    	$('#linkedin-logout').hide();
    	$('#welcome').show();
    	$('#profile').hide();
    }
}

function updateProfile(data) {
	$('#profile h2').html('Welcome, ' + data.firstName);
	$('#profile img').attr('src', data.pictureUrl);
	$('#profile').show();
	$('#welcome').hide();
}

// Handle the successful return from the API call
function onSuccess(data) {
    console.log(data);
    updateProfile(data);
}

// Handle an error response from the API call
function onError(error) {
    console.log(error);
}

// Use the API call wrapper to request the member's basic profile data
function linkedinLoggedIn() {
	setLinkedinButtons();
    IN.API.Raw("/people/~:(first-name,picture-url)").result(onSuccess).error(onError);
}


// Called in the first attempt to use the on-behalf-of flow. The assumption
// is that single factor authentication is all that is needed.
function getDataWithoutAuthChallenge() {
    Office.context.auth.getAccessTokenAsync({forceConsent: false},
        function (result) {
            if (result.status === "succeeded") {
                accessToken = result.value;
                getData("/api/values", accessToken);
            }
            else {
                console.log("Code: " + result.error.code);
                console.log("Message: " + result.error.message);
                console.log("name: " + result.error.name);
                document.getElementById("getGraphAccessTokenButton").disabled = true;
            }
        });
}

// Calls the specified URL or route (in the same domain as the add-in)
// and includes the specified access token.
function getData(relativeUrl, accessToken) {

    $.ajax({
        url: relativeUrl,
        headers: { "Authorization": "Bearer " + accessToken },
        type: "GET",
        // Turn off caching when debugging to force a fetch of data
        // with each call.
        cache: false
    })
    .done(function (result) {
        /*
          If the Microsoft Graph target requests addtional authentication
          factor(s), the result will not be data. It will be a Claims
          JSON telling AAD what addtional factors the user must provide.
          Start a new sign-on that passes this Claims string to AAD so that
          it will provide the needed prompts.
        */

        // If the result contains 'capolids', then it is the Claims string,
        // not the data.
        if (result[0].indexOf('capolids') !== -1) {
            result[0] = JSON.parse(result[0])
            getDataUsingAuthChallenge(result[0]);
        } else {
            showResult(result);
        }
    })
    .fail(function (result) {
      console.log(result.responseJSON.error);
    });
}

// Called to trigger a second sign-on in which the user will be prompted
// to provide additional authentication factor(s). The authChallengeString
// parameter tells AAD what factor(s) it should prompt for.
function getDataUsingAuthChallenge(authChallengeString) {
    Office.context.auth.getAccessTokenAsync({authChallenge: authChallengeString},
        function (result) {
            if (result.status === "succeeded") {
                accessToken = result.value;
                getData("/api/onedriveitems", accessToken);
            }
            else {
                console.log("Code: " + result.error.code);
                console.log("Message: " + result.error.message);
                console.log("name: " + result.error.name);
                document.getElementById("getGraphAccessTokenButton").disabled = true;
            }
        });
}

// Displays the data, assumed to be an array.
function showResult(data) {
	for (var i = 0; i < data.length; i++) {
		console.log(data[i]);
	}
}
