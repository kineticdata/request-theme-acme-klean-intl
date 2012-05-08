<%--
 $Rev: 77 $
 $Date: 2010-09-10 05:49:27 +1000 (Fri, 10 Sep 2010) $
--%>
<%@page contentType="text/html; charset=UTF-8"%>
<%
response.setHeader("CACHE-CONTROL","no-cache, no-store, must-revalidate, max-age=0"); //HTTP 1.1
response.setDateHeader ("EXPIRES", 0); //prevents caching at the proxy server
response.setHeader("PRAGMA","NO-CACHE");
%>
<%--
    Include the theme configuration file.  This
--%>
<%@include file="../../includes/themeLoader.jspf"%>

<%-- Format a list of KS_SRV_SurveyTemplate entries in an unordered list including link to the template and title --%>
<% java.util.List resultsList=(java.util.List)request.getAttribute("resultsList");

    java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));        

%>
<div>
	<div id="searchCategoryLabelHolder" class="searchCategoryLabelHolder" style="">
		<div class="categoryItem categorySelected">
			<div class="categorySelected category_item_label" style="">Search Results</div>
		</div>
	</div>
	<div id="searchResults_ServiceItems" class="serviceItemResults roundedLeft6 curvyRedraw" style="">
<% if(resultsList != null){
    	java.util.Hashtable serviceItems = new java.util.Hashtable();
        java.util.Iterator iter = resultsList.iterator();
        while(iter.hasNext()){
            com.kd.arsHelpers.SimpleEntry entry=(com.kd.arsHelpers.SimpleEntry)iter.next();
            serviceItems.put(entry.getEntryFieldValue("179"), entry);
        }
        java.util.Enumeration siIter = serviceItems.elements();
        while(siIter.hasMoreElements()){
            com.kd.arsHelpers.SimpleEntry entry=(com.kd.arsHelpers.SimpleEntry)siIter.nextElement();
            entry.getEntryFieldValue("700002489");

            String URL=entry.getEntryFieldValue("700002489");
            URL = URL.substring(URL.indexOf("DisplayPage"));
            String templateName = (String) entry.getEntryFieldValue("700001000");
            String templateNameID = templateName.replaceAll(" ", "");
        %>
            <div>
                <div  srv='<%=(String) entry.getEntryFieldValue("179")%>' id='search_serviceItem_<%=(String) entry.getEntryFieldValue("179")%>'class='serviceItem_item' onclick='catalogHelper.selectSearchServiceItem(this)'  onmouseover="catalogHelper.highlightServiceItem(this)" onmouseout="catalogHelper.removeHighlightServiceItem(this)" onmouseleave="catalogHelper.removeHighlightServiceItem(this)"><%=ThemeLocalizer.getString(serviceItemsResourceBundle,templateName) %></div>
            </div>
        <%}%>
	</div
<%} else{%>
    <div>
	<div class='serviceItem_item'>No results found </div>
    </div>
<%} %>
	</div>
</div>    