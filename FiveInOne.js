function clientFieldChanged(type, name, linenum) {
	if (name == 'salesgroup')// This is AkkReportFCLatest
	{
		var old_choosed_team = nlapiGetFieldValue('salesgroup');
		nlapiSetFieldValue('custbodychoosed_team', old_choosed_team);
	}
	var new_choosed_team = nlapiGetFieldValue('custbodychoosed_team');
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var get_form = nlapiGetFieldValue('customform'); // Invoice Printing Date
														// Client
	if (name == 'customform') {
		// alert(get_form);
	}
	if (get_form == 269) { // sandbox 218
		if (name == 'custbody_predelivery_inspection_no') {
			// alert(name);
			var indr_id = nlapiGetFieldValue('custbody_predelivery_inspection_no');
			if (indr_id != null && indr_id != '') {
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('internalid', null, 'anyof',
						indr_id);// internalid
				var columns = new Array();
				columns[0] = new nlobjSearchColumn('custrecord_date');
				var search_results = nlapiSearchRecord(
						'customrecord_interdeptorder_main', null, filters,
						columns);
				// alert(indr_id+','+search_results[0].getValue('custrecord_date'));
				nlapiSetFieldValue('custbody_predelivery_date',
						search_results[0].getValue('custrecord_date'));
			}
		}
		if (name == 'custbody_delivery_order_no') {
			// alert(name);
			var fulfull_id = nlapiGetFieldValue('custbody_delivery_order_no');
			if (fulfull_id != null && fulfull_id != '') {
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('internalid', null, 'anyof',
						fulfull_id);// internalid
				var columns = new Array();
				columns[0] = new nlobjSearchColumn('trandate');
				var search_results = nlapiSearchRecord('itemfulfillment', null,
						filters, columns);
				// alert(fulfull_id+','+search_results[0].getValue('trandate'));
				nlapiSetFieldValue('custbody_delivery_date', search_results[0]
						.getValue('trandate'));
			}
		}
	}// ...end form check
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	if (name == 'custbody_last_deposit_amt_mm') // Myanmar Invoice
	{
		var deposit_date = nlapiGetFieldValue('custbody_deposit_date_mm');
		var deposit_amt = nlapiGetFieldValue('custbody_last_deposit_amt_mm');
		var auto_add_fd = nlapiGetFieldValue('custbody_deposit_list');
		nlapiLogExecution('DEBUG', 'Auto Add field', auto_add_fd);
		if (auto_add_fd != null && auto_add_fd != '' && auto_add_fd != '@NONE@'
				&& auto_add_fd != undefined) {
			if (deposit_date != null && deposit_amt != null
					&& deposit_date != '' && deposit_amt != '') {
				nlapiSetFieldValue('custbody_deposit_list', auto_add_fd
						+ 'ေငြသြင္းရက္ (' + deposit_date
						+ ') (ေနာက္ဆံုး) = ' + deposit_amt
						+ '/- က ်ပ္,     ');
				nlapiSetFieldValue('custbody_deposit_date_mm', '');
				nlapiSetFieldValue('custbody_last_deposit_amt_mm', '');
			}
		} else {
			if (deposit_date != null && deposit_amt != null
					&& deposit_date != '' && deposit_amt != '') {
				nlapiSetFieldValue('custbody_deposit_list',
						'ေငြသြင္းရက္ (' + deposit_date
								+ ') (ေနာက္ဆံုး) = '
								+ deposit_amt + '/- က ်ပ္,     ');
				nlapiSetFieldValue('custbody_deposit_date_mm', '');
				nlapiSetFieldValue('custbody_last_deposit_amt_mm', '');
			}
		}
	}
	// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var price_level = nlapiGetCurrentLineItemValue('item', 'price');// Client
																	// Invoice
																	// PM Fields
																	// - New
	var pm_amount = 0;
	var pm_tax_amount = 0;

	if (type == 'item' && (name == 'rate' || name == 'quantity')) {
		// alert(name);
		var pm_package = nlapiGetCurrentLineItemValue('item',
				'custcol_pm_package');

		if (pm_package == 1) {
			var qty = parseFloat(nlapiGetCurrentLineItemValue('item',
					'quantity'));
			var rate = parseFloat(nlapiGetCurrentLineItemValue('item', 'rate'));
			pm_amount = qty * rate; // parseFloat(quantity)*parseFloat(rate);
			nlapiSetCurrentLineItemValue('item', 'custcol_pm_total', pm_amount,
					true);
			// alert('PM='+pm_amount);
		}
	}
	if (type == 'item' && (name == 'taxrate1' || name == 'custcol_pm_total')) {
		var pm_package = nlapiGetCurrentLineItemValue('item',
				'custcol_pm_package');
		var pmAmount = parseInt(nlapiGetCurrentLineItemValue('item',
				'custcol_pm_total'));
		if (pm_package == 1) {
			var tax_rate = parseFloat(nlapiGetCurrentLineItemValue('item',
					'taxrate1'));
			var tax_rate = tax_rate / 100;
			if (tax_rate > 0) {
				pm_tax_amount = pmAmount * tax_rate;
				nlapiSetCurrentLineItemValue('item', 'custcol_pm_total_tax',
						pm_tax_amount, true);
			} else {
				nlapiSetCurrentLineItemValue('item', 'custcol_pm_total_tax', 0,
						true);
			}
		}
	}
	// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	if (type == 'item' && name == 'custcol_extra_slack_rental_hr')// This is
																	// QtyChange
	{
		nlapiSetCurrentLineItemValue('item', 'quantity',
				parseInt(nlapiGetCurrentLineItemValue('item', 'quantity'))
						+ parseInt(nlapiGetCurrentLineItemValue('item',
								'custcol_extra_slack_rental_hr')));
	}
}