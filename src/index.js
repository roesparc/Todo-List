import './style.css';
import './modules/DOM/UI';
import { checkStorage } from './modules/storage';
import displayTasks from './modules/DOM/taskDOM';

checkStorage();
displayTasks(true);