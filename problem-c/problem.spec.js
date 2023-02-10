const fs = require('fs');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

//load the HTML into the tester
const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once
document.documentElement.innerHTML = html;

const $ = require('jquery'); //jQuery for convenience

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {

    const sources = ['index.js','Model.js','View.js','Controller.js'].map((src) => __dirname + '/js/' + src);
    const linterOptions = {
      overrideConfig: {
        parserOptions: { sourceType: "module" },
        rules:{
          'prefer-arrow-callback': ['error'] //requires arrow functions!
        }
      }
    }

    sources.forEach(async (source) => {
      // console.info(source); //blobs don't work it seems...
      await expect([source]).toHaveNoEsLintErrors(linterOptions);
    })
  })
});

describe('index.html file', () => {
  test('includes index.js module in HTML', () => {
    let scriptElem = $('script');
    expect(scriptElem.length).toBe(1);
    expect(scriptElem.attr('src')).toEqual('js/index.js');
    expect(scriptElem.attr('type')).toEqual('module');
  })
})

describe('Model.js module', () => {
  let model = require(__dirname + '/js/Model')
 
  test('initial processing and getIncompleteTasks() function', () => {
    expect(model.getIncompleteTasks).toBeDefined(); //has exported the function

    let incompleteTasks = model.getIncompleteTasks();
    expect(incompleteTasks.length).toBeGreaterThan(0); //check that loads some tasks

    //check that tasks have ids and correct content
    expect(incompleteTasks[0].description).toEqual("Implement the Model"); //first task is correct
    expect(incompleteTasks[0].status).toEqual("incomplete"); //has all properties
    expect(incompleteTasks[0].id).toEqual(1); //has an assigned id
    let lastIdx = incompleteTasks.length - 1;
    expect(incompleteTasks[lastIdx].description).toEqual("Implement the Controller"); //last task is correct
    expect(incompleteTasks[lastIdx].status).toEqual("incomplete"); //has all properties
    expect(incompleteTasks[lastIdx].id).toEqual(4); //has an assigned id

    expect(incompleteTasks.length).toEqual(3); //has only 2 incomplete tasks
  });

  test('addTask() function', () => {
    expect(model.addTask).toBeDefined(); //has exported the function
    
    model.addTask("testing task 1"); //try calling the function

    let incompleteTasks = model.getIncompleteTasks();
    expect(incompleteTasks.length).toEqual(4); //should now have 4 incompletes
    expect(incompleteTasks[3].description).toEqual("testing task 1");
    expect(incompleteTasks[3].id).toEqual(5); //gets next number for id
    expect(incompleteTasks[3].status).toEqual("incomplete");

    model.addTask("testing task 2"); //try calling the function again

    incompleteTasks = model.getIncompleteTasks();
    expect(incompleteTasks.length).toEqual(5); //should now have 5 incompletes
    expect(incompleteTasks[4].description).toEqual("testing task 2");
    expect(incompleteTasks[4].id).toEqual(6); //gets next number for id
    expect(incompleteTasks[4].status).toEqual("incomplete");

    model.addTask("testing task 3"); //try calling the function again for later testing

  });

  test('markComplete() function', () => {
    expect(model.markComplete).toBeDefined(); //has exported the function

    let initialIncompleteTasks = model.getIncompleteTasks();
    expect(initialIncompleteTasks.length).toEqual(6); //start with 6 incomplete

    model.markComplete(5); //mark first testing task as complete

    let incompleteTasks = model.getIncompleteTasks();
    expect(incompleteTasks.length).toEqual(5); //should now have 5 incompletes
    expect(initialIncompleteTasks[0]).not.toBe(incompleteTasks[0]); //task objects are copies

    model.markComplete(6); //second testing task as complete
    incompleteTasks = model.getIncompleteTasks();
    expect(incompleteTasks.length).toEqual(4); //should now have 4 incompletes
    expect(initialIncompleteTasks[0]).not.toBe(incompleteTasks[0]); //task objects are copies
  })
})

describe('View.js module', () => {
  let model = require(__dirname + '/js/Model')
  let view = require(__dirname + '/js/View')

  test('renderTaskList() function', () => {
    expect(view.renderTaskList).toBeDefined(); //has exported the function

    
    let renderedDOM = view.renderTaskList();
    expect(renderedDOM).toBeDefined(); //function returned a DOM element
    expect(renderedDOM.tagName.toLowerCase()).toEqual("ul"); //returns a <ul> element
    let ul = $(renderedDOM);
    expect(ul.hasClass('list-group')).toBe(true);
    expect(ul.hasClass('list-group-flush')).toBe(true);
  })

  test('renders each task as an <li>', () => {
    expect(view.renderSingleTask).not.toBeDefined(); //has NOT exported helper function

    const testCallback = jest.fn(); //mock

    let renderedDOM = view.renderTaskList(testCallback);
    expect(renderedDOM).toBeDefined(); //function returned a DOM element
    let ul = $(renderedDOM);

    let liElems = ul.children('li');
    expect(liElems.length).toEqual(4); //has 4 incomplete elements (li, children)
    
    let incompleteTasks = model.getIncompleteTasks();

    //check each element
    liElems.each((index) => {
      let elem = liElems.eq(index); //which element are we looking at
      expect(elem.hasClass("list-group-item")).toBe(true);
      expect(elem.text()).toMatch(incompleteTasks[index].description); //includes text

      let button = elem.children('button');
      expect(button).toBeDefined(); //has a button child
      expect(button.attr('class')).toContain('btn');
      expect(button.attr('class')).toContain('btn-sm');
      expect(button.attr('class')).toContain('btn-warning');
      expect(button.html()).toEqual('<span class="material-icons-outlined">done</span>'); //has correct content

      button.trigger('click'); //click the button
      expect(testCallback).toBeCalled(); //callback is executed on button click

      expect(elem.text()).toEqual("done "+incompleteTasks[index].description); //includes button
    })
  })
})

describe('Controller.js module', () => {
  let model = require(__dirname + '/js/Model')
  let controller = require(__dirname + '/js/Controller')

  test("renderTaskView() function", () => {
    expect(controller.renderTaskView).toBeDefined(); //exported function

    controller.renderTaskView(); //call

    let tasksRoot = $('#tasks-root');
    expect(tasksRoot.children('ul').length).toBe(1); //renders a ul child
    expect(tasksRoot.find('li').length).toBe(4); //renders 3 incomplete items (includes testing task)

    controller.renderTaskView(); //call a second time
    expect(tasksRoot.find('li').length).toBe(4); //still has 3 items      
  })

  test('markCompleteCallback() function', () => {
    expect(controller.markCompleteCallback).not.toBeDefined(); //did not export helper

    let tasksRoot = $('#tasks-root');
    expect(tasksRoot.find('li').length).toBe(4); //renders 3 incomplete items (includes testing task)

    let liElems = $(tasksRoot).find('li');
    liElems.last().children('button').trigger('click'); //click last task button

    let incompleteTasks = model.getIncompleteTasks();
    liElems = $(tasksRoot).find('li'); //get new set of DOM
    expect(liElems.length).toBe(3) //now only 3 incomplete tasks
    expect(liElems.last().text()).toMatch(incompleteTasks[incompleteTasks.length-1].description);

    liElems.first().children('button').trigger('click'); //click first task button
    liElems = $(tasksRoot).find('li'); //get new set of DOM
    expect(liElems.length).toBe(2) //now only 2 incomplete tasks
    expect(liElems.first().text()).toMatch(incompleteTasks[1].description); //first item was removed
  })

  test('handles inputting new tasks', () => {
    //can add tasks
    $('input').val('Test adding task'); //enter value
    $('#add-task-button').trigger('click'); //click the button
    expect($('li').length).toBe(3); //now has 3 list items
    expect($('li:last-child').text()).toMatch('Test adding task'); //correct content

    //can't add blank tasks
    $('input').val(''); //clear input
    $('#add-task-button').trigger('click'); //click the button
    expect($('li').length).toBe(3); //still has 3 list items

    //input clears on adding tasks
    $('input').val('Test clearing input'); //enter value
    $('#add-task-button').trigger('click'); //click the button
    expect($('input').val()).toEqual(''); //has no input value
  })
})

describe('index.js module', () => {
  test('renders the DOM when executed', () => {
    document.documentElement.innerHTML = html; //reload the HTML
    require(__dirname + '/js/index.js') //load index.js (if not done yet)
    expect($('#tasks-root ul li').length).toBe(4); //renders base 3 tasks + 1 test
  })
})
