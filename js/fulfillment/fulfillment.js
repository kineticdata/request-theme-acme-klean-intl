// Once the page has loaded
THEME.onPageLoad(function() {
    /**
     * Configure the page tabs:
     *  - Link the children of the +tabContainer+ element (tabs) to the children
     *     of the +contentContainer+ element (content panes).
     *  - When a tab is clicked:
     *    - Execute the +tabSelectHandler+ on the selected tab element.
     *    - Execute the +tabUnselectHandler+ on each of the other tab elements.
     *    - Execute the +contentSelectHandler+ on the content pane element 
     *      linked to the selected tab element.
     *    - Execute the +contentUnselectHandler+ on each of the content pane
     *      elements not linked to the selected tab element.
     */
    THEME.activateNavigation({
        navigationSelector: '#mainNavigation .navigationItem',
        navigationSelectHandler: function(element) {
            THEME.addClass(element, 'navigationItemActive');
        },
        navigationUnselectHandler: function(element) {
            THEME.removeClass(element, 'navigationItemActive');
        },
        contentSelector: '#taskPanels .taskPanel',
        contentSelectHandler: function(element) {
        	YAHOO.util.Dom.replaceClass(element, 'hide', 'show');
        	fulfillmentHelper.showTaskItems(element);
        },
        contentUnselectHandler: function(element) {
        	YAHOO.util.Dom.replaceClass(element, 'show', 'hide');
        }
    });
});

/**
 * The KINETIC global namespace object
 * @class KINETIC
 * @static
 */
if (typeof KINETIC == "undefined") {
    KINETIC = {};
}
if (typeof KINETIC.fulfillment == "undefined") {
    KINETIC.fulfillment = {};
}

if (! KINETIC.fulfillment.Helper){

    KINETIC.fulfillment.Helper= new function(){
        this.assignmentPanel=null;
		
		this.applyAssignment = function(button, loginName) {
			button.value="Assigning...";
			button.disabled=true;
			success = function(o) {
				
			}
			failure = function(o) {
					alert("An error has ocurred attempting to Assign a Task");
			}
 
			var rowID = fulfillmentHelper.tasksTable.getLastSelectedRecord();
			var assignmentID = fulfillmentHelper.tasksTable.getRecord(rowID).getData('assignment_id');
			connection = new KD.utils.Callback(success,failure,[]);
			var now = new Date();
			KD.utils.Action._makeSyncRequest(clientManager.themesDirectory+'jsp/callbacks/fulfillment/assignTask.jsp?assignmentID='+assignmentID+'&loginName='+loginName+'&noCache='+now.getTime(), connection);

			var rowID = fulfillmentHelper.tasksTable.getLastSelectedRecord();
			if (rowID) {
				record = fulfillmentHelper.tasksTable.getRecord(rowID);
				fulfillmentHelper.tasksTable.updateCell ( record , 'individual_name', loginName);
			}
		}
		
		this.cancelAssignment = function() {
			this.assignmentPanel.cancel();
		}
		
        this._buildAssignmentPanel = function(id, elId) {
            var  panelCfg, panelBody;

            if (this.assignmentPanel == null) {
                var pageEl = Dom.get("actionButtons");
                var top = YAHOO.util.Dom.getY(pageEl)-200;
                var left = YAHOO.util.Dom.getX(pageEl)+200;

                panelCfg = {
                    width:"480px",
                    x:left,
                    y:top,
                    zIndex:10000,
                    visible:false,
                    draggable:true,
                    close:true,
                    modal:true,
                    /*constraintoviewport:true,*/
                    underlay:"shadow",
                    iframe:false
                };

                this.assignmentPanel = new YAHOO.widget.SimpleDialog("panel_" + id, panelCfg);
                this.assignmentPanel.setHeader("Assignment Panel");
                this.assignmentPanel.setBody("<div><img alt='' src='resources/catalogIcons/ajax-loader.gif' style='margin:10px;padding:0px;' /></div>");
                this.assignmentPanel.render(elId);

                // give the panel body an id to grab onto
                panelBody = KD.utils.Util.getElementsByClassName("bd", "div", "panel_" + id)[0];
                if (panelBody) {
                    panelBody.id = "assignment_body";
                }
            } else {
                this.assignmentPanel.setBody("<div><img alt='' src='resources/catalogIcons/ajax-loader.gif' style='margin:10px;padding:0px;' /></div>");
            }

            // show the panel
            this.assignmentPanel.show();
        };       
    	
    	
    	this.assignTask = function() {
			var rowID = fulfillmentHelper.tasksTable.getLastSelectedRecord();
			if (rowID) {
				groupID = fulfillmentHelper.tasksTable.getRecord(rowID).getData('group_id');
				this._buildAssignmentPanel(rowID,Dom.get("assignTaskDialog"));
				connection = new KD.utils.Callback(KD.utils.Action._addInnerHTML,KD.utils.Action._addInnerHTML,['assignment_body'], true);
				var now = new Date();
				KD.utils.Action._makeSyncRequest(clientManager.themesDirectory+'jsp/pages/fulfillment/assignmentDialog.jsp?groupID='+groupID+'&noCache='+now.getTime(), connection);
			}

    		
    	};
    	
    	this.openTask = function() {
    		
    	};

    	this.loadDefaultTab = function() {
    		fulfillmentHelper.showTaskItems(Dom.get('myTaskPanel'));
    	};
    	    	
    	this.searchForTasks = function() {
    		fulfillmentHelper.showTaskItems(Dom.get('searchTaskPanel'), true);
    	};
    	
        this.myCustomFormatter = function(elLiner, oRecord, oColumn, oData) {
            if(oColumn.getKey()=="due_date") {
                var dt = new Date(oRecord.getData('due_date').replace(/-/gi, '/'));
                elLiner.innerHTML = KD.utils.Util.formatSimpleDateTime(dt);
            }
			
            if(oColumn.getKey()=="source_id") {
                var URL='';
                var titleVal='';
                var ID=oRecord.getData('source_id');
				
                elLiner.innerHTML = "<a class='requestLink' title='"+titleVal+"' href='"+URL+"'>" + ID + "</a>";				
            }
        };
        
        this.isApprovalRequest = function (submitType) {
            return (submitType == 'Approval' || submitType == 'Approval Task')
        };
		
    	this.buildSearchOptions = function() {
    		var searchValue="";
    		
    		var serviceRequestName = KD.utils.Action.getQuestionValue("Service Request Name");
    		if (serviceRequestName!=""){
    			searchValue += "&serviceItem="+serviceRequestName;
    		}
    		
    		var taskName = KD.utils.Action.getQuestionValue("Task Name");
    		if (taskName!=""){
    			searchValue += "&taskName="+taskName;
    		}
    		
    		var status = KD.utils.Action.getQuestionValue("Status");
    		if (status!=""){
    			searchValue += "&status="+status;
    		}

    		var dueDateStart = KD.utils.Action.getQuestionValue("Needed By Date - Start");
    		if (dueDateStart!=""){
    			searchValue += "&dueDateStart="+dueDateStart;
    		}

    		var dueDateEnd = KD.utils.Action.getQuestionValue("Needed By Date - End");
    		if (dueDateEnd!=""){
    			searchValue += "&dueDateEnd="+dueDateEnd;
    		}

    		var requesterLastName = KD.utils.Action.getQuestionValue("Requested For Last Name");
    		if (requesterLastName!=""){
    			searchValue += "&requesterLastName="+requesterLastName;
    		}

    		var assignedGroup = KD.utils.Action.getQuestionValue("Assigned Group");
    		if (assignedGroup!=""){
    			searchValue += "&assignedGroup="+assignedGroup;
    		}

    		var requestID = KD.utils.Action.getQuestionValue("KSR Number");
    		if (requestID!=""){
    			searchValue += "&requestID="+requestID;
    		}
    		
    		return searchValue;
    	}
        
        this.tasksTable;

        this.showTaskItems = function (element, searchByButton) {
        	var assignmentType;
        	var searchOptions;
        	if (element.id=="myTaskPanel") {
        		assignmentType="My";
        	} else if (element.id=="openTaskPanel") {
        		assignmentType="Open";
        	} else if (element.id=="unassignedTaskPanel") {
        		assignmentType="Unassigned";
        	} else if (element.id=="searchTaskPanel" && searchByButton) {
        		assignmentType="Search";
        		searchOptions=this.buildSearchOptions();
        	} else {
				fulfillmentHelper.disableActionButtons(true); //Disable buttons
        		return;
        	}
        	
            var options = {
            	assignmentType: assignmentType,
            	searchOptions: searchOptions,
            	containerID: element.id+'_TableDiv'
            };
            this._showTaskItems(options);
        };

        this._showTaskItems = function (options) {            
            if (fulfillmentHelper.tasksTable != undefined) {
            	fulfillmentHelper.tasksTable.destroy();
            }
        	
            // Add the custom formatter to the shortcuts
            YAHOO.widget.DataTable.Formatter.myCustom = fulfillmentHelper.myCustomFormatter;

            TasksTable = function() {
            	var pageSize=25;
            	var assignmentType=options.assignmentType;
            	var searchOptions=options.searchOptions;
            	var config = {
                        containerId: options.containerID,
                        defaultSortColumn: "date",
                        pageSize: pageSize,
                        path: clientManager.themesDirectory+'jsp/pages/fulfillment/assignments.jsp?catalogName='+clientManager.catalogName+'&groupIDs='+groupIDs+'&assignmentType='+assignmentType+'&pageSize='+pageSize+'&'+searchOptions
                    };
            	
                // Column definitions
                var dataTableColumns = [ // sortable:true enables sorting
	                {key:'assignment_id',label:'Assignment ID',hidden:true},
	                {key:'date',label:'Date',hidden:true,formatter:"myCustom"},
	                {key:'request_name',label:'Request Name',sortable:true},
	                {key:'source_name',label:'Task',sortable:true},
	                {key:'due_date',label:'Due Date',hidden:false},
	                {key:'requester_name',label:'Requested For',sortable:true},
	                {key:'group_id',label:'Assigned Group ID',hidden:true},
	                {key:'group_name',label:'Assigned Group',sortable:true},
	                {key:'individual_name',label:'Assigned To',sortable:true},
	                {key:'status',label:'Status',sortable:true},
	                {key:'source_id',label:'ID',sortable:true,formatter:"myCustom"}
                ];

                var responseSchema = {
                    	resultsList: "records",
                        fields: [
							 "assignment_id",
    	                     "date",
    	                     "due_date",
    	                     "request_name",
    	                     "request_id",
    	                     "request_guid",
    	                     "status",
    	                     "individual_id",
    	                     "individual_name",
    	                     "group_id",
    	                     "group_name",
    	                     "source_id",
    	                     "source_guid",
    	                     "source_name",
    	                     "requester_name",
    	                     "requester_email"
                        ],
                        metaFields: {
                            startIndex: "startIndex",
                            totalRecords: "totalRecords"
                        }
                    };			

                var path = clientManager.themesDirectory+'jsp/pages/fulfillment/assignments.jsp?catalogName='+clientManager.catalogName+'&groupIDs='+groupIDs+'&assignmentType='+options.assignmentType+'&pageSize='+options.pageSize+'&'+options.searchOptions;
                var initialDataSource = new YAHOO.util.DataSource(path);
                initialDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
                initialDataSource.responseSchema = responseSchema;
				
                // Initialize the data source (which will be used for future XHR calls).
                var dataSource = new YAHOO.util.DataSource(config.path);
                dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
                dataSource.responseSchema = responseSchema;
                
                // Customize request sent to server to be able to set total # of records
                var generateRequest = function(oState) {
                    //
                    oState = oState || { pagination: null, sortedBy: null };
                    var sort = (oState.sortedBy) ? oState.sortedBy.key : config.defaultSortColumn;
                    var order = (oState.sortedBy && oState.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? "desc" : "asc";
                    var recordOffset = (oState.pagination) ? oState.pagination.recordOffset : 0;

                    // Build custom request
                    return  "sort=" + sort +
                            "&order=" + order +
                            "&startIndex=" + recordOffset +
                            "&pageSize=" + config.pageSize;
                };

                // DataTable configuration
                var dataTableConfiguration = {
                	generateRequest: generateRequest,
                    // Initial request for first page of data
                    initialLoad: true,
                    datasource: initialDataSource,
                    // Enables dynamic server-driven data
                	dynamicData : true,
                    MSG_ERROR: 'Your session may have expired. Please refresh the page.',
                    sortedBy:{
                        key:'date',
                        dir:'desc'
                    },
                    // Confgure the pagination
                    paginator: new YAHOO.widget.Paginator({
                        rowsPerPage: config.pageSize
                    })
                };

                // Initialize the DataTable instance with the configuration objects.
                fulfillmentHelper.tasksTable = new YAHOO.widget.DataTable(
                    config.containerId,
                    dataTableColumns,
                    dataSource,
                    dataTableConfiguration);

                fulfillmentHelper.tasksTable._sId="yui-dt";

                // Update totalRecords on the fly with values from server
                fulfillmentHelper.tasksTable.doBeforeLoadData = function(oRequest, oResponse, oPayload) {
                    oPayload.totalRecords = oResponse.meta.totalRecords;
                    oPayload.pagination.recordOffset = oResponse.meta.startIndex;
                    return oPayload;
                };
                
                // Override the pagination function to avaoid the Loading message showing and creating a jumping visual affect */
                fulfillmentHelper.tasksTable.doBeforePaginatorChange = function(oPaginatorState) {
                	return true;
                };

                // Manually load the data table with the initial data
                //catalogHelper.requestsTable.load({datasource: initialDataSource});
                
                // Subscribe to events for row selection
                fulfillmentHelper.tasksTable.subscribe("rowMouseoverEvent", fulfillmentHelper.tasksTable.onEventHighlightRow);
                fulfillmentHelper.tasksTable.subscribe("rowMouseoutEvent", fulfillmentHelper.tasksTable.onEventUnhighlightRow);
                fulfillmentHelper.tasksTable.subscribe("rowClickEvent", fulfillmentHelper.tasksTable.onEventSelectRow);
                fulfillmentHelper.tasksTable.subscribe("rowClickEvent", fulfillmentHelper.taskRowSelected);
                fulfillmentHelper.tasksTable.subscribe("postRenderEvent", fulfillmentHelper.IE8Hack);
                fulfillmentHelper.tasksTable.subscribe("tableMsgHideEvent", fulfillmentHelper.IE67HideMessageHack);
                
				fulfillmentHelper.disableActionButtons(true); //Disable buttons
            }();
        };
        
		this.taskRowSelected = function(oArgs) {
			var rowID = fulfillmentHelper.tasksTable.getLastSelectedRecord();
			if (rowID) {
			}
			fulfillmentHelper.disableActionButtons(false); //Enabled buttons
		}
		
		this.disableActionButtons = function(disable) {
			Dom.get("assignTaskButton").disabled = disable;
			Dom.get("openTaskButton").disabled = disable;
		}
		
        // This is a hack to ensure the Loading message for IE6&7 is removed properly.
        this.IE67HideMessageHack = function() {
        	if (!window.XMLHttpRequest || (document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")){
        		var tasksPanelsDiv = Dom.get("taskPanels");
        		var messageBody = Dom.getElementsByClassName("yui-dt-message", "tbody",  tasksPanelsDiv )[0];
        		var messageLiner = Dom.getElementsByClassName("yui-dt-liner", "div",  messageBody )[0];
        		messageLiner.style.display="none";
        	}
        };
        
        // This is a hack to ensure that when the table is drawn it displays properly in IE8.
        // Without this hack, if you load the table and keep the cursor outside of the table, the table background draws but not the data.
        this.IE8Hack = function() {
            fulfillmentHelper.tasksTable.selectRow(0);
			if (fulfillmentHelper.tasksTable.getRecordSet().getLength()>0){
				fulfillmentHelper.taskRowSelected();
			}
        };
    	
    	
        this.keepSessionAlive = function(){
            KD.utils.ClientManager.checkSession();
            setTimeout('fulfillmentHelper.keepSessionAlive()', 1000*60*19);
        };
    };
};

var fulfillmentHelper = KINETIC.fulfillment.Helper;
