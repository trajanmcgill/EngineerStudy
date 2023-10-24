import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { CLI } from './components/cli';
import { QuizApp } from './components/hoseQuiz';

createApp(App).mount('#App');
(new QuizApp(CLI)).startApplication();
