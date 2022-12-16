function newProjectList() {
    const projects = [];
    let currentProject;

    return {
        addProject: (project) => {
            projects.push(project);
        },

        getProjects: () => projects,

        deleteProject: (obj) => {
            const index = projects.indexOf(obj);

            projects.splice(index, 1);
        },

        getCurrentProject: () => currentProject,

        setCurrentProject: (project) => {
            currentProject = project;
        },

        getHomeProject: () => projects[0],
    };
}

const projectList = newProjectList();

export default projectList;
