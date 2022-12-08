import Project from "./app_logic/project";
import projectList from "./app_logic/projectList";
import projectDOM from "./DOM/projectDOM";

export function updateStorage() {
    localStorage.setItem('projects', JSON.stringify(projectList.getProjects()));
}

export function checkStorage() {
    if (localStorage.length) {
        loadProjectsFromStorage();
    } else {
        createHomeProject()
    }

    projectList.setCurrentProject(projectList.getHomeProject());
}

function createHomeProject() {
    const home = new Project('Home');
    projectList.addProject(home);
}

function loadProjectsFromStorage() {
    const projects = JSON.parse(localStorage.getItem('projects'));

    projects.forEach(project => {
        const newProject = addProjectToList(project);
        appenProjectsToNav(newProject);
    });
}

function addProjectToList(project) {
    const newProject = new Project(project.title);
    newProject.tasks = project.tasks;
    newProject.priorityTasks = project.priorityTasks;

    projectList.addProject(newProject);

    return newProject;
}

function appenProjectsToNav(newProject) {
    if (newProject !== projectList.getHomeProject()) {
        projectDOM.appendProject(newProject);
    }
}