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
