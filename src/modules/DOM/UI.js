import projectLogic from '../app_logic/projectLogic';
import taskLogic from '../app_logic/taskLogic';
import Project from '../app_logic/project';
import projectList from '../app_logic/projectList';
import dynamicClick from './dynamicClick';
import projectDOM from './projectDOM';
import displayTasks from './taskDOM';

const homeLi = document.querySelector('.home-li');
homeLi.addEventListener('click', homeClick);

const todayLi = document.querySelector('.today-li');
todayLi.addEventListener('click', todayClick);

const weekLi = document.querySelector('.week-li');
weekLi.addEventListener('click', weekClick);

const newTaskBtn = document.querySelector('.new-task-button');
newTaskBtn.addEventListener('click', newTaskClick);

const taskForm = document.querySelector('.task-form');
taskForm.addEventListener('submit', submitTask);

const cancelTaskBtn = document.querySelector('.cancel-form-button');
cancelTaskBtn.addEventListener('click', cancelTaskClick);

const newProjectBtn = document.querySelector('.new-project-button');
newProjectBtn.addEventListener('click', newProjectClick);

const projectForm = document.querySelector('.project-form');
projectForm.addEventListener('submit', projectSubmit);

const cancelProjectBtn = document.querySelector('.cancel-form-project');
cancelProjectBtn.addEventListener('click', cancelProjectClick);

function homeClick() {
    projectDOM.setSelectedProject(homeLi);

    projectList.setCurrentProject(projectList.getHomeProject());

    displayTasks(true);

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);

    projectDOM.displayProjectName();
}

function todayClick() {
    projectDOM.setSelectedProject(todayLi);

    projectList.setCurrentProject(new Project());

    projectLogic.getTodayProjects();

    displayTasks(true);

    dynamicClick.dynamicShow(['newProjectBtn']);
    dynamicClick.dynamicHide(['newTaskBtn', 'taskForm', 'projectForm']);

    projectDOM.displayProjectName('Today');
}

function weekClick() {
    projectDOM.setSelectedProject(weekLi);

    projectList.setCurrentProject(new Project());

    projectLogic.getWeekProjects();

    displayTasks(true);

    dynamicClick.dynamicShow(['newProjectBtn']);
    dynamicClick.dynamicHide(['newTaskBtn', 'taskForm', 'projectForm']);

    projectDOM.displayProjectName('This Week');
}

function newTaskClick() {
    taskForm.reset();
    projectForm.reset();

    dynamicClick.dynamicShow(['taskForm', 'newProjectBtn']);
    dynamicClick.dynamicHide(['projectForm']);
}

function submitTask(event) {
    event.preventDefault();

    taskLogic.createTask(projectList.getCurrentProject());

    displayTasks(true);

    dynamicClick.dynamicHide(['taskForm']);
}

function cancelTaskClick() {
    dynamicClick.dynamicHide(['taskForm']);
}

function newProjectClick() {
    taskForm.reset();
    projectForm.reset();

    dynamicClick.dynamicShow(['projectForm']);
    dynamicClick.dynamicHide(['newProjectBtn', 'taskForm']);
}

function projectSubmit(event) {
    event.preventDefault();

    projectDOM.appendProject(projectLogic.createProject());

    dynamicClick.dynamicShow(['newProjectBtn']);
    dynamicClick.dynamicHide(['projectForm']);
}

function cancelProjectClick() {
    dynamicClick.dynamicShow(['newProjectBtn']);
    dynamicClick.dynamicHide(['projectForm']);
}

export default {
    homeLi,
    todayLi,
    weekLi,
    newTaskBtn,
    taskForm,
    cancelTaskBtn,
    newProjectBtn,
    projectForm,
    cancelProjectBtn,
};
