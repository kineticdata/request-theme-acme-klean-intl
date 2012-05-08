<%@include file="../includes/noCache.jspf" %>
<%-- Include the beans that will be referenced by this page. --%>
<%@include file="../includes/application/formReviewBeans.jspf" %>
<%--
	Configure the theme.  This sets multiple theme attributes on the request.
	For more information, see the themeInitialization.jsp file.
--%>
<%@include file="../includes/themeInitialization.jspf"%>
<%@include file="../includes/themeLoader.jspf"%>
<%
java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        
java.util.ResourceBundle catalogResourceBundle=ThemeLocalizer.getResourceBundle("Catalog", ThemeLocalizer.getPreferredLocale(request.getCookies()));
java.util.ResourceBundle templateResourceBundle=null;
try{
    templateResourceBundle=ThemeLocalizer.getResourceBundle(customerSurvey.getSurveyTemplateInstanceID()+".template", ThemeLocalizer.getPreferredLocale(request.getCookies()));
} catch (Exception rbe){
    
}
%>

<html>
	<%@include file="../includes/application/headerReviewContent.jspf"%>

    <%--Include Remedy-created style/javascript info--%>
    <%
        java.util.Iterator itrStyles = RequestPages.iterator();
        while (itrStyles.hasNext()) {
            com.kd.kineticSurvey.beans.CustomerSurveyReview cs = (com.kd.kineticSurvey.beans.CustomerSurveyReview) itrStyles.next(); 
    %>
            <%= cs.getStyleInfo() %>
    <%  } %>
    
    <script type="text/javascript">
        var pageIds = [];
	<%
        if (customerSurveyReview.getLoadAllPages()) {
            java.util.Iterator loadEvents = RequestPages.iterator();
            while (loadEvents.hasNext()) {
                com.kd.kineticSurvey.beans.CustomerSurveyReview cs = (com.kd.kineticSurvey.beans.CustomerSurveyReview) loadEvents.next();
    %>
                pageIds.push("<%=cs.getSanitizedPageId()%>");
    <%
    		}
        }
    %>
        var clientManager = KD.utils.ClientManager;
        var reviewObj = { clientManager: clientManager, loadAllPages: <%=customerSurveyReview.getLoadAllPages()%>, pageIds: pageIds };
        KD.utils.Action.addListener(window, "load", KD.utils.Review.init, reviewObj, true);
    </script>

   	<%=customerSurveyReview.getCustomHeaderContent()%>
    <body class="loadAllPages_<%=customerSurveyReview.getLoadAllPages()%>">
		<% if (request.getAttribute("FullReviewDisplay")!=null && request.getAttribute("FullReviewDisplay").equals("TRUE")) { %>
			<div id="contentPageSection" class="contentPageSection ">
			<%@include file="../pageFragments/reviewHeader.jspf" %>			
		<% } %>
		
	        <div id="reviewContent">
	            <%
	            String renderClass = "frame";

                    List<SimpleEntry> questionsList = new ArrayList();
                    
                    java.util.Iterator pagesItr = RequestPages.iterator();
                    while (pagesItr.hasNext()) {
                        com.kd.kineticSurvey.beans.CustomerSurveyReview cs =
                                (com.kd.kineticSurvey.beans.CustomerSurveyReview) pagesItr.next();
                        com.kd.ksr.beans.Page ppage = com.kd.ksr.cache.PageCache.getPageByInstanceId(cs.getSurveyTemplateInstanceID(), cs.getPageInstanceID());
                        SimpleEntry[] qstns = ppage.getPageQuestions();
                        questionsList.addAll(Arrays.asList(qstns));
                    }
                    SimpleEntry[] questions = (SimpleEntry[])questionsList.toArray(new SimpleEntry[questionsList.size()]);
                    
                    String pageContent = "";
                    
	            if (!customerSurveyReview.getLoadAllPages()) { 
	                pageContent= renderPageTabs(RequestPages, renderClass);
	            } else {
	                pageContent=renderPages(RequestPages, renderClass);
	            }
                    %>
                    <%@include file="../pageFragments/templateLocalize.i18n.jspf" %>
                    <%= pageContent %>

                    <input type="hidden" name="templateID" id= "templateID" value="<%=customerSurveyReview.getSurveyTemplateInstanceID()%>"/>
	            <input type="hidden" name="pageID" id="pageID" value=""/>
	        </div>

		<% if (request.getAttribute("FullReviewDisplay")!=null && request.getAttribute("FullReviewDisplay").equals("TRUE")) { %>
			<%@include file="../pageFragments/footer.jspf" %>			
		</div>
		<% } %>
    </body>
</html>
