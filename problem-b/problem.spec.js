const fs = require('fs');
const md5 = require('md5');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once
const jsPath = __dirname + '/js/index.js';

const moment = require('moment'); //for testing
window.moment = moment;

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    await expect([jsPath]).toHaveNoEsLintErrors();
  })

  test('HTML has not been modified', () => {
    let nospace = html.replace(/\s/g, ''); //strip all whitespace to account for platform modifications
    expect(md5(nospace)).toBe('3a326efb7ac37c896a84df8347c28e31');
    //console.log(md5(nospace));
  })
});


//load the HTML into the tester
document.documentElement.innerHTML = html;
//load JavaScript libraries separately
const solution = require(jsPath); //load the solution

const $ = require('jquery'); //jQuery for convenience

function resetForm() { //helper
  $('#emailInput').val('');
  $('#passwordInput').val('');
  $('#passwordConfirmInput').val('');
  $('#dobInput').val('');
  $('form').removeClass('was-validated');
  $('#dobFeedback').text('');
  $('#passwordConfirmFeedback').text('');
  document.querySelector('button').disabled = false;
}

describe('Perhaps and shows form validation', () => {
  test('Shows feedback highlighting when invalid', () => {
    $('form')[0].dispatchEvent(new Event('submit')); //pretend we submitted
    expect($('form').hasClass('was-validated')).toBe(true);

    expect($('.alert').hasClass('d-none')).toBe(true); //still hidden
  })

  test('Disables button when invalid', () => {
    //form should be invalid at this point
    expect($('button').attr('disabled')).toBeDefined();
  })

  test('Displays success alert only when valid', () => {
    //enter valid values
    $('#emailInput').val('test@test.com');
    $('#passwordInput').val('password');
    $('#passwordConfirmInput').val('password');
    $('#dobInput').val('2000-01-01');
    $('form')[0].dispatchEvent(new Event('submit')); //pretend we submitted

    //form is now valid
    expect($('.alert').hasClass('d-none')).toBe(false);
    expect($('form').hasClass('d-none')).toBe(true);
  })
})

describe('Date of Birth field', () => {
  resetForm();

  test('Is marked invalid when age younger than 13', () => {
    let input = document.querySelector('#dobInput');
    input.value = "2019-01-01" //recent value
    input.dispatchEvent(new Event('input')); //pretend I typed that!

    expect(input.validity.customError).toBe(true); //has error
  })

  test('Shows error message when invalid', () => {
    //is still invalid
    expect($('#dobFeedback').text()).toMatch(/You need to be at least 13 years old/);
  })

  test('Is marked valid when age 13 or older', () => {
    let input = document.querySelector('#dobInput');
    input.value = "2000-01-01" //recent value
    input.dispatchEvent(new Event('input')); //pretend I typed that!

    expect(input.checkValidity()).toBe(true); //has no error
  })
})

describe('validatePasswordMatch() function', () => {
  resetForm();
  let input = document.querySelector('#passwordInput');
  let confirm = document.querySelector('#passwordConfirmInput');

  test("Marks password confirmation invalid if don't match", () => {
    input.value = "password";
    confirm.value = "different";

    solution.validatePasswordMatch() //call function

    expect(confirm.validity.customError).toBe(true); //has error
  })

  test("Shows error message when invalid", () => {
    //is still invalid
    expect($('#passwordConfirmFeedback').text()).toMatch(/Passwords do not match/);
  })

  test("Marks valid if passwords do match", () => {
    input.value = "password";
    confirm.value = "password";

    solution.validatePasswordMatch() //call function

    expect(confirm.checkValidity()).toBe(true); //has no error
  })

  test("Shows no error message when matching", () => {
    expect($('#passwordConfirmFeedback').text()).toBe("");
  })

  test("Is called on input to both password fields", () => {
    resetForm()
    input.value = "password";
    input.dispatchEvent(new Event('input')); //pretend I typed in
    expect(confirm.validity.customError).toBe(true); //has error

    confirm.value = "password" //make match
    confirm.dispatchEvent(new Event('input')); //pretend I typed in
    expect(confirm.validity.customError).toBe(false); //has no error now
  })
})

describe("Form submit button", () => {
  test("Disables on invalid input to any field", () => {
    resetForm()
    $('form').addClass('was-validated'); //like we submitted once
    // $('form')[0].dispatchEvent(new Event('submit')); //pretend we submitted
  
    let button = document.querySelector('button');
  
    button.disabled = false;
    $('#emailInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(true);

    button.disabled = false;
    $('#passwordInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(true);

    button.disabled = false;
    $('#passwordConfirmInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(true);

    button.disabled = false;
    $('#dobInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(true);
  })

  test("Is not disabled if form not submitted", () => {
    resetForm();
    let button = document.querySelector('button');

    //all these work even without submitted the form
    $('#emailInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(false); //form not submitted

    $('#passwordInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(false); //form not submitted

    $('#passwordConfirmInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(false); //form not submitted

    $('#dobInput')[0].dispatchEvent(new Event('input')); //pretend I typed in
    expect(button.disabled).toBe(false); //form not submitted
  }) 
})
