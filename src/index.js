import './style.css';

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

    getTasks() {
        return this.tasks;
    }

    getPriorityTasks() {
        return this.priorityTasks;
    }

    addTask(task, priority) {
        if (priority.checked) {
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
    }

    getTasksChecked() {
        return this.tasksChecked;
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

    project.addTask(task, taskPriority);
}

function displayTasks(arr, priority) {
    const taskList = document.querySelector('.tasks');
    if (priority) {taskList.textContent = '';}

    for (let i = 0; i < arr.length; i++) {
        taskList.appendChild(task(arr[i], priority));
    }

    if (priority) {displayTasks(projects.getCurrentProject().getTasks(), false);}
}

function task(obj, priority) {
    const task = document.createElement('div');
    if (priority) {task.classList.add('high-priority-task');}

    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    if (projects.getCurrentProject().getTasksChecked().includes(obj)) {
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
        if (checkmark.textContent) {
            checkmark.textContent = '';
            projects.getCurrentProject().modifyCheckmark(obj, 'remove');
        } else {
            checkmark.textContent = '✔';
            projects.getCurrentProject().modifyCheckmark(obj, 'add');
        }
    }

    function deleteTask() {
        projects.getCurrentProject().deleteTask(obj);
    
        displayTasks(projects.getCurrentProject().getPriorityTasks(), true);
    }    

    task.appendChild(checkmark);
    task.appendChild(title);
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(deleteBtn);

    return task;
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
    
        displayTasks(projects.getCurrentProject().getPriorityTasks(), true);
    }

    function deleteProject() {
        project.removeEventListener('click', projectClick);

        projects.deleteProject(obj);

        project.remove();

        if (projects.getCurrentProject() == obj) {
            const homeLi = document.querySelector('.home-li');
            setSelectedProject(homeLi);

            projects.setCurrentProject(projects.getHomeProject());
    
            displayTasks(projects.getCurrentProject().getPriorityTasks(), true);    
        }
    }

    project.appendChild(deleteBtn);

    return project;
}

function setSelectedProject(project) {
    const listItems = document.querySelectorAll('li');

    listItems.forEach(item => item.classList.remove('selected-project'));

    project.classList.add('selected-project');
}

const homeLi = document.querySelector('.home-li');
homeLi.addEventListener('click', homeClick);

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

    displayTasks(projects.getCurrentProject().getPriorityTasks(), true);
}

function newTaskClick() {
    newTaskBtn.style.display = 'none';
    taskForm.style.display = 'block';
    newProjectBtn.style.display = 'block';
    projectForm.style.display = 'none';
}

function submitTask(event) {
    event.preventDefault();

    newTaskBtn.style.display = 'block';
    taskForm.style.display = 'none';

    createTask(projects.getCurrentProject());

    displayTasks(projects.getCurrentProject().getPriorityTasks(), true);
}

function cancelTaskClick() {
    newTaskBtn.style.display = 'block';
    taskForm.style.display = 'none';
}

function newProjectClick() {
    newProjectBtn.style.display = 'none';
    projectForm.style.display = 'block';
    newTaskBtn.style.display = 'block';
    taskForm.style.display = 'none';
}

function projectSubmit(event) {
    event.preventDefault();

    newProjectBtn.style.display = 'block';
    projectForm.style.display = 'none';

    createProject();

    displayProject(projects.getProjects());
}

function cancelProjectClick() {
    newProjectBtn.style.display = 'block';
    projectForm.style.display = 'none';
}