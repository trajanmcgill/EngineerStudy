import { GEVFC_ConfigurationsGroups } from "./hoseConfigurations";
import { UserPromptTypes, FormatTypes, TextFormat } from "./UI";


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
	#problemSet;


	constructor(problemSet)
	{ this.#problemSet = problemSet; }


	get description()
	{ return this.#problemSet.description; }


	getProblem()
	{
		// Choose at random a configuration from the question set.
		let allConfigurations = this.#problemSet.configurations;
		let problemConfiguration = allConfigurations[Math.floor(Math.random() * allConfigurations.length)];

		// Return the questions and answers for this configuration.
		let problemDefinition =
		{
			scenario: problemConfiguration.description,
			questions:
			[
				new Question("Flow rate (gallons per minute)", problemConfiguration.flowRate),
				new Question("Total pressure (p.s.i.)", problemConfiguration.totalPressure)
			]
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


	async #askQuestion(question, showExpectedAnswer, moveOnEvenIfIncorrect)
	{
		let answeredCorrectly = false;

		do
		{
			let userAnswer = await this.#UI.getInput(question.prompt, UserPromptTypes.Secondary);
			let evaluationResult = this.#checkAnswer(question, userAnswer);

			if (evaluationResult.resultType === EvaluationResultType.Correct_Exact)
			{
				this.#UI.writeLine("Correct!");
				answeredCorrectly = true;
			}
			else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			{
				this.#UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`);
				answeredCorrectly = true;
			}
			else
			{
				let answerDisplayString = showExpectedAnswer ? ` Expected answer: ${evaluationResult.correctAnswer}.` : "";
				this.#UI.writeLine(`Incorrect.${answerDisplayString}`);
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


	async #offerQuiz(quiz)
	{
		this.#UI.writeLine(`\n\nStarting Quiz: ${this.#currentQuiz.description}\n`, new TextFormat({ textStyles: [FormatTypes.Bold, FormatTypes.Underline], textColor: "teal"}));
		while (true)
		{
			let problem = this.#currentQuiz.getProblem();
			this.#UI.writeLine(`\nScenario: ${problem.scenario}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "cyan" }));
			for (const question of problem.questions)
				await this.#askQuestion(question, false, false);
		}
	}
} // end class QuizApp


export { QuizApp };
