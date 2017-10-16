
$(document).ready(function() {
	$("#title").hide().fadeIn(800);
	$("#lomo").hide().fadeIn(1800);
	$("#bigTemp").hide();


    if (navigator.geolocation) {
        var lat;
        var long;
        var html = "";
        var htmlLoc = "";
        var htmlConds="";



        navigator.geolocation.getCurrentPosition(function(position) {
            apiURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=imperial&APPID=5c3f8291a845afe559a328193bea0bd8";
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            console.log(apiURL);

            //Calls weather api with user coordinates in imperial units
            $.getJSON(apiURL, function(json) {
                var mainVals = Object.values(json);
                var keys = Object.keys(json);
                var weatherConds = mainVals[1];
                var weatherDescrp = weatherConds[0].description;
                var tempHi = mainVals[3].temp_max;
                var tempLow = mainVals[3].temp_min;
                var currTemp = mainVals[3].temp;
                var city = json.name;


                console.log(data);
                console.log(weatherConds[0].description);
                console.log();

                htmlConds+= "<p class='text-center'>There's "+ weatherDescrp +".</p>"

                htmlLoc += "<p>You're in <strong>" + city + "</strong>.</p>"

                html += "<p class = 'text-center'><strong id='currTemp'>" + currTemp + "&degF</strong></p>"


                //adds new html to elements
                $("#lomo").fadeOut().html("").fadeIn();
                $("#data").hide().html(html).fadeIn();
                $("#subTitle").hide().html(htmlLoc).fadeIn();
                $("#weatherOut").hide().html(htmlConds).fadeIn();
                //$("#sunRot").hide().attr("src","sunRot.png").fadeIn();
                $("#bigTemp").append("Conditions");         

                if (htmlConds.indexOf("mist") > 0){
                    $("#pic").hide().attr("src", "mist.png").fadeIn();
                }       
                if (htmlConds.indexOf("rain") > 0){
                    $("#pic").hide().attr("src", "rainDrop.jpeg").fadeIn();
                }
                



            });
        });


    };
});