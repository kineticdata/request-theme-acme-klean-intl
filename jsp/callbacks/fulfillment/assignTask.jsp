<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%@include file="../../models/base.jspf" %>
<%
	/* Defined here because this jsp will be called seperately. That is, not part of the Catalog jsp. */
    HelperContext context = UserContext.getArContext();
%>
<%@include file="../../models/fulfillment/assignment.jspf"%>
<%
	String assignmentID = request.getParameter("assignmentID");
	String loginName = request.getParameter("loginName");
	
	//Assignment.saveAssignment(context, assignmentID, loginName); 
%>
<div id="assignedTask_login_name" class="assignedTask_login_name">
<%=loginName%>
</div>