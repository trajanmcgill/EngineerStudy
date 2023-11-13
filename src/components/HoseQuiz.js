import { Component } from "./engineering/Component";
import { ComponentChain } from "./engineering/ComponentChain";
import { ConfigurationsSet } from "./engineering/ConfigurationsSet";
import { GEVFC_ConfigurationsSets } from "./GEVFC/GEVFC_Configurations";
import { InputCancellation, UserPromptTypes, FormatTypes, TextFormat } from "./UI";


const Version = "1.2.0";
const TimerRegularity = 250; // update the timer view every 0.25 seconds
const WrongAnswersBeforeWalkThrough = 3;
const WalkThroughQuestionColor_FlowRate = "aquamarine";
const WalkThroughQuestionColor_Pressure = "coral";


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
	#formatting;

	constructor(prompt, answer, formatting = {})
	{
		this.#prompt = prompt;
		this.#answer = answer;
		this.#formatting = formatting;
	}

	get prompt() { return this.#prompt; }
	get answer() { return this.#answer; }
	get formatting() { return this.#formatting; }
}


class Quiz
{
	id;
	description;
	#flowQuestion;
	#pressureQuestion;
	configurationSet;
	#isDynamic;
	#doWalkThrough;


	constructor(id, description, configurationSet, isDynamic, doWalkThrough, { flowQuestion, pressureQuestion })
	{
		this.id = id;
		this.description = description;
		this.configurationSet = configurationSet;
		this.#isDynamic = isDynamic;
		this.#doWalkThrough = doWalkThrough;
		this.#flowQuestion = flowQuestion;
		this.#pressureQuestion = pressureQuestion;
	}


	get isDynamic() { return this.#isDynamic; }
	get doWalkThrough() { return this.#doWalkThrough; }


	*getProblems()
	{
		// Create a randomly ordered array of all the hose/appliance configurations in this problem set.
		// Copy the problem set configurations array, then move from the back of the array to the front,
		// randomly swapping an element from the remaining part of the arry with each one.
		let allConfigurations = Array.from(this.configurationSet.deliveryConfigurations);
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
			let standardQuestions = [],
				supplementaryQuestions = [],
				allChainLinks = currentConfiguration.allChainLinks.reverse(); // Order from nozzle end
			if (this.#flowQuestion)
				standardQuestions.push(new Question(this.#flowQuestion, currentConfiguration.flowRate));
			if (this.#pressureQuestion)
				standardQuestions.push(new Question(this.#pressureQuestion, currentConfiguration.totalNeededPressure));

			if (this.#doWalkThrough)
			{
				for (const chainLink of allChainLinks)
				{
					const component = chainLink.component;
					const componentType = component.componentType;
					const componentDescription = component.description;

					if (componentType === Component.ComponentTypes.Nozzle)
					{
						supplementaryQuestions.push(
							new Question(
								`For ${componentDescription}, what is the flow rate (gallons per minute)`,
								chainLink.flowRate,
								{ textColor: WalkThroughQuestionColor_FlowRate }));
						supplementaryQuestions.push(
							new Question(
								`For ${componentDescription} at ${chainLink.flowRate} g.p.m., what is the pressure needed (p.s.i.)`,
								chainLink.pressureDelta,
								{ textColor: WalkThroughQuestionColor_Pressure }));
					}
					else if (componentType === Component.ComponentTypes.Elevation)
					{
						supplementaryQuestions.push(
							new Question(
								`For going to ${componentDescription}, how much pressure is added (p.s.i.)`,
								chainLink.pressureDelta,
								{ textColor: WalkThroughQuestionColor_Pressure }));
					}
					else if (componentType === Component.ComponentTypes.Hose || componentType === Component.ComponentTypes.IntermediateAppliance)
					{
						supplementaryQuestions.push(
							new Question(
								`For ${componentDescription} at ${chainLink.flowRate} g.p.m., what is the friction loss (p.s.i.)`,
								chainLink.pressureDelta,
								{ textColor: WalkThroughQuestionColor_Pressure }));
					}
					else if (componentType === Component.ComponentTypes.SectionStart)
					{
						supplementaryQuestions.push(
							new Question(
								`So for ${componentDescription}, what is the total flow rate (gallons per minute)`,
								chainLink.flowRate,
								{ textColor: WalkThroughQuestionColor_FlowRate, textStyles: [FormatTypes.Bold] }));
						supplementaryQuestions.push(
							new Question(
								`And for ${componentDescription} at ${chainLink.flowRate} g.p.m., what is the total pressure needed (p.s.i.)`,
								chainLink.totalNeededPressure,
								{ textColor: WalkThroughQuestionColor_Pressure, textStyles: [FormatTypes.Bold] }));
					}
				} // end for (const chainLink of allChainLinks)
			} // end if (this.#doWalkThrough)

			let problemDefinition =
			{
				scenario: currentConfiguration.description,
				standardQuestions: standardQuestions,
				supplementaryQuestions: supplementaryQuestions
			};
			yield problemDefinition;
		}
	} // end *getProblems()
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
				true,
				{ flowQuestion: "Flow rate (gallons per minute)", pressureQuestion: "Discharge pressure (p.s.i.)" } ),

			new Quiz(
				"NOZZLES_ALONE",
				"Nozzle Flow Rates",
				GEVFC_ConfigurationsSets.getById("NOZZLES_ALONE"),
				false,
				false,
				{ flowQuestion: "Flow rate (gallons per minute)" } ),
	
			new Quiz(
				"BASE_FRICTION_LOSS_ITEMS_COMMON",
				"Base Friction Losses (Common)",
				GEVFC_ConfigurationsSets.getById("BASE_FRICTION_LOSS_ITEMS_COMMON"),
				false,
				false,
				{ pressureQuestion: "Friction loss (p.s.i.)" } ),

			new Quiz(
				"GEVFC_REALISTIC_SCENARIOS",
				"GEVFC Basic Configurations (Realistic Scenarios)",
				this.#buildRealisticConfigurationsSet(GEVFC_ConfigurationsSets.getById("GEVFC_BASE_CONFIGURATIONS")),
				true,
				true,
				{ flowQuestion: "Flow rate (gallons per minute)", pressureQuestion: "Discharge pressure (p.s.i.)" })
			];

		this.currentQuiz = this.quizzes[0];
		this.UI = new this.#UI_Class(`Welcome to Hose Quiz, version ${Version}.`);
	} // end QuizApp constructor


	get currentQuizID() { return this.currentQuiz === undefined ? null : this.currentQuiz.id; }

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
			catch (err)
			{
				this.UI.writeLine("** Ending quiz. **\n", new TextFormat({ textColor: "#59cd90" }));
				if (!(err instanceof InputCancellation))
				{
					this.UI.writeLine(`** Error: ${err.message} **`, new TextFormat({ textColor: "red" }));
					break;
				}
			}
		}
	}


	startTimer()
	{
		let thisObject = this;
		this.#currentQuestionTimeElapsed = 0;
		this.#currentQuestionStartTime = Date.now();
		this.#timerInterval = window.setInterval(function() { thisObject.updateTimer() }, TimerRegularity);
	} // end startTimer()


	updateTimer()
	{
		let questionTime_ms = Date.now() - this.#currentQuestionStartTime;
		this.#currentQuestionTimeElapsed = this.#getTimeString(questionTime_ms);
		if (this.#externalTimerUpdater)
			this.#externalTimerUpdater(this.#currentQuestionTimeElapsed);
	} // end updateTimer()


	stopTimer()
	{
		if (this.#timerInterval !== null)
		{
			window.clearInterval(this.#timerInterval);
			this.#timerInterval = null;
		}
	} // end stopTimer()


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
	} // end updateAvgTime()


	#getTimeString(milliseconds)
	{
		let secondsElapsed = milliseconds / 1000,
			minutesElapsed = Math.floor(secondsElapsed / 60),
			remainingSeconds = String(Math.round(secondsElapsed % 60)).padStart(2, "0");
		return `${minutesElapsed}:${remainingSeconds}`;
	} // end #getTimeString()


	#buildRealisticConfigurationsSet(baseConfigurationsSet)
	{
		// Build a new configurations group that is a copy of the base configurations group,
		// but with elevations and hose lengths changed to realistic but random numbers.
		
		let realisticConfigurations = [];

		// For each delivery configuration in this set, create a duplicate with adjustments.
		for (const baseDeliveryConfiguration of baseConfigurationsSet.deliveryConfigurations)
		{
			// Get a duplicate of this configuration, but with elevations and tail hose lengths randomly changed.
			let adjustedDeliveryConfiguration =
				baseDeliveryConfiguration.duplicate(
					{
						tailHoseTransformation: function(hose)
						{
							let newLength = hose.length;
							if (hose.diameter === 3)
							{
								let maxLengths = (ComponentChain.MaxAllowed3Inch - ComponentChain.MinAllowed3Inch) / ComponentChain.Multiples_3Inch;
								let numLengths = Math.floor(Math.random() * (maxLengths + 1));
								newLength = numLengths * ComponentChain.Multiples_3Inch;
							}
							else if (hose.diameter === 5)
							{
								let maxLengths = (ComponentChain.MaxAllowed5InchToStandpipe - ComponentChain.MinAllowed5InchToStandpipe) / ComponentChain.Multiples_5Inch;
								let numLengths = Math.floor(Math.random() * (maxLengths + 1));
								newLength = numLengths * ComponentChain.Multiples_5Inch;
							}

							return { diameter: hose.diameter, length: newLength };
						},

						elevationTransformation: function()
						{
							let newFloorCount =
								Math.floor(Math.random() * (ComponentChain.MaxAllowedFloorAboveGround - ComponentChain.MinAllowedFloorAboveGround + 1))
								+ ComponentChain.MinAllowedFloorAboveGround;
							return newFloorCount;
						}
					});

			realisticConfigurations.push(adjustedDeliveryConfiguration);
		}

		return new ConfigurationsSet(
			`${baseConfigurationsSet.id}_REALISTIC_${Math.random()}`,
			`${baseConfigurationsSet.description} (with random, realistic modifications)`,
			realisticConfigurations);
	} // end #buildRealisticConfigurationsSet()


	async #askQuestion(question, showExpectedAnswer, moveOnEvenIfIncorrect, indentLevel = 0)
	{
		let isAnsweredCorrectly = false;

		this.startTimer();
		do
		{
			let formattingObject = question.formatting ?? {};
			formattingObject.indentLevel = indentLevel;

			let userAnswer = await this.UI.getInput(question.prompt, UserPromptTypes.Secondary, formattingObject );
			let evaluationResult = this.#checkAnswer(question, userAnswer);

			if (evaluationResult.resultType === EvaluationResultType.Correct_Exact)
			{
				this.UI.writeLine("Correct!", new TextFormat({ textColor: "#f9eae1", indentLevel: indentLevel }));
				isAnsweredCorrectly = true;
			}
			else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			{
				this.UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`, new TextFormat({ textColor: "#f9eae1", indentLevel: indentLevel }));
				isAnsweredCorrectly = true;
			}
			else
			{
				let answerDisplayString = showExpectedAnswer ? ` Expected answer: ${evaluationResult.correctAnswer}.` : "";
				this.UI.writeLine(`Incorrect.${answerDisplayString}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "#e57a44", indentLevel: indentLevel }));
				this.#clearStreak();
			}
		} while (!isAnsweredCorrectly && !moveOnEvenIfIncorrect);
	
		this.#questionsAnswered++;
		if (isAnsweredCorrectly)
			this.#incrementStreak();
		this.stopTimer();
		this.updateAvgTime();

		return isAnsweredCorrectly;
	} // end #askQuestion()
	
	
	#checkAnswer(question, userAnswer)
	{
		let floatAnswer = Number.parseFloat(userAnswer);
		let correctAnswer = question.answer;
		let result;

		if (floatAnswer === correctAnswer)
			result = EvaluationResultType.Correct_Exact;
		else if ((correctAnswer % 1 !== 0) && (floatAnswer % 1 === 0) && (Math.abs(floatAnswer - correctAnswer) < 1))
			result = EvaluationResultType.Correct_Rounded;
		else
			result = EvaluationResultType.Incorrect;

		return new EvaluationResult(result, correctAnswer);
	} // end #checkAnswer()


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
			let i = 0, incorrectCount = 0;
			while (i < nextProblem.value.standardQuestions.length)
			{
				let question = nextProblem.value.standardQuestions[i];
				let isAnsweredCorrectly = false;

				if (this.currentQuiz.doWalkThrough)
				{
					isAnsweredCorrectly = await this.#askQuestion(question, false, true);
					if (isAnsweredCorrectly)
					{
						incorrectCount = 0;
						i++;
					}
					else
					{
						incorrectCount++;
						if (incorrectCount >= WrongAnswersBeforeWalkThrough)
						{
							this.UI.writeLine("Walking through individual components...");
							for (const supplementaryQuestion of nextProblem.value.supplementaryQuestions)
								await this.#askQuestion(supplementaryQuestion, false, false, 1);
							this.UI.writeLine(`Putting it all back together...\nTotals for ${nextProblem.value.scenario}:`);
							incorrectCount = 0; // Reset counter of wrong answers
							i = 0; // Skip back to the first question for this scenario
						}
					}
				}
				else
				{
					await this.#askQuestion(question, false, false);
					i++;
				}
			} // end while (i < nextProblem.value.standardQuestions.length)
		} // end for loop iterating on problemGenerator.next()

		// If this was a dynamic quiz-- one with realistic scenarios-- then generate a new set of realistic scenarios
		// before this quiz repeats next.
		if (this.currentQuiz.isDynamic)
			this.currentQuiz.configurationSet = this.#buildRealisticConfigurationsSet(this.currentQuiz.configurationSet);
	} // end #offerQuiz()

} // end class QuizApp


export { QuizApp };
