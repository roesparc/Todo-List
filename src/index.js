import './style.css';

class Task {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
    }
}

const tasks = (() => {
    const tasks = [];
    const priorityTasks = [];
    const tasksWithCheckmark = [];

    function getTasks() {
        return tasks;
    }

    function getPriorityTasks() {
        return priorityTasks;
    }

    function addTask(task, priority) {
        if (priority.checked) {
            priorityTasks.push(task);
        } else {
            tasks.push(task);
        }
    }

    function deleteTask(obj) {
        if (obj.priority) {
            const index = priorityTasks.indexOf(obj);

            priorityTasks.splice(index, 1);
        } else {
            const index = tasks.indexOf(obj);

            tasks.splice(index, 1);
        }
    }

    function getCheckmarks() {
        return tasksWithCheckmark;
    }

    function modifyCheckmark(obj, type) {
        if (type === 'add') {
            tasksWithCheckmark.push(obj);
        } else {
            const index = tasksWithCheckmark.indexOf(obj);

            tasksWithCheckmark.splice(index, 1);    
        }
    }

    return {
        getTasks,
        getPriorityTasks,
        addTask,
        deleteTask,
        getCheckmarks,
        modifyCheckmark,
    };
})();

const newTaskBtn = document.querySelector('.new-task-button');
const taskForm = document.querySelector('.task-form');
const cancelFormBtn = document.querySelector('.cancel-form-button');

newTaskBtn.addEventListener('click', () => {
    newTaskBtn.style.display = 'none';
    taskForm.style.display = 'block';
});

taskForm.addEventListener('submit', (e) => {
    taskForm.style.display = 'none';
    newTaskBtn.style.display = 'block';

    createTask();

    displayTasks(tasks.getPriorityTasks(), true);

    e.preventDefault();
});

cancelFormBtn.addEventListener('click', () => {
    taskForm.style.display = 'none';
    newTaskBtn.style.display = 'block';
})

function createTask() {
    const taskTitle = document.querySelector('#title');
    const taskDescription = document.querySelector('#description');
    const taskDate = document.querySelector('#date');
    const taskPriority = document.querySelector('#priority');

    const task = new Task(taskTitle.value, taskDescription.value, taskDate.value, taskPriority.checked);

    tasks.addTask(task, taskPriority);
}

function displayTasks(arr, priority) {
    const taskList = document.querySelector('.tasks');
    if (priority) {taskList.textContent = '';}

    for (let i = 0; i < arr.length; i++) {
        taskList.appendChild(task(arr[i], priority));
    }

    if (priority) {displayTasks(tasks.getTasks(), false);}
}

function task(obj, priority) {
    const task = document.createElement('div');
    if (priority) {task.classList.add('high-priority-task');}

    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    if (tasks.getCheckmarks().includes(obj)) {
        checkmark.textContent = '✔';
    }
    checkmark.addEventListener('click', () => {
        addCheckmark(checkmark, obj)
    });

    const title = document.createElement('h1');
    title.textContent = obj.title;

    const description = document.createElement('p');
    description.textContent = obj.description;

    const date = document.createElement('p');
    date.textContent = obj.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-task-button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', () => deleteTask(obj));

    task.appendChild(checkmark);
    task.appendChild(title);
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(deleteBtn);

    return task;
}

function deleteTask(obj) {
    tasks.deleteTask(obj);

    displayTasks(tasks.getPriorityTasks(), true);
}

function addCheckmark(checkmark, obj) {
    if (checkmark.textContent) {
        checkmark.textContent = '';
        tasks.modifyCheckmark(obj, 'remove');
    } else {
        checkmark.textContent = '✔';
        tasks.modifyCheckmark(obj, 'add');
    }
}