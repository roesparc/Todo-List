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

    addTask(task) {
        if (task.priority) {
            this.priorityTasks.push(task);
        } else {
            this.tasks.push(task);
        }
    }

    deleteTask(task) {
        if (task.priority) {
            const index = this.priorityTasks.indexOf(task);

            this.priorityTasks.splice(index, 1);
        } else {
            const index = this.tasks.indexOf(task);

            this.tasks.splice(index, 1);
        }

        if (this.tasksChecked.includes(task)) {
            const index = this.tasksChecked.indexOf(task);

            this.tasksChecked.splice(index, 1);
        }
    }

    modifyCheckmark(task, type) {
        if (type === 'add') {
            this.tasksChecked.push(task);
        } else {
            const index = this.tasksChecked.indexOf(task);

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

    project.addTask(task);
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

    const checkmark = createCheckmark(obj);
    const title = createTitle(obj);
    const description = createDescription(obj);
    const date = createDate(obj);
    const editBtn = createEditButton(obj, task);
    const deleteBtn = createDeleteButton(obj);

    task.appendChild(checkmark);
    task.appendChild(title);
    title.appendChild(projectName(obj));
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    return task;
}

function createCheckmark(obj) {
    const checkmark = document.createElement('div');

    checkmark.classList.add('checkmark');

    if (projects.getCurrentProject().tasksChecked.includes(obj)) {
        checkmark.textContent = '✔';
    }

    checkmark.addEventListener('click', () => checkmarkClick(checkmark, obj));

    return checkmark;
}

function checkmarkClick(checkmark, obj) {
    displayCheckmark(checkmark);

    verifyAllProjectsMarks(obj);

    dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicHide(['taskForm', 'projectForm']);
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

function createTitle(obj) {
    const title = document.createElement('h3');
    title.textContent = obj.title;
    title.classList.add('task-title');

    return title;
}

function createDescription(obj) {
    const description = document.createElement('p');
    description.textContent = obj.description;
    description.classList.add('task-description');

    return description;
}

function createDate(obj) {
    const date = document.createElement('p');
    date.textContent = obj.date;
    date.classList.add('task-date');

    return date;
}

function createEditButton(obj, task) {
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-task-button');
    editBtn.textContent = 'edit';
    editBtn.addEventListener('click',
    () => editClick(obj, task, editBtn));

    return editBtn;
}

function editClick(obj, task, editBtn) {
    createEditForm(obj, task, editBtn);

    clearTaskElements(editBtn);
}

function clearTaskElements(editBtn) {
    getCurrentTaskElement(editBtn).description.remove();
    getCurrentTaskElement(editBtn).date.remove();
    editBtn.remove();
}

function createEditForm(obj, task, editBtn) {
    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitEdit(obj, editForm);
    });

    const descriptionInput = createDescriptionInput(editBtn);
    const dateInput = createDateInput(editBtn);
    const priorityLabel = createPriorityLabel();
    const priorityInput = createPriorityInput(obj);
    const acceptChanges = createAcceptButton();

    priorityLabel.appendChild(priorityInput);

    editForm.appendChild(descriptionInput);
    editForm.appendChild(dateInput);
    editForm.appendChild(priorityLabel);
    editForm.appendChild(acceptChanges);

    task.insertBefore(editForm, getCurrentTaskElement(editBtn).deleteBtn);
}

function createDescriptionInput(editBtn) {
    const descInp = document.createElement('input');
    descInp.classList.add('edit-description-input');
    descInp.setAttribute('placeholder', 'Description');
    descInp.value =
    getCurrentTaskElement(editBtn).description.textContent;

    return descInp;
}

function createDateInput(editBtn) {
    const dateInp = document.createElement('input');
    dateInp.type = 'date';
    dateInp.classList.add('edit-date-input');
    dateInp.value =
    getCurrentTaskElement(editBtn).date.textContent;

    return dateInp;
}

function createPriorityLabel() {
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Mark High Priority';

    return priorityLabel;
}

function createPriorityInput(obj) {
    const priorityInp = document.createElement('input');
    priorityInp.classList.add('edit-priority-input');
    priorityInp.type = 'checkbox';
    priorityInp.checked = obj.priority;

    return priorityInp;
}

function createAcceptButton() {
    const accept = document.createElement('button');
    accept.textContent = 'accept';

    return accept;
}

function submitEdit(obj, editForm) {
    const isTaskChecked = isChecked(obj);

    applyDescriptionDateChanges(obj, editForm);
    applyPriorityChanges(obj, editForm);
    applayCheckmarkChanges(isTaskChecked, obj);

    getTasksForCurrentProject();
    displayTasks(true);
}

function getTasksForCurrentProject() {
    if (!projects.getCurrentProject().title) {
        const selectedProject = document.querySelector('.selected-project');

        projects.setCurrentProject(new Project());

        if (selectedProject.textContent === 'Today') {
            getTodayProjects();
        } else if (selectedProject.textContent === 'This Week') {
            getWeekProjects();
        }
    }
}

function isChecked(task) {
    let isChecked = false;

    if (getProjectWithTask(task).tasksChecked.includes(task)) {
        isChecked = true
    }

    return isChecked;
}

function applayCheckmarkChanges(wasChecked, task) {
    if (wasChecked) {
        getProjectWithTask(task).tasksChecked.push(task);
    }
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
        deleteProjectTask(obj);

        obj.priority = priorityInput.checked;

        project.addTask(obj);
    }
}

function createDeleteButton(obj) {
    const deleteBtn = document.createElement('button');

    deleteBtn.classList.add('delete-task-button');

    deleteBtn.textContent = 'delete';

    deleteBtn.addEventListener('click', () => deleteTask(obj));

    return deleteBtn;
}

function deleteTask(obj) {
    projects.getCurrentProject().deleteTask(obj);

    deleteProjectTask(obj);

    displayTasks(true);

    dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicHide(['taskForm', 'projectForm']);
}

function getCurrentTaskElement(childElement) {
    const taskDiv = childElement.parentElement;

    const title = taskDiv.querySelector('.task-title');

    const description = taskDiv.querySelector('.task-description');

    const date = taskDiv.querySelector('.task-date');

    const deleteBtn = taskDiv.querySelector('.delete-task-button');

    return {title, description, date, deleteBtn};
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

function getProjectWithTask(obj) {
    let projectIndex;
    const projectsArr = projects.getProjects();

    for (let i = 0; i < projectsArr.length; i++) {
        if (projectsArr[i].tasks.includes(obj) ||
        projectsArr[i].priorityTasks.includes(obj)) {
            projectIndex = i;
        }
    }

    return projectsArr[projectIndex];
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
                currentProject.addTask(priorityTask);
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
                currentProject.addTask(priorityTask);
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