import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { HoseDiameters, Hose } from './components/engineeringCard';

function initializeTerminal()
{
	$("#Terminal").terminal(
		function(command)
		{
			let flowRateInput = Number.parseInt(command);
			this.echo(`At flow rate ${command} gpm, friction loss will be:`);
			for (const hoseDiameter of HoseDiameters)
			{
				let hose = new Hose(hoseDiameter.value, 100);
				this.echo(`  ${hoseDiameter.description} hose => ${hose.getFrictionLoss(flowRateInput)}`);
			}
		},
		{
			greetings: "Welcome to Hose Quiz."
		});
}

createApp(App).mount('#App')
$(initializeTerminal);
