<%@include file="../includes/noCache.jspf" %>
<%@page import="com.kd.ksr.cache.*"%>
<%@page import="com.kd.ksr.beans.*"%>
<%@page import="java.util.*"%>
<%@page import="com.remedy.arsys.api.*"%>
<%@page import="com.kd.arsHelpers.*"%>


<%-- Include the beans that will be referenced by this page. --%>
<%@include file="../includes/application/formBeans.jspf" %>
<%--
    Configure the theme.  This sets multiple theme attributes on the request.
    For more information, see the themeInitialization.jsp file.
--%>
<%@include file="../includes/themeInitialization.jspf"%>
<html>
<%@include file="../includes/application/headerContent.jspf"%>
<%@include file="../includes/application/formListeners.jspf"%>
<body>
	<div id="contentPageSection" class="contentPageSection ">
			<%@include file="../pageFragments/header.jspf" %>
			<%@include file="../pageFragments/displayBodyContent.i18n_1.jspf" %>
			<%@include file="../pageFragments/footer.jspf" %>
	</div>
	<%@include file="../pageFragments/sessionMessage.jspf" %>
</body>
</html>

