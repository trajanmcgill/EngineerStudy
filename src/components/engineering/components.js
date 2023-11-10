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
		SectionStart: "SectionStart"
	});
})(); // end ComponentTypes enum definition


const SectionStart = (function()
{
	class SectionStart
	{
		#componentType;
		#description;

		constructor(description)
		{
			this.#componentType = ComponentTypes.SectionStart;
			this.#description = description;
		}

		get componentType() { return this.#componentType; }
		get description() { return this.#description; }
		get pressureContribution() { return 0; }

		duplicate(changes = {})
		{
			let isChanging = changes.match && changes.match(this);
			return new SectionStart(isChanging ? changes.description : this.#description);
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
		get description() { return Elevation.getElevationText(this.floorCount, false); }
		get descriptionVerbose() { return `elevation of ${Math.abs(this.floorCount)} floors ${this.floorCount >=0 ? "above" : "below"} ground level`; }
		get pressureContribution() { return this.floorCount * PSI_Per_Floor; }

		duplicate(transformationFunction = (elevation) => elevation.floorCount)
		{
			return new Elevation(transformationFunction(this));
		} // end duplicate()

		static getElevationText(floorCount, verbose = false)
		{
			if (verbose)
				return `elevation of ${Math.abs(floorCount)} floors ${floorCount >=0 ? "above" : "below"} ground level`;
			if (floorCount == -1)
				return "basement";
			if (floorCount == 0)
				return "ground floor";
			if (floorCount > 0)
				return `floor ${floorCount + 1}`;
			throw new Error(`Invalid floor count: ${floorCount}`);
		} // end getElevationText()
	} // end class Elevation


	return Object.freeze(Elevation);
})(); // end Elevation class definition and generation code


class ComponentChainLink
{
	#component;
	#next = [];
	#forcedFlowRate;
	#rememberedCalculatedFlowRate = null;

	constructor(component, forcedFlowRate = null)
	{
		this.#component = component;
		this.#forcedFlowRate = forcedFlowRate;
	} // end ComponentChainLink constructor

	get component() { return this.#component; }

	get next() { return this.#next; }
	set next(link) { this.#next = Array.isArray(link) ? link : [link]; }

	get flowRate()
	{
		if (this.#rememberedCalculatedFlowRate !== null)
			return this.#rememberedCalculatedFlowRate;

		if (this.#forcedFlowRate !== null)
			this.#rememberedCalculatedFlowRate = this.#forcedFlowRate;
		else if (this.#component.componentType === ComponentTypes.Nozzle)
			this.#rememberedCalculatedFlowRate = this.#component.flowRate;
		else
		{
			if (this.#next.length < 1)
				throw new Error("Invalid configuration: No nozzle; unable to determine flow rate.");

			this.#rememberedCalculatedFlowRate = 0;
			for (let nextLink of this.#next)
				this.#rememberedCalculatedFlowRate += nextLink.flowRate;
		}

		return this.#rememberedCalculatedFlowRate;
	} // end flowRate property get

	get pressureDelta()
	{
		let pressureContributionType = typeof this.#component.pressureContribution;
		if (pressureContributionType === "number")
			return this.#component.pressureContribution;
		else if (pressureContributionType === "function")
			return this.#component.pressureContribution(this.flowRate);
		else
			throw new Error(`Unable to determine pressure contribution of component ${this.#component.description}`);
	} // end pressureDelta property get

	get totalNeededPressure()
	{
		let totalPressure = this.pressureDelta;
		
		let forwardPressure = 0;
		for (let link of this.#next)
		{
			// In reality, if the line splits, we wouldn't want downstream components that require different pressures,
			// because you can only pump one pressure. For calculation purposes, we'll take the greatest downstream pressure.
			let linkPressure = link.totalNeededPressure;
			if (linkPressure > forwardPressure)
				forwardPressure = linkPressure;
		}
		totalPressure += forwardPressure;

		return totalPressure;
	} // end totalNeededPressure property get

	get downstreamElevation()
	{
		let elevations = this.allDownstreamElevations;
		if (elevations.length < 1)
			return 0;
		
		let returnValue = elevations[0];
		for (let i = 1; i < elevations.length; i++)
		{
			if (elevations[i] !== returnValue)
				throw new Error("Invalid configuration - multiple elevations specified and they do not match.");
		}
		return returnValue;
	} // end downstreamElevation property get

	get allDownstreamElevations()
	{
		let allElevations = (this.#component.componentType === ComponentTypes.Elevation) ? [this.#component.floorCount] : [];
		for (let link of this.#next)
			allElevations = allElevations.concat(link.allDownstreamElevations);
		return allElevations;
	} // end allDownstreamElevations property get


	findTailHose(diameter)
	{
		let foundHose = null;
		if (this.#component.componentType === ComponentTypes.Hose && this.#component.diameter === diameter)
			foundHose = this.#component;
		else if (this.#next.length === 1)
			foundHose = this.#next.findTailHose(diameter);

		return foundHose;
	} // end findTailHose()


	duplicate(changes, currentlyInTail = true)
	{
		let
		{
			forcedFlowRate,
			nozzleChanges,
			tailHoseTransformation,
			tailIntermediateApplianceChanges,
			elevationTransformation,
			sectionChanges
		} = changes;

		let duplicatedComponent;
		if (this.#component.componentType === ComponentTypes.Nozzle)
			duplicatedComponent = this.#component.duplicate(nozzleChanges)
		else if (this.#component.componentType === ComponentTypes.Hose)
			duplicatedComponent = this.#component.duplicate(currentlyInTail ? tailHoseTransformation : undefined);
		else if (this.#component.componentType === ComponentTypes.IntermediateAppliance)
			duplicatedComponent = this.#component.duplicate(currentlyInTail ? tailIntermediateApplianceChanges : {});
		else if (this.#component.componentType === ComponentTypes.Elevation)
			duplicatedComponent = this.#component.duplicate(elevationTransformation);
		else if (this.#component.componentType === ComponentTypes.SectionStart)
			duplicatedComponent = this.#component.duplicate(sectionChanges);
		else
			throw new Error("Unrecognized component type; unable to duplicate.");

		let duplicatedChainLink = new ComponentChainLink(duplicatedComponent, forcedFlowRate ?? this.#forcedFlowRate);
		
		let newNext = [];
		let nextStillInTail = currentlyInTail && (this.#next.length < 2);
		for (let nextLink of this.#next)
			newNext.push(nextLink.duplicate(changes, nextStillInTail));

		duplicatedChainLink.next = newNext;

		return duplicatedChainLink;
	} // end duplicate()


	static createStraightLineChain(componentsArray, forcedFlowRate = null)
	{
		if (componentsArray.length < 1)
			return null;

		let firstLink = new ComponentChainLink(componentsArray[0], forcedFlowRate),
			currentLink = firstLink;
		for (let i = 1; i < componentsArray.length; i++)
			currentLink = currentLink.next = new ComponentChainLink(componentsArray[i], forcedFlowRate);

		return firstLink;
	} // end static createStraightLineChain()
} // end class ComponentChainLink


class ComponentGroup
{
	#descriptionFunction;
	#componentChainStart = null;


	constructor(description, componentChainStart)
	{
		this.#descriptionFunction = (typeof description === "function") ? description : function() { return description; };
		this.#componentChainStart = componentChainStart;
	} // end ComponentGroup constructor


	static get MinAllowedFloorAboveGround() { return -1; }
	static get MaxAllowedFloorAboveGround() { return 5; }

	static get MinAllowed3Inch() { return 0; }
	static get MaxAllowed3Inch() { return 600; }
	static get Multiples_3Inch() { return 50; }

	static get MinAllowed5InchToStandpipe() { return 50; }
	static get MaxAllowed5InchToStandpipe() { return 1000; }
	static get Multiples_5Inch() { return 50; }

	get description() { return this.#descriptionFunction(); }
	get flowRate() { return this.#componentChainStart.flowRate; }
	get totalNeededPressure() { return this.#componentChainStart.totalNeededPressure; }
	get elevation() { return this.#componentChainStart.downstreamElevation; }
	get elevationText() { return Elevation.getElevationText(this.elevation); }

	
	getTailHoseText(diameter)
	{
		let matchingHose = this.#componentChainStart.findTailHose(diameter);
		if (matchingHose === null)
			throw new Error(`Unable to find tail hose with diameter ${diameter}.`);
		
		return matchingHose.description;
	} // end getTailHoseText()


	duplicate(componentChanges)
	{
		let newChainStart = this.#componentChainStart.duplicate(componentChanges);
		return new ComponentGroup(this.#descriptionFunction, newChainStart);
	}

} // end class ComponentGroup


export { ComponentTypes, Nozzle, Hose, IntermediateAppliance, Elevation, SectionStart, ComponentChainLink, ComponentGroup };