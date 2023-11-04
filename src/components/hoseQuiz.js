import { ComponentTypes, ComponentGroup } from "./engineering/components";
import { ConfigurationsSet } from "./engineering/configurationsSet";
import { GEVFC_ConfigurationsSets } from "./GEVFC/GEVFC_Configurations";
import { UserPromptTypes, FormatTypes, TextFormat } from "./ui";


const Version = "1.0.1";
const TimerRegularity = 250; // update the timer view every 0.25 seconds


const EvaluationResultType = Object.freeze(
{
	Incorrect: "Incorrect",
	Correct_Rounded: "Correct_Rounded",
	Correct_Exact: "Correct_Exact"
});


class EvaluationResult
{
	#resultType;
	#correctAnswer;

	constructor(resultType, correctAnswer)
	{
		this.#resultType = resultType;
		this.#correctAnswer = correctAnswer;
	}

	get resultType() { return this.#resultType; }
	get correctAnswer() { return this.#correctAnswer; }
}


class Question
{
	#prompt;
	#answer;

	constructor(prompt, answer)
	{
		this.#prompt = prompt;
		this.#answer = answer;
	}

	get prompt() { return this.#prompt; }
	get answer() { return this.#answer; }
}


class Quiz
{
	id;
	description;
	#flowQuestion;
	#pressureQuestion;
	configurationSet;
	#isDynamic;


	constructor(id, description, configurationSet, isDynamic, { flowQuestion, pressureQuestion })
	{
		this.id = id;
		this.description = description;
		this.configurationSet = configurationSet;
		this.#isDynamic = isDynamic;
		this.#flowQuestion = flowQuestion;
		this.#pressureQuestion = pressureQuestion;
	}


	get isDynamic() { return this.#isDynamic; }


	*getProblems()
	{
		// Create a randomly ordered array of all the hose/appliance configurations in this problem set.
		// Copy the problem set configurations array, then move from the back of the array to the front,
		// randomly swapping an element from the remaining part of the arry with each one.
		let allConfigurations = Array.from(this.configurationSet.configurations);
		for (let remaining = allConfigurations.length; remaining > 0; remaining--)
		{
			let nextElementIndex = Math.floor(Math.random() * remaining);
			let tempCopy = allConfigurations[remaining - 1];
			allConfigurations[remaining - 1] = allConfigurations[nextElementIndex];
			allConfigurations[nextElementIndex] = tempCopy;
		}

		for (const currentConfiguration of allConfigurations)
		{
			// Supply the questions and answers related to this configuration.
			let questions = [];
			if (this.#flowQuestion)
				questions.push(new Question(this.#flowQuestion, currentConfiguration.flowRate));
			if (this.#pressureQuestion)
				questions.push(new Question(this.#pressureQuestion, currentConfiguration.totalNeededPressure));

			let problemDefinition =
			{
				scenario: currentConfiguration.description,
				questions: questions
			};
			yield problemDefinition;
		}
	}
} // end class Quiz


class QuizApp
{
	#UI_Class;
	#overallStartTime = null;
	#currentQuestionStartTime;
	#timerInterval = null;
	#externalTimerUpdater;
	#externalAvgTimeUpdater;
	#externalStreakTracker
	#currentQuestionTimeElapsed = "0:00";
	#avgQuestionTimeElapsed = "0:00";
	#questionsAnswered = 0;
	#_streak = 0;
	UI;
	quizzes;
	currentQuiz;


	constructor(UI_Class, externalTimerUpdater, externalAvgTimeUpdater, externalStreakTracker)
	{
		this.#UI_Class = UI_Class;
		this.#externalTimerUpdater = externalTimerUpdater;
		this.#externalAvgTimeUpdater = externalAvgTimeUpdater;
		this.#externalStreakTracker = externalStreakTracker;
		this.quizzes =
		[
			new Quiz(
				"GEVFC_BASE_CONFIGURATIONS",
				"GEVFC Basic Configurations (Starting Points)",
				GEVFC_ConfigurationsSets.getById("GEVFC_BASE_CONFIGURATIONS"),
				false,
				{ flowQuestion: "Flow rate (gallons per minute)", pressureQuestion: "Discharge pressure (p.s.i.)" } ),

			new Quiz(
				"NOZZLES_ALONE",
				"Nozzle Flow Rates",
				GEVFC_ConfigurationsSets.getById("NOZZLES_ALONE"),
				false,
				{ flowQuestion: "Flow rate (gallons per minute)" } )/*,

			new Quiz(
				"BASE_FRICTION_LOSS_ITEMS_COMMON",
				"Base Friction Losses (Common)",
				GEVFC_ConfigurationsSets.getById("BASE_FRICTION_LOSS_ITEMS_COMMON"),
				false,
				{ pressureQuestion: "Friction loss (p.s.i.)" } ),

			new Quiz(
				"GEVFC_REALISTIC_SCENARIOS",
				"GEVFC Basic Configurations (Realistic Scenarios)",
				this.#buildRealisticConfigurationsSet(GEVFC_ConfigurationsSets.getById("GEVFC_BASE_CONFIGURATIONS")),
				true,
				{ flowQuestion: "Flow rate (gallons per minute)", pressureQuestion: "Discharge pressure (p.s.i.)" }) */
			];

		this.currentQuiz = this.quizzes[0];
		this.UI = new this.#UI_Class(`Welcome to Hose Quiz, version ${Version}.`);
	} // end QuizApp constructor


	get currentQuizID()
	{ return this.currentQuiz === undefined ? null : this.currentQuiz.id; }

	set currentQuizID(quizID)
	{
		this.currentQuiz = this.quizzes.find((quiz) => quiz.id === quizID);
		this.UI.cancelInput();
	}


	#incrementStreak()
	{
		this.#_streak++;
		if (this.#externalStreakTracker)
			this.#externalStreakTracker(this.#_streak);
	}

	#clearStreak()
	{
		this.#_streak = 0;
		if (this.#externalStreakTracker)
			this.#externalStreakTracker(this.#_streak);
	}

	async startApplication()
	{
		while (true)
		{
			try { await this.#offerQuiz(); }
			catch (err) { this.UI.writeLine("** Ending quiz. **\n", new TextFormat({ textColor: "#59cd90" })); }
		}
	}


	startTimer()
	{
		let thisObject = this;
		this.#currentQuestionTimeElapsed = 0;
		this.#currentQuestionStartTime = Date.now();
		this.#timerInterval = window.setInterval(function() { thisObject.updateTimer() }, TimerRegularity);
	}


	updateTimer()
	{
		let questionTime_ms = Date.now() - this.#currentQuestionStartTime;
		this.#currentQuestionTimeElapsed = this.#getTimeString(questionTime_ms);
		if (this.#externalTimerUpdater)
			this.#externalTimerUpdater(this.#currentQuestionTimeElapsed);
	}


	stopTimer()
	{
		if (this.#timerInterval !== null)
		{
			window.clearInterval(this.#timerInterval);
			this.#timerInterval = null;
		}
	}

	updateAvgTime()
	{
		let avgTime_ms = 0;

		if (this.#overallStartTime !== null && this.#questionsAnswered > 0)
		{
			let totalTimeElapsed = Date.now() - this.#overallStartTime;
			avgTime_ms = totalTimeElapsed / this.#questionsAnswered;
		}

		this.#avgQuestionTimeElapsed = this.#getTimeString(avgTime_ms);

		if (this.#externalAvgTimeUpdater)
			this.#externalAvgTimeUpdater(this.#avgQuestionTimeElapsed);
	}


	#getTimeString(milliseconds)
	{
		let secondsElapsed = milliseconds / 1000,
			minutesElapsed = Math.floor(secondsElapsed / 60),
			remainingSeconds = String(Math.round(secondsElapsed % 60)).padStart(2, "0");
		return `${minutesElapsed}:${remainingSeconds}`;
	}


	#buildRealisticConfigurationsSet(baseConfigurationsSet)
	{
		// Build a new configurations group that is a copy of the base configurations group,
		// but with elevations and hose lengths changed to realistic but random numbers.
		let realisticConfigurations = [];
		for (const baseConfiguration of baseConfigurationsSet.configurations)
		{
			// Build a components list, copying all the components from the base list,
			// but modifying any elevation, 3" hose, or 5" hose components.
			let components = [];
			for (const baseComponent of baseConfiguration.components)
			{
				let changes = {};
				if (baseComponent.componentType === ComponentTypes.Elevation)
					changes = { floorCount: Math.floor(Math.random() * (ComponentGroup.MaxAllowedFloorAboveGround - ComponentGroup.MinAllowedFloorAboveGround + 1)) + ComponentGroup.MinAllowedFloorAboveGround };
				else if (baseComponent.componentType === ComponentTypes.Hose && baseComponent.diameter === 3)
				{
					let maxLengths = (ComponentGroup.MaxAllowed3Inch - ComponentGroup.MinAllowed3Inch) / ComponentGroup.Multiples_3Inch;
					let numLengths = Math.floor(Math.random() * (maxLengths + 1));
					changes = { length: numLengths * ComponentGroup.Multiples_3Inch };
				}
				else if (baseComponent.componentType === ComponentTypes.Hose && baseComponent.diameter === 5)
				{
					let maxLengths = (ComponentGroup.MaxAllowed5InchToStandpipe - ComponentGroup.MinAllowed5InchToStandpipe) / ComponentGroup.Multiples_5Inch;
					let numLengths = Math.floor(Math.random() * (maxLengths + 1));
					changes = { length: numLengths * ComponentGroup.Multiples_5Inch };
				}
				components.push(baseComponent.duplicate(changes));
			}

			// Create a new hose configuration with all these components.
			realisticConfigurations.push(
				new ComponentGroup(
					baseConfiguration.descriptionFunction,
					components,
					baseConfiguration.forcedFlowRate));
		}

		return new ConfigurationsSet(
			`${baseConfigurationsSet.id}_REALISTIC_${Math.random()}`,
			`${baseConfigurationsSet.description} (with random, realistic modifications)`,
			realisticConfigurations);
	} // end #buildRealisticConfigurationsSet()


	async #askQuestion(question, showExpectedAnswer, moveOnEvenIfIncorrect)
	{
		let answeredCorrectly = false;

		this.startTimer();
		do
		{
			let userAnswer = await this.UI.getInput(question.prompt, UserPromptTypes.Secondary);
			let evaluationResult = this.#checkAnswer(question, userAnswer);

			if (evaluationResult.resultType === EvaluationResultType.Correct_Exact)
			{
				this.UI.writeLine("Correct!", new TextFormat({ textColor: "#f9eae1" }));
				answeredCorrectly = true;
			}
			else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			{
				this.UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`, new TextFormat({ textColor: "#f9eae1" }));
				answeredCorrectly = true;
			}
			else
			{
				let answerDisplayString = showExpectedAnswer ? ` Expected answer: ${evaluationResult.correctAnswer}.` : "";
				this.UI.writeLine(`Incorrect.${answerDisplayString}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "#e57a44" }));
				this.#clearStreak();
			}
		} while (!answeredCorrectly && !moveOnEvenIfIncorrect);
	
		this.#questionsAnswered++;
		if (answeredCorrectly)
			this.#incrementStreak();
		this.stopTimer();
		this.updateAvgTime();
	}
	
	
	#checkAnswer(question, userAnswer)
	{
		let floatAnswer = Number.parseFloat(userAnswer);
		let correctAnswer = question.answer;
		let result;

		if (floatAnswer === correctAnswer)
			result = EvaluationResultType.Correct_Exact;
		else if ((correctAnswer % 1 !== 0) && (floatAnswer % 1 === 0) && (Math.abs(floatAnswer - correctAnswer) <= 0.5))
			result = EvaluationResultType.Correct_Rounded;
		else
			result = EvaluationResultType.Incorrect;

		return new EvaluationResult(result, correctAnswer);
	}


	async #offerQuiz()
	{
		this.UI.writeLine(`\n\nStarting Quiz: ${this.currentQuiz.description}`, new TextFormat({ textStyles: [FormatTypes.Bold, FormatTypes.Underline], textColor: "#59cd90"}));
		let problemGenerator = this.currentQuiz.getProblems();

		this.#questionsAnswered = 0;
		this.#overallStartTime = Date.now();
		this.updateAvgTime();

		for (let nextProblem = problemGenerator.next(); !nextProblem.done; nextProblem = problemGenerator.next())
		{
			this.UI.writeLine(`\nScenario: ${nextProblem.value.scenario}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "#3fa7d6" }));
			for (const question of nextProblem.value.questions)
				await this.#askQuestion(question, false, false);
		}

		// If this was a dynamic quiz-- one with realistic scenarios-- then generate a new set of realistic scenarios
		// before this quiz repeats next.
		if (this.currentQuiz.isDynamic)
			this.currentQuiz.configurationSet = this.#buildRealisticConfigurationsSet(this.currentQuiz.configurationSet);
	}

} // end class QuizApp


export { QuizApp };
