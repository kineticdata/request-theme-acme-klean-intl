<%!
    // *****************************************************************
    // *  Load the first page only and display page tabs
    // *****************************************************************
    private String renderPageTabs(java.util.Vector requestPages, String renderClass) {
        StringBuffer buf = new StringBuffer();
        java.util.Iterator itr = null;
        boolean firstPage;
        // display a navigation list of page names if more than one page
        if (requestPages.size() > 1) {
            buf.append("<ul id='globalnav'>");

            /* create the page tabs */
            itr = requestPages.iterator();
            firstPage = true;
            String initClass = "selectedTab";
            while (itr.hasNext()) {
                com.kd.kineticSurvey.beans.CustomerSurveyReview cs =
                        (com.kd.kineticSurvey.beans.CustomerSurveyReview) itr.next();
                if (cs.getQuestions() != null) {
                    /* select the first page tab */
                    if (firstPage) {
                        firstPage = false;
                    } else {
                        initClass = "";
                    }
                    buf.append("<li>");
                    buf.append("<a class='");
                    buf.append(initClass);
                    buf.append("' href='javascript:void(0);' onclick='KD.utils.Review.showPage(this, \"pageHolder_");
                    buf.append(cs.getSanitizedPageId());
                    buf.append("\", \"");
                    buf.append(cs.getPageInstanceID());
                    buf.append("\");'>");
                    buf.append(cs.getPageName());
                    buf.append("</a>");
                    buf.append("</li>");
                }
            }

            buf.append("</ul>");
        }

        buf.append("<div id='PAGE_ReviewPages' class='");
        buf.append(renderClass);
        buf.append("'>");
        itr = requestPages.iterator();
        firstPage = true;
        String displayStyle = "block";
        while (itr.hasNext()) {
            com.kd.kineticSurvey.beans.CustomerSurveyReview cs =
                    (com.kd.kineticSurvey.beans.CustomerSurveyReview) itr.next();
            if (cs.getQuestions() != null) {
                buf.append("<div style='display:");
                buf.append(displayStyle);
                buf.append(";' id='pageHolder_");
                buf.append(cs.getSanitizedPageId());
                buf.append("' class='reviewPageDiv'>");
                if (firstPage) {
                    buf.append("<script type='text/javascript'>");
                    buf.append("    KD.utils.Review.currentDisplayedPageID = 'pageHolder_");
                    buf.append(cs.getSanitizedPageId());
                    buf.append("';");
                    buf.append("</script>");
                    firstPage = false;
                    displayStyle = "none";
                    buf.append(cs.getQuestions());
                } else {
                    buf.append("<img src='./resources/catalogIcons/ajax-loader.gif' alt='Loading...'/>");
                }
                buf.append("</div>");
            }
        }
        buf.append("</div>");
        return buf.toString();
    }

    // *****************************************************************
    // *  Load and Display all pages together
    // *****************************************************************
    private String renderPages(java.util.Vector requestPages, String renderClass) {
        StringBuffer buf = new StringBuffer();
        buf.append("<div id='ReviewPages' class='");
        buf.append(renderClass);
        buf.append("'>");

        java.util.Iterator itr = requestPages.iterator();
        while (itr.hasNext()) {
            com.kd.kineticSurvey.beans.CustomerSurveyReview cs =
                    (com.kd.kineticSurvey.beans.CustomerSurveyReview) itr.next();
            if (cs.getQuestions() != null) {
                buf.append("<div id='page_");
                buf.append(cs.getSanitizedPageId());
                buf.append("' class='reviewPageDiv'>");
                buf.append(cs.getQuestions());
                buf.append("</div>");
            }
        }
        buf.append("</div>");
        return buf.toString();
    }
%>
