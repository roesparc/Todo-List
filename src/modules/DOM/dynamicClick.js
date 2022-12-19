function dynamicHide(elements) {
  const newTaskBtn = document.querySelector(".new-task-button");
  const taskForm = document.querySelector(".task-form");
  const newProjectBtn = document.querySelector(".new-project-button");
  const projectForm = document.querySelector(".project-form");

  if (elements.includes("newTaskBtn")) {
    newTaskBtn.style.display = "none";
  }

  if (elements.includes("taskForm")) {
    taskForm.style.opacity = "0";
    taskForm.style.transform = "scale(0)";
  }

  if (elements.includes("newProjectBtn")) {
    newProjectBtn.style.display = "none";
  }

  if (elements.includes("projectForm")) {
    projectForm.style.display = "none";
  }
}

function dynamicShow(elements) {
  const newTaskBtn = document.querySelector(".new-task-button");
  const taskForm = document.querySelector(".task-form");
  const newProjectBtn = document.querySelector(".new-project-button");
  const projectForm = document.querySelector(".project-form");

  if (elements.includes("newTaskBtn")) {
    newTaskBtn.style.display = "inline";
  }

  if (elements.includes("taskForm")) {
    taskForm.style.opacity = "1";
    taskForm.style.transform = "scale(1)";
  }

  if (elements.includes("newProjectBtn")) {
    newProjectBtn.style.display = "block";
  }

  if (elements.includes("projectForm")) {
    projectForm.style.display = "block";
  }
}

export default {
  dynamicHide,
  dynamicShow,
};
