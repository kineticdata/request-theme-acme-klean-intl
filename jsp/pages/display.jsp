<%@include file="../includes/noCache.jspf" %>
<%-- Include the beans that will be referenced by this page. --%>
<%@include file="../includes/application/formBeans.jspf" %>
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

<html>
<%@include file="../includes/application/headerContent.jspf"%>
<%@include file="../includes/application/formListeners.jspf"%>

<script type="text/javascript">
    var Localization = {<%=i18nValues%> };
    
    String.prototype.localize = function(){
          var key=this.replace(/ /g,"_");
          var s = Localization[key];
          return ( s ) ? s : this;
    }

    KD.utils.ClientManager.requiredWarningStr = KD.utils.ClientManager.requiredWarningStr.localize();
    KD.utils.ClientManager.validFormatWarningStr = KD.utils.ClientManager.validFormatWarningStr.localize();
    KD.utils.ClientManager.tooManyCharactersForSubmitStr = KD.utils.ClientManager.tooManyCharactersForSubmitStr.localize();
    
    var origAlertPanel = KD.utils.ClientManager.alertPanel;
    KD.utils.ClientManager.alertPanel = function(options) {
        options.header =options.header.localize();
        origAlertPanel(options);
    }
</script>
<body>
	<div id="contentPageSection" class="contentPageSection ">
			<%@include file="../pageFragments/header.jspf" %>
			<%@include file="../pageFragments/form.jspf" %>
			<%@include file="../pageFragments/footer.jspf" %>
	</div>
	<%@include file="../pageFragments/sessionMessage.jspf" %>
</body>
</html>

