import taskLogic from '../app_logic/taskLogic';
import projectList from '../app_logic/projectList';
import dynamicClick from './dynamicClick';

export default function displayTasks(priority) {
    const taskList = document.querySelector('.tasks');
    if (priority) {taskList.textContent = '';}

    const tasks = taskLogic.getTasksForCurrentProject(priority);

    tasks.forEach(taskObj => {
        taskList.appendChild(createTaskElement(taskObj, priority));
    });

    if (priority) {displayTasks(false);}
}

function createTaskElement(obj, priority) {
    const task = createTaskDiv(priority);
    const checkmark = createCheckmark(task, obj);
    const title = createTitle(obj);
    const description = createDescription(obj);
    const date = createDate(obj);
    const editBtn = createEditButton(obj, task);
    const deleteBtn = createDeleteButton(obj);

    task.appendChild(checkmark);
    task.appendChild(title);
    title.appendChild(taskIsFromThisProject(obj));
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    return task;
}

function createTaskDiv(priority) {
    const task = document.createElement('div');
    task.classList.add('task');
    if (priority) {task.classList.add('high-priority-task');}

    return task
}

function createCheckmark(task, obj) {
    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    checkmark.addEventListener('click',
    () => checkmarkClick(checkmark, obj, task));

    checkTaskCompletion(checkmark, obj, task)

    return checkmark;
}

function checkTaskCompletion(checkmark, obj, task) {
    if (obj.isCompleted) {
        checkmark.textContent = '✔';
        task.classList.add('completed');
    }
}

function checkmarkClick(checkmark, obj, task) {
    displayCheckmark(checkmark, task);

    taskLogic.updateTaskStatus(obj);

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
}

function displayCheckmark(checkmark, task) {
    if (checkmark.textContent) {
        checkmark.textContent = '';
        task.classList.remove('completed');
    } else {
        checkmark.textContent = '✔';
        task.classList.add('completed');
    }
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
    const editBtn = document.createElement('i');
    editBtn.classList.add('fa-solid');
    editBtn.classList.add('fa-pen-to-square');
    editBtn.classList.add('edit-task-button');
    editBtn.addEventListener('click',
    () => editClick(obj, task, editBtn));

    return editBtn;
}

function createDeleteButton(obj) {
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fa-regular');
    deleteBtn.classList.add('fa-trash-can');
    deleteBtn.classList.add('delete-task-button');
    deleteBtn.addEventListener('click', () => taskLogic.deleteTask(obj));

    return deleteBtn;
}

function editClick(obj, task, editBtn) {
    createEditForm(obj, task, editBtn);

    clearTaskElements(editBtn);

    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
}

function clearTaskElements(editBtn) {
    getCurrentTaskElement(editBtn).description.remove();
    getCurrentTaskElement(editBtn).date.remove();
    editBtn.remove();
}

function createEditForm(obj, task, editBtn) {
    const editForm = createEditFormElement(obj);
    const descriptionInput = createDescriptionInput(editBtn);
    const dateInput = createDateInput(editBtn);
    const priorityLabel = createPriorityLabel();
    const priorityInput = createPriorityInput(obj);
    const acceptChanges = createAcceptButton();

    priorityLabel.appendChild(priorityInput);

    editForm.appendChild(descriptionInput);
    editForm.appendChild(priorityLabel);
    editForm.appendChild(dateInput);
    editForm.appendChild(acceptChanges);

    task.insertBefore(editForm, getCurrentTaskElement(editBtn).deleteBtn);
}

function createEditFormElement(obj) {
    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        taskLogic.submitEdit(obj, editForm);
    });

    return editForm;
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

    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    icon.classList.add('fa-circle-check');

    accept.appendChild(icon);

    return accept;
}

function getCurrentTaskElement(childElement) {
    const taskDiv = childElement.parentElement;

    const title = taskDiv.querySelector('.task-title');
    const description = taskDiv.querySelector('.task-description');
    const date = taskDiv.querySelector('.task-date');
    const deleteBtn = taskDiv.querySelector('.delete-task-button');

    return {title, description, date, deleteBtn};
}

function taskIsFromThisProject(obj) {
    const projectName = document.createElement('span');

    if (!projectList.getCurrentProject().title) {
        const projectsArr = projectList.getProjects();

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