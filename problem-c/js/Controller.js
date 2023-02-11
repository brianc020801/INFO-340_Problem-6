'use strict';

import * as model from "./Model.js";
import { renderTaskList } from "./View.js";

function markCompleteCallback(task){
    model.markComplete(task.id);
    renderTaskView();
}

export function renderTaskView(){
    document.querySelector('#tasks-root').innerHTML = "";
    document.querySelector('#tasks-root').append(renderTaskList(markCompleteCallback));
}

document.querySelector('#add-task-button').addEventListener('click', () => {
    let input = document.querySelector('input');
    if(input.value != ""){
        model.addTask(input.value);
        input.value = "";
        renderTaskView();
    }
})