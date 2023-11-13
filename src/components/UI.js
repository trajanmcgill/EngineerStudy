const UserPromptTypes = Object.freeze(
{
	Primary: "Primary",
	Secondary: "Secondary"
});


const FormatTypes = Object.freeze(
{
	Regular: "Regular",
	Bold: "Bold",
	Underline: "Underline",
	Italic: "Italic",
	Strikethrough: "Strikethrough",
	Glow: "Glow"
});


class InputCancellation extends Error
{
	constructor(message) { super(message); }
}


class TextFormat
{
	#textStyles;
	#textColor;
	#backgroundColor;
	#indentLevel;

	constructor(formattingDefinition)
	{
		this.#textStyles = formattingDefinition.textStyles ?? [];
		this.#textColor = formattingDefinition.textColor ?? "";
		this.#backgroundColor = formattingDefinition.backgroundColor ?? "";
		this.#indentLevel = formattingDefinition.indentLevel ?? 0;
	}

	get textStyles() { return this.#textStyles; }
	get textColor() { return this.#textColor; }
	get backgroundColor() { return this.#backgroundColor; }
	get indentLevel() { return this.#indentLevel; }
}


export { UserPromptTypes, FormatTypes, InputCancellation, TextFormat };
