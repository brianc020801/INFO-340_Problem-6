const fs = require('fs');
const md5 = require('md5');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once
const jsPath = __dirname + '/js/index.js';

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    await expect([jsPath]).toHaveNoEsLintErrors();
  })

  test('HTML has not been modified', () => {
    let nospace = html.replace(/\s/g, ''); //strip all whitespace to account for platform modifications
    expect(md5(nospace)).toBe('b9424cd36d6eda716fa363536bcfe003');
    //console.log(md5(nospace));
  })
});

//load the HTML into the tester
document.documentElement.innerHTML = html;

//load JavaScript libraries separately
const $ = require('jquery'); //jQuery for convenience
const solution = require(jsPath); //load the solution

describe('Manipulates the DOM', () => {
  test('Changes the heading content', () => {
    expect($('h1').text()).toEqual("Which Swatch?");
  })

  test('Gives the img an alt attribute', () => {
    expect($('img').attr('alt')).toEqual("A beautiful rainbow");
  })

  test('The image floats to the right', () => {
    expect($('img').attr('class')).toEqual('float-right'); //string comparison for clearer errors
  })

  test('Implemented the createColorBox() function', () => {
    let blueBox = solution.createColorBox('blue', 100);
    expect(blueBox.classList[0]).toEqual('d-inline-block');
    expect(blueBox.style.backgroundColor).toEqual('blue');
    expect(blueBox.style.width).toEqual('100px');
    expect(blueBox.style.height).toEqual('100px');

    let bigRed = solution.createColorBox('red', 200); //check works with different values
    expect(bigRed.style.backgroundColor).toEqual('red');
    expect(bigRed.style.width).toEqual('200px');
    expect(bigRed.style.height).toEqual('200px');
  })

  test('Implemented the renderPaletteRow() function', () => {
    let paletteBox = document.createElement('main');
    solution.renderPalette(['red','green','blue'], paletteBox);
    let colorBoxes = $(paletteBox).find('.d-inline-block'); //find the boxes
    expect(colorBoxes.length).toBe(3); //should be one per color
    expect(colorBoxes.eq(0).css('background-color')).toEqual('red'); //colors should be right
    expect(colorBoxes.eq(1).css('background-color')).toEqual('green');
    expect(colorBoxes.eq(2).css('background-color')).toEqual('blue');    
  })

  test('Implemented and called the renderPaletteTable() function', () => {
    let boxes = $('main .d-inline-block');
    expect(boxes.length).toBe(5*9); //should have 5 rows of 9
    expect(boxes.eq(1).css('background-color')).toEqual('rgb(244, 109, 67)'); //spot check... should be consistent
    expect(boxes.eq(9).css('background-color')).toEqual('rgb(255, 245, 240)');
    expect(boxes.eq(27).css('background-color')).toEqual('rgb(247, 252, 245)');
  })
})
