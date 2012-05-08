/**
 * The KINETIC global namespace object
 * @class KINETIC
 * @static
 */
if (typeof KINETIC == "undefined") {
    KINETIC = {};
}
if (typeof KINETIC.table == "undefined") {
    KINETIC.table = {};
}

if (! KINETIC.table.TwoTable){

    KINETIC.table.TwoTable = function(){
		this.referenceID;
		this.primaryTable;
		this.selectedTable;
		this.primaryTableID;
		this.selectedTableID;
		this.totalsQuestionID;
		this.storedTableDataQuestion;
		this.removedRows = new KD.utils.Hash();
		
		this.initialize = function(referenceIDParam, primaryTableIDParam, selectedTableIDParam, totalsQuestionIDParam, storedTableDataQuestionParam) {
			this.referenceID = referenceIDParam;
			this.primaryTableID = primaryTableIDParam;
			this.selectedTableID = selectedTableIDParam;
			this.totalsQuestionID = totalsQuestionIDParam;
			this.storedTableDataQuestion = storedTableDataQuestionParam;
		}
	
		this.initialTableLoad = function() {
			if (KD.utils.Action.getQuestionValue(this.storedTableDataQuestion)) {
				this.loadSelectedTable(true);
			} else {
				this.loadSelectedTable();
			}
			this.loadPrimaryTable();
		}

		this.noSelected = function(){
			var recordSet= this.selectedTable.getRecordSet();
			if (recordSet.getLength()==0){
				return true;
			}
			return false;
		}

		this.saveSelected = function(){
			var recordSet= this.selectedTable.getRecordSet();
			var strData="";
			for (var i=0; i<recordSet.getLength(); i++) {
				data = YAHOO.lang.JSON.stringify(recordSet.getRecord(i).getData());
				if (strData != "") {
					strData = strData +","+data;
				} else {
					strData = data;
				}
			}
			KD.utils.Action.setQuestionValue(this.storedTableDataQuestion, strData);
		}

		this.formatCurrency = function(num) {
			num = num.toString().replace(/\$|\,/g,'');
			if(isNaN(num)) {
				num = "0";
			}
			sign = (num == (num = Math.abs(num)));
			num = Math.floor(num*100+0.50000000001);
			cents = num%100;
			num = Math.floor(num/100).toString();
			if(cents<10) {
				cents = "0" + cents;	
			}
			for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
				num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
			}

			return (((sign)?'':'-') + '$' + num + '.' + cents);
		}

		this.setTotal = function() {
			var total=0;
			var recCount = this.selectedTable.getRecordSet().getLength();
			for (var i=0; i< recCount; i++) {
				var qty = this.selectedTable.getRecordSet().getRecord(i).getData('quantity');
				var cost = this.selectedTable.getRecordSet().getRecord(i).getData('cost');
				total += (qty*cost);
			}
			total = this.formatCurrency(total);
			KD.utils.Action.setQuestionValue(this.totalsQuestionID, total);
		}

		this.sortSelectedTable = function(a,b, desc, field) {
			if (a.getData(field) > b.getData(field)){
				return 1;
			} else {
				return -1;
			}
		}

		this.sortPrimaryTable = function(a,b, desc, field) {
			if ((desc && a.getData(field) <b.getData(field)) || (!desc && a.getData(field) >b.getData(field))){
				return 1;
			} else {
				return -1;
			}
		}

		this.addRow = function() {	
			// The this value may be the DataTable if being invoked as a callback, or will be an instance of KINETIC.table.TwoTable
			// Do a swtich to the KINETIC.table.TwoTable instance
			if (this.containerObj) {
				thisObj = this.containerObj;
			} else {
				thisObj = this;
			}

			var rowID = thisObj.primaryTable.getLastSelectedRecord();
			if (rowID) {
				var row = thisObj.primaryTable.getRecord(rowID);
				var recIndex = thisObj.primaryTable.getRecordIndex(row);
				var requestID = row.getData('requestid');

				var obj = thisObj.primaryTable.getRecordSet().deleteRecord(recIndex);
				thisObj.removedRows.setItem(obj.requestid, obj);
				
				thisObj.selectedTable.addRow(row.getData());
				var recCount = thisObj.selectedTable.getRecordSet().getLength();
				var row = thisObj.selectedTable.getRecord(recCount-1);
				row.setData('quantity', '1');

				thisObj.selectedTable.getRecordSet().sortRecords(thisObj.sortSelectedTable, false, 'name');
				thisObj.selectedTable.render();
				thisObj.setTotal();	

				// Use this for the sake of IE 6, which isn't hiding the table message properly
				thisObj.selectedTable.showTableMessage(" ");
				thisObj.selectedTable.hideTableMessage();

				thisObj.primaryTable.render();
			}
		}

		this.removeRow = function(oArgs) {
			// The this value may be the DataTable if being invoked as a callback, or will be an instance of KINETIC.table.TwoTable
			// Do a swtich to the KINETIC.table.TwoTable instance
			if (this.containerObj) {
				thisObj = this.containerObj;
			} else {
				thisObj = this;
			}
			var rowID = thisObj.selectedTable.getLastSelectedRecord();
			if (rowID) {
				var row = thisObj.selectedTable.getRecord(rowID);
				var requestID = row.getData('requestid');

				thisObj.selectedTable.deleteRow(rowID);
				thisObj.setTotal();
				
				thisObj.primaryTable.getRecordSet().addRecord(thisObj.removedRows.getItem(requestID));

				data = thisObj.primaryTable.getRecordSet().sortRecords(thisObj.sortPrimaryTable, false, 'category');

				// Use this for the sake of IE 6, which isn't hiding the table message properly
				thisObj.primaryTable.render();
				thisObj.primaryTable.showTableMessage(" ");
				thisObj.primaryTable.hideTableMessage();
			}
		}
	
		this.hideSelectedRows = function() {
			// The this object is the DataTable instance
			// Do a swtich to the KINETIC.table.TwoTable instance
			thisObj = this.containerObj;
			var recCount = thisObj.primaryTable.getRecordSet().getLength();
			for (var i=0; i< recCount; i++) {
				requestID=thisObj.primaryTable.getRecordSet().getRecord(i).getData('requestid');
				
				var selRecCount = thisObj.selectedTable.getRecordSet().getLength();
				for (var idx=0; idx< selRecCount; idx++) {
					if (thisObj.selectedTable.getRecordSet().getRecord(idx).getData('requestid')==requestID) {
						var obj = thisObj.primaryTable.getRecordSet().deleteRecord(i);
						thisObj.removedRows.setItem(obj.requestid, obj);

						i-=1;
						recCount-=1;
						break;
					}
				}
			}
		}

		this.buildDataRequestURL = function(requestName, dataRequestId, paramString, useGetList){
			if(KD.utils.Action.sdrErrors == null){
				KD.utils.Action.sdrErrors = new KD.utils.Hash();
						}
						if(paramString && paramString != "" && paramString.indexOf("&") != 0){
							paramString ="&"+paramString;
						}
						dataRequestId=encodeURIComponent(dataRequestId);
						requestName=encodeURIComponent(requestName);
						var sessionId=encodeURIComponent(KD.utils.ClientManager.sessionId);
						var now = new Date();
						var entryParam="";
						if(useGetList == true){
							entryParam="&useGetList=true"
						}
						var path = "SimpleDataRequest?requestName="+ requestName +"&dataRequestId="+ dataRequestId +"&sessionId="+sessionId +"&format="+ paramString+entryParam+"&noCache="+now.getTime();
			return path;
		}

		this.myCustomFormatter = function(elLiner, oRecord, oColumn, oData) {
			if(oColumn.getKey()=="image") {
				elLiner.innerHTML = ' <img src="'+oRecord.getData('image')+'">';
			}
		}

		this.loadPrimaryTable = function() {	
			// Add the custom formatter to the shortcuts 
			YAHOO.widget.DataTable.Formatter.myCustom = this.myCustomFormatter;
			var myColumnDefs = getPrimaryTableDefs(this.referenceID);
				
			var dynTextLayer = YAHOO.util.Dom.get(this.primaryTableID).parentNode;
			var sdrId = KD.utils.Util.getIDPart(dynTextLayer.id);
			var clientAction = KD.utils.ClientManager.customEvents.getItem(sdrId)[0];					

			var path = this.buildDataRequestURL('getPrimaryData', clientAction.actionId, '', true);
			var myDataSource = new YAHOO.util.DataSource(path);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
			myDataSource.useXPath = true;
			myDataSource.responseSchema = {
				metaFields: {},
				resultNode: 'record',
			fields: getPrimaryTableFields(this.refenceID)
			};
			this.primaryTable= new YAHOO.widget.GroupedDataTable(this.primaryTableID, myColumnDefs, myDataSource, {groupBy: "category"});
			// Store the reference to the KINETIC.table.TwoTable instance
			// This is to allow the callback functions to have access to the KINETIC.table.TwoTable instance
			this.primaryTable.containerObj = this;
					// Subscribe to events for row selection
			this.primaryTable.subscribe("rowMouseoverEvent", this.primaryTable.onEventHighlightRow);
			this.primaryTable.subscribe("rowMouseoutEvent", this.primaryTable.onEventUnhighlightRow);
			this.primaryTable.subscribe("rowClickEvent", this.primaryTable.onEventSelectRow);
			this.primaryTable.subscribe("rowDblclickEvent", this.addRow);
			this.primaryTable.hideTableMessage();
			this.primaryTable.subscribe("beforeRenderEvent", this.hideSelectedRows);
					return {
				oDS: myDataSource,
				oDT: this.primaryTable
			};
		}	
	
		this.mySaveEvent = function( editor , newData , oldData ){
			// The this object is the DataTable instance
			// Do a swtich to the KINETIC.table.TwoTable instance
			thisObj = this.containerObj;
			thisObj.setTotal();	
		}
		this.loadSelectedTable = function(loadData, disable) {
			// Add the custom formatter to the shortcuts
			YAHOO.widget.DataTable.Formatter.myCustom = this.myCustomFormatter;

			var myColumnDefs = getSelectedTableDefs(this.referenceID);
			var myDataSource = new YAHOO.util.DataSource([]);
			myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			myDataSource.responseSchema = {
				fields: getSelectedTableFields(this.referenceID)
			};
			this.selectedTable= new YAHOO.widget.DataTable(this.selectedTableID, myColumnDefs, myDataSource, {});
			// Store the reference to the KINETIC.table.TwoTable instance
			// This is to allow the callback functions to have access to the KINETIC.table.TwoTable instance
			this.selectedTable.containerObj = this;
			if (loadData) {
				var strData = KD.utils.Action.getQuestionValue(this.storedTableDataQuestion);
				if (strData.length>0){
					var strArray = strData.split('},');
					var dataObjs = new Array();
					for (var i=0; i<strArray.length; i++) {
						var str = strArray[i];
						if (i<strArray.length-1) {
							str+="}";
						}
						try {
							var dataObj = YAHOO.lang.JSON.parse(str);
						} catch (e) {alert(e);}
						dataObjs[dataObjs.length] = dataObj;
					}
					this.selectedTable.addRows(dataObjs);
				}
			}
			if (disable) {
				/* This is called twice deliberately. Browsers respond differently to this feature without calling twice. */
				this.selectedTable.disable();
				//setTimeout('this.selectedTable.disable()', 300);
			} else {
						// Subscribe to events for row selection
				this.selectedTable.subscribe("rowMouseoverEvent", this.selectedTable.onEventHighlightRow);
				this.selectedTable.subscribe("rowMouseoutEvent", this.selectedTable.onEventUnhighlightRow);
				this.selectedTable.subscribe("rowClickEvent", this.selectedTable.onEventSelectRow);
				this.selectedTable.subscribe("cellClickEvent", this.selectedTable.onEventShowCellEditor);
				this.selectedTable.subscribe("editorSaveEvent", this.mySaveEvent);
				this.selectedTable.subscribe("rowDblclickEvent", this.removeRow);
			}
				return {
			oDS: myDataSource,
			oDT: this.selectedTable
			};
		}
    }
};

