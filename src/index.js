import './style.css';
import {isThisWeek, isToday, parseISO} from 'date-fns';

class Task {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
        this.priorityTasks = [];
        this.tasksChecked = [];
    }

    addTask(task, priority) {
        if (priority) {
            this.priorityTasks.push(task);
        } else {
            this.tasks.push(task);
        }
    }

    deleteTask(obj) {
        if (obj.priority) {
            const index = this.priorityTasks.indexOf(obj);

            this.priorityTasks.splice(index, 1);
        } else {
            const index = this.tasks.indexOf(obj);

            this.tasks.splice(index, 1);
        }

        if (this.tasksChecked.includes(obj)) {
            const index = this.tasksChecked.indexOf(obj);

            this.tasksChecked.splice(index, 1);
        }
    }

    modifyCheckmark(obj, type) {
        if (type === 'add') {
            this.tasksChecked.push(obj);
        } else {
            const index = this.tasksChecked.indexOf(obj);

            this.tasksChecked.splice(index, 1);    
        }
    }
}

const projects = (() => {
    const homeProject = new Project('Home');
    let currentProject = homeProject;
    const projects = [homeProject];

    function addProject(project) {
        projects.push(project);
    }

    function getProjects() {
        return projects;
    }

    function deleteProject(obj) {
        const index = projects.indexOf(obj);

        projects.splice(index, 1);
    }

    function getCurrentProject() {
        return currentProject;
    }

    function setCurrentProject(project) {
        currentProject = project;
    }

    function getHomeProject() {
        return homeProject;
    }

    return {
        addProject,
        getProjects,
        deleteProject,
        getCurrentProject,
        setCurrentProject,
        getHomeProject
    };
})();

function createTask(project) {
    const taskTitle = document.querySelector('#title');
    const taskDescription = document.querySelector('#description');
    const taskDate = document.querySelector('#date');
    const taskPriority = document.querySelector('#priority');

    const task = new Task(taskTitle.value, taskDescription.value, taskDate.value, taskPriority.checked);

    project.addTask(task, taskPriority.checked);
}

function displayTasks(priority) {
    const taskList = document.querySelector('.tasks');
    if (priority) {taskList.textContent = '';}

    let tasks;
    if (priority) {
        tasks = projects.getCurrentProject().priorityTasks;
    } else {
        tasks = projects.getCurrentProject().tasks;
    }

    tasks.forEach(taskObj => {
        taskList.appendChild(task(taskObj, priority));
    });

    if (priority) {displayTasks(false);}
}

function task(obj, priority) {
    const task = document.createElement('div');
    if (priority) {task.classList.add('high-priority-task');}

    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    if (projects.getCurrentProject().tasksChecked.includes(obj)) {
        checkmark.textContent = '✔';
    }
    checkmark.addEventListener('click', addCheckmark);

    const title = document.createElement('h3');
    title.textContent = obj.title;

    const description = document.createElement('p');
    description.textContent = obj.description;

    const date = document.createElement('p');
    date.textContent = obj.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-task-button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', deleteTask);

    function addCheckmark() {
        displayCheckmark(checkmark);

        verifyAllProjectsMarks(obj);

        dynamicShow(['newTaskBtn', 'newProjectBtn']);
        dynamicHide(['taskForm', 'projectForm']);
    }

    function deleteTask() {
        projects.getCurrentProject().deleteTask(obj);

        deleteProjectTask(obj);
    
        displayTasks(true);

        dynamicShow(['newTaskBtn', 'newProjectBtn']);
        dynamicHide(['taskForm', 'projectForm']);
    }

    task.appendChild(checkmark);
    task.appendChild(title);
    title.appendChild(projectName(obj));
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(deleteBtn);

    return task;
}

function displayCheckmark(checkmark) {
    if (checkmark.textContent) {
        checkmark.textContent = '';
    } else {
        checkmark.textContent = '✔';
    }
}

function verifyAllProjectsMarks(obj) {
    const projectsArr = projects.getProjects();
    
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

function deleteProjectTask(obj) {
    const projectsArr = projects.getProjects();

    projectsArr.forEach(project => {
        if (project.tasks.includes(obj)) {
            project.deleteTask(obj);
        }

        if (project.priorityTasks.includes(obj)) {
            project.deleteTask(obj);
        }
    });
}

function projectName(obj) {
    const projectName = document.createElement('span');

    if (!projects.getCurrentProject().title) {
        const projectsArr = projects.getProjects();

        projectsArr.forEach(project => {
            if (project.tasks.includes(obj)) {
                projectName.textContent =
                ` (${project.title})`;
            }

            if (project.priorityTasks.includes(obj)) {
                projectName.textContent =
                ` (${project.title})`;
            }
        });
    }

    return projectName;
}

function createProject() {
    const projectsNav = document.querySelector('.projects-nav');
    const projectName = document.querySelector('#project-name');

    const project = new Project(projectName.value);

    projects.addProject(project);

    projectsNav.appendChild(displayProject(project));
}

function displayProject(obj) {
    const project = document.createElement('li');
    project.textContent = obj.title;
    project.addEventListener('click', projectClick);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', deleteProject);

    function projectClick() {
        setSelectedProject(project);
    
        projects.setCurrentProject(obj);
    
        displayTasks(true);

        dynamicShow(['newTaskBtn', 'newProjectBtn']);
        dynamicHide(['taskForm', 'projectForm']);

        displayProjectName();
    }

    function deleteProject() {
        project.removeEventListener('click', projectClick);

        projects.deleteProject(obj);

        project.remove();

        ifSelectedProjectDeleted(obj);

        dynamicShow(['newTaskBtn', 'newProjectBtn']);
        dynamicHide(['taskForm', 'projectForm']);
    }

    project.appendChild(deleteBtn);

    return project;
}

function setSelectedProject(project) {
    const listItems = document.querySelectorAll('li');

    listItems.forEach(item => item.classList.remove('selected-project'));

    project.classList.add('selected-project');
}

function ifSelectedProjectDeleted(obj) {
    if (projects.getCurrentProject() == obj) {
        const homeLi = document.querySelector('.home-li');
        setSelectedProject(homeLi);

        projects.setCurrentProject(projects.getHomeProject());

        displayTasks(true);    
    }
}

function getTodayProjects() {
    const currentProject = projects.getCurrentProject();
    const projectsArr = projects.getProjects();

    projectsArr.forEach(project => {
        project.tasks.forEach(task => {
            if (isToday(parseISO(task.date))) {
                currentProject.addTask(task);
            }
        });

        project.priorityTasks.forEach(priorityTask => {
            if (isToday(parseISO(priorityTask.date))) {
                currentProject.addTask(priorityTask, true);
            }
        });

        project.tasksChecked.forEach(taskChecked => {
            currentProject.modifyCheckmark(taskChecked, 'add');
        });
    });
}

function getWeekProjects() {
    const currentProject = projects.getCurrentProject();
    const projectsArr = projects.getProjects();

    projectsArr.forEach(project => {
        project.tasks.forEach(task => {
            if (isThisWeek(parseISO(task.date))) {
                currentProject.addTask(task);
            }
        });

        project.priorityTasks.forEach(priorityTask => {
            if (isThisWeek(parseISO(priorityTask.date))) {
                currentProject.addTask(priorityTask, true);
            }
        });

        project.tasksChecked.forEach(taskChecked => {
            currentProject.modifyCheckmark(taskChecked, 'add');
        });
    });
}

function displayProjectName(title) {
    const currentProject = projects.getCurrentProject();

    const projectName = document.querySelector('.project-name');

    if (currentProject.title) {
        projectName.textContent = currentProject.title;
    } else {
        projectName.textContent = title;
    }
}

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
    setSelectedProject(homeLi);

    projects.setCurrentProject(projects.getHomeProject());

    displayTasks(true);

    dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicHide(['taskForm', 'projectForm']);

    displayProjectName();
}

function todayClick() {
    setSelectedProject(todayLi);

    projects.setCurrentProject(new Project());

    getTodayProjects();

    displayTasks(true);

    dynamicShow(['newProjectBtn']);
    dynamicHide(['newTaskBtn', 'taskForm', 'projectForm']);

    displayProjectName('Today');
}

function weekClick() {
    setSelectedProject(weekLi);

    projects.setCurrentProject(new Project());

    getWeekProjects();

    displayTasks(true);

    dynamicShow(['newProjectBtn']);
    dynamicHide(['newTaskBtn', 'taskForm', 'projectForm']);

    displayProjectName('This Week');
}

function newTaskClick() {
    taskForm.reset();
    projectForm.reset();

    dynamicShow(['taskForm', 'newProjectBtn']);
    dynamicHide(['newTaskBtn', 'projectForm']);
}

function submitTask(event) {
    event.preventDefault();

    createTask(projects.getCurrentProject());

    displayTasks(true);

    dynamicShow(['newTaskBtn']);
    dynamicHide(['taskForm']);
}

function cancelTaskClick() {
    dynamicShow(['newTaskBtn']);
    dynamicHide(['taskForm']);
}

function newProjectClick() {
    taskForm.reset();
    projectForm.reset();

    dynamicShow(['projectForm', 'newTaskBtn']);
    dynamicHide(['newProjectBtn', 'taskForm']);
}

function projectSubmit(event) {
    event.preventDefault();

    createProject();

    dynamicShow(['newProjectBtn']);
    dynamicHide(['projectForm']);
}

function cancelProjectClick() {
    dynamicShow(['newProjectBtn']);
    dynamicHide(['projectForm']);
}

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

    if (!projects.getCurrentProject().title) {
        newTaskBtn.style.display = 'none';
    }
}