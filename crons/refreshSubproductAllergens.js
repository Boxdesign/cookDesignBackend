var cron = require('node-cron')
//let schedule = process.env.NODE_ENV == 'production' ? '0 0 * * 7' : '0 4 * * *' //Prod “At 00:00 UTC on Sunday.”, dev every 5 min
var winston = require('winston')
var schedule;

switch(process.env.NODE_ENV) {
	case 'production':
			schedule = '0 16 * * 7'  //Prod “At 10:00 UTC on Sunday.”
	break;

	case 'staging':
			schedule = '0 0 * 12 7'
	break;

	default:
		schedule = '0 4 * * *'
	break
}


exports.refreshSubproductAllergensTask = cron.schedule(schedule, () => {

	var refreshAllergensQueue = require('../queues/refreshAllergens')

  refreshAllergensQueue.refreshAllergens(
    {
      title: 'Refresh Subproduct Allergens ',
      model: 'Subproduct' 
    }
  );  


})