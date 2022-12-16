import projectList from '../app_logic/projectList';
import { updateStorage } from '../app_logic/storage';
import dynamicClick from './dynamicClick';
import displayTasks from './taskDOM';

function appendProject(project) {
    const projectsNav = document.querySelector('.projects-nav');

    projectsNav.appendChild(createProjectElement(project));
}

function createProjectElement(obj) {
    const project = createProjectLi(obj);
    const infoDiv = createProjectInfo();
    const projectIcon = createProjectIcon();
    const projectTitle = createProjectTitle(obj);
    const deleteBtn = createDeleteProjectButton(project, obj);

    project.appendChild(infoDiv);
    infoDiv.appendChild(projectIcon);
    infoDiv.appendChild(projectTitle);
    project.appendChild(deleteBtn);

    return project;
}

function createProjectLi(obj) {
    const project = document.createElement('li');
    project.addEventListener('click', () => projectClick(project, obj));

    return project;
}

function createProjectInfo() {
    const projectInfo = document.createElement('div');
    projectInfo.classList.add('project-info-div');

    return projectInfo;
}

function createProjectTitle(obj) {
    const title = document.createElement('div');
    title.textContent = obj.title;

    return title;
}

function createProjectIcon() {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    icon.classList.add('fa-list-check');

    return icon;
}

function createDeleteProjectButton(project, obj) {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-project');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(project, obj);
    });

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-regular');
    deleteIcon.classList.add('fa-trash-can');

    deleteBtn.appendChild(deleteIcon);

    return deleteBtn;
}

function projectClick(project, obj) {
    setSelectedProject(project);
    projectList.setCurrentProject(obj);

    displayTasks(true);

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);

    displayProjectName();
}

function deleteProject(project, obj) {
    projectList.deleteProject(obj);

    project.remove();

    ifSelectedProjectDeleted(obj);

    updateStorage();

    dynamicClick.dynamicShow(['newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
}

function setSelectedProject(project) {
    const listItems = document.querySelectorAll('li');

    listItems.forEach((item) => item.classList.remove('selected-project'));

    project.classList.add('selected-project');
}

function ifSelectedProjectDeleted(obj) {
    if (projectList.getCurrentProject() == obj) {
        const homeLi = document.querySelector('.home-li');
        setSelectedProject(homeLi);

        projectList.setCurrentProject(projectList.getHomeProject());

        displayProjectName();

        displayTasks(true);
    }
}

function displayProjectName(title) {
    const currentProject = projectList.getCurrentProject();

    const projectName = document.querySelector('.project-name');

    if (currentProject.title) {
        projectName.textContent = currentProject.title;
    } else {
        projectName.textContent = title;
    }
}

function appendProjectsFromStorage() {
    const projects = projectList.getProjects();

    for (let i = 1; i < projects.length; i += 1) {
        appendProject(projects[i]);
    }
}

export default {
    appendProject,
    createProjectElement,
    createDeleteProjectButton,
    projectClick,
    deleteProject,
    setSelectedProject,
    ifSelectedProjectDeleted,
    displayProjectName,
    appendProjectsFromStorage,
};
