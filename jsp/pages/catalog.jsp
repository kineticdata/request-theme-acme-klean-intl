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
    HelperContext context = UserContext.getArContext();
    Catalog catalog = Catalog.findByName(context, customerSurvey.getCategory());    
    String i18nValues = "";
            
    java.util.ResourceBundle catalogResourceBundle=ThemeLocalizer.getResourceBundle("Catalog", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
    java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
    java.util.ResourceBundle categoryResourceBundle=ThemeLocalizer.getResourceBundle("Category", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
    java.util.ResourceBundle templateResourceBundle=null;
    try{
        templateResourceBundle=ThemeLocalizer.getResourceBundle(customerSurvey.getSurveyTemplateInstanceID()+".template", ThemeLocalizer.getPreferredLocale(request.getCookies()));
    } catch (Exception rbe){
   }
     for( java.util.Enumeration en = catalogResourceBundle.getKeys(); en.hasMoreElements(); ){
         String key = (String)en.nextElement();
         if (key.indexOf("javascript.")>=0){
             String keyVal=key.replaceAll("javascript.", "");
             if (i18nValues!=""){
                 i18nValues+=",";
             }
             i18nValues += "\""+keyVal+"\" : \""+catalogResourceBundle.getString(key)+"\"";
         }
     }
%>

<script type="text/javascript">
    var Localization = {<%=i18nValues%> };
    
    String.prototype.localize = function(){
          var key=this.replace(/ /g,"_");
          var s = Localization[key];
          return ( s ) ? s : this;
    }
</script>
<html>
	<script type="text/javascript">var _sf_startpt=(new Date()).getTime()</script>
	<%@include file="../includes/application/headerContent.jspf"%>
	<%@include file="../includes/application/formListeners.jspf"%>
	<script type="text/javascript">
		KD.utils.Action.addListener(window, "load", KINETIC.catalog.Helper.keepSessionAlive);			
	</script>
	<body class=" yui-skin-sam">
	<div id="compact"></div> 
		<div id="contentPageSection" class="contentPageSection rounded6">
			<div id="headerSection" class="headerSection">
				<div class="headerWelcome tertiaryColorBackground" onclick='try {catalogHelper.showMyInfo();} catch(e) {}'>
					<div id="authenticatedName" class="loginInfo">
                                            <div class="welcomeText">
                                                 <%=ThemeLocalizer.getString(catalogResourceBundle,"Welcome")%>
                                            </div> <div class="welcomeLoginName" id='loginName'><%= UserContext.getUserName()%></div></div>
                                </div>

				<div class="headerLogout auxiliaryColorBackground roundedBottom6">
					<a href="KSAuthenticationServlet?Logout=true" class="logout"> <%=ThemeLocalizer.getString(catalogResourceBundle,"Logout")%></a>
				</div>
			</div>
			<div id="popUps">
				<div id="selectedRequestOrig" style="position:static !important;"></div>
				<div id="selectedRequest" style="position:static !important;"></div>
			</div>
			<div id="MyInfo_Section" style="display:none;" class="userInfoSection">
				<%@ include file="catalog/userInfo.jspf" %>				
			</div>
			<div id="Title_Section" class="templateSection catalogTitleSection">
				<div id="serviceCatalogName" class="secondColorHeader standard_box rounded4"><%=ThemeLocalizer.getString(serviceItemsResourceBundle,customerSurvey.getSurveyTemplateName()) %></div>
			</div>			
			<%@ include file="../pageFragments/pageQuestionsContent.i18n.jspf" %>
			<div id="CategoryLabel_Section" class="categoryLabelSection" onClick="catalogHelper.showMainDisplay();">
				<div class='categoryLabelImage  categoryLabelText'></div>
			</div>			
			<div id="contentSection">
				<div id="myRequests" class=" requestsLayer" style="display:none;">	
    				<div id="yui-dt-paginator0" class="yui-dt-paginator yui-pg-container topPaginator"> </div>
    				<div id="selectedServiceItems"></div>
    				<div id="yui-dt-paginator1" class="yui-dt-paginator yui-pg-container"> </div>
				</div>
				<div id="serviceItems" class="serviceItemsLayer">
					<%@ include file="catalog/serviceItems.jspf" %>
				</div>
				<div id="searchResults" class="serviceItemsLayer">
					<div id="searchReturn" class='searchReturnResult rounded4' style='display:none;'></div>
				</div>
			</div>
			<div id="Action_Section" class="actionItemsSection">
				<div id="serviceItemSummary">
					<%@ include file="catalog/actionItems.jsp" %>
				</div>
			</div>			
			<%@ include file="../pageFragments/footer.jspf" %>
			<%@ include file="../pageFragments/pageSessionInfo.jspf" %>
		</div>
		<jsp:setProperty name="UserContext" property="errorMessage" value=""/>
	</body>
</html>
