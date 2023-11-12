class ConfigurationsSet
{
	#id;
	#description;
	#deliveryConfigurations;

	constructor(id, description, deliveryConfigurations)
	{
		this.#id = id;
		this.#description = description;
		this.#deliveryConfigurations = deliveryConfigurations;
	}

	get id() { return this.#id; }
	get description() { return this.#description; }
	get deliveryConfigurations() { return this.#deliveryConfigurations; }

} // end class ConfigurationsSet


export { ConfigurationsSet };