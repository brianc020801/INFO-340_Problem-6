'use strict';

// import { lastIndexOf } from 'lodash';
import { getIncompleteTasks } from './Model.js';

function renderSingleTask(task, func){
    let newLi = document.createElement('li');
    newLi.classList.add('list-group-item');
    newLi.textContent = " " + task.description;
    let newBtn = document.createElement('button');
    newBtn.classList.add('btn', 'btn-sm', 'btn-warning');
    newBtn.innerHTML = `<span class="material-icons-outlined">done</span>`;
    newBtn.addEventListener('click', () => {
        func(task);
    })
    newLi.prepend(newBtn);
    return newLi;
}

export function renderTaskList(func){
    let newUl = document.createElement('ul');
    newUl.classList.add('list-group', 'list-group-flush');
    let incomplete = getIncompleteTasks();
    console.log(incomplete);
    if(incomplete.length != 0){
        incomplete.forEach(task => {
            newUl.append(renderSingleTask(task, func));
        })
    }else{
        let newDiv = document.createElement('div');
        newDiv.textContent = "None!";
    }
    return newUl;
}

console.log(renderTaskList(undefined));