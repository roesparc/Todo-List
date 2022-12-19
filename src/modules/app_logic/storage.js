import Project from "./project";
import projectList from "./projectList";

const init = function createHomeProject() {
  const home = new Project("Home");
  projectList.addProject(home);
};

const add = function addProjectToList(project) {
  const newProject = new Project(project.title);
  newProject.tasks = project.tasks;
  newProject.priorityTasks = project.priorityTasks;

  projectList.addProject(newProject);

  return newProject;
};

const load = function loadProjectsFromStorage() {
  const projects = JSON.parse(localStorage.getItem("projects"));

  projects.forEach((project) => {
    add(project);
  });
};

export function updateStorage() {
  localStorage.setItem("projects", JSON.stringify(projectList.getProjects()));
}

export function checkStorage() {
  if (localStorage.length) {
    load();
  } else {
    init();
  }

  projectList.setCurrentProject(projectList.getHomeProject());
}
