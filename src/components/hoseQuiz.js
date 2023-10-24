import { GEVFC_ConfigurationsGroups } from "./hoseConfigurations";
import { FormatType } from "./UI";


const Version = "1.0";


class Quiz
{
	#questionSet;


	constructor(questionSet)
	{ this.#questionSet = questionSet; }


	get description()
	{ return this.#questionSet.description; }


	getProblem()
	{
		// Choose at random a configuration from the question set.
		let allConfigurations = this.#questionSet.configurations;
		let problemConfiguration = allConfigurations[Math.floor(Math.random() * allConfigurations.length)];

		// Return the question and the answer-checking function for this configuration.
		let problemDefinition =
		{
			question: `Total pressure for ${problemConfiguration.description}:`,
			answerEvaluator: (answer) => (Number.parseInt(answer) === problemConfiguration.totalPressure)
		};
		return problemDefinition;
	}
} // end class Quiz


class QuizApp
{
	#UI_Class;
	#UI;
	#currentQuiz;


	constructor(UI_Class)
	{
		this.#UI_Class = UI_Class;
		this.#currentQuiz = new Quiz(GEVFC_ConfigurationsGroups.find((configurationSet) => configurationSet.id === "GEVFC_BASE_CONFIGURATIONS"));
		this.#UI = new this.#UI_Class(`Welcome to Hose Quiz, version ${Version}.`);
	} // end QuizApp constructor



	startApplication()
	{
		this.#offerQuiz();
	}


	#askQuestion(question, evaluator)
	{
		let thisObject = this;
		let checkAnswer = this.#checkAnswer;
		return this.#UI.getInput(question)
			.then((userAnswer) => checkAnswer.call(thisObject, userAnswer, evaluator));
	}
	
	
	#checkAnswer(userAnswer, evaluator)
	{
		this.#UI.writeLine(`Your answer was: ${userAnswer}`);
		if (evaluator(userAnswer))
			this.#UI.writeLine("CORRECT!");
		else
			this.#UI.writeLine("WRONG!");
		this.#UI.writeLine("");
	}


	async #offerQuiz(quiz)
	{
		this.#UI.writeLine(`\n\nStarting Quiz: ${this.#currentQuiz.description}\n`, [FormatType.Bold], "teal");
		while (true)
		{
			let quizProblem = this.#currentQuiz.getProblem();
			await this.#askQuestion(quizProblem.question, quizProblem.answerEvaluator);
		}
	}
} // end class QuizApp


export { QuizApp };
