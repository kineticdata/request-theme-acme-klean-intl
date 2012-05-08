<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%
	/* Defined here because this jsp will be called seperately. That is, not part of the Catalog jsp. */
    HelperContext context = UserContext.getArContext();
%>
<%@page contentType="text/html; charset=UTF-8"%>

<%--
    Include the theme configuration file.  This
--%>
<%@include file="../../includes/themeLoader.jspf"%>
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
    java.util.ResourceBundle catalogResourceBundle=ThemeLocalizer.getResourceBundle("Catalog", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
    java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        

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
    String requestType = request.getParameter("requestType");
    if (requestType == null) {requestType = "Active";}

    Integer sortOrder = 1;
    if ("desc".equals(order)) {
        sortOrder = 2;
    }

    /** Set the name of the catalog that this page is using. 
    	This is expected to be passed in, since this call is done independently of load the page.
    */
    ThemeConfig.put("catalogName", catalogName);
%>
<%@include file="configuration/submissionGroups.jspf"%>

<%
    String[] sortFields = new String[0];
    if ("date".equals(sort)) {
        sortFields = new String[] {Submission.FIELD_CREATE_DATE};
    } else if ("name".equals(sort)) {
        sortFields = new String[] {Submission.FIELD_TEMPLATE_NAME};
    } else if ("status".equals(sort)) {
        sortFields = new String[] {Submission.FIELD_STATUS};
    } else if ("requestId".equals(sort)) {
        sortFields = new String[] {Submission.FIELD_REQUEST_ID};
    }

    Integer pageSizeInteger = Integer.valueOf(pageSize);
    Integer startIndexInteger = Integer.valueOf(startIndex);

    SubmissionList submissionList = SubmissionGroupManager.getSubmissionList("Requests", requestType);
    Submission[] submissions = submissionList.getSubmissions(context, sortFields, pageSizeInteger, startIndexInteger, sortOrder);
%>
<%!
    private String formatSubmissions(Submission[] submissions, java.util.ResourceBundle catalogResourceBundle, java.util.ResourceBundle serviceItemsResourceBundle) {
        java.lang.StringBuilder builder = new java.lang.StringBuilder();
        for(Submission submission : submissions) {
            if (submission != submissions[0]) {
                builder.append(",");
                builder.append("\n");
            }
            builder.append("    {");
            builder.append("\"instance_id\": \"").append(submission.getId()).append("\",");
            builder.append("\"date\": \"").append(submission.getCreateDate()).append("\",");
            builder.append("\"name\": \"").append(ThemeLocalizer.getString(serviceItemsResourceBundle,submission.getTemplateName())).append("\",");
            builder.append("\"originating_form\": \"").append(submission.getOriginatingForm()).append("\",");
            builder.append("\"submit_type\": \"").append(submission.getSubmitType()).append("\",");
            builder.append("\"submission_status\": \"").append(submission.getStatus()).append("\",");
            builder.append("\"request_status\": \"").append(submission.getRequestStatus()).append("\",");
            builder.append("\"validation_status\": \"").append(ThemeLocalizer.getString(catalogResourceBundle,submission.getValidationStatus())).append("\",");
            builder.append("\"version\": \"").append(submission.getVersion()).append("\",");
            builder.append("\"requestId\": \"").append(submission.getRequestId()).append("\",");
            builder.append("\"originating_id_display\": \"").append(submission.getOriginatingIDDisplay()).append("\",");
            builder.append("\"originating_id\": \"").append(submission.getOriginatingID()).append("\",");
            builder.append("\"notes\": \"").append(submission.getNotesForCustomer()).append("\"");
            builder.append("}");
        }

        return builder.toString();
    }
%>{
  "recordsReturned": <%= submissions.length %>,
  "totalRecords": <%= submissionList.getCount(context) %>,
  "startIndex": <%= startIndex %>,
  "sort":" <%= sort %>",
  "order":" <%= order %>",
  "pageSize": <%= pageSize %>,
  "records": [
<%= formatSubmissions(submissions, catalogResourceBundle, serviceItemsResourceBundle) %>
  ]
}