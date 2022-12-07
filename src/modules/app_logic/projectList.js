import Project from './project';

function newProjectList() {
    const homeProject = new Project('Home');
    let projects = [homeProject];
    let currentProject = homeProject;

    return {
        addProject: (project) => {
            projects.push(project);
        },

        getProjects: () => {
            return projects;
        },

        deleteProject: (obj) => {
            const index = projects.indexOf(obj);
    
            projects.splice(index, 1);
        },

        getCurrentProject: () => {
            return currentProject;
        },
    
        setCurrentProject: (project) => {
            currentProject = project;
        },
    
        getHomeProject: () => {
            return homeProject;
        }    
    };
}

const projectList = newProjectList();

export default projectList;