export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
        this.priorityTasks = [];
        this.tasksChecked = [];
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

        if (this.tasksChecked.includes(task)) {
            const index = this.tasksChecked.indexOf(task);

            this.tasksChecked.splice(index, 1);
        }
    }

    modifyCheckmark(task, type) {
        if (type === 'add') {
            this.tasksChecked.push(task);
        } else {
            const index = this.tasksChecked.indexOf(task);

            this.tasksChecked.splice(index, 1);    
        }
    }
}
