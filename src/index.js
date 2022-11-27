import './style.css';

class Task {
    constructor(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
    }
}

const tasks = (() => {
    const tasks = [];

    function addTask(task) {
        tasks.push(task);
    }

    function getTasks() {
        return tasks;
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
    }

    return {addTask, getTasks, deleteTask};
})();

const newTaskBtn = document.querySelector('.new-task-button');
const taskForm = document.querySelector('.task-form');
const taskPriority = document.querySelector('#priority');
const cancelFormBtn = document.querySelector('.cancel-form-button');

newTaskBtn.addEventListener('click', () => {
    newTaskBtn.style.display = 'none';
    taskForm.style.display = 'block';
});

taskForm.addEventListener('submit', (e) => {
    taskForm.style.display = 'none';
    newTaskBtn.style.display = 'block';

    createTask();

    displayTasks(tasks.getTasks());

    e.preventDefault();
});

function createTask() {
    const taskTitle = document.querySelector('#title');
    const taskDescription = document.querySelector('#description');
    const taskDate = document.querySelector('#date');

    const task = new Task(taskTitle.value, taskDescription.value, taskDate.value);

    tasks.addTask(task);
}

function displayTasks(arr) {
    const listContainer = document.querySelector('.list-container');
    listContainer.textContent = '';

    for (let i = 0; i < arr.length; i++) {
        const task = document.createElement('div');

        const checkmark = document.createElement('div');
        checkmark.classList.add('checkmark');
        checkmark.textContent = '✔';

        const title = document.createElement('h1');
        title.textContent = arr[i].title;
    
        const description = document.createElement('p');
        description.textContent = arr[i].description;
    
        const date = document.createElement('p');
        date.textContent = arr[i].date;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-task-button');
        deleteBtn.textContent = 'delete';
        deleteBtn.addEventListener('click', () => {
            tasks.deleteTask(i);
            displayTasks(tasks.getTasks());        
        });
    
        listContainer.appendChild(task);
        task.appendChild(checkmark);
        task.appendChild(title);
        task.appendChild(description);
        task.appendChild(date);
        task.appendChild(deleteBtn);
    }
}