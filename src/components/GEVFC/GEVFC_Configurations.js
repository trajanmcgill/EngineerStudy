import { ConfigurationsSet } from "../engineering/configurationsSet";
import { Nozzle, Hose, IntermediateAppliance, Elevation, ComponentGroup } from "../engineering/components";


const GEVFC_ConfigurationsSets =
[
	new ConfigurationsSet(
		"GEVFC_BASE_CONFIGURATIONS",
		"GEVFC Base Configurations",
		Object.freeze(
			[
				new ComponentGroup(
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
				
				new ComponentGroup(
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

				new ComponentGroup(
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

				new ComponentGroup(
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

				new ComponentGroup(
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

				new ComponentGroup(
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

				new ComponentGroup(
					function() { return `Blitzfire with 1 1/4\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(3, 0)
					]),

				new ComponentGroup(
					function() { return `Blitzfire with 1 1/2\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/2
							}),
						new Hose(3, 0)
					]),
	
				new ComponentGroup(
					"Trash line (default setting)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogConventional_TrashLine,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 100)
					]),
										
				new ComponentGroup(
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
	
				new ComponentGroup(
					function() { return `High-rise pack on standpipe, to ${this.elevationText}, supplied by ${this.hoseText(5)}`; },
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
	
				new ComponentGroup(
					"Deck gun with 1 3/8\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/8
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new ComponentGroup(
					"Deck gun with 1 1/2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new ComponentGroup(
					"Deck gun with 1 3/4\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/4
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new ComponentGroup(
					"Deck gun with 2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new ComponentGroup(
					"Deck gun with fog nozzle",
					[
						new Nozzle({ nozzleType: Nozzle.Types.MasterFog }),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					])
			])),

	new ConfigurationsSet(
		"NOZZLES_ALONE",
		"Nozzles Alone",
		Object.freeze(
			[
				new ComponentGroup(
					"1 3/4\" hand line fog nozzle (trash line, default setting)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogConventional_TrashLine, diameter: 1 + 1/2 })]),
				new ComponentGroup(
					"1 3/4\" hand line fog nozzle (other than trash line)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })]),
				new ComponentGroup(
					"2 1/2\" hand line fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 2 + 1/2 })]),
				new ComponentGroup(
					"Master stream fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterFog })]),

				new ComponentGroup(
					"Smooth bore nozzle, 15/16\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 15/16 })]),															
				new ComponentGroup(
					"Smooth bore nozzle, 1\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/8\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/8 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/4\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/2\" tip, at 50 p.s.i.",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/2 })]),

				new ComponentGroup(
					"Smooth bore nozzle, 1 1/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/4 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 3/8\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/8 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/2 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 1 3/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/4 })]),
				new ComponentGroup(
					"Smooth bore nozzle, 2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 2 })]),

	
				new ComponentGroup(
					"Foam eductor",
					[new Nozzle({ nozzleType: Nozzle.Types.FoamEductor })]),
				new ComponentGroup(
					"Cellar nozzle (backup engines)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E60/63" })]),
				new ComponentGroup(
					"Cellar nozzle (E61)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E61" })]),
				new ComponentGroup(
					"Cellar nozzle (E62)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E62" })]),
				new ComponentGroup(
					"Piercing nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.Piercing })])
			])),
	
	new ConfigurationsSet(
		"BASE_FRICTION_LOSS_ITEMS_COMMON",
		"Base Friction Loss Items (Common)",
		Object.freeze(
			[
				new ComponentGroup("1 3/4\" hose at 150 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 150),
				new ComponentGroup("1 3/4\" hose at 185 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 185),
				new ComponentGroup("2 1/2\" hose at 250 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 250),
				new ComponentGroup("2 1/2\" hose at 300 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 300),
				new ComponentGroup("3\" hose at 150 gallons per minute, per 100\'", [new Hose(3, 100)], 150),
				new ComponentGroup("3\" hose at 185 gallons per minute, per 100\'", [new Hose(3, 100)], 185),
				new ComponentGroup("3\" hose at 250 gallons per minute, per 100\'", [new Hose(3, 100)], 250),
				new ComponentGroup("3\" hose at 300 gallons per minute, per 100\'", [new Hose(3, 100)], 300),
				new ComponentGroup("3\" hose at 400 gallons per minute, per 100\'", [new Hose(3, 100)], 400),
				new ComponentGroup("3\" hose at 500 gallons per minute, per 100\'", [new Hose(3, 100)], 500),
				new ComponentGroup("Aerial waterway (via direct inlet)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Inlet)]),
				new ComponentGroup("Aerial waterway (from truck pump)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Pump)]),
				new ComponentGroup("Wye", [new IntermediateAppliance(IntermediateAppliance.Types.Wye)]),
				new ComponentGroup("Siamese connection", [new IntermediateAppliance(IntermediateAppliance.Types.Siamese)]),
				new ComponentGroup("Master stream device", [new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)]),
				new ComponentGroup("Standpipe system", [new IntermediateAppliance(IntermediateAppliance.Types.Standpipe)])
			]))
];
GEVFC_ConfigurationsSets.getById = function(id) { return this.find((configurationSet) => configurationSet.id === id); };
Object.freeze(GEVFC_ConfigurationsSets);


export { GEVFC_ConfigurationsSets };