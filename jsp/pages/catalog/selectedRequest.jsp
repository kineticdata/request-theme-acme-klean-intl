<%--
 $Rev: 161 $
 $Date: 2011-06-23 06:40:58 +1000 (Thu, 23 Jun 2011) $
--%>
<%@page contentType="text/html; charset=UTF-8"%>
<%
    response.setHeader("CACHE-CONTROL", "no-cache, no-store, must-revalidate, max-age=0"); //HTTP 1.1
    response.setDateHeader("EXPIRES", 0); //prevents caching at the proxy server
    response.setHeader("PRAGMA", "NO-CACHE");

%>
<%@include file="../../includes/themeLoader.jspf"%>
<%
    java.util.ResourceBundle catalogResourceBundle=ThemeLocalizer.getResourceBundle("Catalog", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
    java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
 
%>

<%!class TaskKey {
	public java.util.Date taskDate = null;
	public String keyValue = null;
	
	TaskKey(java.util.Date date, String keyValue) {
		this.taskDate = date;
		this.keyValue = keyValue;
	}
	
	public boolean equals(Object obj) {
		// We only want to compare by keyValue.
		// This is to allow the get() function to work as required.
		
		TaskKey compObj = (TaskKey)obj;
		
		return this.keyValue.equals(compObj.keyValue);

	}
	
	public String toString() {
		return keyValue;
	}
	
}
%>

<%!class TaskComparator implements java.util.Comparator{
	public int compare(Object o1,Object o2) {
		TaskKey key1 = (TaskKey)o1;
		TaskKey key2 = (TaskKey)o2;


		return key1.keyValue.compareTo(key2.keyValue);
	}

}
%>

<%

    java.util.List resultsList = (java.util.List) request.getAttribute("resultsList");
    if (resultsList != null) {
        java.text.SimpleDateFormat simpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
        java.text.DateFormat dateFormat = java.text.DateFormat.getDateTimeInstance(java.text.DateFormat.MEDIUM, java.text.DateFormat.MEDIUM, request.getLocale());

        // month name abbreviations
        String[] monthAbbrs = { 
            ThemeLocalizer.getString(catalogResourceBundle,"Jan"),
            ThemeLocalizer.getString(catalogResourceBundle,"Feb"),
            ThemeLocalizer.getString(catalogResourceBundle,"Mar"),
            ThemeLocalizer.getString(catalogResourceBundle,"Apr"),
            ThemeLocalizer.getString(catalogResourceBundle,"May"),
            ThemeLocalizer.getString(catalogResourceBundle,"Jun"),
            ThemeLocalizer.getString(catalogResourceBundle,"Jul"),
            ThemeLocalizer.getString(catalogResourceBundle,"Aug"),
            ThemeLocalizer.getString(catalogResourceBundle,"Sep"),
            ThemeLocalizer.getString(catalogResourceBundle,"Oct"),
            ThemeLocalizer.getString(catalogResourceBundle,"Nov"),
            ThemeLocalizer.getString(catalogResourceBundle,"Dec") };

        // define field values for the customer request
        java.util.Hashtable<String,String> constants = new java.util.Hashtable<String,String>();
        constants.put("Version", "700071008");
        constants.put("UseTaskEngine", "700073501");
        constants.put("CreatedAt", "3");
        constants.put("CustomerSurveyInstanceId", "179");
        constants.put("CustomerSurveyId", "536870913");
        constants.put("OrigIdDisplay", "700088607");
        constants.put("SubmitType", "700088475");
        constants.put("Status", "7");
        constants.put("TemplateName", "700001000");
        constants.put("ValidationStatus", "700002400");
        constants.put("NotesForCustomer", "600003021");
        constants.put("RequestStatus", "700089541");

        // get the first entry to obtain the base request information
        com.kd.arsHelpers.SimpleEntry baseEntry = (com.kd.arsHelpers.SimpleEntry) resultsList.get(0);
    	String version = baseEntry.getEntryFieldValue(constants.get("Version"));
        String useTaskEngine = baseEntry.getEntryFieldValue(constants.get("UseTaskEngine"));
        java.util.Date createdAtDate = simpleDateFormat.parse(baseEntry.getEntryFieldValue(constants.get("CreatedAt")), new java.text.ParsePosition(0));
        java.util.Calendar createdAt = java.util.Calendar.getInstance();
        createdAt.setTime(createdAtDate);
%>
<div class="selReqWrapper">
<div class="selReq">
    <div class="selReqDetails">
        <div class="head rounded6">
            <div>
                <div class="left"><b><%= ThemeLocalizer.getString(serviceItemsResourceBundle,baseEntry.getEntryFieldValue(constants.get("TemplateName")))%></b></div>
                <div class="right"><a href="javascript:catalogHelper.showDetails('<%= baseEntry.getEntryFieldValue(constants.get("CustomerSurveyInstanceId"))%>')"
                      class="selDetailsLinks" ><%= baseEntry.getEntryFieldValue(constants.get("CustomerSurveyId"))%></a>
                </div>
            </div>
        </div>
        <div class="detail rounded6">
			<div class="body">
		       	<div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Requested At")%>:</div> <div class="value"><%= dateFormat.format(createdAtDate) %></div></div>  
				<div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Status")%>: </div> <div class="value"><%=ThemeLocalizer.getString(catalogResourceBundle,baseEntry.getEntryFieldValue(constants.get("ValidationStatus")))%></div></div>
				<% if (baseEntry.getEntryFieldValue(constants.get("NotesForCustomer"))!=null && baseEntry.getEntryFieldValue(constants.get("NotesForCustomer")).length()>0) {%>
				<div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Notes")%>: </div><div class="value"><%= baseEntry.getEntryFieldValue(constants.get("NotesForCustomer"))%></div></div>
				<%}%>
			</div>
                        <div style="clear:both;"></div>
	    </div>
    </div>
<%
	String baseCSRV=baseEntry.getEntryFieldValue("179");
    String requestStatus = baseEntry.getEntryFieldValue("RequestStatus");
	java.util.SortedMap<java.util.Date,String> outerSortedTasks = null;
	java.util.SortedMap<TaskKey,java.util.List> sortedTasks = null;
    // define field values for the correct task form
    java.util.Hashtable<String,java.util.ArrayList<String[]>> taskMsgs = null;

    if (useTaskEngine == null || useTaskEngine.trim().length() == 0) {
        // field mappings for CustomerSurvey_RQT_Task Join
        constants.put("TaskRequestId", "536870930");
        constants.put("TaskName", "700000030");
        constants.put("TaskNotes", "700066400");
        constants.put("TaskStatus", "536870932");
        constants.put("TaskUpdatedAt", "700066406");
        constants.put("ApproverLastName", "700088102");
        constants.put("ApproverFirstName", "700088101");
    } else {
        // field mappings for CustomerSurvey_TSK_Instance Join
        constants.put("CSRV", "179");
        constants.put("OriginatingID", "600000310");
        constants.put("IntegrationID", "700001560");
        constants.put("TaskName", "700000810");
        constants.put("TaskNotes", "536870930");
        constants.put("TaskStatus", "536870931");
        constants.put("TaskUpdatedAt", "536870929");
        constants.put("ApproverLastName", "");
        constants.put("ApproverFirstName", "");
        constants.put("Visible","700000914");
        constants.put("TaskRequestId", "536870940");
        constants.put("TaskInstanceId", "536870921");
        constants.put("TaskMsgInstanceId", "536870936");
        constants.put("TaskMessage", "700066400");
        constants.put("TaskMessageDate", "536870939");
        constants.put("def_name", "700000990");
        constants.put("task_return_variables", "700000959");
        constants.put("source_id", "700000830");
        constants.put("User_Indicator", "700088110");

        outerSortedTasks = new java.util.TreeMap<java.util.Date, String>();
        sortedTasks = new java.util.TreeMap(new TaskComparator());
        // create a hashtable of task messages
        taskMsgs = new java.util.Hashtable<String,java.util.ArrayList<String[]>>();
        String taskId = null;
        String tempId = null;
        String currTask = null;
try {
        java.util.ArrayList<String[]> messages = null;
        com.kd.arsHelpers.SimpleEntry entry = null;
        for (int i = 0; i < resultsList.size(); i++) {
           entry = (com.kd.arsHelpers.SimpleEntry) resultsList.get(i);
			String csrv=entry.getEntryFieldValue(constants.get("CSRV"));
			String originatingID=entry.getEntryFieldValue(constants.get("OriginatingID"));
			String taskInstanceID=entry.getEntryFieldValue(constants.get("TaskInstanceId"));
			String integrationID=entry.getEntryFieldValue(constants.get("IntegrationID"));
		
			if (taskInstanceID == null || taskInstanceID.length()==0) {
				continue;
			}			
			


			TaskKey key=null;
			java.util.Date taskDate = simpleDateFormat.parse(entry.getEntryFieldValue(constants.get("TaskUpdatedAt")), new java.text.ParsePosition(0));
			if (baseCSRV.equals(csrv)) {
				key = new TaskKey(taskDate, csrv+"-"+taskInstanceID);
			} else {
				key = new TaskKey(taskDate, baseCSRV+"-"+integrationID);
			}

			java.util.List taskList = (java.util.List)sortedTasks.get(key);
			if (taskList==null) {
				taskList = new java.util.Vector();			
				sortedTasks.put(key, taskList);
				java.util.Date aDate=taskDate;

				if (outerSortedTasks.get(aDate)!=null) {
					aDate.setTime(aDate.getTime()+100+i);
				}
				outerSortedTasks.put(aDate, key.keyValue);
			}
			
			String id = entry.getEntryFieldValue(constants.get("TaskInstanceId"));
			if (currTask==null || (currTask!=null && !currTask.equals(id))) {
				taskList.add(entry);
			}
			currTask=id;
			
            String taskMsg = entry.getEntryFieldValue(constants.get("TaskMessage"));
            if (taskMsg != null && taskMsg.length() > 0) {
                tempId = entry.getEntryFieldValue(constants.get("TaskInstanceId"));
                // create a new arraylist to hold messages for the new task
                if (!tempId.equals(taskId)) {
                    if (taskId != null && messages != null) {
                        messages.trimToSize();
                        if (messages.size() > 0) {
                            // add the previous task messages to the taskMsgs Hashtable
                            taskMsgs.put(taskId, messages);
                        }
                    }
                    taskId = tempId;
                    messages = new java.util.ArrayList<String[]>();
                }
                // store the task message as a String array: 0 = message date, 1 = message text
                String[] messageObj = new String[2];
                java.util.Date msgDate = simpleDateFormat.parse(entry.getEntryFieldValue(constants.get("TaskMessageDate")), new java.text.ParsePosition(0));
                messageObj[0] = dateFormat.format(msgDate);
                messageObj[1] = taskMsg;
                messages.add(messageObj);
            }
        }
        // add the last task messages to the taskMsgs Hashtable
        if (taskId != null && messages != null) {
            messages.trimToSize();
            if (messages.size() > 0) {
                taskMsgs.put(taskId, messages);
            }
        }
} catch (Exception e) {
%> 
<p>XXX</p>
<%
//	Throwable err = e.fillInStackTrace();
//	err.printStackTrace( new java.io.PrintWriter( out ) );
	e.printStackTrace( new java.io.PrintWriter( out ) );
}
    }
%>
    <div class="selReqtasks">
<%
    // iterate over all the entries to display task details
    com.kd.arsHelpers.SimpleEntry taskEntry = null;
    String taskInstanceId = null;
    String taskId = null;
    String tempId = null;

	java.util.Iterator keyItr = outerSortedTasks.values().iterator();
try {
    while (keyItr.hasNext()) {
    	String key=(String)keyItr.next();
		TaskKey taskKey = new TaskKey(null, key);

    	java.util.List taskList = (java.util.List)sortedTasks.get(taskKey);
    
    	int taskCount=0;
    	java.util.Iterator taskItr = taskList.iterator();

    	if (taskList.size() > 1) {
		%>
			<div class="multipleTaskContainer">
		<%		
		}    	
    	while (taskItr.hasNext()) {    	
			taskEntry = (com.kd.arsHelpers.SimpleEntry) taskItr.next();
			tempId = taskEntry.getEntryFieldValue(constants.get("TaskRequestId"));

			// check if this task is visible on the portal
			String visible = "Yes";
			if (constants.containsKey("Visible")) {
				visible = taskEntry.getEntryFieldValue(constants.get("Visible"));
				// if constants contains the Visible property, then it also has TaskInstanceId
				taskInstanceId = taskEntry.getEntryFieldValue(constants.get("TaskInstanceId"));
			}

			if (visible != null && visible.equalsIgnoreCase("Yes") &&
					tempId != null && tempId.trim().length() > 0 && !tempId.equals(taskId)){
				taskId = tempId;
				java.util.Date taskDate = simpleDateFormat.parse(taskEntry.getEntryFieldValue(constants.get("TaskUpdatedAt")), new java.text.ParsePosition(0));
				java.util.Calendar taskCal = java.util.Calendar.getInstance();
				taskCal.setTime(taskDate);

				if (++taskCount==1) {
					// begin a new task
					boolean allowApprovalConversation=false;
					boolean showConversation=false;
					String approvalID="";
					String variablesValue=taskEntry.getEntryFieldValue(constants.get("task_return_variables"));

					if (taskEntry.getEntryFieldValue(constants.get("def_name")).equals("request_send_approval_v1")) {
							String[] vals = variablesValue.split("Instance ID\">");
							if (vals.length >1){
								vals = vals[1].split("</result>");	
								approvalID=vals[0];
							}						
							showConversation=true;
					}
					
					if (taskEntry.getEntryFieldValue(constants.get("def_name")).equals("request_send_approval_v1") && 
									taskEntry.getEntryFieldValue(constants.get("TaskStatus")).equals("Work In Progress") &&
                                    requestStatus.equals("Open")) {
							allowApprovalConversation=true;		
							
					%>
					
							<iframe  style="" id="addReplyFrame" taskInstanceID=<%=taskEntry.getEntryFieldValue(constants.get("TaskInstanceId")) %> CSRV="<%=taskEntry.getEntryFieldValue(constants.get("CSRV")) %>" approvalID="<%=approvalID%>" src ="/kinetic/DisplayPage?name=Create_Message" width="0" height="0px" scrolling="no"  frameborder="0" style="min-height:0px;">
							<p>Your browser does not support iframes.</p>
							</iframe>
					<%
					}
					%>
					
					<div class="task <%=taskEntry.getEntryFieldValue(constants.get("TaskStatus")) %> ">
						<div class="date">
							<div class="month"><%= monthAbbrs[taskCal.get(java.util.Calendar.MONTH)].toUpperCase() %> <%= taskCal.get(java.util.Calendar.YEAR) %></div>
							<div class="day"><%= taskCal.get(java.util.Calendar.DATE) %></div>	
						</div>
						<div class="body">
							<div class="content">
								<div>
                                    <div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Task")%>:</div>
                                    <div class="value"><%= taskEntry.getEntryFieldValue(constants.get("TaskName"))%></div>
                                    <div class="year_time"><%= monthAbbrs[taskCal.get(java.util.Calendar.MONTH)] %> <%= taskCal.get(java.util.Calendar.DATE) %>, <%= taskCal.get(java.util.Calendar.YEAR) %> <%= (taskCal.get(java.util.Calendar.HOUR) + ":" + com.kd.kineticSurvey.impl.SurveyUtilities.padZeros(taskCal.get(java.util.Calendar.MINUTE), 2) + ":" + com.kd.kineticSurvey.impl.SurveyUtilities.padZeros(taskCal.get(java.util.Calendar.SECOND), 2)).trim() %></div>
                                </div>
								<div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Status")%>: </div><div class="value"><%= taskEntry.getEntryFieldValue(constants.get("TaskStatus"))%></div></div>
								<%if (taskEntry.getEntryFieldValue(constants.get("ApproverLastName"))!=null && taskEntry.getEntryFieldValue(constants.get("ApproverLastName")).length()>0) {%>
								<div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Approver")%>: </div><div class="value"><%= taskEntry.getEntryFieldValue(constants.get("ApproverFirstName"))%> <%= taskEntry.getEntryFieldValue(constants.get("ApproverLastName"))%> </div></div>
								<%}%>
							</div>
							<%if (taskInstanceId != null && taskMsgs != null && taskMsgs.containsKey(taskInstanceId)) {%>
							<div class="taskMsgs">
								<%
								java.util.ArrayList<String[]> msgs = taskMsgs.get(taskInstanceId);
								java.util.Iterator msgIter = msgs.iterator();
								while (msgIter.hasNext()) {
									String[] msg = (String[])msgIter.next();%>
								<div class="taskMsg">
									<div class="taskMsgText"><%=msg[1]%></div>
								</div>
								<%}%>
							</div>
							<%}%>
							<% if (showConversation) { %>
								<div class="conversationLabelHolder">
									<%  String indicator = (String)taskEntry.getEntryFieldValue(constants.get("User_Indicator"));
										if (indicator!=null && indicator.equals("NEW_MESSAGE")) { %>
											<img  width="16px" src="themes/acme/images/conversation_alert.png"/>
									<%  } %>
									<a id="a_<%=approvalID%>" href="javascript:catalogHelper.showConversation('<%=approvalID%>');" class="showConversation">Show Conversation</a>
								</div>


								<div id="ConversationDiv_<%=approvalID%>" class="ConversationDiv"> </div>
								<div id="replyHolder"> </div>
							<% } %>
							<% if (allowApprovalConversation) { %>
								<a id="reply_<%=approvalID%>" href="javascript:catalogHelper.showReply('<%=approvalID%>');" class="showReply">Reply</a>
							<% } %>
							
						</div>
					</div>
		<%
				} else {
	%>
                    <div class="subtask <%=taskEntry.getEntryFieldValue(constants.get("TaskStatus")) %>">
                        <div class="date">
                                                        <div class="month"><%= monthAbbrs[taskCal.get(java.util.Calendar.MONTH)].toUpperCase() %> <%= taskCal.get(java.util.Calendar.YEAR) %></div>
                                                        <div class="day"><%= taskCal.get(java.util.Calendar.DATE) %></div>
                        </div>
                        <div class="body">
                            <div class="content">
                                <div>
                                                                        <div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Task")%>: </div>
                                                                        <div class="value"><%= taskEntry.getEntryFieldValue(constants.get("TaskName"))%></div>
                                                                        <div class="year_time"><%= monthAbbrs[taskCal.get(java.util.Calendar.MONTH)] %> <%= taskCal.get(java.util.Calendar.DATE) %>, <%= taskCal.get(java.util.Calendar.YEAR) %> <%= (taskCal.get(java.util.Calendar.HOUR) + ":" + com.kd.kineticSurvey.impl.SurveyUtilities.padZeros(taskCal.get(java.util.Calendar.MINUTE), 2) + ":" + com.kd.kineticSurvey.impl.SurveyUtilities.padZeros(taskCal.get(java.util.Calendar.SECOND), 2)).trim() %></div>
                                                                    </div>
                                                                    <div><div class="label"><%=ThemeLocalizer.getString(catalogResourceBundle,"Status")%>: </div><div class="value"><%= taskEntry.getEntryFieldValue(constants.get("TaskStatus"))%></div></div>
                            </div>
                            <%if (taskInstanceId != null && taskMsgs != null && taskMsgs.containsKey(taskInstanceId)) {%>
                            <div class="taskMsgs">
                                <%
                                java.util.ArrayList<String[]> msgs = taskMsgs.get(taskInstanceId);
                                java.util.Iterator msgIter = msgs.iterator();
                                while (msgIter.hasNext()) {
                                    String[] msg = (String[])msgIter.next();%>
                                <div class="taskMsg">
                                    <div class="taskMsgText"><%=msg[1]%></div>
                                </div>
                                <%}%>
                            </div>
                            <%}%>
                        </div>
                    </div>

	<%
				}
			}
	    }
    	if (taskList.size() > 1) {		
		%>
		</div>
		<%
		}
	    
    }
} catch (Exception e) {
%> 
<p>QQQ<%=e%></p>
<%
}
    
%>
    </div>
</div>
</div>
<%
    } else {
%>
<div class="selReqWrapper">
    <div class="selReq" style="text-align:center;"><b style="line-height:300px;">The requested item could not be found.</b></div>
</div>
<%
    }
%>
