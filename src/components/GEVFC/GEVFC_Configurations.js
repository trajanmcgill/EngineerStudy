import { DeliveryConfiguration, ConfigurationsGroup } from "../engineering/deliveryConfigurations";
import { ComponentTypes, Nozzle, Hose, IntermediateAppliance, Elevation } from "../engineering/components";


const GEVFC_ConfigurationsGroups =
[
	new ConfigurationsGroup(
		"GEVFC_BASE_CONFIGURATIONS",
		"GEVFC Base Configurations",
		Object.freeze(
			[
				new DeliveryConfiguration(
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
				
				new DeliveryConfiguration(
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

				new DeliveryConfiguration(
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

				new DeliveryConfiguration(
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

				new DeliveryConfiguration(
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

				new DeliveryConfiguration(
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

				new DeliveryConfiguration(
					function() { return `Blitzfire with 1 1/4\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/4
							}),
						new Hose(3, 0)
					]),

				new DeliveryConfiguration(
					function() { return `Blitzfire with 1 1/2\" tip and ${this.hoseText(3)}`; },
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandSmooth,
								diameter: 1 + 1/2
							}),
						new Hose(3, 0)
					]),
	
				new DeliveryConfiguration(
					"Trash line (default setting)",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.HandFogConventional_TrashLine,
								diameter: 1 + 1/2
							}),
						new Hose(1.75, 100)
					]),
										
				new DeliveryConfiguration(
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
	
				new DeliveryConfiguration(
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
	
				new DeliveryConfiguration(
					"Deck gun with 1 3/8\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/8
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new DeliveryConfiguration(
					"Deck gun with 1 1/2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 1/2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new DeliveryConfiguration(
					"Deck gun with 1 3/4\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 1 + 3/4
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new DeliveryConfiguration(
					"Deck gun with 2\" tip",
					[
						new Nozzle(
							{
								nozzleType: Nozzle.Types.MasterSmooth,
								diameter: 2
							}),
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)
					]),

				new DeliveryConfiguration(
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
				new DeliveryConfiguration(
					"1 3/4\" hand line fog nozzle (trash line, default setting)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogConventional_TrashLine, diameter: 1 + 1/2 })]),
				new DeliveryConfiguration(
					"1 3/4\" hand line fog nozzle (other than trash line)",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })]),
				new DeliveryConfiguration(
					"2 1/2\" hand line fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 2 + 1/2 })]),
				new DeliveryConfiguration(
					"Master stream fog nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterFog })]),

				new DeliveryConfiguration(
					"Smooth bore nozzle, 15/16\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 15/16 })]),															
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 1/8\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/8 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 1/4\" tip, at hand line pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 1/2\" tip, at 50 p.s.i.",
					[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/2 })]),

				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 1/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/4 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 3/8\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/8 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 1/2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/2 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 1 3/4\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/4 })]),
				new DeliveryConfiguration(
					"Smooth bore nozzle, 2\" tip, at master stream pressure",
					[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 2 })]),

	
				new DeliveryConfiguration(
					"Foam eductor",
					[new Nozzle({ nozzleType: Nozzle.Types.FoamEductor })]),
				new DeliveryConfiguration(
					"Cellar nozzle (backup engines)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E60/63" })]),
				new DeliveryConfiguration(
					"Cellar nozzle (E61)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E61" })]),
				new DeliveryConfiguration(
					"Cellar nozzle (E62)",
					[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E62" })]),
				new DeliveryConfiguration(
					"Piercing nozzle",
					[new Nozzle({ nozzleType: Nozzle.Types.Piercing })])
			])),
	
	new ConfigurationsGroup(
		"BASE_FRICTION_LOSS_ITEMS_COMMON",
		"Base Friction Loss Items (Common)",
		Object.freeze(
			[
				new DeliveryConfiguration("1 3/4\" hose at 150 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 150),
				new DeliveryConfiguration("1 3/4\" hose at 185 gallons per minute, per 100\'", [new Hose(1 + 3/4, 100)], 185),
				new DeliveryConfiguration("2 1/2\" hose at 250 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 250),
				new DeliveryConfiguration("2 1/2\" hose at 300 gallons per minute, per 100\'", [new Hose(2 + 1/2, 100)], 300),
				new DeliveryConfiguration("3\" hose at 150 gallons per minute, per 100\'", [new Hose(3, 100)], 150),
				new DeliveryConfiguration("3\" hose at 185 gallons per minute, per 100\'", [new Hose(3, 100)], 185),
				new DeliveryConfiguration("3\" hose at 250 gallons per minute, per 100\'", [new Hose(3, 100)], 250),
				new DeliveryConfiguration("3\" hose at 300 gallons per minute, per 100\'", [new Hose(3, 100)], 300),
				new DeliveryConfiguration("3\" hose at 400 gallons per minute, per 100\'", [new Hose(3, 100)], 400),
				new DeliveryConfiguration("3\" hose at 500 gallons per minute, per 100\'", [new Hose(3, 100)], 500),
				new DeliveryConfiguration("Aerial waterway (via direct inlet)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Inlet)]),
				new DeliveryConfiguration("Aerial waterway (from truck pump)", [new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Pump)]),
				new DeliveryConfiguration("Wye", [new IntermediateAppliance(IntermediateAppliance.Types.Wye)]),
				new DeliveryConfiguration("Siamese connection", [new IntermediateAppliance(IntermediateAppliance.Types.Siamese)]),
				new DeliveryConfiguration("Master stream device", [new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)]),
				new DeliveryConfiguration("Standpipe system", [new IntermediateAppliance(IntermediateAppliance.Types.Standpipe)])
			]))
];
GEVFC_ConfigurationsGroups.getById = function(id) { return this.find((configurationSet) => configurationSet.id === id); };
Object.freeze(GEVFC_ConfigurationsGroups);


export { GEVFC_ConfigurationsGroups };