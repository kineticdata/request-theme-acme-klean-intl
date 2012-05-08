<%@page contentType="text/html; charset=UTF-8"%>
<%
    response.setHeader("CACHE-CONTROL", "no-cache, no-store, must-revalidate, max-age=0"); //HTTP 1.1
    response.setDateHeader("EXPIRES", 0); //prevents caching at the proxy server
    response.setHeader("PRAGMA", "NO-CACHE");

%>
<%--
    Include the theme configuration file.  This
--%>
<%@include file="../../includes/themeLoader.jspf"%>

<%
    String preferredLocale = ThemeLocalizer.getPreferredLocale(request.getCookies());
    java.util.ResourceBundle serviceItemsResourceBundle=ThemeLocalizer.getResourceBundle("ServiceItems", ThemeLocalizer.getPreferredLocale(request.getCookies()));    
    String description="";
    String templateID="";
    java.util.List resultsList = (java.util.List) request.getAttribute("resultsList");
    if (resultsList != null) {
        com.kd.arsHelpers.SimpleEntry entry = (com.kd.arsHelpers.SimpleEntry) resultsList.get(0);
    	description = entry.getEntryFieldValue("700001010");//Survey_Description

        // Locate all <LOCALE*> tags then remove those that don't match the preferred Locale
        StringBuffer buffer=new StringBuffer(description);
        int pos=0;
        while((pos=buffer.indexOf("<LOCALE_",pos))!=-1){
            String tag = buffer.substring(pos, buffer.indexOf(">",pos)+1);
            System.out.println("Found:"+tag);            

            if (!tag.equals("<LOCALE_"+preferredLocale+">")){
                String endTag = "</"+tag.substring(1);
                buffer=buffer.delete(pos, buffer.indexOf(endTag,pos)+endTag.length());
                pos=0;
            } else {
                pos+=tag.length();
            }
        }
             
        description = buffer.toString();
        // Find all LOCALIZE_SI tags and translate
        // These Tags will translate based on the service items resource bundle
        java.util.List<String> matchedSIValues = new java.util.ArrayList<String>();
        String localizeSIPat = "<LOCALIZE_SI>(.*?)</LOCALIZE_SI>";
        java.util.regex.Pattern localizeSIPattern = java.util.regex.Pattern.compile(localizeSIPat);
        java.util.regex.Matcher localizeSIMatcher = localizeSIPattern.matcher(description);

        while(localizeSIMatcher.find()) {
            String matchString = localizeSIMatcher.group();
            matchedSIValues.add(matchString);
            //System.out.println("Found:"+matchString);            
        }

        java.util.Iterator<String> si_iterator = matchedSIValues.iterator();
	while (si_iterator.hasNext()) {
            String matchString = (String)si_iterator.next();
            String origValue=matchString.replaceFirst("<LOCALIZE_SI>", "")
						.replaceFirst("</LOCALIZE_SI>", "");
            
            String translatedValue=ThemeLocalizer.getString(serviceItemsResourceBundle,origValue);
            //System.out.println("Value:"+origValue+" translate:"+translatedValue);
            
            description=description.replaceAll(matchString, translatedValue);
	}
        
        // Look for the <LOCALIZE_SERVICE_ITEM_DESCRIPTION> TAG
        // If found replace with the resourceBundle stored value
        if (description.indexOf("<LOCALIZE_SERVICE_ITEM_DESCRIPTION>")>=0){
            String templateName = entry.getEntryFieldValue("700001000");
            templateName = templateName.replaceAll(" ","_");
            String localizedDescription = ThemeLocalizer.getString(serviceItemsResourceBundle,templateName+"_DESCRIPTION");
            description=description.replace("<LOCALIZE_SERVICE_ITEM_DESCRIPTION>", localizedDescription);
        }
    	templateID = entry.getEntryFieldValue("179");//Instance ID
    }

%>
<div>
<%=description%>
</div>