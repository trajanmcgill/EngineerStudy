class EngineeringCard
{
	static #HoseDiameters =
	[
		{ value: 1.75, description: "1 3/4\""},
		{ value: 2.5, description: "2 1/2\""},
		{ value: 3, description: "3\""},
		{ value: 5, description: "5\""}
	];

	static #HoseFrictionLossTables =
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

	static get HoseDiameters() { return #HoseDiameters; }
	static get HoseFrictionLossTables() { return this.#HoseFrictionLossTables; }
}

class Hose
{
	#diameter;
	#length;
	#frictionLossTable;

	constructor(diameter, length)
	{
		if (length <= 0)
			throw new Error(`Invalid hose length: ${length} (must be greater than zero)`);

		let hoseDiameter = HoseDiameters.find((hoseDiameter) => hoseDiameter.value === diameter);
		if (hoseDiameter === undefined)
			throw new Error(`Invalid hose diameter: ${diameter}`);
		
		this.#length = length;
		this.#diameter = hoseDiameter;
		this.#frictionLossTable = HoseFrictionLossTables.find((frictionLossTable) => frictionLossTable.diameter === diameter);
	}
	
	get diameter() { return this.#diameter; }
	get length() { return this.#length; }

	getFrictionLoss(flowRate)
	{
		let precalculatedValue = this.#frictionLossTable.precalculatedFrictionLosses.find((entry) => entry.flowRate === flowRate);
		if (precalculatedValue === undefined)
			return this.#frictionLossTable.formulaPer100Feet(flowRate) * this.#length / 100;
		else
			return precalculatedValue.frictionLossPer100ft * this.#length / 100;
	}
}






/*
const NozzleTypes =
{
	HandSmooth:
	{
		description: "Smoothbore (hand line)",
		nozzlePressure: 50,
		flowRates:
			[
				{ diameterDescription: "15/16\"", flowRate: 185 },
				{ diameterDescription: "1\"", flowRate: 200 },
				{ diameterDescription: "1 1/8\"", flowRate: 250 },
				{ diameterDescription: "1 1/4\"", flowRate: 300 }
			]
	},
	HandFogConventional:
	{
		description: "Fog nozzle (hand line, conventional)",
		nozzlePressure: 100
	},
	HandFogLowPressure:
	{
		description: "Fog nozzle (hand line, low pressure)",
		nozzlePressure: 75
	},
	MasterSmooth:
	{
		description: "Master stream smooth bore",
		nozzlePressure: 80
	},
	MasterFog:
	{
		description: "Master stream fog nozzle",
		nozzlePressure: 100
	},
	Cellar:
	{
		description: "Cellar nozzle",
		nozzlePressure: 100
	},
	Piercing:
	{
		description: "Piercing nozzle",
		nozzlePressure: 100
	},
	FoamEductor:
	{
		description: "Foam eductor"
	}
};

const NozzleFlow =
	{

	}

const nozzles =
	[
		{
			name: "",
			type: "",
			stream: ""
		}
	];
*/

export { EngineeringCard, Hose };
