import projectLogic from '../app_logic/projectLogic';
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
    title.appendChild(taskIsFromThisProject(obj));
    task.appendChild(description);
    task.appendChild(date);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    return task;
}

function createCheckmark(obj) {
    const checkmark = document.createElement('div');

    checkmark.classList.add('checkmark');

    if (projectList.getCurrentProject().tasksChecked.includes(obj)) {
        checkmark.textContent = '✔';
    }

    checkmark.addEventListener('click', () => checkmarkClick(checkmark, obj));

    return checkmark;
}

function checkmarkClick(checkmark, obj) {
    displayCheckmark(checkmark);

    projectLogic.verifyAllProjectsMarks(obj);

    dynamicClick.dynamicShow(['newTaskBtn', 'newProjectBtn']);
    dynamicClick.dynamicHide(['taskForm', 'projectForm']);
}

function displayCheckmark(checkmark) {
    if (checkmark.textContent) {
        checkmark.textContent = '';
    } else {
        checkmark.textContent = '✔';
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
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-task-button');
    editBtn.textContent = 'edit';
    editBtn.addEventListener('click',
    () => editClick(obj, task, editBtn));

    return editBtn;
}

function createDeleteButton(obj) {
    const deleteBtn = document.createElement('button');

    deleteBtn.classList.add('delete-task-button');

    deleteBtn.textContent = 'delete';

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
    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        taskLogic.submitEdit(obj, editForm);
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