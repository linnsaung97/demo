/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
 define(['N/search'],
	 function(search) {
	 	function getEmployeeEmail(context) {
	 		var email = context.currentRecord.getValue({
	 		fieldId: 'email'
	 		});
		 	var empEmail = search.lookupFields({
			 type: 'employee',
			 id: email,
			 columns: ['email']
			 });
			 alert(JSON.stringify(empEmail));
		}

	return {
	 fieldChanged: getEmployeeEmail
	}
});
