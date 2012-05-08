<%@include file="../includes/noCache.jspf" %>
<%-- Include the beans that will be referenced by this page. --%>
<%@include file="../includes/application/formBeans.jspf" %>
<%-- Define a value to allow us to only load Catalog information when required, such as js and css files--%> 
<%	request.setAttribute("Catalog", "TRUE"); %>

<%--
    Configure the theme.  This sets multiple theme attributes on the request.
    For more information, see the themeInitialization.jsp file.
--%>
<%@include file="../includes/themeInitialization.jspf"%>

<%--
    Include the theme configuration file.  This
--%>
<%@include file="../includes/themeLoader.jspf"%>
<%
    HelperContext context = (HelperContext) ThemeConfig.get("context");
%>

<html>
	<%@include file="../includes/application/headerContent.jspf"%>
	<%@include file="../includes/fulfillment/fulfillment.jspf"%>
	<%@include file="./fulfillment/supportGroups.jspf"%>
	<%@include file="../includes/application/formListeners.jspf"%>
	<script type="text/javascript">
		KD.utils.Action.addListener(window, "load", KINETIC.fulfillment.Helper.keepSessionAlive);			
		KD.utils.Action.addListener(window, "load", KINETIC.fulfillment.Helper.loadDefaultTab);			
	</script>
	<body class=" yui-skin-sam">
			<div id="popUps">
				<div id="assignTaskDialog" style="position:static !important;">
				</div>
			</div>
 		<div id="contentPageSection" class="contentPageSection rounded6">
			<div id="headerSection" class="headerSection">
				<div class="headerWelcome tertiaryColorBackground" onclick='try {catalogHelper.showMyInfo();} catch(e) {}'>
					<div id="authenticatedName" class="loginInfo"><div class="welcomeText">Welcome</div> <div class="welcomeLoginName" id='loginName'><%= UserContext.getUserName()%></div></div>
				</div>
	
				<div class="headerLogout auxiliaryColorBackground roundedBottom6">
					<a href="KSAuthenticationServlet?Logout=true" class="logout"> Logout</a>
				</div>
			</div> 
			<div id="MyInfo_Section" style="display:none;" class="userInfoSection">
				<%@ include file="catalog/userInfo.jspf" %>				
			</div>
			<div id="Title_Section" class="templateSection catalogTitleSection">
				<div id="serviceCatalogName" class="secondColorHeader standard_box rounded4"><%=customerSurvey.getSurveyTemplateName() %></div>
			</div>		
            <div id="mainNavigation">
                <div id="myTasksTab" class="navigationItem navigationItemActive">
                    <a href="javascript:void(0)">My Tasks</a>
                </div>
                <div class="divider"></div>
                <div id="openTasksTab" class="navigationItem">
                    <a href="javascript:void(0)">Open Tasks</a>
                </div>
                <div class="divider"></div>
                <div id="unassignedTasksTab" class="navigationItem">
                    <a href="javascript:void(0)">Unassigned Tasks</a>
                </div>
                <div class="divider"></div>
                <div id="searchTasksTab" class="navigationItem">
                    <a href="javascript:void(0)">Search</a>
                </div>
            </div>
            <div id="taskPanels">
   				<div id="yui-dt-paginator0" class="yui-dt-paginator yui-pg-container topPaginator"> </div>
	                <div id="myTaskPanel" class="taskPanel show">
	                <p>My Tasks</p>
	                <div id="myTaskPanel_TableDiv"></div>
	                </div>
	                <div id="openTaskPanel" class="taskPanel hide">
	                <p> Open Tasks </p>
	                <div id="openTaskPanel_TableDiv"></div>
	                </div>
	                <div id="unassignedTaskPanel" class="taskPanel hide">
	                <p> Unassigned Tasks </p>
	                <div id="unassignedTaskPanel_TableDiv"></div>
	                </div>
	                <div id="searchTaskPanel" class="taskPanel hide">
	                <p> Search Tasks </p>
	                <%@ include file="fulfillment/searchPanel.jspf" %>				
	                <div id="searchTaskPanel_TableDiv"></div>
	                </div>
   				<div id="yui-dt-paginator1" class="yui-dt-paginator yui-pg-container"> </div>
            </div>
            <div id="actionButtons" class="actionButtons">
            	<input id="assignTaskButton" name="assignTaskButton" type="button" value="Assign" disabled=true onclick="fulfillmentHelper.assignTask();"></input>
            	<input id="openTaskButton" name="openTaskButton" type="button" value="Open" disabled=true onclick="fulfillmentHelper.openTask();"></input>
            </div>
			<%@ include file="../pageFragments/footer.jspf" %>
		</div>
		<%@ include file="../pageFragments/pageSessionInfo.jspf" %>
		<jsp:setProperty name="UserContext" property="errorMessage" value=""/>
	</body>
</html>