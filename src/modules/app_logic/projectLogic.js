import { isThisWeek, isToday, parseISO } from "date-fns";
import Project from "./project";
import projectList from "./projectList";
import { updateStorage } from "./storage";

function getTasksForProject() {
  if (!projectList.getCurrentProject().title) {
    const selectedProject = document.querySelector(".selected-project");

    projectList.setCurrentProject(new Project());

    if (selectedProject.textContent === " Today") {
      getTodayProjects();
    } else if (selectedProject.textContent === " This Week") {
      getWeekProjects();
    }
  }
}

function deleteProjectTask(obj) {
  const projectsArr = projectList.getProjects();

  projectsArr.forEach((project) => {
    if (project.tasks.includes(obj)) {
      project.deleteTask(obj);
    }

    if (project.priorityTasks.includes(obj)) {
      project.deleteTask(obj);
    }
  });
}

function createProject() {
  const projectName = document.querySelector("#project-name").value;

  const project = new Project(projectName);

  projectList.addProject(project);

  updateStorage();

  return project;
}

function getTodayProjects() {
  const currentProject = projectList.getCurrentProject();
  const projectsArr = projectList.getProjects();

  projectsArr.forEach((project) => {
    project.tasks.forEach((task) => {
      if (isToday(parseISO(task.date))) {
        currentProject.addTask(task);
      }
    });

    project.priorityTasks.forEach((priorityTask) => {
      if (isToday(parseISO(priorityTask.date))) {
        currentProject.addTask(priorityTask);
      }
    });
  });
}

function getWeekProjects() {
  const currentProject = projectList.getCurrentProject();
  const projectsArr = projectList.getProjects();

  projectsArr.forEach((project) => {
    project.tasks.forEach((task) => {
      if (isThisWeek(parseISO(task.date))) {
        currentProject.addTask(task);
      }
    });

    project.priorityTasks.forEach((priorityTask) => {
      if (isThisWeek(parseISO(priorityTask.date))) {
        currentProject.addTask(priorityTask);
      }
    });
  });
}

export default {
  getTasksForProject,
  deleteProjectTask,
  createProject,
  getTodayProjects,
  getWeekProjects,
};
