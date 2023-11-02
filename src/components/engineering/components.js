function diameterDescription(diameter)
{
	let wholePart = Math.trunc(diameter);
	let fractionalPart = diameter - wholePart;
	let fractionalText;

	if (fractionalPart === 0)
		fractionalText = "";
	else if (fractionalPart % 0.5 === 0)
		fractionalText = " 1/2";
	else if (fractionalPart % 0.25 === 0)
		fractionalPart = ` ${fractionalPart / 0.25}/4`;
	else if (fractionalPart % 0.125 === 0)
		fractionalPart = ` ${fractionalPart / 0.125}/8`;
	else
		return `${diameter}\"`;

	return `${wholePart}${fractionalText}\"`;
}


const ComponentTypes = (function()
{
	return Object.freeze(
	{
		Nozzle: "Nozzle",
		Hose: "Hose",
		IntermediateAppliance: "IntermediateAppliance",
		Elevation: "Elevation",
		ComponentGroup: "ComponentGroup"
	});
})(); // end ComponentTypes enum definition


const Nozzle = (function()
{
	const NozzleTypes = Object.freeze(
	{
		HandSmooth: Object.freeze(
		{
			description: "Smoothbore (hand line)",
			nozzlePressure: 50,
			flowRates: Object.freeze(
			[
				{ diameter: 15/16, flowRate: 185 },
				{ diameter: 1, flowRate: 200 },
				{ diameter: 1+1/8, flowRate: 250 },
				{ diameter: 1+1/4, flowRate: 300 },
				{ diameter: 1+3/8, flowRate: 400 },
				{ diameter: 1+1/2, flowRate: 500 }
			])
		}),
		HandFogConventional_TrashLine: Object.freeze(
		{
			description: "Fog nozzle (hand line, conventional, GEVFC trash line setting)",
			nozzlePressure: 100,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 125 }])
		}),
		HandFogLowPressure: Object.freeze(
		{
			description: "Fog nozzle (hand line, low pressure)",
			nozzlePressure: 75,
			flowRates: Object.freeze(
			[
				{ diameter: 1+1/2, flowRate: 150},
				{ diameter: 2+1/2, flowRate: 250}
			])
		}),
		MasterSmooth: Object.freeze(
		{
			description: "Smooth bore (master stream)",
			nozzlePressure: 80,
			flowRates: Object.freeze(
			[
				{ diameter: 1+1/4, flowRate: 400 },
				{ diameter: 1+3/8, flowRate: 500 },
				{ diameter: 1+1/2, flowRate: 600 },
				{ diameter: 1+3/4, flowRate: 800 },
				{ diameter: 2, flowRate: 1000 }
			])
		}),
		MasterSmoothReducedPressure: Object.freeze(
		{
			description: "Smooth bore (master stream, reduced pressure)",
			nozzlePressure: 50,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 500 }])
		}),
		MasterFog: Object.freeze(
		{
			description: "Fog nozzle (master stream)",
			nozzlePressure: 100,
			flowRate: 1000
		}),
		Cellar: Object.freeze(
		{
			description: "Cellar nozzle",
			nozzlePressure: 100,
			flowRates: Object.freeze(
			[
				{ identifier: "E60/63", flowRate: 350 },
				{ identifier: "E61", flowRate: 400 },
				{ identifier: "E62", flowRate: 500 }
			])
		}),
		Piercing: Object.freeze(
		{
			description: "Piercing nozzle",
			nozzlePressure: 100,
			flowRate: 125
		}),
		/* ADD CODE HERE
		SprinklerSystem:
		{},
		*/
		FoamEductor: Object.freeze(
		{
			description: "Foam eductor",
			nozzlePressure: 200,
			flowRate: 125
		})
	}); // end NozzleTypes definition


	class Nozzle
	{
		#componentType;
		#nozzleType;
		#diameter;
		#identifier;
		#flowRateFunction;

		constructor(nozzleDefinition)
		{
			this.#componentType = ComponentTypes.Nozzle;
			this.#nozzleType = nozzleDefinition.nozzleType;
			this.#diameter = nozzleDefinition.diameter;
			this.#identifier = nozzleDefinition.identifier;

			if (this.#nozzleType.flowRate !== undefined)
				this.#flowRateFunction = () => this.#nozzleType.flowRate;
			else if (this.#identifier !== undefined)
				this.#flowRateFunction = () => this.#nozzleType.flowRates.find((flowRate) => flowRate.identifier === this.#identifier).flowRate;
			else if (this.#diameter !== undefined)
				this.#flowRateFunction = () => this.#nozzleType.flowRates.find((flowRate) => flowRate.diameter === this.#diameter).flowRate;
			else
				throw new Error("Unable to determine flow rate.");
		}

		static get Types() { return NozzleTypes; }

		get componentType() { return this.#componentType; }
		get nozzleType() { return this.#nozzleType; }
		get description() { return this.#nozzleType.description; }
		get flowRate() { return this.#flowRateFunction(); }
		get pressureContribution() { return this.#nozzleType.nozzlePressure; }

		duplicate(changes = {})
		{
			return new Nozzle(
			{
				nozzleType: changes.nozzleType ?? this.#nozzleType,
				diameter: changes.diameter ?? this.#diameter,
				identifier: changes.identifier ?? this.#identifier
			});
		} // end duplicate()

	} // end class Nozzle


	return Object.freeze(Nozzle);
})(); // end Nozzle class generation code


const Hose = (function()
{
	const HoseFrictionLossTables =
	[
		{
			diameter: 1.75,
			precalculatedFrictionLosses:
				[
					{ flowRate: 100, frictionLossPer100ft: 20 },
					{ flowRate: 125, frictionLossPer100ft: 26 },
					{ flowRate: 150, frictionLossPer100ft: 32 },
					{ flowRate: 185, frictionLossPer100ft: 44 },
					{ flowRate: 200, frictionLossPer100ft: 50 },
					{ flowRate: 250, frictionLossPer100ft: 72 }
				],
			formulaPer100Feet: function(flowRate)
				{
					let Q = flowRate / 100;
					return (10 * Q * Q) + 10;
				}
		},
		{
			diameter: 2.5,
			precalculatedFrictionLosses:
				[
					{ flowRate: 100, frictionLossPer100ft: 3 },
					{ flowRate: 125, frictionLossPer100ft: 5 },
					{ flowRate: 150, frictionLossPer100ft: 6 },
					{ flowRate: 200, frictionLossPer100ft: 10 },
					{ flowRate: 250, frictionLossPer100ft: 15 },
					{ flowRate: 300, frictionLossPer100ft: 21 },
					{ flowRate: 350, frictionLossPer100ft: 28 },
					{ flowRate: 400, frictionLossPer100ft: 36 },
					{ flowRate: 500, frictionLossPer100ft: 55 }
				],
			formulaPer100Feet: function(flowRate)
				{
					let Q = flowRate / 100;
					return (2 * Q * Q) + Q;
				}
		},
		{
			diameter: 3,
			precalculatedFrictionLosses:
				[
					{ flowRate: 150, frictionLossPer100ft: 2 },
					{ flowRate: 185, frictionLossPer100ft: 3 },
					{ flowRate: 200, frictionLossPer100ft: 4 },
					{ flowRate: 250, frictionLossPer100ft: 6 },
					{ flowRate: 300, frictionLossPer100ft: 8 },
					{ flowRate: 350, frictionLossPer100ft: 11 },
					{ flowRate: 400, frictionLossPer100ft: 14 },
					{ flowRate: 500, frictionLossPer100ft: 22 },
					{ flowRate: 600, frictionLossPer100ft: 31 },
					{ flowRate: 700, frictionLossPer100ft: 42 },
					{ flowRate: 800, frictionLossPer100ft: 54 }
				],
			formulaPer100Feet: function(flowRate)
			{
				let Q = flowRate / 100;
				return ((2 * Q * Q) + Q) * .4;
			}
		},
		{
			diameter: 5,
			precalculatedFrictionLosses:
				[
					{ flowRate: 500, frictionLossPer100ft: 2 },
					{ flowRate: 600, frictionLossPer100ft: 2 },
					{ flowRate: 700, frictionLossPer100ft: 3 },
					{ flowRate: 800, frictionLossPer100ft: 4 },
					{ flowRate: 900, frictionLossPer100ft: 5 },
					{ flowRate: 1000, frictionLossPer100ft: 7 }
				],
			formulaPer100Feet: function(flowRate)
			{
				let Q = flowRate / 100;
				return ((2 * Q * Q) + Q) * .031;
			}
		},
	]; // end HoseFrictionLossTables array


	class Hose
	{
		#componentType;
		#diameter;
		length;
		#frictionLossTable;
	

		constructor(diameter, length)
		{
			this.#componentType = ComponentTypes.Hose;
			this.length = length;
			this.#diameter = diameter;
			this.#frictionLossTable = HoseFrictionLossTables.find((frictionLossTable) => frictionLossTable.diameter === diameter);
		}
		

		get componentType() { return this.#componentType; }
		get description() { return `${this.length}\' of ${diameterDescription(this.#diameter)} hose` }
		get diameter() { return this.#diameter; }
	
		
		getFrictionLoss(flowRate)
		{
			let precalculatedValue = this.#frictionLossTable.precalculatedFrictionLosses.find((entry) => entry.flowRate === flowRate);
			if (precalculatedValue === undefined)
				return this.#frictionLossTable.formulaPer100Feet(flowRate) * this.length / 100;
			else
				return precalculatedValue.frictionLossPer100ft * this.length / 100;
		}
		

		get pressureContribution()
		{
			let thisObject = this;
			return ((flowRate) => thisObject.getFrictionLoss(flowRate));
		}


		duplicate(changes = {})
		{
			return new Hose(changes.diameter ?? this.#diameter, changes.length ?? this.length);
		} // end duplicate()

	} // end class Hose

	return Object.freeze(Hose);
})(); // end Hose class definition and generation code


const IntermediateAppliance = (function()
{
	class IntermediateApplianceType
	{
		#id;
		#description;
		#frictionLoss;

		constructor(id, description, frictionLoss)
		{
			this.#id = id;
			this.#description = description;
			this.#frictionLoss = frictionLoss;
		}

		get id() { return this.#id; }
		get description() { return this.#description; }
		get frictionLoss() { return this.#frictionLoss; }
	} // end class IntermediateApplianceType


	const IntermediateApplianceTypes = Object.freeze(
	{
		Wye: Object.freeze(new IntermediateApplianceType("Wye", "Wye", 10)),
		Siamese: Object.freeze(new IntermediateApplianceType("Siamese", "Siamese Connection", 10)),
		MasterStreamDevice: Object.freeze(new IntermediateApplianceType("MasterStreamDevice", "Master Stream Device", 20)),
		Standpipe: Object.freeze(new IntermediateApplianceType("Standpipe", "Standpipe", 25)),
		AerialWaterway_Inlet: Object.freeze(new IntermediateApplianceType("AerialWaterway_Inlet", "Aerial Waterway (from direct intake)", 60)),
		AerialWaterway_Pump: Object.freeze(new IntermediateApplianceType("AerialWaterway_Pump", "Aerial Waterway (from pump)", 80))
	}); // end IntermediateApplianceTypes definition


	class IntermediateAppliance
	{
		#componentType;
		#intermediateApplianceType;

		static get Types() { return IntermediateApplianceTypes; }

		constructor(type)
		{
			this.#componentType = ComponentTypes.IntermediateAppliance;
			this.#intermediateApplianceType = type;
		}

		get componentType() { return this.#componentType; }
		get intermediateApplianceType() { return this.#intermediateApplianceType.id; }
		get description() { return this.#intermediateApplianceType.description; }
		get pressureContribution() { return this.#intermediateApplianceType.frictionLoss; }

		duplicate(changes = {})
		{
			return new IntermediateAppliance(changes.type ?? this.#intermediateApplianceType);
		} // end duplicate()

	} // end class IntermediateAppliance

	return Object.freeze(IntermediateAppliance);
})(); // end IntermediateAppliance class definition and generation code


const Elevation = (function()
{
	const PSI_Per_Floor = 5;

	class Elevation
	{
		#componentType;
		floorCount;

		constructor(floorCount)
		{
			this.#componentType = ComponentTypes.Elevation;
			this.floorCount = floorCount;
		}

		get componentType() { return this.#componentType; }
		get description() { return `elevation of ${Math.abs(this.floorCount)} floors ${this.floorCount >=0 ? "above" : "below"} ground level`; }
		get pressureContribution() { return this.floorCount * PSI_Per_Floor; }

		duplicate(changes = {})
		{
			return new Elevation(changes.floorCount ?? this.floorCount);
		} // end duplicate()

	} // end class Elevation


	return Object.freeze(Elevation);
})(); // end Elevation class definition and generation code


class ComponentGroup
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
	} // end ComponentGroup constructor


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

} // end class ComponentGroup


export { ComponentTypes, Nozzle, Hose, IntermediateAppliance, Elevation, ComponentGroup };