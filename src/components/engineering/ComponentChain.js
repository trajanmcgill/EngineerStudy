import { Component, SectionStart, Nozzle, Hose, IntermediateAppliance, Elevation } from "./Component";


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


	#calculateFlowRate()
	{
		if (this.#forcedFlowRate !== null)
			this.#rememberedCalculatedFlowRate = this.#forcedFlowRate;
		else if (this.#component.componentType === Component.ComponentTypes.Nozzle)
			this.#rememberedCalculatedFlowRate = this.#component.flowRate;
		else
		{
			if (this.#next.length < 1)
				throw new Error("Invalid configuration: No nozzle; unable to determine flow rate.");

			this.#rememberedCalculatedFlowRate = 0;
			for (let nextLink of this.#next)
				this.#rememberedCalculatedFlowRate += nextLink.flowRate;
		}
	} // end #calculateFlowRate()


	get flowRate()
	{
		if (this.#rememberedCalculatedFlowRate === null)
			this.#calculateFlowRate();
		
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


	get allChainLinksFromHere()
	{
		let chainLinks = [this];

		// Add those further downstream. Note that if the chain splits (there are two or more components directly after this one),
		// we follow only one side of the split, assuming that both sides match, which really they should for any proper configuration.
		if (this.#next.length > 0)
			chainLinks = chainLinks.concat(this.#next[0].allChainLinksFromHere);

		return chainLinks;
	} // end allChainLinksFromHere property get


	get individualDownstreamNumbers()
	{
		if (this.#rememberedCalculatedFlowRate === null)
			this.#calculateFlowRate();

		let allDownstreamNumbers = [{ chainLink: this, flowRate: this.#rememberedCalculatedFlowRate, pressureDelta: this.pressureDelta }];

		// Add those further downstream. Note that if the chain splits (there are two or more components directly after this one),
		// we follow only the first one, assuming that both sides match, which really they should for any proper configuration.
		if (this.#next.length > 0)
			allDownstreamNumbers = allDownstreamNumbers.concat(this.#next[0].individualDownstreamNumbers);

		return allDownstreamNumbers;
	} // end individualDownstreamNumbers()


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
		let allElevations = (this.#component.componentType === Component.ComponentTypes.Elevation) ? [this.#component.floorCount] : [];
		for (let link of this.#next)
			allElevations = allElevations.concat(link.allDownstreamElevations);
		return allElevations;
	} // end allDownstreamElevations property get


	findTailHose(diameter)
	{
		let foundHose = null;
		if (this.#component.componentType === Component.ComponentTypes.Hose && this.#component.diameter === diameter)
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
		if (this.#component.componentType === Component.ComponentTypes.Nozzle)
			duplicatedComponent = this.#component.duplicate(nozzleChanges)
		else if (this.#component.componentType === Component.ComponentTypes.Hose)
			duplicatedComponent = this.#component.duplicate(currentlyInTail ? tailHoseTransformation : undefined);
		else if (this.#component.componentType === Component.ComponentTypes.IntermediateAppliance)
			duplicatedComponent = this.#component.duplicate(currentlyInTail ? tailIntermediateApplianceChanges : {});
		else if (this.#component.componentType === Component.ComponentTypes.Elevation)
			duplicatedComponent = this.#component.duplicate(elevationTransformation);
		else if (this.#component.componentType === Component.ComponentTypes.SectionStart)
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


class ComponentChain
{
	#descriptionFunction;
	#componentChainStart = null;


	constructor(description, componentChainStart)
	{
		this.#descriptionFunction = (typeof description === "function") ? description : function() { return description; };
		this.#componentChainStart = componentChainStart;
	} // end ComponentChain constructor


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
	get allChainLinks() { return this.#componentChainStart.allChainLinksFromHere; }
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
		return new ComponentChain(this.#descriptionFunction, newChainStart);
	}

} // end class ComponentChain


export { ComponentChainLink, ComponentChain };
