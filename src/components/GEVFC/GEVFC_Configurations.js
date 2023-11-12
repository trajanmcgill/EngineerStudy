import { ConfigurationsSet } from "../engineering/configurationsSet";
import { Component, Nozzle, Hose, IntermediateAppliance, Elevation, SectionStart, ComponentChainLink, ComponentGroup } from "../engineering/component";

const GEVFC_ConfigurationsSets =
[
	new ConfigurationsSet(
		"GEVFC_BASE_CONFIGURATIONS",
		"GEVFC Base Configurations",
		Object.freeze(
			[
				new ComponentGroup(
					function() { return `1 3/4\" crosslay to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(1.75, 200),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
					])),

				new ComponentGroup(
					function() { return `2 1/2\" crosslay to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(2.5, 200),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })
					])),

				new ComponentGroup(
					function() { return `1 3/4\" skid load with ${this.getTailHoseText(3)}, to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new SectionStart("Total skid load assembly by itself"),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(1.75, 150),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
					]))/*,

				new ComponentGroup(
					function() { return `1 3/4\" skid load with ${this.getTailHoseText(3)}, to ${this.elevationText}, with a 2nd hand line (high rise pack) also attached at the wye`; },
					(function ()
					{
						let chainStart = new ComponentChainLink(new Hose(3, 0));
						let elevation = chainStart.next = new ComponentChainLink(new Elevation(0));
						let wye = elevation.next = new ComponentChainLink(new IntermediateAppliance(IntermediateAppliance.Types.Wye));
						let handline1 = ComponentChainLink.createStraightLineChain(
							[
								new Hose(1.75, 150),
								new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
							]);
						let handline2 = ComponentChainLink.createStraightLineChain(
							[
								new Hose(1.75, 150),
								new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
							]);
						wye.next = [handline1, handline2];
						return chainStart;
					})()),

				new ComponentGroup(
					function() { return `1 3/4\" skid load with fog tip removed and ${this.getTailHoseText(3)}, to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(1.75, 150),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 15/16 })
					])),

				new ComponentGroup(
					function() { return `2 1/2\" skid load with default tip and ${this.getTailHoseText(3)}, to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new Hose(2.5, 150),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/8 })
					])),

				new ComponentGroup(
					function() { return `2 1/2\" skid load with 1 1/4\" tip and ${this.getTailHoseText(3)}, to ${this.elevationText}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new Hose(2.5, 150),
						new Elevation(0),
						new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })
					])),

				new ComponentGroup(
					function() { return `Blitzfire with 1 1/4\" tip and ${this.getTailHoseText(3)}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/4 })
					])),

				new ComponentGroup(
					function() { return `Blitzfire with 1 1/2\" tip and ${this.getTailHoseText(3)}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(3, 0),
						new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/2 })
					])),
	
				new ComponentGroup(
					"Trash line (default setting)",
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(1.75, 100),
						new Nozzle({ nozzleType: Nozzle.Types.HandFogConventional_TrashLine, diameter: 1 + 1/2 })
					])),
										
				new ComponentGroup(
					"High-rise pack by itself",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(1.75, 150),
						new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
					])),
	
				new ComponentGroup(
					function() { return `High-rise pack on standpipe, to ${this.elevationText}, supplied by ${this.getTailHoseText(5)}`; },
					ComponentChainLink.createStraightLineChain(
					[
						new Hose(5, 0),
						new IntermediateAppliance(IntermediateAppliance.Types.Standpipe),
						new Elevation(0),
						new IntermediateAppliance(IntermediateAppliance.Types.Wye),
						new Hose(1.75, 150),
						new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })
					])),
	
				new ComponentGroup(
					"Deck gun with 1 3/8\" tip",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice),
						new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/8 })
					])),

				new ComponentGroup(
					"Deck gun with 1 1/2\" tip",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice),
						new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/2 })
					])),

				new ComponentGroup(
					"Deck gun with 1 3/4\" tip",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice),
						new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/4 })
					])),

				new ComponentGroup(
					"Deck gun with 2\" tip",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice),
						new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 2 })
					])),

				new ComponentGroup(
					"Deck gun with fog nozzle",
					ComponentChainLink.createStraightLineChain(
					[
						new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice),
						new Nozzle({ nozzleType: Nozzle.Types.MasterFog })						
					]))*/
			])),

	new ConfigurationsSet(
		"NOZZLES_ALONE",
		"Nozzles Alone",
		Object.freeze(
			[
				new ComponentGroup(
					"1 3/4\" hand line fog nozzle (trash line, default setting)",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandFogConventional_TrashLine, diameter: 1 + 1/2 })])),
				new ComponentGroup(
					"1 3/4\" hand line fog nozzle (other than trash line)",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 1 + 1/2 })])),
				new ComponentGroup(
					"2 1/2\" hand line fog nozzle",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandFogLowPressure, diameter: 2 + 1/2 })])),
				new ComponentGroup(
					"Master stream fog nozzle",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterFog })])),

				new ComponentGroup(
					"Smooth bore nozzle, 15/16\" tip, at hand line pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 15/16 })])),															
				new ComponentGroup(
					"Smooth bore nozzle, 1\" tip, at hand line pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/8\" tip, at hand line pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/8 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/4\" tip, at hand line pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/4 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/2\" tip, at 50 p.s.i.",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.HandSmooth, diameter: 1 + 1/2 })])),

				new ComponentGroup(
					"Smooth bore nozzle, 1 1/4\" tip, at master stream pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/4 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 3/8\" tip, at master stream pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/8 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 1/2\" tip, at master stream pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 1/2 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 1 3/4\" tip, at master stream pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 1 + 3/4 })])),
				new ComponentGroup(
					"Smooth bore nozzle, 2\" tip, at master stream pressure",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.MasterSmooth, diameter: 2 })])),

	
				new ComponentGroup(
					"Foam eductor",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.FoamEductor })])),
				new ComponentGroup(
					"Cellar nozzle (backup engines)",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E60/63" })])),
				new ComponentGroup(
					"Cellar nozzle (E61)",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E61" })])),
				new ComponentGroup(
					"Cellar nozzle (E62)",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.Cellar, identifier: "E62" })])),
				new ComponentGroup(
					"Piercing nozzle",
					ComponentChainLink.createStraightLineChain(
						[new Nozzle({ nozzleType: Nozzle.Types.Piercing })]))
			])),
	
	new ConfigurationsSet(
		"BASE_FRICTION_LOSS_ITEMS_COMMON",
		"Base Friction Loss Items (Common)",
		Object.freeze(
			[
				new ComponentGroup(
					"1 3/4\" hose at 150 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(1 + 3/4, 100)], 150)),
				new ComponentGroup(
					"1 3/4\" hose at 185 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(1 + 3/4, 100)], 185)),
				new ComponentGroup(
					"2 1/2\" hose at 250 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(2 + 1/2, 100)], 250)),
				new ComponentGroup(
					"2 1/2\" hose at 300 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(2 + 1/2, 100)], 300)),
				new ComponentGroup(
					"3\" hose at 150 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 150)),
				new ComponentGroup(
					"3\" hose at 185 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 185)),
				new ComponentGroup(
					"3\" hose at 250 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 250)),
				new ComponentGroup(
					"3\" hose at 300 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 300)),
				new ComponentGroup(
					"3\" hose at 400 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 400)),
				new ComponentGroup(
					"3\" hose at 500 gallons per minute, per 100\'",
					ComponentChainLink.createStraightLineChain([new Hose(3, 100)], 500)),
				new ComponentGroup(
					"Aerial waterway (via direct inlet)",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Inlet)])),
				new ComponentGroup(
					"Aerial waterway (from truck pump)",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.AerialWaterway_Pump)])),
				new ComponentGroup(
					"Wye",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.Wye)])),
				new ComponentGroup(
					"Siamese connection",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.Siamese)])),
				new ComponentGroup(
					"Master stream device",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.MasterStreamDevice)])),
				new ComponentGroup(
					"Standpipe system",
					ComponentChainLink.createStraightLineChain([new IntermediateAppliance(IntermediateAppliance.Types.Standpipe)]))
			]))
];
GEVFC_ConfigurationsSets.getById = function(id) { return this.find((configurationSet) => configurationSet.id === id); };
Object.freeze(GEVFC_ConfigurationsSets);


export { GEVFC_ConfigurationsSets };