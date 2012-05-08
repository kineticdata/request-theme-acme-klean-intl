<%-- Initialize the theme configuration bean used for this request. --%>
<jsp:useBean id="ThemeConfig" scope="request" class="java.util.LinkedHashMap"/>

<%-- Set the values of the themes configurable settings. --%>
<%
	ThemeConfig.put("catalogName", "ACME");
    ThemeConfig.put("companyName", "ACME");
    ThemeConfig.put("portalName", "ACME_Klean_Catalog_Intl");
%>