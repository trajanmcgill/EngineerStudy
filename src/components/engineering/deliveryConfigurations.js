import { ComponentTypes } from "../engineering/components";


class DeliveryConfiguration
{
	descriptionFunction;
	#components;
	_flowRate = null;


	constructor(description, components, flowRate = null)
	{
		if (typeof description === "function")
			this.descriptionFunction = description;
		else
			this.descriptionFunction = function() { return description; };
		this.#components = components;
		this._flowRate = flowRate;
	} // end DeliveryConfiguration constructor


	static get MinFloorAboveGround() { return -1; }
	static get MaxFloorAboveGround() { return 5; }

	static get Min3Inch() { return 0; }
	static get Max3Inch() { return 600; }
	static get Multiples_3Inch() { return 50; }

	static get Min5InchToStandpipe() { return 50; }
	static get Max5InchToStandpipe() { return 1000; }
	static get Multiples_5Inch() { return 50; }


	get description()
	{ return this.descriptionFunction(); }


	get components()
	{ return this.#components; }


	get flowRate()
	{
		// If this.#flowRate is null, it needs to be calculated.
		// If it is not null, either flow rate was set as a fixed value for this hose configuration,
		// or it has previously been calculated and saved for subsequent requests, and we just return the known value.

		if (this._flowRate === null)
		{
			// Flow rate is determined by the nozzle. Find the nozzle component to get its flow rate.
			// Only calculate flow rate once, and save it for subsequent calls.
			let nozzle = this.#components.find((component) => component.componentType === ComponentTypes.Nozzle);
			if (nozzle === undefined)
				throw new Error("Invalid configuration: No nozzle; unable to determine flow rate.");
			this._flowRate = nozzle.flowRate;
		}

		return this._flowRate;
	} // end flowRate property


	get totalPressure()
	{
		let totalPressure = 0;
		for (const currentComponent of this.#components)
		{
			let pressureContributionType = typeof currentComponent.pressureContribution;
			if (pressureContributionType === "number")
				totalPressure += currentComponent.pressureContribution;
			else if (pressureContributionType === "function")
				totalPressure += currentComponent.pressureContribution(this.flowRate);
			else
				throw new Error(`Unable to determine pressure contribution of component ${currentComponent.description}`);
		}

		return totalPressure;
	} // end totalPressure property


	get elevationComponent()
	{
		return this.components.find((component) => component.componentType === ComponentTypes.Elevation);
	} // end elevationComponent property

	
	get elevationText()
	{
		let elevation = this.elevationComponent;
		if (elevation.floorCount == -1)
			return "basement";
		if (elevation.floorCount == 0)
			return "ground floor";
		if (elevation.floorCount > 0)
			return `floor ${elevation.floorCount + 1}`;
		throw new Error(`Invalid floor count: ${elevation.floorCount}`);
	} // end elevationText property


	hoseText(diameter)
	{
		let matchingHose = this.components.find(
			(component) =>
				component.componentType === ComponentTypes.Hose
				&& component.diameter === diameter
			);
		
		return matchingHose.description;
	} // end hostText()

} // end class DeliveryConfiguration


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


export { DeliveryConfiguration, ConfigurationsGroup };