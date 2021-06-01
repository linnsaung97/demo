/**
 * 
 * @NApiVersion 2.x
 * @NScriptType workflowactionscript
 */
define(
		[ 'N/workflow', 'N/record', 'N/search', 'N/runtime' ],
		/**
		 * @param {record}
		 *            record
		 * @param {workflow}
		 *            workflow
		 */
		function(workflow, record, search, runtime) {
			function onAction(scriptContext) {
				var rec = scriptContext.newRecord;
				var recordType = record.Type.PURCHASE_ORDER;
				var recordId = rec.id;
				var currUserId = runtime.getCurrentUser();
				var tran_approvallvl = 6;
				var tran_sbu = rec.getValue('subsidiary');
				var tran_approvaldept = rec.getValue('department');
				var tran_approvallocation = rec.getValue('location');
				var landed_cost_field_approval = rec
						.getValue('custbody_landed_cost_approval');
				var reapproval_check = rec
						.getValue('custbody_reapproval_check');
				var normal_check = rec.getValue('custbody_normal_check');
				rec.setValue('custbody79', 'Hi', true);
				rec.setValue('custbody_next_approvers_info', '', true);
				rec.setValue('custbody_nextapprovallvltb', tran_approvallvl,
						true);
				var length = rec
						.getLineCount('recmachcustrecord_purchaseorder');

				for (var i = 1; i <= length; i++) {
					// var reapproval_approve =
					// rec.getSublistValue('recmachcustrecord_purchaseorder','custrecord_reapproval',i);
					// var approve =
					// rec.getSublistValue('recmachcustrecord_purchaseorder','custrecord_approve',i);
					// var rejected =
					// rec.getSublistValue('recmachcustrecord_purchaseorder','custrecord_rejected',i);
					// var LC_id =
					// rec.getSublistValue('recmachcustrecord_purchaseorder','id',i);
					var reapproval_approve = rec.getSublistValue({
						sublistId : 'recmachcustrecord_purchaseorder',
						fieldId : 'custrecord_reapproval',
						line : i + 1
					});
					var approve = rec.getSublistValue({
						sublistId : 'recmachcustrecord_purchaseorder',
						fieldId : 'custrecord_approve',
						line : i + 1
					});
					var rejected = rec.getSublistValue({
						sublistId : 'recmachcustrecord_purchaseorder',
						fieldId : 'custrecord_rejected',
						line : i + 1
					});
					var LC_id = rec.getSublistValue({
						sublistId : 'recmachcustrecord_purchaseorder',
						fieldId : 'id',
						line : i + 1
					});
					var est = rec.getSublistValue({
						sublistId : 'recmachcustrecord_purchaseorder',
						fieldId : 'custrecord_estimateamount',
						line : i + 1
					});
					log.debug({
						title : 'Test',
						details : 'OK' + '  Approve is ' + approve
								+ ' reapproval_approve is  '
								+ reapproval_approve + '  rejected is  '
								+ rejected + ' ID  is ' + LC_id
								+ '   Estimate amount is ' + est,
					});
					if ((rejected === true && reapproval_approve == false
							&& normal_check == true && landed_cost_field_approval == true)
							|| (rejected === true && reapproval_approve == true
									&& reapproval_check == true && landed_cost_field_approval == true)) {
						log.debug({
							title : 'Test',
							details : 'If check ok',
						});
						workflow.trigger({
							recordType : 'customrecord_estimatelandedcost',
							recordId : LC_id,
							workflowId : 'customworkflow27',
							defaultValues : p,
							actionId : 'workflowaction4478'
						});
					}
				}
				rec.setValue('custbody_landed_cost_approval', false, true);
				if (normal_check == 'T'
						&& (rec.getdValue('custbody_landedcostapvlstus') == 2 || rec
								.getValue('custbody_landedcostapvlstus') == 3)) {
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_landedcostb2 : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_aprrejdatelanddcostb2 : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody58 : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_rejectreason_landedcost_b2 : ''
						}
					});
				}
				if (reapproval_check == 'T'
						&& (nlapiGetFieldValue('custbody_re_landedcostapprovalstatus') == 2 || nlapiGetFieldValue('custbody_re_landedcostapprovalstatus') == 3)) {
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_landedcostb2reapproval : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbodyaprrejdatelanddcost_reapp_b2 : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_sts_landedcost_reapproval : ''
						}
					});
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbodyrejectreasonlandedcostb2_re : ''
						}
					});
				}
				if (normal_check == 'T') {
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_landedcostapvlstus : 1
						}
					});
				}
				if (reapproval_check == 'T') {
					rec.submitFields({
						type : recordType,
						id : recordId,
						values : {
							custbody_re_landedcostapprovalstatus : 1
						}
					});
				}
				if ((tran_approvallvl != null && tran_approvallvl != ''
						&& tran_approvallvl != undefined && tran_approvallvl != '@NONE@')
						&& (tran_approvaldept != null
								&& tran_approvaldept != ''
								&& tran_approvaldept != undefined && tran_approvaldept != '@NONE@')
						&& (tran_approvallocation != null
								&& tran_approvallocation != ''
								&& tran_approvallocation != undefined && tran_approvallocation != '@NONE@')) {
					var mySearch = search
							.create({
								type : 'CUSTOMRECORD_APPROVAL_INFORMATION',
								filters : [
										[ 'custrecord_approval_levels',
												'anyof', tran_approvallvl ],
										'and',
										[ 'custrecord_approval_departments',
												'anyof', tran_approvaldept ],
										'and',
										[ 'custrecord_approval_locations',
												'anyof', tran_approvallocation ],
										'and',
										[ 'isinactive', 'is', 'F' ],
										'and',
										[ 'custrecord_subsidiaries', 'anyof',
												tran_sbu ] ],
								columns : [ 'custrecord_employee' ]
							});
					var searchresults = mySearch.run().getRange({
						start : 0,
						end : 50
					});
					var results = '';
					if (searchresults != null) {
						if (searchresults.length == 1) {
							results = searchresults[0];
							var empid = results.getValue('custrecord_employee');

							rec.setValue('custbody_next_approvers_info', '',
									true);
							rec.setValue('nextapprover', empid, true);
							return true;
						}

						else if (searchresults.length > 1) {
							var emp_id = new Array();
							for (var j = 0; j < searchresults.length; j++) {
								results = searchresults[j];
								emp_id[j] = results
										.getValue('custrecord_employee');
							}
							rec.setValue('custbody_next_approvers_info',
									emp_id, true);
							rec.setValue('nextapprover', '', true);
							return true;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
			return {
				onAction : onAction
			};
		});