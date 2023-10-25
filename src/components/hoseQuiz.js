import { GEVFC_ConfigurationsGroups } from "./hoseConfigurations";
import { UserPromptTypes, FormatTypes, TextFormat } from "./ui";


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


	*getProblems()
	{
		// Create a randomly ordered array of all the hose/appliance configurations in this problem set.
		// Copy the problem set configurations array, then move from the back of the array to the front,
		// randomly swapping an element from the remaining part of the arry with each one.
		let allConfigurations = Array.from(this.#problemSet.configurations);
		for (let remaining = allConfigurations.length; remaining > 0; remaining--)
		{
			let nextElementIndex = Math.floor(Math.random() * remaining);
			let tempCopy = allConfigurations[remaining - 1];
			allConfigurations[remaining - 1] = allConfigurations[nextElementIndex];
			allConfigurations[nextElementIndex] = tempCopy;
		}

		for (const problemConfiguration of allConfigurations)
		{
			// Supply the questions and answers related to this configuration.
			let problemDefinition =
			{
				scenario: problemConfiguration.description,
				questions:
				[
					new Question("Flow rate (gallons per minute)", problemConfiguration.flowRate),
					new Question("Total pressure (p.s.i.)", problemConfiguration.totalPressure)
				]
			};
			yield problemDefinition;
		}
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



	async startApplication()
	{
		while (true)
			await this.#offerQuiz();
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
				this.#UI.writeLine("Correct!", new TextFormat({ textColor: "white" }));
				answeredCorrectly = true;
			}
			else if (evaluationResult.resultType === EvaluationResultType.Correct_Rounded)
			{
				this.#UI.writeLine(`Correct (rounded from ${evaluationResult.correctAnswer})`, new TextFormat({ textColor: "white" }));
				answeredCorrectly = true;
			}
			else
			{
				let answerDisplayString = showExpectedAnswer ? ` Expected answer: ${evaluationResult.correctAnswer}.` : "";
				this.#UI.writeLine(`Incorrect.${answerDisplayString}`, new TextFormat({ textColor: "orange" }));
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
		let problemGenerator = this.#currentQuiz.getProblems();
		for (let nextProblem = problemGenerator.next(); !nextProblem.done; nextProblem = problemGenerator.next())
		{
			this.#UI.writeLine(`\nScenario: ${nextProblem.value.scenario}`, new TextFormat({ textStyles: [FormatTypes.Bold], textColor: "cyan" }));
			for (const question of nextProblem.value.questions)
				await this.#askQuestion(question, false, false);
		}
	}
} // end class QuizApp


export { QuizApp };
