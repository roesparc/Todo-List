export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
        this.priorityTasks = [];
    }

    addTask(task) {
        if (task.priority) {
            this.priorityTasks.push(task);
        } else {
            this.tasks.push(task);
        }
    }

    deleteTask(task) {
        if (task.priority) {
            const index = this.priorityTasks.indexOf(task);

            this.priorityTasks.splice(index, 1);
        } else {
            const index = this.tasks.indexOf(task);

            this.tasks.splice(index, 1);
        }
    }
}
