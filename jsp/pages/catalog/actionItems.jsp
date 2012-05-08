<%@include file="configuration/submissionGroups.jspf"%>
<%
SubmissionList[] requests = SubmissionGroupManager.getSubmissionLists("Requests");
SubmissionList[] approvals = SubmissionGroupManager.getSubmissionLists("Approvals");
%>
<% 
String partial = "";
if(requests != null){
%>
  <% 	Integer parkedCount = requests[0].getCount(context);
  		
      	if (parkedCount >0) { 
      	%>
	    <div class="actionItemRowLine">
		    <div class="actionItemRow">	    	
	    	  <div id="parked_requests" style="display:block;" class='summaryItem' onclick='catalogHelper.showRequestPanel(this); catalogHelper.showSelectedRequests("Requests", "Parked"); '><%=ThemeLocalizer.getString(catalogResourceBundle,"Parked") %>&nbsp;(<%= parkedCount%>)</div>
		    </div>
	    </div>
      <%}%>
      <%
		Integer openCount = requests[1].getCount(context);

      if (openCount >0) { 
      	%>
	    <div class="actionItemRowLine">
		    <div class="actionItemRow">	    	
	    	  <div id="inprogress_requests" style="display:block;" class='summaryItem' onclick='catalogHelper.showRequestPanel(this); catalogHelper.showSelectedRequests("Requests", "Active"); '><%=ThemeLocalizer.getString(catalogResourceBundle,"In Progress") %>&nbsp;(<%= openCount%>)</div>
		    </div>
	    </div>
      <%}%>
      <%Integer completedCount = requests[2].getCount(context);;

      	if (completedCount >0) { %>
	    <div class="actionItemRowLine">
		    <div class="actionItemRow">	    	
		      <div id="closed_requests" style="display:block;" class='summaryItem' onclick='catalogHelper.showRequestPanel(this); catalogHelper.showSelectedRequests("Requests", "Closed");'><%=ThemeLocalizer.getString(catalogResourceBundle,"Closed") %>&nbsp;(<%= completedCount%>)</div>
		    </div>
	    </div>
      <%}%>
<%}%>
<%      
if(approvals != null){
%>
      <%Integer activeApprovalsCount = approvals[0].getCount(context);;

    	if (activeApprovalsCount >0) { %>
	    <div class="actionItemRowLine"">
		    <div class="actionItemRow">	    	
	      		<div id="open_approvals_requests" style="display:block;" class='summaryItem' onclick='catalogHelper.showRequestPanel(this); catalogHelper.showSelectedRequests("Approvals", "Awaiting Approval");'><%=ThemeLocalizer.getString(catalogResourceBundle,"Needing approval") %>&nbsp;(<%= activeApprovalsCount%>)</div>
		    </div>
	    </div>
      <%}%>
      <%Integer closedApprovalsCount = approvals[1].getCount(context);;

  		if (closedApprovalsCount >0) { %>%>
	    <div class="actionItemRowLine"">
		    <div class="actionItemRow">	    	
	      		<div id="pending_actions_requests" style="display:block;" class='summaryItem' onclick='catalogHelper.showRequestPanel(this); catalogHelper.showSelectedRequests("Approvals", "Complete");'><%=ThemeLocalizer.getString(catalogResourceBundle,"Pending Actions") %>&nbsp;(<%= closedApprovalsCount%>)</div>
		    </div>
	    </div>
      <%}%>
<%} %>
