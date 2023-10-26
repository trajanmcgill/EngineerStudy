import { GEVFC_ConfigurationsGroups } from "./hoseConfigurations";
import { UserPromptTypes, FormatTypes, TextFormat } from "./ui";
import { ref } from 'vue';


const Version = "1.0";

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
	#configurationSet;


	constructor(id, description, configurationSet, { flowQuestion, pressureQuestion })
	{
		this.id = id;
		this.description = description;
		this.#configurationSet = configurationSet;
		this.#flowQuestion = flowQuestion;
		this.#pressureQuestion = pressureQuestion;
	}


	//get id() { return this.#id; }
	//get description() { return this.#description; }


	*getProblems()
	{
		// Create a randomly ordered array of all the hose/appliance configurations in this problem set.
		// Copy the problem set configurations array, then move from the back of the array to the front,
		// randomly swapping an element from the remaining part of the arry with each one.
		let allConfigurations = Array.from(this.#configurationSet.configurations);
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
				questions.push(new Question(this.#pressureQuestion, currentConfiguration.totalPressure));

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
	UI;
	quizzes;
	currentQuiz;


	constructor(UI_Class)
	{
		this.#UI_Class = UI_Class;
		this.quizzes =
		[
			new Quiz("GEVFC_BASE_CONFIGURATIONS", "GEVFC Base Configurations",
				GEVFC_ConfigurationsGroups.getById("GEVFC_BASE_CONFIGURATIONS"),
				{ flowQuestion: "Flow rate (gallons per minute)", pressureQuestion: "Discharge pressure (p.s.i.)" } ),

			new Quiz("NOZZLES_ALONE", "Nozzle Flow Rates",
				GEVFC_ConfigurationsGroups.getById("NOZZLES_ALONE"),
				{ flowQuestion: "Flow rate (gallons per minute)" } ),

			new Quiz("BASE_FRICTION_LOSS_ITEMS_COMMON", "Base Friction Losses (Common)",
				GEVFC_ConfigurationsGroups.getById("BASE_FRICTION_LOSS_ITEMS_COMMON"),
				{ pressureQuestion: "Friction loss (p.s.i.)" } ),
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


	async startApplication()
	{
		while (true)
		{
			try { await this.#offerQuiz(); }
			catch (err) { this.UI.writeLine("** Ending quiz. **\n", new TextFormat({ textColor: "mediumslateblue" })); }
		}
	}


	async #askQuestion(question, showExpectedAnswer, moveOnEvenIfIncorrect)
	{
		let answeredCorrectly = false;

		do
		{
			let userAnswer = await this.UI.getInput(question.prompt, UserPromptTypes.Secondary);
			let evaluationResult = this.#checkAnswer(question, userAnswer);

			if (evaluationResult.resultType === EvaluationResultType.Correct_Exact)
			{
				this.UI.writeLine("Correct!", new TextFormat({ textColor: "white" }));
				answeredCorrectly = true;
			}
			else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			{
				this.UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`, new TextFormat({ textColor: "white" }));
				answeredCorrectly = true;
			}
			else
			{
				let answerDisplayString = showExpectedAnswer ? ` Expected answer: ${evaluationResult.correctAnswer}.` : "";
				this.UI.writeLine(`Incorrect.${answerDisplayString}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "darkgoldenrod" }));
			}

		} while (!answeredCorrectly && !moveOnEvenIfIncorrect);
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
		this.UI.writeLine(`\n\nStarting Quiz: ${this.currentQuiz.description}`, new TextFormat({ textStyles: [FormatTypes.Bold, FormatTypes.Underline], textColor: "darkgoldenrod"}));
		let problemGenerator = this.currentQuiz.getProblems();
		for (let nextProblem = problemGenerator.next(); !nextProblem.done; nextProblem = problemGenerator.next())
		{
			this.UI.writeLine(`\nScenario: ${nextProblem.value.scenario}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "cornflowerblue" }));
			for (const question of nextProblem.value.questions)
				await this.#askQuestion(question, false, false);
		}
	}
} // end class QuizApp


export { QuizApp };
