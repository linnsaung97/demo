/**
 * 
 * @NApiVersion 2.x
 * @NScriptType workflowactionscript
 */
define(
		[ 'N/record', 'N/search', 'N/runtime' ],
		/**
		 * @param {record}
		 *            record
		 * @param {workflow}
		 *            workflow
		 */
		function(record, search, runtime) {
			function onAction(scriptContext) {
				log.debug({
					title : 'Test 1',
					details : 'Script Run',
				});
				var rec = scriptContext.newRecord;
				var recordType = record.Type.PURCHASE_ORDER;
				var recordId = rec.id;
				var currUserId = runtime.getCurrentUser();
				var tran_approvallvl = 6;
				var tran_approvallvl_text = 'B2';
				var tran_sbu = rec.getValue('subsidiary');
				var tran_sbu_text = rec.getText('subsidiary');
				var tran_approvaldept = rec.getValue('department');
				var tran_approvaldept_text = rec.getText('department');
				var tran_approvallocation = rec.getValue('location');
				var tran_approvallocation_text = rec.getText('location');

				var landed_cost_field_approval = rec
						.getValue('custbody_landed_cost_approval');
				var reapproval_check = rec
						.getValue('custbody_reapproval_check');
				var normal_check = rec.getValue('custbody_normal_check');
				log.debug({
					title : 'Test 2',
					details : 'OK --> ' + 'landed_cost_field_approval --> '
							+ landed_cost_field_approval
							+ '  reapproval_check  --> ' + reapproval_check
							+ '   normal_check  -->  ' + normal_check,
				});

				rec.setValue({
					fieldId : 'custbody_next_approvers_info',
					value : '',
					ignoreFieldChange : true
				});

				rec.setValue({
					fieldId : 'custbody_nextapprovallvltb',
					value : tran_approvallvl,
					ignoreFieldChange : true
				});
				// Akk By MaMayKo 25/11/2019
				log.debug({
					title : 'Test 3',
					details : 'Before AkkSearch',
				});
				var akkSearch = search
						.create({
							type : 'CUSTOMRECORD_ESTIMATELANDEDCOST',
							filters : [ [ 'custrecord_purchaseorder', 'is',
									recordId ] ],
							columns : [ 'internalid', 'custrecord_approve',
									'custrecord_reapproval',
									'custrecord_rejected' ]
						});
				log.debug({
					title : 'Test 4',
					details : 'After  AkkSearch and Before Run',
				});
				var akkSearchresults = akkSearch.run().getRange({
					start : 0,
					end : 50
				});
				log.debug({
					title : 'Test 5',
					details : 'After Search Run',
				});
				var akkResults = '';
				if (akkSearchresults != null) {
					log.debug({
						title : 'Test 6',
						details : 'OK --> '
								+ 'Search != null and Result.length --> '
								+ akkSearchresults.length,
					});
					for (var i = 0; i < akkSearchresults.length; i++) {
						log.debug({
							title : 'Test Loop',
							details : 'Loop --> ' + i,
						});
						var akkResults = akkSearchresults[i];
						var iidd = akkResults.getValue('internalid');
						var approve = akkResults.getValue('custrecord_approve');
						var rejected = akkResults
								.getValue('custrecord_rejected');
						var reapproval_approve = akkResults
								.getValue('custrecord_reapproval');
						log.debug({
							title : 'Test Record Load ',
							details : 'Before Load Record ' + i,
						});
						/*
						 * try { var akkRecord = record.load({ type:
						 * 'customrecord_estimatelandedcost', id: iidd,
						 * isDynamic: true }); } catch(e1) { if(e1.code ==
						 * 'RCRD_LOCKED_BY_WF' || e1.code ==
						 * 'RCRD_HAS_BEEN_CHANGED') { continue; } }
						 */

						log.debug({
							title : 'Test value',
							details : 'Loop  --> ' + i + '   id  --> ' + iidd
									+ '  approve  --> ' + approve
									+ '   rejected  --> ' + rejected
									+ 'reapproval_approve  --> '
									+ reapproval_approve + ' Record Id  --> ',
						});
						if (rejected === true && reapproval_approve == false
								&& normal_check == true
								&& landed_cost_field_approval == true)// ||(rejected
																		// ===
																		// true
																		// &&
																		// reapproval_approve
																		// ==
																		// true
																		// &&
																		// reapproval_check
																		// ==
																		// true
																		// &&
																		// landed_cost_field_approval
																		// ==
																		// true)
						{
							log.debug({
								title : 'Test Target',
								details : 'target If Check Ok  --> ' + i,
							});
							try {
								/*
								 * akkRecord.setValue({ fieldId:
								 * 'custrecord_rejected', value: false,
								 * ignoreFieldChange: true });
								 */
								// customrecord_estimatelandedcost //
								// CUSTOMRECORD_ESTIMATELANDEDCOST
								record.submitFields({
									type : 'customrecord_estimatelandedcost',
									id : iidd,
									values : {
										'custrecord_rejected' : false
									},
								});
							} catch (e2) {
								if (e2.code == 'RCRD_LOCKED_BY_WF'
										|| e2.code == 'RCRD_HAS_BEEN_CHANGED') {
									continue;
								}
							}
							log.debug({
								title : 'Test Target',
								details : 'target set --> ' + i,
							});
						}
						// log.debug({title: 'Test Save Record Before',details:
						// 'BeforeRecord Save --> '+ i,});
						/*
						 * try { akkRecord.save(); } catch(e3) { if(e3.code ==
						 * 'RCRD_LOCKED_BY_WF' || e3.code ==
						 * 'RCRD_HAS_BEEN_CHANGED') { continue; } }
						 */
						// log.debug({title: 'Test Save Record After',details:
						// 'After Record Save --> '+ i,});
					}
				}
				// Akk Test End By MaMayKo 25/11/2019

				// Akk Test Start
				rec.setValue({
					fieldId : 'custbody_landed_cost_approval',
					value : false,
					ignoreFieldChange : true
				});

				rec.setValue({
					fieldId : 'custbody_landedcostapvlstus',
					value : 1,
					ignoreFieldChange : true
				});

				rec.setValue({
					fieldId : 'custbody_landedcostb2',
					value : '',
					ignoreFieldChange : true
				});
				rec.setValue({
					fieldId : 'custbody_aprrejdatelanddcostb2',
					value : '',
					ignoreFieldChange : true
				});
				rec.setValue({
					fieldId : 'custbody58',
					value : '',
					ignoreFieldChange : true
				});
				rec.setValue({
					fieldId : 'custbody_rejectreason_landedcost_b2',
					value : '',
					ignoreFieldChange : true
				});
				// Akk Test end

				/*
				 * log.debug({ title: 'Record selected Test 1', details: 'Record
				 * ID: ' + recordId + 'Record Type ' + recordType + 'Current
				 * User --> ' + currUserId + 'tran_approval level -->'
				 * +'tran_sbu'+tran_sbu+'/'+
				 * 'tran_approvaldept'+tran_approvaldept+'/'+'tran_approvallocation'+tran_approvallocation ,
				 * });
				 */
				if ((tran_approvallvl != null && tran_approvallvl != ''
						&& tran_approvallvl != undefined && tran_approvallvl != '@NONE@')
						&& (tran_approvaldept != null
								&& tran_approvaldept != ''
								&& tran_approvaldept != undefined && tran_approvaldept != '@NONE@')
						&& (tran_approvallocation != null
								&& tran_approvallocation != ''
								&& tran_approvallocation != undefined && tran_approvallocation != '@NONE@')) {

					/*
					 * log.debug({ title: 'Test 2', details: 'OK', });
					 * log.debug({ title: 'Test 3', details: 'OK', });
					 */
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

					/*
					 * log.debug({ title: 'Test 4', details: 'OK', });
					 */
					var searchresults = mySearch.run().getRange({
						start : 0,
						end : 50
					});
					var results = '';
					/*
					 * log.debug({ title: 'Test 5 Before != null ', details:
					 * 'OK', });
					 */
					if (searchresults != null) {
						/*
						 * log.debug({ title: 'Test 6 Pre', details: 'OK -->
						 * '+'Search Result.length --> '+ searchresults.length,
						 * });
						 */

						var previous_next_approver_tb = rec
								.getValue('custbody_next_approver_tb');
						var previous_next_approver = rec
								.getValue('nextapprover');
						var previous_next_approvers = rec
								.getValue('custbody_next_approvers_info');
						rec.setValue('custbody_previous_next_approver_tb',
								previous_next_approver_tb, true);
						rec.setValue('custbody_previous_approver',
								previous_next_approver, true);
						rec.setValue('custbody_previous_next_approvers',
								previous_next_approvers, true);
						/*
						 * log.debug({ title: 'Test 7 Before == 1 ', details:
						 * 'OK', });
						 */
						if (searchresults.length == 1) {
							/*
							 * log.debug({ title: 'Test 5 After enter ==1',
							 * details: 'OK', });
							 */
							results = searchresults[0];
							var empid = results.getValue('custrecord_employee');

							rec.setValue('custbody_next_approvers_info', '',
									true);
							rec.setValue('nextapprover', empid, true);// nextapprover//custbody_landed_cost_next_approver

							/*
							 * log.debug({ title: 'Next Approver == 1', details:
							 * 'empID -->'+empid, });
							 */
							return empid;
						}

						else if (searchresults.length > 1) {
							/*
							 * log.debug({ title: 'Test 6 >1', details: 'OK it
							 * is more than one', });
							 */

							var emp_id = new Array();
							for (var j = 0; j < searchresults.length; j++) {
								results = searchresults[j];
								emp_id[j] = results
										.getValue('custrecord_employee');
							}
							rec.setValue('custbody_next_approvers_info',
									emp_id, true);
							rec.setValue('nextapprover', '', true);

							/*
							 * log.debug({ title: 'Next Approver More Than One',
							 * details:
							 * 'searchresults.length'+searchresults.length, });
							 */
							return '';
						}
					} else {
						/*
						 * log.debug({ title: 'No Next Approver', details:
						 * 'Search Result'+searchresults, });
						 */
						return '';
					}
				} else {
					/*
					 * log.debug({ title: 'Level/Dept/Location Checking',
					 * details: 'Finding Criterias Null Next Approval Level is
					 * NUll (or) Next Approval Departments is NUll (or) Next
					 * Approval Locations is Null', });
					 */
					return '';
				}
			}
			return {
				onAction : onAction
			};

		});
