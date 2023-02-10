'use strict';

//Create a variable `form` that refers to the `<form>` element in the DOM.

/* Add an event listener to the `form` element that will listen for `'submit'` 
type events (which occur when the form is submitted). In the callback function 
for this event listener, do the following:
  1. Call the `preventDefault()` function on the event to keep the HTTP request
     from being submitted.
  2. Check if the form is currently valid by calling the `checkValidity()` 
     function on the `form` element. This function returns `true` if all inputs 
     are valid, and `false` otherwise.
  3. If the form IS valid, add the `d-none` class to the form element to hide it.
     Also remove the `d-none` element from the `.alert` paragraph to show that 
     instead.
  4. If the form IS NOT valid, add a class called `was-validated` to the `form`. 
     This Bootstrap class will cause validation styling to be applied.
     Also you should disable the submit `button` by assigning its `disabled` 
     attribute a value of `true` (set the attribute directly with dot notation, 
     don't use `setAttribute()`).
     PLEASE NOTE: the `was-validated` class DO NOT MEAN mean that a form is 
     "valid" (correct). It just mean that the form has been "checked" for 
     correctness. "was-checked" would be a better classname, but Bootstrap 
     doesn't use that.
*/



/* You should now be able to submit the form and see it highlight fields that 
are invalid. This validity is based on HTML attributes; for example, the "email"
input has `type="email"` and the `required` attribute, so that it will be 
invalid if it is not an email or missing. 

However, this form will require some "custom" validations not supported by HTML
attributes, so you'll need to use JavaScript to handle that! */

//This function takes in a Date type value and returns the number of years
//since that date (based on the current time). For example, if run in 2020:
//    getYearsSince("2001-01-01") // returns 19
function getYearsSince(aDate){
  /* global moment */
  moment.suppressDeprecationWarnings = true; //don't worry about these now
  return moment().diff(moment(aDate), 'years');
}

/* First you'll check to make sure that the user is at least 13 years old. Add 
an event lister to the `#dobInput` <input> element that will respond to `"input"` 
events (when the user changes the inputted value). In the callback function for 
this event handler, do the following:
  - Get the `.value` property of the `<input>` element (what the user typed in),
    and use that value and the `getYearsSince()` function to calculate the 
    user's age (use the `getYearsSince()`.
  - If the person's age is less than 13 (or greater than 200), call the 
    `setCustomValidity()` method on the `#dobInput` element, setting its error 
    to be the string:
        "You need to be at least 13 years old."
    Also change the `#dobFeedback` element so its `textContent` is this same
    error message.
  - If the person's age is NOT less than 13, use `setCustomValidity()` to set
    the `#dobInput` element's error to be an empty string `""` (this will
    remove the validation error).

The "Date of Birth" should now show an error when empty or if the year is too
recent; otherwise it should highlight as valid. Note that you'll need to hit
"Sign me up!" first to enable the validation highlighting!
*/



/* Next you'll make sure the two "password" fields match. Start by defining a
function `validatePasswordMatch()`. This function should access both password
<input> elements and check if their `.value` properties are the same.
- If the values are NOT the same, call the the `setCustomValidity()` method on
  the `#passwordConfirmInput` element, setting its error to be the string:
      "Passwords do not match"
  Also change the `#passwordConfirmFeedback` element so its `textContent` is 
  this same error message.
- If the values ARE the same, use `setCustomValidity()` to set the
  `#passwordConfirmInput` element's error to be an empty string `""`.
  Also change the `#passwordConfirmFeedback` element so its `textContent` is
  also blank (an empty string).
*/



/* Assign the `validatePasswordMatch` function as the callback for `input` 
events that happen on BOTH the `#passwordInput` and `#passwordConfirmInput`
elements. You can select the elements individually or using `querySelectorAll()`.
*/



/* Last you'll need to only enable the "submit" button if the form is valid. Use
the `querySelectorAll()` method to select all 4 of the <input> elements. Use the
`forEach` function to loop through these inputs, and for each input add (another)
event listener to respond to `input` events. In the event handler function, check
if the <form> element has the `was-validated` class (has been checked, even if it
isn't correct). If it has been checked, modify the button's `disabled` property:
it should be `false` if the form is valid (use `checkValidity()`), and `true` 
otherwise. Note that there are "two conditions" being considered: first if the
form has been checked at all (whether to change the button at all), and second 
if the form is valid (what to change the button to).

This should disable the button until all of the fields are valid, but only after
the user tries to submit once (which is a polite user experience)
*/




//Make functions and variables available to tester. DO NOT MODIFY THIS.
if(typeof module !== 'undefined' && module.exports){
  /* eslint-disable */
  if(typeof validatePasswordMatch !== 'undefined') 
    module.exports.validatePasswordMatch = validatePasswordMatch;
}
