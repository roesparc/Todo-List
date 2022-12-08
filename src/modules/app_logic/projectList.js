import { updateStorage } from "../storage";

function newProjectList() {
    let projects = [];
    let currentProject;

    return {
        addProject: (project) => {
            projects.push(project);

            updateStorage();
        },

        getProjects: () => {
            return projects;
        },

        deleteProject: (obj) => {
            const index = projects.indexOf(obj);
    
            projects.splice(index, 1);

            updateStorage();
        },

        getCurrentProject: () => {
            return currentProject;
        },
    
        setCurrentProject: (project) => {
            currentProject = project;
        },
    
        getHomeProject: () => {
            return projects[0];
        }    
    };
}

const projectList = newProjectList();

export default projectList;