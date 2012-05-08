
/**
 * The KINETIC global namespace object
 * @class KINETIC
 * @static
 */
if (typeof KINETIC == "undefined") {
    KINETIC = {};
}
if (typeof KINETIC.serviceitems == "undefined") {
    KINETIC.serviceitems = {};
}

if (! KINETIC.serviceitems.Helper){

	KINETIC.serviceitems.Helper= new function(){
		this.lastLookup;

		this.resetLookup = function(){
			if (this.lastLookup!=undefined && this.lastLookup.parentNode) {
				layer = new YAHOO.util.Element(this.lastLookup.parentNode);
				layer.removeChild(this.lastLookup);
			} 
			this.lastLookup=undefined;		
		}

		// This is a hack or workaround to allot the CCS affect we use that uses the :before class.
		this.setIE67PreRequired = function(obj) {
		    var html = obj.innerHTML;
		   
		    if (html.indexOf("*")==-1) {
		        html = "<span>*</span>"+html;
		        obj.innerHTML = html;
		    }
		}		
		
		this.showLookupMode = function(obj) {
			this.resetLookup();
			
			lookup = document.createElement("div");
			lookup.className = "lookupPanel";
			lookup.style.display='none';
			lookup.innerHTML="<img src='resources/catalogIcons/ajax-loader_red.gif'></img>";

			obj.parentNode.parentNode.appendChild(lookup);
			this.lastLookup=lookup;

			KD.utils.Action.addListener(lookup, "click", this.hidePanelLookup)
			KD.utils.Action.addListener(obj, "focus", this.hideObjLookup)

			setTimeout(function(){siHelper.showLookup(obj)},100);
		}

		this.showLookup = function(obj){
			layer = new YAHOO.util.Element(obj.parentNode.parentNode);

			lookup = layer.getElementsByClassName('lookupPanel', 'div');
			if (lookup && lookup.length>0){
				lookup[0].style.display='block';
			}
		}

		this.handleErrorResults = function(obj, msg) {
			layer = new YAHOO.util.Element(obj.parentNode.parentNode);
			lookup = layer.getElementsByClassName('lookupPanel', 'div');

			if (lookup && lookup.length>0){
				lookup[0].innerHTML=msg;
			}
		}

		this.hidePanelLookup = function(evt) {
			lookup = YAHOO.util.Event.getTarget(evt);
			layer = lookup.parentNode;
			if (lookup && layer){
				layer.removeChild(lookup);
				this.lastLookup=undefined;
			}
		}

		this.hideObjLookup = function(evt) {
			siHelper.hideLookup(YAHOO.util.Event.getTarget(evt));
		}

		this.hideLookup = function(obj){
			layer = new YAHOO.util.Element(obj.parentNode.parentNode);
			lookup = layer.getElementsByClassName('lookupPanel', 'div');
			if (lookup && lookup.length>0){
				obj.parentNode.parentNode.removeChild(lookup[0]);
				this.lastLookup=undefined;
			}
		}
		
	}
};

var siHelper= KINETIC.serviceitems.Helper;
