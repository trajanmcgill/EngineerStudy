class CLI
{
	#terminal;
	#parseFunction = null;
	#failureFunction = null;

	#startRead(parseFunction, failureFunction)
	{
		this.#parseFunction = parseFunction;
		this.#failureFunction = failureFunction;
		this.#terminal.enable();
	}

	readLine(userPrompt)
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

	#processInput(command)
	{
		if (this.#parseFunction !== null)
			this.#parseFunction(command);
	}

	#initializeCLI(greetingText, shellManager)
	{
		let processInput = (command) => { this.#processInput(command); };
		this.#terminal = $("#Terminal").terminal(
			function(command)
			{
				processInput(command);
			},
			{
				greetings: greetingText
			});
		shellManager();
	}

	constructor(greetingText, readyFunction)
	{
		let thisObject = this;
		let initFunction = this.#initializeCLI;
		$(function() { initFunction.call(thisObject, greetingText, readyFunction); });
	}
}

export { CLI };
