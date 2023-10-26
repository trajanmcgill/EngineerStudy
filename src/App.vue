<script	setup>
	import { ref, computed, onMounted } from 'vue';
	import { CLI } from './components/cli';
	import { QuizApp } from './components/hoseQuiz';

	let _quizApp = null;
	let vQuizApp = ref({});

	const vCurrentQuiz = computed(
		{
			cache: false,
			get: function() { return vQuizApp.value.currentQuizID; },
			set: function(newID) { vQuizApp.value.currentQuizID = newID; }
		});

	function start()
	{
		_quizApp = new QuizApp(CLI);
		vQuizApp.value = _quizApp;
		_quizApp.startApplication();
	}

	onMounted(start);
</script>

<template>
	<header>
		<div id="TitleBar"><h1>Fire Apparatus Engineer Study</h1></div>
	</header>

	<main>
		<div id="Terminal"></div>
	</main>

	<footer>
		<div id="FooterBar">
			<h2>Active Quiz:</h2>
			<div v-for="quiz in vQuizApp.quizzes" :key="quiz.id">
				<input name="QuizSelection" v-bind:id="'QUIZ_' + quiz.id" type="radio" v-bind:value="quiz.id" v-model="vCurrentQuiz" />
				<label class="QuizChoice" v-bind:for="'QUIZ_' + quiz.id">{{ quiz.description }}</label>
			</div>
		</div>
	</footer>
</template>

<style scoped>
</style>
