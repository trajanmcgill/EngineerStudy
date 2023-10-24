class CLI
{
	#terminal;
	#parseFunction = null;
	#failureFunction = null;


	constructor(greetingText, readyFunction)
	{
		//let thisObject = this;
		//let initFunction = this.#initializeCLI;
		this.#initializeCLI(greetingText, readyFunction);
		//$(function() { initFunction.call(thisObject, greetingText, readyFunction); });
	}

	
	#initializeCLI(greetingText)
	{
		let processInput = (command) => { this.#processInput(command); };
		this.#terminal = $("#Terminal").terminal(
			(command) => { processInput(command); },
			{ greetings: greetingText });
	}


	#startRead(parseFunction, failureFunction)
	{
		this.#parseFunction = parseFunction;
		this.#failureFunction = failureFunction;
		this.#terminal.enable();
	}


	#processInput(command)
	{
		if (this.#parseFunction !== null)
			this.#parseFunction(command);
	}


	getInput(userPrompt)
	{
		let thisObject = this;
		let startRead = this.#startRead;
		if (userPrompt !== undefined && userPrompt !== null)
			this.writeLine(userPrompt);
		return new Promise((resolveFunc, rejectFunc) => { startRead.call(thisObject, resolveFunc, rejectFunc); });
	}


	writeLine(text)
	{
		this.#terminal.echo(text);
	}

}

export { CLI };
