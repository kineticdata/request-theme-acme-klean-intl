/**
 *
 */

// If the Javascript THEME class has not yet been defined
if (typeof THEME == "undefined") {
        // Initialize the THEME class.
        var THEME = {};
        // Initialize the THEME configuration hash.
        THEME.config = {};

        THEME.activateNavigation = function(config) {
            var navigationElements = YAHOO.util.Selector.query(config['navigationSelector']);
            var contentElements = YAHOO.util.Selector.query(config['contentSelector']);

            // Validate the configuration passed to this function
            if (navigationElements.length == 0) {
                THEME.displayError("Unable to activate navigation, the navigation " +
                    "selector query '" + config['navigationSelector'] + "' returns " +
                    "zero results.");
            } else if (contentElements.length == 0) {
                THEME.displayError("Unable to activate navigation, the content container " +
                    "querry '" + config['contentSelector'] + "' returns zero results.");
            } else if (navigationElements.length != contentElements.length) {
                THEME.displayError("Unable to configure navigation, the navigation " +
                    "selector query '" + config['navigationSelector'] + "' (" +
                    navigationElements.length + ") returns a different number of " +
                    "elements than the content selector query '" + config['contentContainer'] +
                    "' (" + contentElements.length + ").");
            } else {
                // For each of the associated elements
                for (var index=0; index<navigationElements.length; index++) {
                    // Configure an event listener on click of the navigation element
                    YAHOO.util.Event.on(navigationElements[index], "click", function (e) {
                        // For each of the content elements
                        for (var eventIndex=0; eventIndex<contentElements.length; eventIndex++) {
                            var navigationElement = navigationElements[eventIndex];
                            var contentElement = contentElements[eventIndex];
                            if (this == navigationElement) {
                                if (config['navigationSelectHandler'] != undefined) {
                                    config['navigationSelectHandler'](navigationElement);
                                }
                                if (config['contentSelectHandler'] != undefined) {
                                    config['contentSelectHandler'](contentElement);
                                }
                            } else {
                                if (config['navigationUnselectHandler'] != undefined) {
                                    config['navigationUnselectHandler'](navigationElement);
                                }
                                if (config['contentUnselectHandler'] != undefined) {
                                    config['contentUnselectHandler'](contentElement);
                                }
                            }
                        }
                    });
                }
            }
        }

        THEME.addClass = function(element, className) {
            YAHOO.util.Dom.addClass(element, className);
        }
        THEME.removeClass = function(element, className) {
            YAHOO.util.Dom.removeClass(element, className);
        }

        THEME.onPageLoad = function(method) {
            YAHOO.util.Event.onDOMReady(method);
        }

        THEME.disable = function(element) {
            YAHOO.util.Dom.setAttribute(element, 'disabled', 'diabled');
        }
        THEME.enable = function(element) {
            YAHOO.util.Dom.setAttribute(element, 'disabled', 'false');
        }

        THEME.lock = function(element) {
            YAHOO.util.Dom.setAttribute(element, 'readonly', 'readonly');
            YAHOO.util.Dom.addClass(element, 'readonly');
        }
        THEME.unlock = function(element) {
            YAHOO.util.Dom.setAttribute(element, 'readonly', 'false');
            YAHOO.util.Dom.removeClass(element, 'readonly');
        }

        THEME.focus = function(element) {
            try {
                element = YAHOO.util.Dom.get(element);
                element.select();
                element.focus();
            } catch (e) {
            // something failed, just ignore and let the user click
            }
        }

        THEME.hide = function(element) {
            YAHOO.util.Dom.addClass(element, 'hidden');
        }
        THEME.show = function(element) {
            YAHOO.util.Dom.removeClass(element, 'hidden');
        }
        THEME.toggle = function(element) {
            if (YAHOO.util.Dom.hasClass(element, 'hidden')) {
                THEME.show(element);
            } else {
                THEME.hide(element);
            }
        }


        /** TODO */
        THEME.showErrorMessage = function(message) {
            alert(message);
        }


        THEME.replace = function(elementReference, path, arguments) {
            if (THEME.config.rootPath == undefined) {
                THEME.showErrorMessage("Error configuring THEME.replace AJAX " +
                    "request. Unable to determine the theme's root path.  Please "+
                    "ensure the THEME.config.rootPath javascript configuration "+
                    "variable is set.");
            } else {
                var element = YAHOO.util.Dom.get(elementReference);

                if (element == null) {
                    THEME.showErrorMessage("Error configuring THEME.replace AJAX" +
                        "request.  Target element '"+elementReference+"' was not " +
                        "found.");
                } else {
                    var callback = {
                        success: THEME.buildHandleReplaceSuccess(element),
                        failure: THEME.buildHandleReplaceFailure(elementReference),
                        arguments: arguments
                    };

                    path = THEME.config.rootPath+'/'+path;

                    YAHOO.util.Connect.asyncRequest('GET', path, callback);
                }
            }
        }

        THEME.replaceIfEmpty = function (elementReference, path, arguments) {
            var element = YAHOO.util.Dom.get(elementReference);
            if (element.children.length == 0) {
                THEME.replace(elementReference, path, arguments);
            }
        }

        THEME.buildHandleReplaceSuccess = function(elementReference) {
            var element = YAHOO.util.Dom.get(elementReference);
            return function(response) {
                if (element == null) {
                    THEME.showErrorMessage("Unable to process the javascript "+
                        "THEME.replace call.  Target element was not found.");
                } else {
                    element.innerHTML = response.responseText;
                }
            }
        }
        THEME.buildHandleReplaceFailure = function(elementReference) {
            return function(response) {
                THEME.showErrorMessage('Unable to replace the contents of '+
                    elementReference+': ('+response.status+') '+response.statusText+
                    '\n\n'+response.responseText);
            }
        }
}
