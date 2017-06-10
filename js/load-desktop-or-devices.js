/* karthik 05-15 13:03*/ 
//Add forEach Array method support
'use strict';
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}

var arrValuesSegment = [  "localhost", "treasures", "treasures-id", "treasures-sc", "treasures-zh", "treasures-private-client", "treasures-private-client-id", "treasures-private-client-sc", "treasures-private-client-zh", "private-banking", "private-banking-id", "private-banking-sc", "private-banking-zh" ];

var BrowserDetect = { 
 init: function () {
		var pageURL = window.location.href;
    var pageSegments = pageURL.split('/');
    var pageSegment = "";

    if (pageSegments != null && pageSegments != "")
    {
        if (pageSegments[3] == "in")
            pageSegment = pageSegments[4];
        else if (pageSegments[3] == "id")
            pageSegment = pageSegments[4];
        else
            pageSegment = pageSegments[3];
    }
	var oaos=false;
	if ((pageSegments[3] == "in")||(pageSegments[3] == "id"))
	{
		if((typeof pageSegments[5]!=="undefined")&&(typeof pageSegments[6]!=="undefined")&&(pageSegments[5]=="dbs-forms")&&(pageSegments[6]=="accounts"))
		{ 
			oaos=true;
	 
		}
	}
	else
	{
		if((typeof pageSegments[4]!=="undefined")&&(typeof pageSegments[5]!=="undefined")&&(pageSegments[4]=="dbs-forms")&&(pageSegments[5]=="accounts"))
		{
			oaos=true;
		}
	
	}
	if(oaos===false)
	{
	   if(navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|webOS|Mobile/i)){ 
	  this.loadjscssfile("./iwov-resources/styles/web/devices.css", "css", true); 
	   
		var object = this;
		  arrValuesSegment.forEach(function(entry) { /* pageSegment iWealth CSS - START */
			 if(pageSegment==entry){
			   object.loadjscssfile("./iwov-resources/styles/web/devices-iw.css", "css", false);
			 }			
		  });	

		  
	   }else{
		this.loadjscssfile("./iwov-resources/styles/web/desktop.css", "css", false);
		this.loadjscssfile("./iwov-resources/styles/web/desktop_continue.css", "css", false);

		var object = this;
		arrValuesSegment.forEach(function(entry) { /* pageSegment iWealth CSS - START */
			if(pageSegment==entry){ 
				object.loadjscssfile("./iwov-resources/styles/web/desktop-iw.css", "css", false);
			}			
		});	

		  
	   }
	}
	else
	{	
		this.loadjscssfile("./iwov-resources/styles/web/desktop.css", "css", false);
		this.loadjscssfile("./iwov-resources/styles/web/desktop_continue.css", "css", false);

		var object = this;
		arrValuesSegment.forEach(function(entry) { /* pageSegment iWealth CSS - START */
			if(pageSegment==entry){ 
				object.loadjscssfile("./iwov-resources/styles/web/desktop-iw.css", "css", false);
			}			
		});	
		
	}
    },
 loadjscssfile: function (filename, filetype, ifMetaTag) {
    var metaTagHand = document.createElement("meta");
   metaTagHand.setAttribute("name", "HandheldFriendly");   
   metaTagHand.setAttribute("content", "True");      
 
   var metaTag = document.createElement("meta");
   metaTag.setAttribute("name", "viewport");   
   metaTag.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"); 
    
   var fileref=document.createElement("link");
   fileref.setAttribute("rel", "stylesheet");
   fileref.setAttribute("type", "text/css");
   fileref.setAttribute("href", filename);

	 
     if (typeof fileref!="undefined"){
     if (ifMetaTag){
    document.getElementsByTagName("head")[0].appendChild(metaTagHand);
    document.getElementsByTagName("head")[0].appendChild(metaTag);
  }    
    document.getElementsByTagName("head")[0].appendChild(fileref);
    } 
 } 
};
BrowserDetect.init();
 
/*Header BR Tag Remove 11 Jun 2013*/
$(document).ready(function() {
 $('ul#bu-dropdown li.list-heading h1').each(function(){
    var heading = $(this).text();
  heading = heading.replace("<br/>"," ");
  $(this).text(heading);
 });
 $('div#language-country-dropdown li.list-heading h1').each(function(){
  var heading = $(this).text();
  heading = heading.replace("<br/>"," ");
  $(this).text(heading); 
 });
 $('div#segment-dropdown li.list-heading h1').each(function(){
  var heading = $(this).text();
  heading = heading.replace("<br/>"," ");
  $(this).text(heading); 
 });
 /*************** Cookie Value updation statrs here ******************************/
 function setCookie(c_name,value,exdays,urlPath)
        {
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + ";path=" +urlPath;
            document.cookie=c_name + "=" + c_value;
        }
    
        setCookie("segmentValue", "", "-1", "/");
        var pageURL = window.location.href;
      
        var pageSegments = pageURL.split('/');
        var pageSegment = "";
        if(pageSegments != null && pageSegments != "")
        {
   
            if(pageSegments[3] == "in")
                 pageSegment = pageSegments[4];
            else if(pageSegments[3] == "id")
                 pageSegment = pageSegments[4];
            else
                 pageSegment = pageSegments[3];
        }
        //var arrValues = [ "treasures", "personal", "sme", "corporate" ];
		//var arrValues = [ "treasures", "sme", "corporate", "treasures-private-client", "private-banking","personal","personal-zh","treasures-zh", "sme-zh", "corporate-zh", "treasures-private-client-zh", "private-banking-zh" ];
        var arrValues = [ "treasures", "sme", "corporate", "treasures-private-client", "private-banking","personal","personal-zh","treasures-zh", "sme-zh", "corporate-zh", "treasures-private-client-zh", "private-banking-zh","posb" ];
  arrValues.forEach(function(entry) {
     if(pageSegment==entry)
     {
      "console" in window && console.log("cookie passed here is --->"+pageSegment);
       setCookie("segmentValue", pageSegment, 99999,"/");
     }
  });
       /* if((pageSegment!=null || pageSegment!='')&&((pageSegment != "index")&&(pageSegment != "index-sc")&&(pageSegment != "index-zh")&&(pageSegment != "index-id")))
        {
   "console" in window && console.log("cookie passed here is --->"+pageSegment);
            setCookie("segmentValue", pageSegment, 99999,"/");
        }*/
 /*************** Cookie Value updation ends here ******************************/
});
