function priceChange(type, name, linenum)
{
 	if(type === 'item' && name ==='item'){
      var priceLevel = nlapiGetCurrentLineItemValue('item','price');
      var priceS = nlapiGetCurrentLineItemValue('price');
      
      if(priceLevel == 1){
        nlapiSetCurrentLineItemValue('item','rate',5000);
        //alert('Successful!');
      }
 	}
}
function fieldchange(type, name, linenum)
{
 	if(type === 'item' && name ==='price')
    {
      //var priceLevel = nlapiGetCurrentLineItemValue('item','price');
      //alert('Price Level ='+ priceLevel);
      //if(priceLevel == 1){
        //nlapiSetCurrentLineItemValue('item','rate',5000);
       // alert(nlapiGetCurrentLineItemValue('item','price'));
     // }
 	}
}
