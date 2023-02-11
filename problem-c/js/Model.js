'use strict';

import initialTasks from './task-data.js';

let currentTaskList = initialTasks.map((task, index) => {
    task.id = index + 1;
    return {...task};
})

export function getIncompleteTasks(){
    let incomplete = currentTaskList.filter(task => {
        return task.status === 'incomplete';
    })
    return incomplete;
}

export function addTask(description){
    let newTask = {description: description, status: "incomplete", id: currentTaskList[currentTaskList.length-1].id + 1};
    currentTaskList.push(newTask)
    return {...currentTaskList};
}

export function markComplete(taskId){
    currentTaskList = currentTaskList.map(task => {
        let copy = {...task};
        if(copy.id == taskId){
            copy.status = "complete";
            return copy;
        }else{
            return copy;
        }
    })
}