/**
 * The KINETIC global namespace object
 * @class KINETIC
 * @static
 */
if (typeof KINETIC == "undefined") {
    KINETIC = {};
}
if (typeof KINETIC.catalog == "undefined") {
    KINETIC.catalog = {};
}

if (! KINETIC.catalog.Helper){

    KINETIC.catalog.Helper= new function(){
        this.currentCategorySI=null;
        this.currentServiceItemLaunch=null;
        this.categoriesLoaded=false;
        this.summaryLoaded=false;
        this.currentRequestAction=null;
        this.siDescriptions={};

        this.keepSessionAlive = function(){
            KD.utils.ClientManager.checkSession();
            setTimeout('catalogHelper.keepSessionAlive()', 1000*60*19);
        };

        this.adjustDivs = function() {
            /* This code is for IE 6&7 that does not apply min-height styles 
             * || (document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")*/
            if (!window.XMLHttpRequest ){
            	var catSI = YAHOO.util.Dom.get('categoryServiceItems');
                var siLaunchHolder = YAHOO.util.Dom.get('serviceItemLaunch_holder');
	            if (siLaunchHolder.clientHeight>catSI.clientHeight){
	            	catSI.style.height="auto";
	            } else {
	            	var siHolder = YAHOO.util.Dom.get('serviceItemsHolder');
		            if (siHolder.style.height){
		            	catSI.style.height=siHolder.style.height;
		            	siLaunchHolder.style.height=siHolder.style.height;
		            }
	            }
            } else {
                YAHOO.util.Dom.get('categoryServiceItems').style.height = "";
                YAHOO.util.Dom.get('serviceItemLaunch_holder').style.height = "";
            }
        };
        
        this.adjustSearchDivs = function() {
            /* This code os for IE that does not apply min-height styles 
             * || (document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")*/
            if (!window.XMLHttpRequest || (document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")){
                var catSI = YAHOO.util.Dom.get('categoryServiceItems');               
                var siLaunchHolder = YAHOO.util.Dom.get('serviceItemLaunch_holder');
                var searchReturnDiv = Dom.get('searchReturn');
                var searchResultsDiv = Dom.get('searchResults_ServiceItems');
                
                var siLaunchHolderHeight = siLaunchHolder.clientHeight;
                var catSIHeight = catSI.clientHeight;
                var searchReturnDivHeight = searchReturnDiv.clientHeight;
                
                if ((document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")){
                	siLaunchHolder.style.height="auto";
                	siLaunchHolderHeight = siLaunchHolder.clientHeight;
                }
 
	            if (siLaunchHolderHeight>catSIHeight){
	            	catSI.style.height=siLaunchHolderHeight+"px";;
	            	searchResultsDiv.style.height=siLaunchHolderHeight+"px";;
	            } else if (searchReturnDivHeight>catSIHeight){
	            	searchResultsDiv.style.height=searchReturnDivHeight+"px";;
	            	catSI.style.height=searchReturnDivHeight+"px";;
	            	siLaunchHolder.style.height=searchReturnDivHeight+"px";;
	            } else if (searchReturnDivHeight > siLaunchHolderHeight){
	            	catSI.style.height=searchReturnDivHeight+"px";
	            	siLaunchHolder.style.height=searchReturnDivHeight+"px";;
	            	searchResultsDiv.style.height=searchReturnDivHeight+"px";;
	            }
                
                searchReturnDiv.style.top=10+'px';	            
            }
        };
       
        this.processSearchResult = function(o) {
            KD.utils.Action._addInnerHTML(o);

            var csiDiv = Dom.get('categoryServiceItems');
            var height = csiDiv.clientHeight;
            var searchReturnDiv = Dom.get('searchReturn');

            searchReturnDiv.style.top=10+"px";

            var searchResultServiceItemsDiv = Dom.get('searchResults_ServiceItems');
            var searchCategoryLabelHolderDiv = Dom.get('searchCategoryLabelHolder');
            
            if (searchResultServiceItemsDiv.clientHeight > height) {
            	Dom.get('categoryServiceItems').style.height=searchResultServiceItemsDiv.clientHeight+"px";     
            	Dom.get('serviceItemLaunch_holder').style.height=searchResultServiceItemsDiv.clientHeight+"px";                 	
            } else {
                searchReturnDiv.style.height=height+'px';
                searchCategoryLabelHolderDiv.style.height=(height-15/*to offset margin-top:15px*/)+'px';
            	searchResultServiceItemsDiv.style.height=height+'px';
            }
            searchResultServiceItemsDiv.style.height=searchReturnDiv.clientHeight+"px";;
            
            catalogHelper.clearCurrentServiceItemLaunch();            
        };

        this.showMyInfo = function() {
            var section = YAHOO.util.Dom.get("MyInfo_Section");

            if (section.style.display=='block') {
                section.style.display='none';
            } else {
                section.style.display='block';
            }
		};
		
        this.hideMyInfo = function() {
            var section = YAHOO.util.Dom.get("MyInfo_Section");
            section.style.display='none';
        };

        this.showMainDisplay = function(){
            var mainPanel = YAHOO.util.Dom.get('serviceItems');
            mainPanel.style.display='block';

            var siPanel = YAHOO.util.Dom.get('categoryServiceItems');
            siPanel.style.display='block';

            this.resetSearch();
            this.resetRequests();

            this.adjustDivs();
            
            this.hideMyInfo();
            if (this.oServiceItemPanel)
                this.oServiceItemPanel.hide();
            this.reflectLastAction();

            //KD.utils.ClientManager.renderSimpleLogin();
        };

        this.getContentHeight = function(){
            var catHeight = YAHOO.util.Dom.get('categoryItems').clientHeight;
            var tempHeight = 56 + 30 + catHeight + 30 + 15 + 20;
            return tempHeight;
        };

        this.showSearchResults = function(){
            this.resetRequests();

            var mainPanel = YAHOO.util.Dom.get('serviceItems');
            mainPanel.style.display='block';

            var siPanel = YAHOO.util.Dom.get('categoryServiceItems');
            siPanel.style.display='block';

            var searchReturn=YAHOO.util.Dom.get('searchReturn');
            if (searchReturn)
                searchReturn.style.display='block';
			
            this.hideMyInfo();
        };

        this.hideSearchResults = function(){
            var searchReturn=YAHOO.util.Dom.get('searchReturn');
            searchReturn.innerHTML = '';

            this.showMainDisplay();
        };

        this.showRequestPanel = function(obj){
            this.currentRequestAction = obj;
            this.resetSearch();
            KD.utils.Action.insertElement('My Requests')
			
            var mainPanel = YAHOO.util.Dom.get('serviceItems');
            mainPanel.style.display='none';

            var siPanel = YAHOO.util.Dom.get('categoryServiceItems');
            siPanel.style.display='none';

            var holder = new YAHOO.util.Element('myServiceItemSummary');

            var selected = holder.getElementsByClassName('requestsSelected', 'div');
            for (var i=0; i<selected.length; i++) {
                var el  = new YAHOO.util.Element(selected[i]);
                el.removeClass('requestsSelected');
            }

            el = new YAHOO.util.Element(obj);
            el.addClass('requestsSelected');
            this.hideMyInfo();
			
            this.setLastRequestsAction(obj.id);
        };

        this.resetRequests = function() {
            Dom.get('myRequests').style.display="none";
            var holder = new YAHOO.util.Element('myServiceItemSummary');

            var selected = holder.getElementsByClassName('requestsSelected', 'div');
            for (var i=0; i<selected.length; i++) {
                var el  = new YAHOO.util.Element(selected[i]);
                el.removeClass('requestsSelected');
            }
            this.clearRequestsAction();
        };
		
        this.resetSearch = function(){
            // Hide Search results panel
            var searchReturn=YAHOO.util.Dom.get('searchReturn');
            if (searchReturn)
                searchReturn.style.display='none';

            KD.utils.Action.setQuestionValue('Search','');

            var siPanel = YAHOO.util.Dom.get('categoryServiceItems');
            if (siPanel)
                siPanel.style.visibility='visible';
        };

        this.selectCategory = function(obj){
            var id = obj.id.replace('category_','');
            var holder = new YAHOO.util.Element('serviceItemsHolder');

            this.resetSearch();

            var selected = holder.getElementsByClassName('categorySelected', 'div');
            for (var i=0; i<selected.length; i++) {
                var el  = new YAHOO.util.Element(selected[i]);
                el.removeClass('categorySelected');
            }

            el = new YAHOO.util.Element(obj);
            el.addClass('categorySelected');

            // Switch in the reflected Category Service Items
            var siPlaceHolder = YAHOO.util.Dom.get('serviceItemPlaceholder');
            var siListHolder = YAHOO.util.Dom.get('serviceItemsList_holder');

            if (this.currentCategorySI && siPlaceHolder && siListHolder) {
                try {
                    var siDiv=siListHolder.removeChild(this.currentCategorySI);
                    if (siDiv) {
                        siDiv.style.display='none';
                        // Place back into PlaceHolder
                        siPlaceHolder.appendChild(siDiv);
                    }
                } catch (e) {}
            }

            siDiv = YAHOO.util.Dom.get('serviceItems_'+id);
            if (siDiv) {
                if (siPlaceHolder) {
                    siPlaceHolder.removeChild(siDiv);
                }

                if (siListHolder) {
                    siListHolder.appendChild(siDiv);
                }
                siDiv.style.display='block';

                this.currentCategorySI=siDiv;
            }
            this.clearSelectedServiceItem();

            this.clearCurrentServiceItemLaunch();
            this.hideMyInfo();
			
            this.setLastCategoryAction(obj.id);
        };

        this.clearSelectedServiceItem = function() {
            var holder = new YAHOO.util.Element('serviceItemsList_holder');
            var selected = holder.getElementsByClassName('serviceItemSelected', 'div');
            for (var i=0; i<selected.length; i++) {
                var el  = new YAHOO.util.Element(selected[i]);
                el.removeClass('serviceItemSelected');
            }
        };

        this.clearSearchSelectedServiceItem = function() {
            var holder = new YAHOO.util.Element('searchResults_ServiceItems');
            var selected = holder.getElementsByClassName('serviceItemSelected', 'div');
            for (var i=0; i<selected.length; i++) {
                var el  = new YAHOO.util.Element(selected[i]);
                el.removeClass('serviceItemSelected');
            }
        };

        this.getXmlRecordField = function (obj, fieldId) {
            if (obj && obj.responseXML) {
                var record = obj.responseXML.getElementsByTagName("record")[0];
                var fields = record.getElementsByTagName("field");
                for (var i = 0; i < fields.length; i += 1) {
                    var fieldIdValue = fields[i].getAttribute('id');
                    if (fieldIdValue == fieldId) {
                        if (fields[i].text) {
                            return fields[i].text; //IE
                        } else {
                            return fields[i].textContent;
                        }
                    }
                }
            }
            return undefined;
        };

        this.getClickedServiceItem = function (obj) {
            var selEl = obj;
            // figure out which element was selected that triggered this action
            // if it came from a simple data response, will be wrapped up in the
            // argument property.
            if (obj && obj.argument && KD.utils.Util.isArray(obj.argument)) {
                // if the object was specified as an array, the descriptionText is
                // the first element, and the clicked service item is the
                // second element
                if (KD.utils.Util.isArray(obj.argument[0])) {
                    selEl = obj.argument[0][1];
                } else {
                    selEl = obj.argument[0];
                }
            }
            return selEl;
        };

        this.getServiceItemDescription = function (obj, prefix, fSuccess, fFailure) {
            var id = obj.id.replace(prefix, ''),
            launchHolder, siSummary, dynTextLayer, sdrId,
            clientAction, connection, paramStr;

            // get the service item description from the server
            siSummary = YAHOO.util.Dom.get('myServiceItemSummary');
            dynTextLayer = siSummary.parentNode;
            if (dynTextLayer) {
                sdrId = KD.utils.Util.getIDPart(dynTextLayer.id);
                if (sdrId) {
                    // need to store a copy of the current launched service item
                    // because the node will get wiped out when the AJAX loader
                    // image is displayed
                    if (catalogHelper.currentServiceItemLaunch) {
                        catalogHelper.currentServiceItemLaunch = catalogHelper.currentServiceItemLaunch.cloneNode(true);
                    }
                    launchHolder = YAHOO.util.Dom.get('serviceItemLaunch_holder');
                    paramStr = "templateId=" + id;
                    clientAction = KD.utils.ClientManager.customEvents.getItem(sdrId)[0];
                    connection = new KD.utils.Callback(fSuccess, fFailure, [launchHolder, obj], true);
                    var myPartial = '../../'+clientManager.themesDirectory+'jsp/pages/catalog/siDescription';

                    KD.utils.Action.makeAsyncRequest('getSiDesc', clientAction.actionId, connection, paramStr, myPartial, true);
                } else {
                    catalogHelper.showSelectedServiceItem(obj);
                    return;
                }
            }
        };

        this.selectServiceItem = function (obj) {
            var prefix = 'serviceItem_',
            id = obj.id.replace(prefix,''),
            success = catalogHelper.showSelectedServiceItem,
            failure = catalogHelper.showSelectedServiceItem,
            desc = catalogHelper.siDescriptions[id];
                
            if (desc != null && desc != undefined) {
                // description was in the cache, use it
                catalogHelper.showSelectedServiceItem(obj, desc);
                return;
            }
            
            // it wasn't in the cache, get it from the server
            catalogHelper.getServiceItemDescription(obj, prefix, success, failure);
        };

        this.showSelectedServiceItem = function (obj, desc) {
            var selEl = catalogHelper.getClickedServiceItem(obj),
            prefix = 'serviceItem_', id, el,
            siLaunchPlaceHolder, siLaunchHolder, launchDiv, loaderImg, method,
            descTextDiv, descriptionContainers;

            // bail out if the clicked service item could not be determined
            if (!selEl) {
                return;
            }

            // just want the instanceid of the service item
            id = selEl.id.replace(prefix,'');

            // if the description wasn't provided directly, look into the
            // simple data response object to get it
            if (desc == null || desc == undefined) {
                //desc = catalogHelper.getXmlRecordField(obj, "Survey_Description") || "";
                desc = obj.responseText;
                // cache the description
                catalogHelper.siDescriptions[id] = desc;
            }

            catalogHelper.clearSelectedServiceItem();
            catalogHelper.clearCurrentServiceItemLaunch();

            el = new YAHOO.util.Element(selEl);
            el.addClass('serviceItemSelected');

            // Switch in the reflected Service Item Launch info
            siLaunchPlaceHolder = YAHOO.util.Dom.get('serviceItemLaunch_Placeholder');
            siLaunchHolder = YAHOO.util.Dom.get('serviceItemLaunch_holder');
            loaderImg = siLaunchHolder.getElementsByTagName("img")[0];
            if (loaderImg) {
                loaderImg.parentNode.removeChild(loaderImg);
            }

            launchDiv = YAHOO.util.Dom.get('launch_'+id);
            if (!launchDiv) {
                // do this for IE6
                method = function(el) {return el.id == 'launch_' + id;}
                launchDiv = YAHOO.util.Dom.getElementsBy(method, 'div', siLaunchPlaceHolder)[0]
            }
            // get the description text element and add the description
            descTextDiv = YAHOO.util.Dom.getElementsByClassName("descriptionText", "div", launchDiv)[0];
            descTextDiv.innerHTML = desc;

            launchDiv = launchDiv.parentNode.removeChild(launchDiv);
            launchDiv = siLaunchHolder.appendChild(launchDiv);
            launchDiv.style.display='block';

            catalogHelper.currentServiceItemLaunch=launchDiv;

            descriptionContainers = YAHOO.util.Dom.get('descriptionContainer_' + id);
            if (!descriptionContainers) {
                // do this for IE6
                method = function(el) {return el.id == 'descriptionContainer_' + id;}
                descriptionContainers = YAHOO.util.Dom.getElementsBy(method, 'div', siLaunchHolder)[0]
            }
            requestDescriptionHeight = descriptionContainers.offsetHeight;
            catHeight = YAHOO.util.Dom.get('categoryItems').offsetHeight;
            
            catalogHelper.adjustDivs();
            
            catalogHelper.hideMyInfo();
        };

        this.selectSearchServiceItem = function (obj) {
            var prefix = 'search_serviceItem_',
            id = obj.id.replace(prefix,''),
            success = catalogHelper.showSelectedSearchItem,
            failure = catalogHelper.showSelectedSearchItem,
            desc = catalogHelper.siDescriptions[id];

            if (desc != null && desc != undefined) {
                // description was in the cache, use it
                catalogHelper.showSelectedSearchItem(obj, desc);
                return;
            }

            // it wasn't in the cache, get it from the server
            catalogHelper.getServiceItemDescription(obj, prefix, success, failure);
        };

        this.showSelectedSearchItem = function (obj, desc) {
            var selEl = catalogHelper.getClickedServiceItem(obj),
            prefix = 'search_serviceItem_', id, el,
            siLaunchPlaceHolder, siLaunchHolder, launchDiv, loaderImg, method,
            descTextDiv;

            // bail out if the clicked service item could not be determined
            if (!selEl) {
                return;
            }

            // just want the instanceid of the service item
            id = selEl.id.replace(prefix,'');

            // if the description wasn't provided directly, look into the
            // simple data response object to get it
            if (desc == null || desc == undefined) {
                desc = catalogHelper.getXmlRecordField(obj, "Survey_Description") || "";
                // put the description in the cache so it won't
                // be loaded from the server again
                catalogHelper.siDescriptions[id] = desc;
            }

            catalogHelper.clearSearchSelectedServiceItem();
            catalogHelper.clearCurrentServiceItemLaunch();

            el = new YAHOO.util.Element(selEl);
            el.addClass('serviceItemSelected');

            // Switch in the reflected Service Item Launch info
            siLaunchPlaceHolder = YAHOO.util.Dom.get('serviceItemLaunch_Placeholder');
            siLaunchHolder = YAHOO.util.Dom.get('serviceItemLaunch_holder');
            loaderImg = siLaunchHolder.getElementsByTagName("img")[0];
            if (loaderImg) {
                loaderImg.parentNode.removeChild(loaderImg);
            }

            launchDiv = YAHOO.util.Dom.get('launch_' + id);
            if (!launchDiv) {
                // do this for IE6
                method = function(el) {return el.id == 'launch_' + id;}
                launchDiv = YAHOO.util.Dom.getElementsBy(method, 'div', siLaunchPlaceHolder)[0]
            }

            if (launchDiv) { // Service Item has been associated to a Category
                // get the description text element and add the description
                descTextDiv = YAHOO.util.Dom.getElementsByClassName("descriptionText", "div", launchDiv)[0];
                descTextDiv.innerHTML = desc;
                launchDiv = launchDiv.parentNode.removeChild(launchDiv);
            } else { // Not related to a Service Item.
                launchDiv = YAHOO.util.Dom.get('launch_NotCategorized');
                var but = YAHOO.util.Dom.getElementsByClassName('UncategorizedServiceItemButton', 'input', launchDiv);
                but[0].onclick = function() {
                    window.location="DisplayPage?srv=" + encodeURIComponent(id);
                };
            }

            launchDiv = siLaunchHolder.appendChild(launchDiv);
            launchDiv.style.display='block';

            catalogHelper.currentServiceItemLaunch=launchDiv;

            descriptionContainers = YAHOO.util.Dom.get('descriptionContainer_' + id);
            if (!descriptionContainers) {
                // do this for IE6
                method = function(el) {return el.id == 'descriptionContainer_' + id;}
                descriptionContainers = YAHOO.util.Dom.getElementsBy(method, 'div', siLaunchHolder)[0]
            }
            
            /* Adjust the search Divs to service item description */
            var siLaunchHolder=Dom.get("serviceItemLaunch_holder");
            var searchResultsSIs = Dom.get("searchResults_ServiceItems");
            searchResultsSIs.style.height=siLaunchHolder.clientHeight+"px";
            
            /* Adjust Divs if SI description is large */
            var descContainerDiv = Dom.getElementsByClassName("descriptionContainer", "div", launchDiv)[0];
            if (descContainerDiv.clientHeight>siLaunchHolder.clientHeight) {
            	siLaunchHolder.style.height = descContainerDiv.clientHeight+"px";
            	Dom.get("categoryServiceItems").style.height = descContainerDiv.clientHeight+"px";
            	searchResultsSIs.style.height = descContainerDiv.clientHeight+"px";            	
            }

            catalogHelper.adjustSearchDivs();

            catalogHelper.hideMyInfo();
        };

        this.clearCurrentServiceItemLaunch = function() {
            if (catalogHelper.currentServiceItemLaunch) {
                var siLaunchPlaceHolder = YAHOO.util.Dom.get('serviceItemLaunch_Placeholder'),
                    launchDiv = catalogHelper.currentServiceItemLaunch;

                try {
                    launchDiv = launchDiv.parentNode.removeChild(launchDiv);
                } catch (e) {}
                launchDiv.style.display='none';
                // Place back into PlaceHolder
                launchDiv = siLaunchPlaceHolder.appendChild(launchDiv);
                catalogHelper.currentServiceItemLaunch=null;
            }
        };

        this.setLastCategoryAction = function(id){
            KD.utils.Util.setCookie("KD_LastCategoryAction_ID", id, 10000000);
            this.clearRequestsAction();
        };

        this.clearRequestsAction = function(){
            KD.utils.Util.deleteCookie("KD_LastRequestsAction_ID");
        };
        this.setLastRequestsAction = function(id){
            KD.utils.Util.setCookie("KD_LastRequestsAction_ID", id, 10000000);
        };

        this.reflectLastAction = function(){
            var id = KD.utils.Util.getCookie("KD_LastRequestsAction_ID");
            if (id) {
                var el = new YAHOO.util.Dom.get(id);
                if(el && el.id != undefined) {
                    el.onclick();
                }
            } else {
                id = KD.utils.Util.getCookie("KD_LastCategoryAction_ID");
			
                if (id) {
                    el = new YAHOO.util.Dom.get(id);
                    if(el && el.id != undefined) {
                        el.onclick();
                    }
                } else {
                    catalogHelper.setCategoryDefaultSelection();
                }
            }
            
        };

        this.showDetails = function(csrv) {
            window.open(KD.utils.ClientManager.webAppContextPath+'/ReviewRequest?csrv='+csrv+'&excludeByName=Review Page&reviewPage='+clientManager.themesDirectory+'jsp/pages/review', '_blank');
        };

        this.setCategoryDefaultSelection = function() {
            var siHolder = YAHOO.util.Dom.get('serviceItemsHolder');

            var category = KD.utils.Util.getElementsByClassName('categoryItem', 'div', siHolder);
            if (category.length > 0) {
                category[0].onclick();
            }

        };
		
        this.buildDataRequestURL = function(requestName, dataRequestId, paramString, useGetList, paramString){
            if(KD.utils.Action.sdrErrors == null){
                KD.utils.Action.sdrErrors = new KD.utils.Hash();
            }

            dataRequestId=encodeURIComponent(dataRequestId);
            requestName=encodeURIComponent(requestName);
            var sessionId=encodeURIComponent(KD.utils.ClientManager.sessionId);
            var now = new Date();
            var entryParam="";
            if(useGetList == true){
                entryParam="&useGetList=true"
            }
            var path = "SimpleDataRequest?requestName="+ requestName +"&dataRequestId="+ dataRequestId +"&sessionId="+sessionId +"&"+ paramString+entryParam+"&noCache="+now.getTime();
            return path;
        };
        
        this.myCustomFormatter = function(elLiner, oRecord, oColumn, oData) {
            if(oColumn.getKey()=="user_indicator") {
                if (oRecord.getData('user_indicator')=="NEW_MESSAGE") {
                    var params = 'paramCustomerSurveyID='+oRecord.getData("instance_id")+'&paramVersion='+oRecord.getData("version");

                    var image = clientManager.webAppContextPath+'/'+clientManager.themesDirectory+'images/conversation_alert.png';
                    elLiner.innerHTML = ' <img width="16px" src="'+image+'" onclick="javascript:catalogHelper.showSelectedRequest(\''+oRecord.getData('instance_id')+'\',null,\''+params+'\')"/>';
                }
            }
            if(oColumn.getKey()=="name") {
                var submitType = oRecord.getData('submit_type');
                var nameStr="";
                if (KINETIC.catalog.Helper.isApprovalRequest(submitType)) {
                    nameStr = oRecord.getData('originating_form');
                } else {
                    nameStr = oRecord.getData('name');
                }

                if (nameStr.length > 25) {
                    nameStr = nameStr.substring(0,22)+"...";
                }

                nameStr = nameStr.replace(/ /g, '&nbsp;');
                elLiner.innerHTML = nameStr;
            }
            if(oColumn.getKey()=="date") {
                var dt = new Date(oRecord.getData('date'));
                elLiner.innerHTML = KD.utils.Util.formatSimpleDateTime(dt);
            }

            if(oColumn.getKey()=="validation_status") {
                var statusStr = oRecord.getData('validation_status');
                if (oRecord.getData('submission_status')=="In Progress"){
                        statusStr = "In Complete".localize();
                }
                var notes = oRecord.getData('notes');
                if (notes.length > 35) {
                    notes = notes.substring(0,32)+"...";
                }

                if (notes.length > 0) {
                    statusStr += ' ('+notes+')';
                }
                statusStr = statusStr.replace(/ /g, '&nbsp;');
                elLiner.innerHTML = statusStr;
            }
			
            if(oColumn.getKey()=="requestId") {
                var URL='';
                var titleVal='';
                var submissionStatus = oRecord.getData('submission_status');
                var submitType = oRecord.getData('submit_type');
                var ID=oRecord.getData('requestId');
				
                if (submissionStatus=='In Progress') {
                    URL = 'DisplayPage?csrv=' + oRecord.getData('instance_id');
                    titleVal = 'Complete current In Progress Request'.localize();
                } else if (KINETIC.catalog.Helper.isApprovalRequest(submitType) && submissionStatus=='Sent') {
                    URL = 'DisplayPage?csrv=' + oRecord.getData('instance_id');
                    titleVal = 'Complete approval response'.localize();
                    ID = oRecord.getData('originating_id_display');
                } else if (submitType=='Fulfillment' && submissionStatus=='New') {
                    URL = 'DisplayPage?csrv=' + oRecord.getData('instance_id');
                    titleVal = 'Complete fulfilment Task'.localize();
                    ID = oRecord.getData('originating_id_display');
                } else if (KINETIC.catalog.Helper.isApprovalRequest(submitType) && submissionStatus=='Completed') {
                    var params = "paramCustomerSurveyID="+oRecord.getData('instance_id')+"&paramVersion="+oRecord.getData('version');
                    URL = 'javascript:catalogHelper.showSelectedRequest("'+oRecord.getData('originating_id')+'",null,"'+params+'")';
                    titleVal = 'View request fulfillment details'.localize();
                    ID = oRecord.getData('originating_id_display');
                } else if (submissionStatus=='Completed' || submissionStatus=='Closed' ) {
                    var params = "paramCustomerSurveyID="+oRecord.getData('instance_id')+"&paramVersion="+oRecord.getData('version');
                    URL = 'javascript:catalogHelper.showSelectedRequest("'+oRecord.getData('instance_id')+'",null,"'+params+'")';
                    titleVal = 'View request fulfillment details'.localize();
                }
								
                elLiner.innerHTML = "<a class='requestLink' title='"+titleVal+"' href='"+URL+"'>" + ID + "</a>";				
            }
        };
        
        this.isApprovalRequest = function (submitType) {
            return (submitType == 'Approval' || submitType == 'Approval Task')
        };
		
        this.requestsTable;

        this.showSelectedRequests = function (requestGroup, requestType, paramString) {
            var options = {
            	requestGroup: requestGroup,
            	requestType: requestType,
                isActionPending: false,
                paramString: paramString
            };
            Dom.get('myRequests').style.display="block";
            this._showSelectedRequests(options);
        };

        this._showSelectedRequests = function (options) {
            
            if (catalogHelper.requestsTable != undefined) {
                catalogHelper.requestsTable.destroy();
            }
        	
            // Add the custom formatter to the shortcuts
            YAHOO.widget.DataTable.Formatter.myCustom = catalogHelper.myCustomFormatter;

            SummissionsTable = function() {
				var dt = new Date();
            	var pageSize=20;
            	var config = {
                        containerId: "selectedServiceItems",
                        defaultSortColumn: "name",
                        defaultSortOrder: "asc",
                        pageSize: pageSize,
                        path: clientManager.themesDirectory+'jsp/pages/catalog/submissions.jsp?catalogName='+clientManager.catalogName+'&requestGroup='+options.requestGroup+'&requestType='+options.requestType+'&pageSize='+pageSize+'&cache='+dt.getTime()
                    };
            	
                // Column definitions
                var dataTableColumns = [ // sortable:true enables sorting
	                {key:'date',label:'Date'.localize(),sortable:true,formatter:"myCustom"},
	                {key:'name',label:'Name'.localize(),sortable:true,formatter:"myCustom"},
	                {key:'validation_status',label:'Status'.localize(),sortable:false,formatter:"myCustom"},
	                {key:'requestId',label:'Request ID'.localize(),sortable:true,formatter:"myCustom"},
	                {key:'user_indicator',label:'',sortable:true,formatter:"myCustom"},
	                {key:'submit_type',label:'',hidden:true},
	                {key:'instance_id',label:'',hidden:true},
	                {key:'request_status',label:'',hidden:true},
	                {key:'submission_status',label:'',hidden:true},
	                {key:'version',label:'',hidden:true},
	                {key:'originating_form',label:'',hidden:true},
	                {key:'originating_id_display',label:'',hidden:true},
	                {key:'originating_id',label:'',hidden:true},
	                {key:'notes',label:'',hidden:true}
                ];

                var responseSchema = {
                    	resultsList: "records",
                        fields: [
    	                     "user_indicator",
    	                     "date",
    	                     "name",
    	                     "originating_form",
    	                     "validation_status",
    	                     "requestId",
    	                     "submit_type",
    	                     "instance_id",
    	                     "request_status",
    	                     "submission_status",
    	                     "version",
    	                     "originating_id_display",
    	                     "originating_id",
    	                     "notes"
                        ],
                        metaFields: {
                            startIndex: "startIndex",
                            totalRecords: "totalRecords"
                        }
                    };			
                // Customize request sent to server to be able to set total # of records
                var generateRequest = function(oState) {
                    //
                    oState = oState || { pagination: null, sortedBy: null };
                    var sort = (oState.sortedBy) ? oState.sortedBy.key : config.defaultSortColumn;
                    var order = (oState.sortedBy && oState.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? "desc" : "asc";
                    var recordOffset = (oState.pagination) ? oState.pagination.recordOffset : 0;

                    // Build custom request
                    return  "&sort=" + sort +
                            "&order=" + order +
                            "&startIndex=" + recordOffset +
                            "&pageSize=" + config.pageSize;
                };

                var initialLoadPath = clientManager.themesDirectory+'jsp/pages/catalog/submissions.jsp?catalogName='+clientManager.catalogName+'&requestGroup='+options.requestGroup+'&requestType='+options.requestType+'&pageSize='+options.pageSize+'&cache='+dt.getTime()+generateRequest();
				
                // Initialize the data source (which will be used for future XHR calls).
                var dataSource = new YAHOO.util.DataSource(config.path);
                dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
                dataSource.responseSchema = responseSchema;
                

                // DataTable configuration
                var dataTableConfiguration = {
                	generateRequest: generateRequest,
                    // Initial request for first page of data
                    initialLoad: true,
                    initialRequest: initialLoadPath,
                    // Enables dynamic server-driven data
                    dynamicData : true,
                    MSG_ERROR: 'Your session may have expired. Please refresh the page.'.localize(),
                    sortedBy:{
                        key:'name',
                        dir:'asc'
                    },
                    // Confgure the pagination
                    paginator: new YAHOO.widget.Paginator({
                        rowsPerPage: config.pageSize
                    })
                };

                // Initialize the DataTable instance with the configuration objects.
                catalogHelper.requestsTable = new YAHOO.widget.DataTable(
                    config.containerId,
                    dataTableColumns,
                    dataSource,
                    dataTableConfiguration);

                    catalogHelper.requestsTable.configs.paginator.setAttributeConfig('firstPageLinkLabel', {
                        value : '&lt;&lt; '+'first'.localize()
                    });
                    catalogHelper.requestsTable.configs.paginator.setAttributeConfig('previousPageLinkLabel', {
                        value : '&lt;&lt; '+'prev'.localize()
                    });
                    catalogHelper.requestsTable.configs.paginator.setAttributeConfig('nextPageLinkLabel', {
                        value : '&gt;&gt; '+'next'.localize()
                    });
                    catalogHelper.requestsTable.configs.paginator.setAttributeConfig('lastPageLinkLabel', {
                        value : '&gt;&gt; '+'last'.localize()
                    });

                    catalogHelper.requestsTable._sId="yui-dt";

                // Update totalRecords on the fly with values from server
                catalogHelper.requestsTable.doBeforeLoadData = function(oRequest, oResponse, oPayload) {
                    oPayload.totalRecords = oResponse.meta.totalRecords;
                    oPayload.pagination.recordOffset = oResponse.meta.startIndex;
                    return oPayload;
                };
                
                // Override the pagination function to avaoid the Loading message showing and creating a jumping visual affect */
                catalogHelper.requestsTable.doBeforePaginatorChange = function(oPaginatorState) {
                	return true;
                };

                // Manually load the data table with the initial data
                //catalogHelper.requestsTable.load({datasource: initialDataSource});
                
                // Subscribe to events for row selection
                catalogHelper.requestsTable.subscribe("rowMouseoverEvent", catalogHelper.requestsTable.onEventHighlightRow);
                catalogHelper.requestsTable.subscribe("rowMouseoutEvent", catalogHelper.requestsTable.onEventUnhighlightRow);
                catalogHelper.requestsTable.subscribe("rowClickEvent", catalogHelper.requestsTable.onEventSelectRow);
                catalogHelper.requestsTable.subscribe("postRenderEvent", catalogHelper.IE8Hack);
                catalogHelper.requestsTable.subscribe("tableMsgHideEvent", catalogHelper.IE67HideMessageHack);
                
            }();
        };
        
        // This is a hack to ensure the Loading message for IE6&7 is removed properly.
        this.IE67HideMessageHack = function() {
        	if (!window.XMLHttpRequest || (document.documentElement && typeof document.documentElement.style.maxHeight!="undefined")){
        		var serviceItemsDiv = Dom.get("selectedServiceItems");
        		var messageBody = Dom.getElementsByClassName("yui-dt-message", "tbody",  serviceItemsDiv )[0];
        		var messageLiner = Dom.getElementsByClassName("yui-dt-liner", "div",  messageBody )[0];
        		messageLiner.style.display="none";
        	}
        };
        
        // This is a hack to ensure that when the table is drawn it displays properly in IE8.
        // Without this hack, if you load the table and keep the cursor outside of the table, the table background draws but not the data.
        this.IE8Hack = function() {
            catalogHelper.requestsTable.selectRow(0);
        };

        // Show a selected request in its own panel
        this.showSelectedRequest = function (rqtId, partial, paramString) {
            //Retrieve the custom event to get the SDR Id
            var myPartial = '../../'+clientManager.themesDirectory+'jsp/pages/catalog/selectedRequest',
            selReqId = 'selectedRequestSDR',
            selReqText,
            dynTextLayer,
            sdrId,
            clientAction = null,
            connection = null,
            paramStr = "",
            params;

            if (partial && partial.length > 0) {
                myPartial = partial;
            }

            if (paramString && paramString.length > 0) {
                if (paramString.indexOf("?") === 0) {
                    paramString = paramString.slice(1);
                }
                if (paramString.indexOf("&") !== 0) {
                    paramString = '&' + paramString;
                }
                paramStr = paramString || "";
            
                // determine which task engine this service item uses:
                // if version is null: < 4.5 engine
                // if version is not null: 4.5+ engine
                params = paramStr.split("&");
                for (var i=0; i<params.length; i+=1) {
                    var param = params[i].split("=");
                    if (param && param[0] === "paramVersion") {
                        if (param[1] !== null && param[1] !== "") {
                            selReqId = 'selectedRequestSDR';
                        }
                        break;
                    }
                }
            }

            selReqText = YAHOO.util.Dom.get(selReqId);
            if (selReqText) {
                dynTextLayer = selReqText.parentNode;
                sdrId = KD.utils.Util.getIDPart(dynTextLayer.id);

                // build up the panel to display the requested service item
                this._buildPanel(rqtId, Dom.get("selectedRequest"));

                // get the service item data from the server, and update the panel body
                if (sdrId) {
                    clientAction = KD.utils.ClientManager.customEvents.getItem(sdrId)[0];//Should only have one custom event
                    connection = new KD.utils.Callback(catalogHelper.taskDetails,KD.utils.Action._addInnerHTML,['tasks_panel_body'], true);
                    KD.utils.Action.makeAsyncRequest(myPartial, clientAction.actionId, connection, paramStr, myPartial);
                } else {
                    alert("No record found".localize());
                }
            }
        };

        this.taskDetails = function(o) {
            KD.utils.Action._addInnerHTML(o);
        };

        this.oServiceItemPanel=null;
        this._buildPanel = function(id, elId) {
            var  panelCfg, panelBody;

            if (this.oServiceItemPanel == null) {
                var pageEl = Dom.get("contentSection");
                var top = YAHOO.util.Dom.getY(pageEl)+40;
                var left = YAHOO.util.Dom.getX(pageEl)+200;

                panelCfg = {
                    width:"480px",
                    x:left,
                    y:top,
                    zIndex:10000,
                    visible:false,
                    draggable:true,
                    close:true,
                    /*modal:true,*/
                    /*constraintoviewport:true,*/
                    underlay:"shadow",
                    iframe:false
                };

                this.oServiceItemPanel = new YAHOO.widget.ResizePanel("panel_" + id, panelCfg);
                this.oServiceItemPanel.setHeader("Service Item Details".localize());
                this.oServiceItemPanel.setBody("<div><img alt='' src='resources/catalogIcons/ajax-loader.gif' style='margin:10px;padding:0px;' /><span>Loading your service item.</span></div>");
                this.oServiceItemPanel.render(elId);

                // give the panel body an id to grab onto
                panelBody = KD.utils.Util.getElementsByClassName("bd", "div", "panel_" + id)[0];
                if (panelBody) {
                    panelBody.id = "tasks_panel_body";
                }
            } else {
                this.oServiceItemPanel.setBody("<div><img alt='' src='resources/catalogIcons/ajax-loader.gif' style='margin:10px;padding:0px;' /><span>Loading your service item.</span></div>");
            }

            // show the panel
            this.oServiceItemPanel.show();
        };       

        this.highlightCategory = function(obj) {
            el = new YAHOO.util.Element(obj);
            el.addClass('highlightCategory');
		
        };
        this.removeHighlightCategory = function(obj) {
            el = new YAHOO.util.Element(obj);
            el.removeClass('highlightCategory');
        };
        this.highlightServiceItem = function(obj) {
            el = new YAHOO.util.Element(obj);
            el.addClass('highlightServiceItem');
		
        };
        this.removeHighlightServiceItem = function(obj) {
            el = new YAHOO.util.Element(obj);
            el.removeClass('highlightServiceItem');
        };

        this.setFocus = function (el) {
            if (el) {
                try {
                    el.select();
                    el.focus();
                } catch (e) {
                    // something failed, just ignore and let the user click
                }
            }
        };
		
    };
};

var catalogHelper = KINETIC.catalog.Helper;
