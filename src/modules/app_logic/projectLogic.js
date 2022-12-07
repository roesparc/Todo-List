import {isThisWeek, isToday, parseISO} from 'date-fns';
import taskLogic from './taskLogic';
import Project from './project';
import projectList from './projectList';
import projectDOM from '../DOM/projectDOM';

function verifyAllProjectsMarks(obj) {
    const projectsArr = projectList.getProjects();

    projectsArr.forEach(project => {
        if (project.tasksChecked.includes(obj)) {
            project.modifyCheckmark(obj, 'remove');
        } 
        else if (project.tasks.includes(obj) ||
        project.priorityTasks.includes(obj)) {
            project.modifyCheckmark(obj, 'add');    
        }
    });
}

function getTasksForProject() {
    if (!projectList.getCurrentProject().title) {
        const selectedProject = document.querySelector('.selected-project');

        projectList.setCurrentProject(new Project());

        if (selectedProject.textContent === 'Today') {
            getTodayProjects();
        } else if (selectedProject.textContent === 'This Week') {
            getWeekProjects();
        }
    }
}

function deleteProjectTask(obj) {
    const projectsArr = projectList.getProjects();

    projectsArr.forEach(project => {
        if (project.tasks.includes(obj)) {
            project.deleteTask(obj);
        }

        if (project.priorityTasks.includes(obj)) {
            project.deleteTask(obj);
        }
    });
}

function createProject() {
    const project = createNewProject();
    projectDOM.appendProject(project);
}

function createNewProject() {
    const projectName = document.querySelector('#project-name').value;

    const project = new Project(projectName);

    projectList.addProject(project);

    return project;
}

function getTodayProjects() {
    const currentProject = projectList.getCurrentProject();
    const projectsArr = projectList.getProjects();

    projectsArr.forEach(project => {
        project.tasks.forEach(task => {
            if (isToday(parseISO(task.date))) {
                taskLogic.addTaskToProject(currentProject, task);
            }
        });

        project.priorityTasks.forEach(priorityTask => {
            if (isToday(parseISO(priorityTask.date))) {
                taskLogic.addTaskToProject(currentProject, priorityTask);
            }
        });

        project.tasksChecked.forEach(taskChecked => {
            currentProject.modifyCheckmark(taskChecked, 'add');
        });
    });
}

function getWeekProjects() {
    const currentProject = projectList.getCurrentProject();
    const projectsArr = projectList.getProjects();

    projectsArr.forEach(project => {
        project.tasks.forEach(task => {
            if (isThisWeek(parseISO(task.date))) {
                taskLogic.addTaskToProject(currentProject, task);
            }
        });

        project.priorityTasks.forEach(priorityTask => {
            if (isThisWeek(parseISO(priorityTask.date))) {
                taskLogic.addTaskToProject(currentProject, priorityTask);
            }
        });

        project.tasksChecked.forEach(taskChecked => {
            currentProject.modifyCheckmark(taskChecked, 'add');
        });
    });
}

export default {
    verifyAllProjectsMarks,
    getTasksForProject,
    deleteProjectTask,
    createProject,
    createNewProject,
    getTodayProjects,
    getWeekProjects
}