/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */


$(document).ready(() => {
    $('.preferences').click(preferences);
    $('#main').click(main);
    $('#app-body').show();
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

async function linkedin_loaded() {
	alert('linkedin_loaded');
}

async function main() {
	$('#intro').hide();
	$('#preferences-body').hide();
	$('#main-body').show();
}