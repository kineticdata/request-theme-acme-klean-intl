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

<html>
            <%
            java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
            java.util.ResourceBundle catalogResourceBundle=ThemeLocalizer.getResourceBundle("Catalog", ThemeLocalizer.getPreferredLocale(request.getCookies()));
            java.util.ResourceBundle templateResourceBundle=null;
            try{
                templateResourceBundle=ThemeLocalizer.getResourceBundle(customerSurvey.getSurveyTemplateInstanceID()+".template", ThemeLocalizer.getPreferredLocale(request.getCookies()));
            } catch (Exception rbe){                
            }

            String i18nValues = "";

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
	<%@include file="../includes/application/headerContent.jspf"%>
	<%@include file="../includes/application/formListeners.jspf"%>

        <script type="text/javascript">
            var Localization = {<%=i18nValues%> };

            String.prototype.localize = function(){
                  var key=this.replace(/ /g,"_");
                  var s = Localization[key];
                  return ( s ) ? s : this;
            }
            
            var origCheckMessages = KD.utils.ClientManager.checkMessages;
            KD.utils.ClientManager.checkMessages = function() {
                clientManager.errorMessage = clientManager.errorMessage.localize();

                origCheckMessages();
            }
        </script>
        
	<head>
		<title>
			<%=ThemeLocalizer.getString(serviceItemsResourceBundle,customerSurvey.getSurveyTemplateName()) %>
		</title>    
					
	</head>
	<body class=" yui-skin-sam">
	<div id="compact"></div> 
		<div id="contentPageSection" class="contentPageSection rounded6" style="min-height:0; width:625px;">
			<div id="headerSection" class="headerSection">
			</div>
			<%@ include file="../pageFragments/pageQuestionsContent.i18n.jspf" %>
			<%@ include file="../pageFragments/footer.jspf" %>
			<%@ include file="../pageFragments/pageSessionInfo.jspf" %>
		</div>
		<jsp:setProperty name="UserContext" property="errorMessage" value=""/>
	</body>
</html>