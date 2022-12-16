import Project from './project';
import projectList from './projectList';

export function updateStorage() {
    localStorage.setItem('projects', JSON.stringify(projectList.getProjects()));
}

export function checkStorage() {
    if (localStorage.length) {
        loadProjectsFromStorage();
    } else {
        createHomeProject();
    }

    projectList.setCurrentProject(projectList.getHomeProject());
}

function createHomeProject() {
    const home = new Project('Home');
    projectList.addProject(home);
}

function loadProjectsFromStorage() {
    const projects = JSON.parse(localStorage.getItem('projects'));

    projects.forEach((project) => {
        addProjectToList(project);
    });
}

function addProjectToList(project) {
    const newProject = new Project(project.title);
    newProject.tasks = project.tasks;
    newProject.priorityTasks = project.priorityTasks;

    projectList.addProject(newProject);

    return newProject;
}
