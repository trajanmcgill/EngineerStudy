import { ComponentTypes, Nozzle, Hose, IntermediateAppliance, Elevation } from "./engineeringCard";


class HoseConfiguration
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
	} // end HoseConfiguration constructor


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


let GEVFC_ConfigurationsGroups =
[
	new ConfigurationsGroup(
		"GEVFC_BASE_CONFIGURATIONS",
		"GEVFC Base Configurations",
		Object.freeze(
			[
				new HoseConfiguration(
					function() { return `1 3/4\" crosslay to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 200),
						new Elevation(0)
					]),
				
				new HoseConfiguration(
					function() { return `2 1/2\" crosslay to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(2.5, 200),
						new Elevation(0)
					]),

				new HoseConfiguration(
					function() { return `1 3/4\" skid load with ${this.hoseText(3)}, to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 150),
						new Elevation(0),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(3, 0)
					]),

				new HoseConfiguration(
					function() { return `1 3/4\" skid load with fog tip removed and ${this.hoseText(3)}, to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 15/16
							}),
						new Hose(1.75, 150),
						new Elevation(0),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(3, 0)
					]),

				new HoseConfiguration(
					function() { return `2 1/2\" skid load with default tip and ${this.hoseText(3)}, to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/8
							}),
						new Hose(2.5, 150),
						new Elevation(0),
						new Hose(3, 0)
					]),

				new HoseConfiguration(
					function() { return `2 1/2\" skid load with 1 1/4\" tip and ${this.hoseText(3)}, to ${this.elevationText}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(2.5, 150),
						new Elevation(0),
						new Hose(3, 0)
					]),

				new HoseConfiguration(
					function() { return `Blitzfire with 1 1/4\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(3, 0)
					]),

				new HoseConfiguration(
					function() { return `Blitzfire with 1 1/2\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/2
							}),
						new Hose(3, 0)
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
					function() { return `High-rise pack on standpipe, to ${this.elevationText}, supplied by ${this.hoseText(5)}`; },
					//"High-rise pack on standpipe (before elevation or hose running to standpipe is counted)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogLowPressure,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 150),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new IntermediateAppliance(IntermediateAppliance.Types.Standpipe),
						new Elevation(0),
						new Hose(5, 0)
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
						new Nozzle({ nozzleType: Nozzle.Types.MasterFog }),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					])						
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
			])),
	
	new ConfigurationsGroup(
		"BASE_FRICTION_LOSS_ITEMS_COMMON",
		"Base Friction Loss Items (Common)",
		Object.freeze(
			[
				new HoseConfiguration("1 3/4\" hose at 150 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 150),
				new HoseConfiguration("1 3/4\" hose at 185 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 185),
				new HoseConfiguration("2 1/2\" hose at 250 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 250),
				new HoseConfiguration("2 1/2\" hose at 300 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 300),
				new HoseConfiguration("3\" hose at 150 gallons per minute, per 100\'", [new Hose(3, 100)], 150),
				new HoseConfiguration("3\" hose at 185 gallons per minute, per 100\'", [new Hose(3, 100)], 185),
				new HoseConfiguration("3\" hose at 250 gallons per minute, per 100\'", [new Hose(3, 100)], 250),
				new HoseConfiguration("3\" hose at 300 gallons per minute, per 100\'", [new Hose(3, 100)], 300),
				new HoseConfiguration("3\" hose at 400 gallons per minute, per 100\'", [new Hose(3, 100)], 400),
				new HoseConfiguration("3\" hose at 500 gallons per minute, per 100\'", [new Hose(3, 100)], 500),
				new HoseConfiguration("Aerial waterway (via direct inlet)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Inlet)]),
				new HoseConfiguration("Aerial waterway (from truck pump)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Pump)]),
				new HoseConfiguration("Wye", [new IntermediateAppliance(IntermediateAppliance.Types.Wye)]),
				new HoseConfiguration("Siamese connection", [new IntermediateAppliance(IntermediateAppliance.Types.Siamese)]),
				new HoseConfiguration("Master stream device", [new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)]),
				new HoseConfiguration("Standpipe system", [new IntermediateAppliance(IntermediateAppliance.Types.Standpipe)])
			]))
];
GEVFC_ConfigurationsGroups.getById = function(id) { return this.find((configurationSet) => configurationSet.id === id); };
Object.freeze(GEVFC_ConfigurationsGroups);


export { HoseConfiguration, ConfigurationsGroup, GEVFC_ConfigurationsGroups };