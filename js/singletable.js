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

if (! KINETIC.table.SingleTable){

    KINETIC.table.SingleTable = function(){
                var self = this;
		this.referenceID;
		this.primaryTable;
		this.primaryTableID;
		this.primaryDataRequestID;
                this.useBridge;
                this.bridgeConfig;
                this.lastSortedBy;
		
		this.initialize = function(referenceIDParam, primaryTableIDParam, primaryDataRequestIDParam, useBridge, config) {
			this.referenceID = referenceIDParam;
			this.primaryTableID = primaryTableIDParam;

			if (primaryDataRequestIDParam) {
				this.primaryDataRequestID = primaryDataRequestIDParam;
			} else {
				this.primaryDataRequestID = primaryTableIDParam;
			}
                        
                        this.useBridge = useBridge;
                        this.bridgeConfig = config;
		}
	
		this.initialTableLoad = function() {
			this.loadTable();
		}

		this.sortPrimaryTable = function(a,b, desc, field) {
			if ((desc && a.getData(field) <b.getData(field)) || (!desc && a.getData(field) >b.getData(field))){
				return 1;
			} else {
				return -1;
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
		// sample
		this.myCustomFormatter = function(elLiner, oRecord, oColumn, oData) {
			if(oColumn.getKey()=="image") {
				elLiner.innerHTML = ' <img src="'+oRecord.getData('image')+'">';
			}
		}

                this.loadBridgeResult = function(list){
                    self.primaryTable.getRecordSet().reset();
                    var dataObjs = new Array();
                    for (var i=0; i<list.records.length; i++) {
                            dataObjs[dataObjs.length] =list.records[i].attributes;
                    }                    
                    self.primaryTable.addRows(dataObjs);      

                    if (self.primaryTable.configs.paginator){
                        self.primaryTable.configs.paginator.setStartIndex(0, true);                    
                        self.primaryTable.configs.paginator.setRowsPerPage(list.metadata.pageSize, true);                 
                        self.primaryTable.render();

                        self.primaryTable.configs.paginator.setTotalRecords(list.metadata.count, true);                    
                        self.primaryTable.configs.paginator.setStartIndex(list.metadata.offset, true);                    
                        self.primaryTable.configs.paginator.setRowsPerPage(list.metadata.pageSize, true);                    
                        self.primaryTable.configs.paginator.setPage((((list.metadata.offset+1)<list.metadata.pageSize)?1:((list.metadata.offset+1)/list.metadata.pageSize)+1), true);                    
                        self.primaryTable.configs.paginator.render();
                    }
                }
                this.handlePagination = function(state){
                    self.generateRequest(state);
                }
                this.getPageSize = function(state){
                    var pageSize=10;
                    if (state && state.rowsPerPage){
                        pageSize=state.rowsPerPage;
                    } else if (state && !state.rowsPerPage && state.pagination){
                        pageSize=state.pagination.rowsPerPage;
                    }
                    return pageSize;
                }
                this.getOffset = function(state){
                    var offset=0;
                    if (state && state.recordOffset){
                        offset=state.recordOffset;
                    } else if (state && !state.recordOffset && state.pagination){
                        offset=state.pagination.recordOffset;
                    }
                    return offset;
                }
                this.getSortColumn = function(state){
                    var sortColumn="";
                    if (state && state.sortedBy){
                        sortColumn+=state.sortedBy.key;
                        sortColumn+= (state.sortedBy && state.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? " desc" : " asc";                        
                    } else if (self.lastSortedBy){
                        sortColumn = self.lastSortedBy;
                    }
                    self.lastSortedBy = sortColumn;
                    return sortColumn;
                }
                
                this.generateRequest = function(state){
                    var connector = new KD.bridges.BridgeConnector();
                    connector.search(self.bridgeConfig.model, self.bridgeConfig.qualification, 
                    {
                       /* parameters:{'Application': "Kinetic Request"}, */
                        metadata:{
                            pageSize:self.getPageSize(state),
                            offset:self.getOffset(state),
                            sortColumns: self.getSortColumn(state)},
                            success:self.loadBridgeResult
                    });
                }
		this.loadTable = function() {	
			// Add the custom formatter to the shortcuts 
			if (myCustomFormatter) {
				YAHOO.widget.DataTable.Formatter.myCustom = myCustomFormatter;
			}
			var myColumnDefs = getPrimaryTableDefs(this.referenceID);
			var myOptions = getPrimaryOptions(this.referenceID);
			
			var dynTextLayer = YAHOO.util.Dom.get(this.primaryDataRequestID).parentNode;
			var sdrId = KD.utils.Util.getIDPart(dynTextLayer.id);
			var clientAction = KD.utils.ClientManager.customEvents.getItem(sdrId)[0];					

			var path;
                        if (this.useBridge){
                                path = [];
                        } else {    
                                path = this.buildDataRequestURL('getPrimaryData', clientAction.actionId, '', true);
                        }        
			var myDataSource = new YAHOO.util.DataSource(path);
                        if (this.useBridge){
                                myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
                        } else {
        			myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
                        }
			myDataSource.useXPath = true;
                        if (this.useBridge){
                            myDataSource.responseSchema = {
                                fields: getPrimaryTableFields(this.referenceID)
                            };
                        } else {
                            myDataSource.responseSchema = {
                                    metaFields: {},
                                    resultNode: 'record',
                                    fields: getPrimaryTableFields(this.referenceID)
                            };
                        }
			
                        myOptions.generateRequest = this.generateRequest,
			this.primaryTable= new YAHOO.widget.ScrollingDataTable(this.primaryTableID, myColumnDefs, myDataSource, myOptions);
                        if (this.primaryTable.configs.paginator){
                            this.primaryTable.configs.paginator.setAttributeConfig('firstPageLinkLabel', {
                                value : '&lt;&lt; '+'first'
                            });
                            this.primaryTable.configs.paginator.setAttributeConfig('previousPageLinkLabel', {
                                value : '&lt;&lt; '+'prev'
                            });
                            this.primaryTable.configs.paginator.setAttributeConfig('nextPageLinkLabel', {
                                value : '&gt;&gt; '+'next'
                            });
                            this.primaryTable.configs.paginator.setAttributeConfig('lastPageLinkLabel', {
                                value : '&gt;&gt; '+'last'
                            });                           

                            myOptions.paginator.unsubscribe("changeRequest", this.primaryTable.onPaginatorChangeRequest);
                            myOptions.paginator.subscribe("changeRequest", this.handlePagination, this.primaryTable, true);
                        }
                        // 
			// Store the reference to the KINETIC.table.TwoTable instance
			// This is to allow the callback functions to have access to this instance
			this.primaryTable.containerObj = this;

                        if (this.useBridge){
                            this.generateRequest();
                        }
                        this.primaryTable.doBeforeLoadData = function(oRequest, oResponse, oPayload) {
                            oResponse.error=false;
                            return oPayload;
                        };

			// Subscribe to events for row selection
			this.primaryTable.subscribe("rowMouseoverEvent", this.primaryTable.onEventHighlightRow);
			this.primaryTable.subscribe("rowMouseoutEvent", this.primaryTable.onEventUnhighlightRow);
			this.primaryTable.subscribe("rowClickEvent", this.primaryTable.onEventSelectRow);
			this.primaryTable.subscribe("rowClickEvent", rowSelected);
			this.primaryTable.hideTableMessage();
		}	
	
    }
};

