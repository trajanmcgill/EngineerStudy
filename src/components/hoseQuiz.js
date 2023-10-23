import { ComponentTypes, Nozzle, Hose, BasicSetups } from "./engineeringCard";
import { CLI } from "./cli";

const Version = 1.0;

const UI = new CLI(`Welcome to Hose Quiz, version ${Version}.`, quiz);

async function quiz()
{
	while (true)
	{
		let currentSetup = BasicSetups[Math.floor(Math.random() * BasicSetups.length)];
		let totalPressure = 0;
		let flowRate = null;
		let allComponents = currentSetup.components;
		let deferredComponents = [];
		for (let i = 0; i < allComponents.length; i++)
		{
			let currentComponent = allComponents[i];
			if (currentComponent.componentType === ComponentTypes.Nozzle)
			{
				flowRate = currentComponent.flowRate;
				totalPressure += currentComponent.pressure;
			}
			else if (flowRate === null)
				deferredComponents.push(currentComponent);
			else
				totalPressure += currentComponent.getFrictionLoss(flowRate);
		}
		for (let i = 0; i < deferredComponents.length; i++)
			totalPressure += deferredComponents[i].getFrictionLoss(flowRate);

		await askQuestion(`Total pressure for ${currentSetup.description}:`, (answer) => (Number.parseInt(answer) === totalPressure));
	}
}


function askQuestion(question, evaluator)
{
	return UI.readLine(question)
		.then((userAnswer) => checkAnswer(userAnswer, evaluator));
}


function checkAnswer(userAnswer, evaluator)
{
	UI.writeLine(`Your answer was: ${userAnswer}`);
	if (evaluator(userAnswer))
		UI.writeLine("CORRECT!");
	else
		UI.writeLine("WRONG!");
}