import { ComponentTypes, Nozzle, Hose, IntermediateAppliance, Elevation } from "./engineeringCard";


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
		for (const currentComponent of this.#components)
		{
			let pressureContributionType = typeof currentComponent.pressureContribution;
			if (pressureContributionType === "number")
				totalPressure += currentComponent.pressureContribution;
			else if (pressureContributionType === "function")
				totalPressure += currentComponent.pressureContribution(flowRate);
			else
				throw new Error(`Unable to determine pressure contribution of component ${currentComponent.description}`);
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
					"1 3/4\" crosslay to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 200)
					]),
				
				new HoseConfiguration(
					"2 1/2\" crosslay to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(2.5, 200)
					]),

				new HoseConfiguration(
					"1 3/4\" skid load with 0\' of 3\", to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 150),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye)
					]),

				new HoseConfiguration(
					"1 3/4\" skid load with fog tip removed and 0\' of 3\", to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 15/16
							}),
						new Hose(1.75, 150),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye)
					]),

				new HoseConfiguration(
					"2 1/2\" skid load with default tip and 0\' of 3\", to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/8
							}),
						new Hose(2.5, 150)
					]),

				new HoseConfiguration(
					"2 1/2\" skid load with 1 1/4\" tip and 0\' of 3\", to ground floor",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(2.5, 150)
					]),

				new HoseConfiguration(
					"Blitzfire with 1 1/4\" tip and 0\' of 3\"",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/4
							})
					]),

				new HoseConfiguration(
					"Blitzfire with 1 1/2\" tip and 0\' of 3\"",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/2
							})
					]),
	
				new HoseConfiguration(
					"Trash line (default setting)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogConventional_TrashLine,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 100)
					]),
										
				new HoseConfiguration(
					"High-rise pack by itself",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
							new Hose(1.75, 150),
							new IntermediateAppliance(IntermediateAppliance.Types.Wye)
					]),
	
				new HoseConfiguration(
					"High-rise pack on standpipe (before elevation or hose running to standpipe is counted)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 150),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new IntermediateAppliance(IntermediateAppliance.Types.Standpipe)
					]),
	
				new HoseConfiguration(
					"Deck gun with 1 3/8\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/8
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new HoseConfiguration(
					"Deck gun with 1 1/2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new HoseConfiguration(
					"Deck gun with 1 3/4\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/4
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new HoseConfiguration(
					"Deck gun with 2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),
				new HoseConfiguration(

					"Deck gun with fog nozzle",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterFog,
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),
						
			])),

	new ConfigurationsGroup(
		"NOZZLES_ALONE",
		"Nozzles Alone",
		Object.freeze(
			[
				new HoseConfiguration(
					"1 3/4\" hand line fog nozzle (trash line, default setting)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogConventional_TrashLine, diameter: 1 + 1/2 })]),
				new HoseConfiguration(
					"1 3/4\" hand line fog nozzle (other than trash line)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })]),
				new HoseConfiguration(
					"2 1/2\" hand line fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 2 + 1/2 })]),
				new HoseConfiguration(
					"Master stream fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterFog })]),

				new HoseConfiguration(
					"Smooth bore nozzle, 15/16\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 15/16 })]),															
				new HoseConfiguration(
					"Smooth bore nozzle, 1\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 1/8\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/8 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 1/4\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 1/2\" tip, at 50 p.s.i.",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/2 })]),

				new HoseConfiguration(
					"Smooth bore nozzle, 1 1/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/4 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 3/8\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/8 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 1/2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/2 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 1 3/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/4 })]),
				new HoseConfiguration(
					"Smooth bore nozzle, 2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 2 })]),

	
				new HoseConfiguration(
					"Foam eductor",
					[new Nozzle({ nozzleType: Nozzle.Types.FoamEductor })]),
				new HoseConfiguration(
					"Cellar nozzle (backup engines)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E60/63" })]),
				new HoseConfiguration(
					"Cellar nozzle (E61)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E61" })]),
				new HoseConfiguration(
					"Cellar nozzle (E62)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E62" })]),
				new HoseConfiguration(
					"Piercing nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.Piercing })])
			]))
]);


export { HoseConfiguration, GEVFC_ConfigurationsGroups };