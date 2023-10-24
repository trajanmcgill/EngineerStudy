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


class TextFormat
{
	#textStyles;
	#textColor;
	#backgroundColor;

	constructor(formattingDefinition)
	{
		this.#textStyles = formattingDefinition.textStyles ?? [];
		this.#textColor = formattingDefinition.textColor ?? "";
		this.#backgroundColor = formattingDefinition.backgroundColor ?? "";
	}

	get textStyles() { return this.#textStyles; }
	get textColor() { return this.#textColor; }
	get backgroundColor() { return this.#backgroundColor; }
}


export { UserPromptTypes, FormatTypes, TextFormat };
