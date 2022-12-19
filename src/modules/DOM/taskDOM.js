import taskLogic from "../app_logic/taskLogic";
import projectList from "../app_logic/projectList";
import dynamicClick from "./dynamicClick";

const createTaskDiv = function createTaskDiv(priority) {
  const task = document.createElement("div");
  task.classList.add("task");
  if (priority) {
    task.classList.add("high-priority-task");
  }

  return task;
};

const displayCheckmark = function displayCheckmark(checkmark, task) {
  if (checkmark.textContent) {
    checkmark.textContent = "";
    task.classList.remove("completed");
  } else {
    checkmark.textContent = "✔";
    task.classList.add("completed");
  }
};

const checkmarkClick = function checkmarkClick(checkmark, obj, task) {
  displayCheckmark(checkmark, task);

  taskLogic.updateTaskStatus(obj);

  dynamicClick.dynamicShow(["newProjectBtn"]);
  dynamicClick.dynamicHide(["taskForm", "projectForm"]);
};

const checkTaskCompletion = function checkTaskCompletion(checkmark, obj, task) {
  if (obj.isCompleted) {
    checkmark.textContent = "✔";
    task.classList.add("completed");
  }
};

const createCheckmark = function createCheckmark(task, obj) {
  const checkmark = document.createElement("div");
  checkmark.classList.add("checkmark");
  checkmark.addEventListener("click", () =>
    checkmarkClick(checkmark, obj, task)
  );

  checkTaskCompletion(checkmark, obj, task);

  return checkmark;
};

const createTitle = function createTitle(obj) {
  const title = document.createElement("h3");
  title.textContent = obj.title;
  title.classList.add("task-title");

  return title;
};

const createDescription = function createDescription(obj) {
  const description = document.createElement("p");
  description.textContent = obj.description;
  description.classList.add("task-description");

  return description;
};

const createDate = function createDate(obj) {
  const date = document.createElement("p");
  date.textContent = obj.date;
  date.classList.add("task-date");

  return date;
};

const submitEdit = function submitEdit(obj, editForm) {
  taskLogic.submitEdit(obj, editForm);
  displayTasks(true);
};

const createEditFormElement = function createEditFormElement(obj) {
  const editForm = document.createElement("form");
  editForm.classList.add("edit-form");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitEdit(obj, editForm);
  });

  return editForm;
};

const getCurrentTaskElement = function getCurrentTaskElement(childElement) {
  const taskDiv = childElement.parentElement;

  const title = taskDiv.querySelector(".task-title");
  const description = taskDiv.querySelector(".task-description");
  const date = taskDiv.querySelector(".task-date");
  const deleteBtn = taskDiv.querySelector(".delete-task-button");

  return {
    title,
    description,
    date,
    deleteBtn,
  };
};

const createDescriptionInput = function createDescriptionInput(editBtn) {
  const descInp = document.createElement("input");
  descInp.classList.add("edit-description-input");
  descInp.setAttribute("placeholder", "Description");
  descInp.value = getCurrentTaskElement(editBtn).description.textContent;

  return descInp;
};

const createDateInput = function createDateInput(editBtn) {
  const dateInp = document.createElement("input");
  dateInp.type = "date";
  dateInp.classList.add("edit-date-input");
  dateInp.value = getCurrentTaskElement(editBtn).date.textContent;

  return dateInp;
};

const createPriorityLabel = function createPriorityLabel() {
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Mark High Priority";

  return priorityLabel;
};

const createPriorityInput = function createPriorityInput(obj) {
  const priorityInp = document.createElement("input");
  priorityInp.classList.add("edit-priority-input");
  priorityInp.type = "checkbox";
  priorityInp.checked = obj.priority;

  return priorityInp;
};

const createAcceptButton = function createAcceptButton() {
  const accept = document.createElement("button");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid");
  icon.classList.add("fa-circle-check");

  accept.appendChild(icon);

  return accept;
};

const createEditForm = function createEditForm(obj, task, editBtn) {
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
};

const clearTaskElements = function clearTaskElements(editBtn) {
  getCurrentTaskElement(editBtn).description.remove();
  getCurrentTaskElement(editBtn).date.remove();
  editBtn.remove();
};

const editClick = function editClick(obj, task, editBtn) {
  createEditForm(obj, task, editBtn);

  clearTaskElements(editBtn);

  dynamicClick.dynamicHide(["taskForm", "projectForm"]);
  dynamicClick.dynamicShow(["newProjectBtn"]);
};

const createEditButton = function createEditButton(obj, task) {
  const editBtn = document.createElement("i");
  editBtn.classList.add("fa-solid");
  editBtn.classList.add("fa-pen-to-square");
  editBtn.classList.add("edit-task-button");
  editBtn.addEventListener("click", () => editClick(obj, task, editBtn));

  return editBtn;
};

const deleteClick = function deleteClick(obj) {
  taskLogic.deleteTask(obj);
  displayTasks(true);

  dynamicClick.dynamicShow(["newProjectBtn"]);
  dynamicClick.dynamicHide(["taskForm", "projectForm"]);
};

const createDeleteButton = function createDeleteButton(obj) {
  const deleteBtn = document.createElement("i");
  deleteBtn.classList.add("fa-regular");
  deleteBtn.classList.add("fa-trash-can");
  deleteBtn.classList.add("delete-task-button");
  deleteBtn.addEventListener("click", () => deleteClick(obj));

  return deleteBtn;
};

const taskIsFromThisProject = function taskIsFromThisProject(obj) {
  const projectName = document.createElement("span");

  if (!projectList.getCurrentProject().title) {
    const projectsArr = projectList.getProjects();

    projectsArr.forEach((project) => {
      if (project.tasks.includes(obj)) {
        projectName.textContent = ` (${project.title})`;
      }

      if (project.priorityTasks.includes(obj)) {
        projectName.textContent = ` (${project.title})`;
      }
    });
  }

  return projectName;
};

const createTaskElement = function createTaskElement(obj, priority) {
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
};

export default function displayTasks(priority) {
  const taskList = document.querySelector(".tasks");
  if (priority) {
    taskList.textContent = "";
  }

  const tasks = taskLogic.getTasksForCurrentProject(priority);

  tasks.forEach((taskObj) => {
    taskList.appendChild(createTaskElement(taskObj, priority));
  });

  if (priority) {
    displayTasks(false);
  }
}
