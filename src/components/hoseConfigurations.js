import { ComponentTypes, Nozzle, Hose } from "./engineeringCard";


class HoseConfiguration
{
	#description;
	#components;
	#flowRate = null;


	constructor(description, components)
	{
		this.#description = description;
		this.#components = components;
	} // end HoseConfiguration constructor


	get description()
	{ return this.#description; }


	get flowRate()
	{
		// Only calculate flow rate once, and save it for subsequent calls.
		if (this.#flowRate === null)
		{
			// Flow rate is determined by the nozzle. Find the nozzle component and return its flow rate.
			let nozzle = this.#components.find((component) => component.componentType === ComponentTypes.Nozzle);
			if (nozzle === undefined)
				throw new Error("Invalid configuration: No nozzle; unable to determine flow rate.");
			this.#flowRate = nozzle.flowRate;
		}

		return this.#flowRate;
	} // end flowRate property


	get totalPressure()
	{
		let totalPressure = 0;
		let flowRate = this.flowRate;
		let allComponents = this.#components;
		for (let i = 0; i < allComponents.length; i++)
		{
			let currentComponent = allComponents[i];
			if (currentComponent.componentType === ComponentTypes.Nozzle)
				totalPressure += currentComponent.pressure;
			else
				totalPressure += currentComponent.getFrictionLoss(flowRate);
		}

		return totalPressure;
	} // end totalPressure property

} // end class HoseConfiguration


class ConfigurationsGroup
{
	#id;
	#description;
	#configurations;

	constructor(id, description, configurations)
	{
		this.#id = id;
		this.#description = description;
		this.#configurations = configurations;
	}

	get id() { return this.#id; }
	get description() { return this.#description; }
	get configurations() { return this.#configurations; }
} // end class ConfigurationsSet


const GEVFC_ConfigurationsGroups = Object.freeze(
[
	new ConfigurationsGroup(
		"GEVFC_BASE_CONFIGURATIONS",
		"GEVFC Base Configurations",
		Object.freeze(
			[
				new HoseConfiguration(
					"1 3/4 crosslay (ground floor)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1.5
							}),
						new Hose(1+3/4, 200)
					]
				)
			]))
]);


export { HoseConfiguration, GEVFC_ConfigurationsGroups };