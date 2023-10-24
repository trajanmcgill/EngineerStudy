import { GEVFC_ConfigurationsGroups } from "./hoseConfigurations";
import { FormatType, TextFormat } from "./UI";


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
			answerEvaluator: function (userAnswer)
			{
				let floatAnswer = Number.parseFloat(userAnswer);
				let correctAnswer = problemConfiguration.totalPressure;
				let result;

				if (floatAnswer === correctAnswer)
					result = EvaluationResultType.Correct_Exact;
				else if ((correctAnswer % 1 !== 0) && (floatAnswer % 1 === 0) && (Math.abs(floatAnswer - correctAnswer) <= 0.5))
					result = EvaluationResultType.Correct_Rounded;
				else
					result = EvaluationResultType.Incorrect;

				return new EvaluationResult(result, correctAnswer);
			}
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


	#askQuestion(quizProblem)
	{
		let thisObject = this;
		let checkAnswer = this.#checkAnswer;
		return this.#UI.getInput(quizProblem.question)
			.then((userAnswer) => checkAnswer.call(thisObject, quizProblem, userAnswer));
	}
	
	
	#checkAnswer(quizProblem, userAnswer)
	{
		let evaluationResult = quizProblem.answerEvaluator(userAnswer);
		if (evaluationResult.resultType === EvaluationResultType.Correct_Exact)
			this.#UI.writeLine("Correct!");
		else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			this.#UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`);
		else
			this.#UI.writeLine(`Incorrect. Expected answer: ${evaluationResult.correctAnswer}.`);
		this.#UI.writeLine("");
	}


	async #offerQuiz(quiz)
	{
		this.#UI.writeLine(`\n\nStarting Quiz: ${this.#currentQuiz.description}\n`, new TextFormat({ textStyles: [FormatType.Bold], textColor: "teal"}));
		while (true)
		{
			await this.#askQuestion(this.#currentQuiz.getProblem());
		}
	}
} // end class QuizApp


export { QuizApp };
