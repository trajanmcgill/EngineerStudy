import { InputCancellation, UserPromptTypes, FormatTypes } from "./UI";


class CLI
{
	#SpacesPerIndentLevel = 2;

	terminal;
	readResolveFunc = null;
	readFailureFunc = null;


	constructor(greetingText, readyFunction)
	{
		this.#initializeCLI(`[[b;white;]${greetingText}]`, readyFunction);
	}

	
	#initializeCLI(greetingText)
	{
		let sizeFixer = this.fixTerminalSize;

		let processInput = (command) => { this.#processInput(command); };

		let TerminalHeight = document.getElementById("Main").clientHeight;
		this.terminal = $("#Terminal").terminal(
			(command) => { processInput(command); },
			{
				greetings: greetingText,
				height: TerminalHeight
			});

		let terminal = this.terminal;
		window.addEventListener("resize", function () { sizeFixer(terminal); });
	}


	fixTerminalSize(terminalObject)
	{
		let headerHeight = document.getElementById("Header").offsetHeight,
			footerHeight = document.getElementById("Footer").offsetHeight,
			windowHeight = document.documentElement.clientHeight,
			terminalHeight = windowHeight - headerHeight - footerHeight;
		window.setTimeout(() => { terminalObject.resize("100%", terminalHeight); }, 1);
		console.debug(terminalHeight);
	}


	#startRead(readResolveFunc, readFailureFunc)
	{
		this.readResolveFunc = readResolveFunc;
		this.readFailureFunc = readFailureFunc;
		this.terminal.enable();
	}


	#processInput(command)
	{
		// Resolve the promise that was created in getInput()
		this.clearCustomPrompt();
		let resolver = this.readResolveFunc;
		if (resolver !== null)
		{
			this.readResolveFunc = null;
			this.readFailureFunc = null;
			resolver(command);
		}
	}


	clearCustomPrompt()
	{
		this.terminal.set_prompt("> ");
	}


	cancelInput()
	{
		// Fail the promise that was created in getInput()
		this.clearCustomPrompt();
		let failureFunc = this.readFailureFunc;
		if (failureFunc !== null)
		{
			this.readResolveFunc = null;
			this.readFailureFunc = null;
			failureFunc(new InputCancellation("Input Canceled"));
		}
	}


	#getFormattedText(text, formattingObject)
	{
		let prefix = "", postfix = "";
		if (formattingObject !== undefined)
		{
			let formatString = "";
			for (const style of (formattingObject.textStyles ?? []))
			{
				if (style === FormatTypes.Bold)
					formatString += "b";
				else if (style === FormatTypes.Glow)
					formatString += "g";
				else if (style === FormatTypes.Italic)
					formatString += "i";
				else if (style === FormatTypes.Strikethrough)
					formatString += "s";
				else if (style === FormatTypes.Underline)
					formatString += "u";
			}

			prefix = `[[${formatString};${formattingObject.textColor};${formattingObject.backgroundColor}]`;
			postfix = "]";
		}

		return (prefix + text + postfix);
	}


	getInput(userPrompt, promptType, formattingObject = {})
	{
		let thisObject = this;
		let startRead = this.#startRead;
		if (userPrompt !== undefined && userPrompt !== null)
		{
			if (promptType === undefined || promptType === UserPromptTypes.Primary)
				this.writeLine(promptText, formattingObject);
			else
			{
				let indentString = " ".repeat(this.#SpacesPerIndentLevel * (formattingObject.indentLevel ?? 0));
				let promptText = this.#getFormattedText(indentString + userPrompt, formattingObject);

				this.terminal.set_prompt(`${promptText}> `);
			}
		}
		return new Promise(
			(resolveFunc, rejectFunc) =>
			{
				startRead.call(thisObject, resolveFunc, rejectFunc);
			});
	}


	writeLine(text, formattingObject)
	{
		let outputText;

		if (formattingObject === undefined)
			outputText = text;
		else
		{
			let indentDistance = formattingObject.indentLevel ?? 0;
			let indentString = " ".repeat(this.#SpacesPerIndentLevel * (indentDistance ?? 0));
			outputText = this.#getFormattedText(indentString + text, formattingObject);
		}

		this.terminal.echo(outputText);
	}

}

export { CLI };
