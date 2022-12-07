import projectList from '../app_logic/projectList';
import dynamicClick from './dynamicClick';
import displayTasks from './taskDOM';

function appendProject(project) {
    const projectsNav = document.querySelector('.projects-nav');

    projectsNav.appendChild(createProjectElement(project));
}

function createProjectElement(obj) {
    const project = document.createElement('li');
    project.textContent = obj.title;
    project.addEventListener('click', (e) => {
        if (e.target === project) {
            projectClick(project, obj);
        }
    });

    const deleteBtn = createDeleteProjectButton(project, obj);

    project.appendChild(deleteBtn);

    return project;
}

function createDeleteProjectButton(project, obj) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', () => deleteProject(project, obj));

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

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
}

function setSelectedProject(project) {
    const listItems = document.querySelectorAll('li');

    listItems.forEach(item => item.classList.remove('selected-project'));

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

export default {
    appendProject,
    createProjectElement,
    createDeleteProjectButton,
    projectClick,
    deleteProject,
    setSelectedProject,
    ifSelectedProjectDeleted,
    displayProjectName
}