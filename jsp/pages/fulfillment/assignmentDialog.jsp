<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%@include file="../../models/base.jspf" %>
<%
	/* Defined here because this jsp will be called seperately. That is, not part of the Catalog jsp. */
    HelperContext context = UserContext.getArContext();
%>
<%@include file="../../models/fulfillment/supportGroup.jspf"%>
<%
	String groupID = request.getParameter("groupID");
	/* Load the Support Group's users
	*/
	String qualification = "'Support Group ID'=\""+groupID+"\" AND 'Availability Hold'=\"Yes\"";
	SupportGroup[] names = SupportGroup.find(context, qualification);
%>
<script>
	var selectedAssignedLoginName;
</script>
<div id="assignmentDialogContent">
  
	<select onchange="selectedAssignedLoginName=this.value;" class="answerValue answerSelect" name="support_assignees">
		<option value=""></option>
		<%
		for (int i=0; i<names.length; i++){
		%>
			<option value<%=names[i].getLoginName()%>"><%=names[i].getFullName()%></option>
		<%
		}
		%>
	</select>
	
	<input type="button" value="Assign" onclick="fulfillmentHelper.applyAssignment(this, selectedAssignedLoginName);"></input>
	<input type="button" value="Cancel" onclick="fulfillmentHelper.cancelAssignment();"></input>
</div>
