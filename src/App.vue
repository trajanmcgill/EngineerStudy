<script	setup>
	import { ref, computed, onMounted } from 'vue';
	import { CLI } from './components/CLI';
	import { QuizApp } from './components/HoseQuiz';

	const Streak_Display = 10;
	const Streak_Exclaim = 30;

	let _quizApp = null;
	let vQuizApp = ref({});
	let timeElapsed = ref("0:00");
	let avgAnswerTime = ref("0:00");
	let streak = ref(0);

	function updateTimeElapsed(newValue)
	{ timeElapsed.value = newValue; }

	function updateAvgAnswerTime(newValue)
	{ avgAnswerTime.value = newValue; }

	function updateStreak(newValue)
	{ streak.value = newValue; }

	const exclamation = computed(() => ((streak.value >= Streak_Exclaim) ? "!" : ""));

	const vCurrentQuiz = computed(
		{
			cache: false,
			get: function() { return vQuizApp.value.currentQuizID; },
			set: function(newID) { vQuizApp.value.currentQuizID = newID; }
		});

	function start()
	{
		_quizApp = new QuizApp(CLI, updateTimeElapsed, updateAvgAnswerTime, updateStreak);
		vQuizApp.value = _quizApp;
		_quizApp.startApplication();
	}

	onMounted(start);
</script>

<template>
	<header id="Header">
		<div id="TitleBar"><h1>Fire Apparatus Engineer Study</h1></div>
	</header>

	<main id="Main">
		<div id="Terminal"></div>
	</main>

	<footer id="Footer">
		<div id="FooterBar">
			<div id="QuizSelectionArea">
				<h2>Active Quiz:</h2>
				<div v-for="quiz in vQuizApp.quizzes" :key="quiz.id">
					<input name="QuizSelection" v-bind:id="'QUIZ_' + quiz.id" type="radio" v-bind:value="quiz.id" v-model="vCurrentQuiz" />
					<label class="QuizChoice" v-bind:for="'QUIZ_' + quiz.id">{{ quiz.description }}</label>
				</div>
			</div>
			<div id="StreakArea">
				<div v-if="streak >= Streak_Display" class="BadgeDisplay" id="Streak">Streak: {{ streak }}{{ exclamation }}</div>
			</div>
			<div id="TimersArea">
				<div class="BadgeDisplay" id="CurrentQuestionTimer">Current question: {{ timeElapsed }}</div>
				<div class="BadgeDisplay" id="AverageTimer">Average time to answer: {{ avgAnswerTime }}</div>
			</div>
		</div>
	</footer>
</template>

<style scoped>
</style>
