const ComponentTypes = (function()
{
	return Object.freeze(
	{
		Nozzle: 1,
		Hose: 2,
		Pipe: 3,
		Appliance: 4,
		Adapter: 5
	});
})(); // end ComponentTypes enum definition


const Nozzle = (function()
{
	const NozzleTypes = Object.freeze(
	{
		HandSmooth:
		{
			description: "Smoothbore (hand line)",
			nozzlePressure: 50,
			flowRates: Object.freeze(
			[
				{ diameter: 15/16, flowRate: 185 },
				{ diameter: 1, flowRate: 200 },
				{ diameter: 1+1/8, flowRate: 250 },
				{ diameter: 1+1/4, flowRate: 300 }
			])
		},
		HandFogConventional_TrashLine:
		{
			description: "Fog nozzle (hand line, conventional, GEVFC trash line setting)",
			nozzlePressure: 100,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 125 }])
		},
		HandFogLowPressure:
		{
			description: "Fog nozzle (hand line, low pressure)",
			nozzlePressure: 75,
			flowRates: Object.freeze(
			[
				{ diameter: 1+1/2, flowRate: 150},
				{ diameter: 2+1/2, flowRate: 250}
			])
		},
		MasterSmooth:
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
		},
		MasterSmoothReducedPressure:
		{
			description: "Smooth bore (master stream, reduced pressure)",
			nozzlePressure: 50,
			flowRates: Object.freeze([{ diameter: 1+1/2, flowRate: 500 }])
		},
		MasterFog:
		{
			description: "Fog nozzle (master stream)",
			nozzlePressure: 100,
			flowRate: 1000
		},
		Cellar:
		{
			description: "Cellar nozzle",
			nozzlePressure: 100,
			flowRates: Object.freeze(
			[
				{ identifier: "E60/63", flowRate: 350 },
				{ identifier: "E61", flowRate: 400 },
				{ identifier: "E62", flowRate: 500 }
			])
		},
		/*
		Piercing:
		{
			description: "Piercing nozzle",
			nozzlePressure: 100
		},
		*/
		FoamEductor:
		{
			description: "Foam eductor",
			nozzlePressure: 200,
			flowRate: 125
		}
	});

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

			if (this.#identifier !== undefined)
				this.#flowRateFunction = () => this.#nozzleType.flowRates.find((flowRate) => flowRate.identifier === this.#identifier).flowRate;
			else if (this.#diameter !== undefined)
				this.#flowRateFunction = () => this.#nozzleType.flowRates.find((flowRate) => flowRate.diameter === this.#diameter).flowRate;
			else
				this.#flowRateFunction = () => this.#nozzleType.flowRate;
		}

		static get Types() { return NozzleTypes; }

		get componentType() { return this.#componentType; }
		get nozzleType() { return this.#nozzleType; }
		get description() { return this.#nozzleType.description; }
		get flowRate() { return this.#flowRateFunction(); }
		get pressure() { return this.#nozzleType.nozzlePressure; }
	}

	return Object.freeze(Nozzle);
})(); // end Nozzle class definition


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
	];

	class Hose
	{
		#componentType;
		#diameter;
		#length;
		#frictionLossTable;
	
		constructor(diameter, length)
		{
			this.#componentType = ComponentTypes.Hose;
			this.#length = length;
			this.#diameter = diameter;
			this.#frictionLossTable = HoseFrictionLossTables.find((frictionLossTable) => frictionLossTable.diameter === diameter);
		}
		
		get componentType() { return this.#componentType; }
		get diameter() { return this.#diameter; }
		get length() { return this.#length; }
		get description() { return `${this.#length} feet of ${this.#diameter.description} hose` }
	
		getFrictionLoss(flowRate)
		{
			let precalculatedValue = this.#frictionLossTable.precalculatedFrictionLosses.find((entry) => entry.flowRate === flowRate);
			if (precalculatedValue === undefined)
				return this.#frictionLossTable.formulaPer100Feet(flowRate) * this.#length / 100;
			else
				return precalculatedValue.frictionLossPer100ft * this.#length / 100;
		}
	} // end class Hose

	return Object.freeze(Hose);
})(); // end Hose class definition


const BasicSetups = (function ()
{
	return Object.freeze(
	[
		Object.freeze(
		{
			description: "1 3/4 crosslay (ground floor)",
			components: Object.freeze(
			[
				new Nozzle(
					{
						nozzleType: Nozzle.Types.HandFogLowPressure,
						diameter: 1.5
					}),
				new Hose(1+3/4, 200)
			])
		})
	]);
})(); // end BasicSetups array definition

export { ComponentTypes, Nozzle, Hose, BasicSetups };