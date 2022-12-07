import projectList from "../app_logic/projectList";

function dynamicHide(elements) {
    const newTaskBtn = document.querySelector('.new-task-button');
    const taskForm = document.querySelector('.task-form');
    const newProjectBtn = document.querySelector('.new-project-button');
    const projectForm = document.querySelector('.project-form');

    if (elements.includes('newTaskBtn')) {
        newTaskBtn.style.display = 'none';
    }
    
    if (elements.includes('taskForm')) {
        taskForm.style.display = 'none';
    }

    if (elements.includes('newProjectBtn')) {
        newProjectBtn.style.display = 'none';
    }

    if (elements.includes('projectForm')) {
        projectForm.style.display = 'none';
    }
}

function dynamicShow(elements) {
    const newTaskBtn = document.querySelector('.new-task-button');
    const taskForm = document.querySelector('.task-form');
    const newProjectBtn = document.querySelector('.new-project-button');
    const projectForm = document.querySelector('.project-form');

    if (elements.includes('newTaskBtn')) {
        newTaskBtn.style.display = 'block';
    }
    
    if (elements.includes('taskForm')) {
        taskForm.style.display = 'block';
    }

    if (elements.includes('newProjectBtn')) {
        newProjectBtn.style.display = 'block';
    }

    if (elements.includes('projectForm')) {
        projectForm.style.display = 'block';
    }

    if (!projectList.getCurrentProject().title) {
        newTaskBtn.style.display = 'none';
    }
}

export default {
    dynamicHide,
    dynamicShow
}