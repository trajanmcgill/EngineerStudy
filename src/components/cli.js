import { FormatType } from "./UI";


class CLI
{
	#terminal;
	#parseFunction = null;
	#failureFunction = null;


	constructor(greetingText, readyFunction)
	{
		//let thisObject = this;
		//let initFunction = this.#initializeCLI;
		this.#initializeCLI(`[[b;white;]${greetingText}]`, readyFunction);
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


	writeLine(text, formattingArray, textColor, backgroundColor)
	{
		let formatString = "";
		if (formattingArray !== undefined)
		{
			for (const formattingElement of formattingArray)
			{
				if (formattingElement === FormatType.Bold)
					formatString += "b";
				else if (formattingElement === FormatType.Glow)
					formatString += "g";
				else if (formattingElement === FormatType.Italic)
					formatString += "i";
				else if (formattingElement === FormatType.Strikethrough)
					formatString += "s";
				else if (formattingElement === FormatType.Underline)
					formatString += "u";
			}
		}

		let prefix = "", postfix = "";
		if (formattingArray !== undefined || textColor !== undefined || backgroundColor !== undefined)
		{
			prefix = `[[${formatString};${textColor};${backgroundColor}]`;
			postfix = "]";
		}

		this.#terminal.echo(prefix + text + postfix);
	}

}

export { CLI };
