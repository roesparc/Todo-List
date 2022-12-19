import './style.css';
import './modules/DOM/UI';
import { checkStorage } from './modules/app_logic/storage';
import displayTasks from './modules/DOM/taskDOM';
import { appendProjectsFromStorage } from './modules/DOM/projectDOM';

checkStorage();
appendProjectsFromStorage();
displayTasks(true);
