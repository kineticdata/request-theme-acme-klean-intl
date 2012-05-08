<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%
	/* Defined here because this jsp will be called seperately. That is, not part of the Catalog jsp. */
    HelperContext context = UserContext.getArContext();
%>
<%--
<%@page trimDirectiveWhitespaces="true"%>
--%>
<%--
    Include the theme configuration file.  This
--%>
<%@include file="../../models/base.jspf" %>
<%@include file="../../models/fulfillment/assignment.jspf" %>
<%@include file="../../models/fulfillment/assignmentList.jspf" %>
<%--
    Initialize the reference to the ThemeConfig (HashMap) bean.  This bean is
    initialized in the THEME_ROOT/config/config.jsp file and further attributes
    are added by the THEME_ROOT/jsp/includes/themeInitialization.jsp file.
--%>
<jsp:useBean id="ThemeConfig" scope="request" class="java.util.LinkedHashMap"/>
<%--
    Include the ?
--%>
<%
	String catalogName = request.getParameter("catalogName");
	if (catalogName == null) {catalogName = "";}
    String pageSize = request.getParameter("pageSize");
    if (pageSize == null) {pageSize = "10";}
    String startIndex = request.getParameter("startIndex");
    if (startIndex == null) {startIndex = "0";}
    String sort = request.getParameter("sort");
    if (sort == null) {sort = "requestId";}
    String order = request.getParameter("order");
    if (order == null) {order = "desc";}
    String assignmentType = request.getParameter("assignmentType");
    if (assignmentType == null) {assignmentType = "Assigned";}
    String supportGroupIDs = request.getParameter("groupIDs");

    Integer sortOrder = 1;
    if ("desc".equals(order)) {
        sortOrder = 2;
    }

    /** Set the name of the catalog that this page is using. 
    	This is expected to be passed in, since this call is done independently of load the page.
    */
    ThemeConfig.put("catalogName", catalogName);
%>
<%@include file="configuration/assignmentGroups.jspf"%>

<%
    String[] sortFields = new String[0];
    if ("date".equals(sort)) {
        sortFields = new String[] {Assignment.FIELD_CREATE_DATE};
    }

    Integer pageSizeInteger = Integer.valueOf(pageSize);
    Integer startIndexInteger = Integer.valueOf(startIndex);

    AssignmentList assignmentList = AssignmentGroupManager.getAssignmentList("Tasks", assignmentType);
    String baseQualification = assignmentList.getQualification();
    if (assignmentType.equals("Search")){
    	formatSearchQualification(request, assignmentList);
    }
    Assignment[] assignments = assignmentList.getAssignments(context, sortFields, pageSizeInteger, startIndexInteger, sortOrder);

   	assignmentList.setQualification(baseQualification);
%>
<%!
	// Convert the date string to an integer which then will work no matter what timezone/locale etc is running
	private String formatDate(String aDateStr) {
		String[] parts = aDateStr.split("-");
		int Y = new Integer(parts[0]).intValue();
		int M = new Integer(parts[1]).intValue();
		int D = new Integer(parts[2]).intValue();

		int M1 = (M-14)/12;
		int Y1 = Y + 4800;

		int dateInt = 1461*(Y1+M1)/4 + 367*(M-2-12*M1)/12 - (3*((Y1+M1+100)/100))/4 + D - 32075;
		return (new Integer(dateInt)).toString();
	}

	private void formatSearchQualification(javax.servlet.http.HttpServletRequest request, AssignmentList assignmentList){
		String qualification = assignmentList.getQualification();
		String serviceItem = request.getParameter("serviceItem");
		if (serviceItem!=null && serviceItem.length()>0){
			qualification += " AND 'Form' LIKE \"%"+serviceItem+"%\"";
		}
		
		String taskName = request.getParameter("taskName");
		if (taskName!=null && taskName.length()>0){
			qualification += " AND 'Survey_Template_Name' LIKE \"%"+taskName+"%\"";
		}

		String status = request.getParameter("status");
		if (status!=null && status.length()>0){
			qualification += " AND 'Status' = \""+status+"\"";
		}

		String dueDateStart = request.getParameter("dueDateStart");
		if (dueDateStart!=null && dueDateStart.length()>0){
			qualification += " AND 'DueDate' >= "+formatDate(dueDateStart)+"";
		}

		String dueDateEnd = request.getParameter("dueDateEnd");
		if (dueDateEnd!=null && dueDateEnd.length()>0){
			qualification += " AND 'DueDate' <= "+formatDate(dueDateEnd)+"";
		}

		String requesterLastName = request.getParameter("requesterLastName");
		if (requesterLastName!=null && requesterLastName.length()>0){
			qualification += " AND 'Last Name' LIKE \"%"+requesterLastName+"%\"";
		}

		String assignedGroup = request.getParameter("assignedGroup");
		if (assignedGroup!=null && assignedGroup.length()>0){
			qualification += " AND 'AssignedGroupName' LIKE \"%"+assignedGroup+"%\"";
		}

		String requestID = request.getParameter("requestID");
		if (requestID!=null && requestID.length()>0){
			qualification += " AND 'OriginatingID_Display' LIKE \"%"+requestID+"%\"";
		}
System.out.println("QUAL:"+qualification);
		assignmentList.setQualification(qualification);
	}

    private String formatAssignments(Assignment[] assignments) {
	
        java.lang.StringBuilder builder = new java.lang.StringBuilder();
        for(Assignment assignment : assignments) {
            if (assignment != assignments[0]) {
                builder.append(",");
                builder.append("\n");
            }

            builder.append("    {");
            builder.append("\"date\": \"").append(assignment.getCreateDate()).append("\",");
            builder.append("\"due_date\": \"").append(assignment.getDueDate()).append("\",");
            builder.append("\"request_name\": \"").append(assignment.getRequestName()).append("\",");
            builder.append("\"request_id\": \"").append(assignment.getRequestID()).append("\",");
            builder.append("\"request_guid\": \"").append(assignment.getRequestGUID()).append("\",");
            builder.append("\"status\": \"").append(assignment.getStatus()).append("\",");
            builder.append("\"individual_id\": \"").append(assignment.getIndividualID()).append("\",");
            builder.append("\"individual_name\": \"").append(assignment.getIndividualName()).append("\",");
            builder.append("\"group_id\": \"").append(assignment.getGroupID()).append("\",");
            builder.append("\"group_name\": \"").append(assignment.getGroupName()).append("\",");
            builder.append("\"source_id\": \"").append(assignment.getSourceID()).append("\",");
            builder.append("\"source_guid\": \"").append(assignment.getSourceGUID()).append("\",");
            builder.append("\"source_name\": \"").append(assignment.getSourceName()).append("\",");
            builder.append("\"requester_name\": \"").append(assignment.getRequesterName()).append("\",");
            builder.append("\"requester_email\": \"").append(assignment.getRequesterEmail()).append("\"");
            builder.append("}");
        }
        
        return builder.toString();
    }
%>{
  "recordsReturned": <%= assignments.length %>,
  "totalRecords": <%= assignmentList.getCount(context) %>,
  "startIndex": <%= startIndex %>,
  "sort":" <%= sort %>",
  "order":" <%= order %>",
  "pageSize": <%= pageSize %>,
  "records": [
<%= formatAssignments(assignments) %>
  ]
}