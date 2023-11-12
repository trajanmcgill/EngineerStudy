const Component = (function()
{
	const _ComponentTypes = Object.freeze(
		{
			Nozzle: "Nozzle",
			Hose: "Hose",
			IntermediateAppliance: "IntermediateAppliance",
			Elevation: "Elevation",
			SectionStart: "SectionStart"
		}); // end ComponentTypes enum definition


	class Component
	{
		#componentType;
		#descriptionFunction;
		#pressureContributionFunction

		constructor(componentType, descriptionFunction, pressureContributionFunction)
		{
			this.#componentType = componentType;
			this.#descriptionFunction = descriptionFunction;
			this.#pressureContributionFunction = pressureContributionFunction;
		}

		get componentType() { return this.#componentType; }
		get description() { return this.#descriptionFunction(); }
		get pressureContribution() { return this.#pressureContributionFunction(); }

		static get ComponentTypes() { return _ComponentTypes; }

		static diameterDescription(diameter)
		{
			let wholePart = Math.trunc(diameter);
			let fractionalPart = diameter - wholePart;
			let fractionalText;
		
			if (fractionalPart === 0)
				fractionalText = "";
			else if (fractionalPart % 0.5 === 0)
				fractionalText = "+1/2";
			else if (fractionalPart % 0.25 === 0)
				fractionalText = `+${fractionalPart / 0.25}/4`;
			else if (fractionalPart % 0.125 === 0)
				fractionalText = `+${fractionalPart / 0.125}/8`;
			else if (fractionalPart % 0.0625)
				fractionalText = `+${fractionalPart / 0.0625}/16`;
			else
				return `${diameter}\"`;
		
			return `${wholePart}${fractionalText}\"`;
		} // end static diameterDescription()
	}

	return Object.freeze(Component);
})(); // end Component class generation code


const SectionStart = (function()
{
	class SectionStart extends Component
	{
		#sectionName;

		constructor(sectionName)
		{
			const descriptionFunction = () => this.#sectionName;
			const pressureContributionFunction = () => 0;

			super(Component.ComponentTypes.SectionStart, descriptionFunction, pressureContributionFunction);
		}

		duplicate(changes = {})
		{
			let isChanging = changes.match && changes.match(this);
			return new SectionStart(isChanging ? changes.sectionName : this.#sectionName);
		}
	} // end class SectionStart


	return Object.freeze(SectionStart);
})(); // end SectionStart class generation code


const Nozzle = (function()
{
	const NozzleTypes = Object.freeze(
	{
		HandSmooth: Object.freeze(
		{
			description: "smoothbore nozzle (hand line pressure)",
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
			description: "fog nozzle (hand line, conventional, GEVFC trash line setting)",
			nozzlePressure: 100,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 125 }])
		}),
		HandFogLowPressure: Object.freeze(
		{
			description: "fog nozzle (hand line, low pressure)",
			nozzlePressure: 75,
			flowRates: Object.freeze(
			[
				{ diameter: 1+1/2, flowRate: 150},
				{ diameter: 2+1/2, flowRate: 250}
			])
		}),
		MasterSmooth: Object.freeze(
		{
			description: "smooth bore nozzle (master stream pressure)",
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
			description: "smooth bore nozzle (master stream, reduced pressure)",
			nozzlePressure: 50,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 500 }])
		}),
		MasterFog: Object.freeze(
		{
			description: "fog nozzle (master stream)",
			nozzlePressure: 100,
			flowRate: 1000
		}),
		Cellar: Object.freeze(
		{
			description: "cellar nozzle",
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
			description: "piercing nozzle",
			nozzlePressure: 100,
			flowRate: 125
		}),
		/* ADD CODE HERE
		SprinklerSystem:
		{},
		*/
		FoamEductor: Object.freeze(
		{
			description: "foam eductor",
			nozzlePressure: 200,
			flowRate: 125
		})
	}); // end NozzleTypes definition


	class Nozzle extends Component
	{
		#nozzleType;
		#diameter;
		#identifier;
		#flowRateFunction;

		constructor(nozzleDefinition)
		{
			const descriptionFunction =
				nozzleDefinition.diameter !== undefined
				? () => { return `a ${Component.diameterDescription(this.#diameter)} ${this.#nozzleType.description}`; }
				: () => { return `a ${this.#nozzleType.description}`; };
			const pressureContributionFunction = () => this.#nozzleType.nozzlePressure;

			super(Component.ComponentTypes.Nozzle, descriptionFunction, pressureContributionFunction);
			
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

		get nozzleType() { return this.#nozzleType; }
		get flowRate() { return this.#flowRateFunction(); }

		duplicate(changes = {})
		{
			let isChanging = changes.match && changes.match(this);
			return new Nozzle(
				{
					nozzleType: isChanging ? (changes.nozzleType ?? this.#nozzleType) : this.#nozzleType,
					diameter: isChanging ? (changes.diameter ?? this.#diameter) : this.#diameter,
					identifier: isChanging ? (changes.identifier ?? this.#identifier) : this.#identifier
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

	class Hose extends Component
	{
		#diameter;
		length;
		#frictionLossTable;
	
		constructor(diameter, length)
		{
			const descriptionFunction = () => `${this.length}\' of ${Component.diameterDescription(this.#diameter)} hose`;
			const pressureContributionFunction = function()
			{
				let thisObject = this;
				return ((flowRate) => thisObject.getFrictionLoss(flowRate));
			};

			super(Component.ComponentTypes.Hose, descriptionFunction, pressureContributionFunction);
			this.length = length;
			this.#diameter = diameter;
			this.#frictionLossTable = HoseFrictionLossTables.find((frictionLossTable) => frictionLossTable.diameter === diameter);
		}

		get diameter() { return this.#diameter; }
		
		getFrictionLoss(flowRate)
		{
			let precalculatedValue = this.#frictionLossTable.precalculatedFrictionLosses.find((entry) => entry.flowRate === flowRate);
			if (precalculatedValue === undefined)
				return this.#frictionLossTable.formulaPer100Feet(flowRate) * this.length / 100;
			else
				return precalculatedValue.frictionLossPer100ft * this.length / 100;
		} // end getFrictionLoss()

		duplicate(transformationFunction = (hose) => ({ diameter: hose.diameter, length: hose.length }))
		{
			let { diameter: newDiameter, length: newLength } = transformationFunction(this);
			return new Hose(newDiameter, newLength);
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
		Wye: Object.freeze(new IntermediateApplianceType("Wye", "a wye", 10)),
		Siamese: Object.freeze(new IntermediateApplianceType("Siamese", "a Siamese Connection", 10)),
		MasterStreamDevice: Object.freeze(new IntermediateApplianceType("MasterStreamDevice", "a master stream device", 20)),
		Standpipe: Object.freeze(new IntermediateApplianceType("Standpipe", "a standpipe", 25)),
		AerialWaterway_Inlet: Object.freeze(new IntermediateApplianceType("AerialWaterway_Inlet", "an aerial waterway (from direct intake)", 60)),
		AerialWaterway_Pump: Object.freeze(new IntermediateApplianceType("AerialWaterway_Pump", "an aerial waterway (from pump)", 80))
	}); // end IntermediateApplianceTypes definition


	class IntermediateAppliance extends Component
	{
		#intermediateApplianceType;

		static get Types() { return IntermediateApplianceTypes; }

		constructor(type)
		{
			const descriptionFunction = () => this.#intermediateApplianceType.description;
			const pressureContributionFunction = () => this.#intermediateApplianceType.frictionLoss;

			super(Component.ComponentTypes.IntermediateAppliance, descriptionFunction, pressureContributionFunction);
			this.#intermediateApplianceType = type;
		}

		get intermediateApplianceType() { return this.#intermediateApplianceType.id; }

		duplicate(changes = {})
		{
			let isChanging = changes.match && changes.match(this);
			return new IntermediateAppliance(
				isChanging ? (changes.type ?? this.#intermediateApplianceType) : this.#intermediateApplianceType);
		} // end duplicate()

	} // end class IntermediateAppliance

	return Object.freeze(IntermediateAppliance);
})(); // end IntermediateAppliance class definition and generation code


const Elevation = (function()
{
	const PSI_Per_Floor = 5;

	class Elevation extends Component
	{
		floorCount;

		constructor(floorCount)
		{
			const descriptionFunction = () => Elevation.getElevationText(this.floorCount, false);
			const pressureContributionFunction = () => this.floorCount * PSI_Per_Floor;

			super(Component.ComponentTypes.Elevation, descriptionFunction, pressureContributionFunction);
			this.floorCount = floorCount;
		}

		//get descriptionVerbose() { return `elevation of ${Math.abs(this.floorCount)} floors ${this.floorCount >=0 ? "above" : "below"} ground level`; }

		duplicate(transformationFunction = (elevation) => elevation.floorCount)
		{
			return new Elevation(transformationFunction(this));
		} // end duplicate()

		static getElevationText(floorCount, verbose = false)
		{
			if (verbose)
				return `an elevation of ${Math.abs(floorCount)} floors ${floorCount >=0 ? "above" : "below"} ground level`;
			if (floorCount == -1)
				return "the basement";
			if (floorCount == 0)
				return "the ground floor";
			if (floorCount > 0)
				return `floor ${floorCount + 1}`;
			throw new Error(`Invalid floor count: ${floorCount}`);
		} // end getElevationText()
	} // end class Elevation


	return Object.freeze(Elevation);
})(); // end Elevation class definition and generation code


export { Component, Nozzle, Hose, IntermediateAppliance, Elevation, SectionStart };