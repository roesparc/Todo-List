import projectLogic from './projectLogic';
import projectList from './projectList';
import Task from './task';
import dynamicClick from '../DOM/dynamicClick';
import displayTasks from '../DOM/taskDOM';

function createTask(project) {
    const task = createNewTask();
    addTaskToProject(project, task);
}

function createNewTask() {
    const taskTitle = document.querySelector('#title').value;
    const taskDescription = document.querySelector('#description').value;
    const taskDate = document.querySelector('#date').value;
    const taskPriority = document.querySelector('#priority').checked;

    return new Task(taskTitle, taskDescription, taskDate, taskPriority);
}

function addTaskToProject(project, task) {
    project.addTask(task);
}

function getTasksForCurrentProject(priority) {
    let tasks;

    if (priority) {
        tasks = projectList.getCurrentProject().priorityTasks;
    } else {
        tasks = projectList.getCurrentProject().tasks;
    }

    return tasks;
}

function deleteTask(obj) {
    projectList.getCurrentProject().deleteTask(obj);

    projectLogic.deleteProjectTask(obj);

    displayTasks(true);

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
}

function submitEdit(obj, editForm) {
    const isTaskChecked = isChecked(obj);

    applyDescriptionDateChanges(obj, editForm);
    applyPriorityChanges(obj, editForm);
    applayCheckmarkChanges(isTaskChecked, obj);

    projectLogic.getTasksForProject();
    displayTasks(true);
}

function isChecked(task) {
    let isChecked = false;

    if (getProjectWithTask(task).tasksChecked.includes(task)) {
        isChecked = true
    }

    return isChecked;
}

function applyDescriptionDateChanges(obj, editForm) {
    const descriptionInput = editForm.querySelector('.edit-description-input');
    const dateInput = editForm.querySelector('.edit-date-input');

    obj.description = descriptionInput.value;
    obj.date = dateInput.value;
}

function applyPriorityChanges(obj, editForm) {
    const project = getProjectWithTask(obj)
    const priorityInput = editForm.querySelector('.edit-priority-input');

    if (obj.priority !== priorityInput.checked) {
        projectLogic.deleteProjectTask(obj);

        obj.priority = priorityInput.checked;

        addTaskToProject(project, obj);
    }
}

function applayCheckmarkChanges(wasChecked, task) {
    if (wasChecked) {
        getProjectWithTask(task).tasksChecked.push(task);
    }
}

function getProjectWithTask(obj) {
    let projectIndex;
    const projectsArr = projectList.getProjects();

    for (let i = 0; i < projectsArr.length; i++) {
        if (projectsArr[i].tasks.includes(obj) ||
        projectsArr[i].priorityTasks.includes(obj)) {
            projectIndex = i;
        }
    }

    return projectsArr[projectIndex];
}

export default {
    createTask,
    createNewTask,
    addTaskToProject,
    getTasksForCurrentProject,
    deleteTask,
    submitEdit,
    isChecked,
    applyDescriptionDateChanges,
    applyPriorityChanges,
    applayCheckmarkChanges,
    getProjectWithTask
}