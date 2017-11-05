$(document).ready(function() {
    var username = "";
    var liveOrNot = "";
    var newBox = "";
    var streamPic = "";
    var fade;
    var streamUrl = "";

    $(".title").hide().fadeIn("slow");
    function buildBox() {
        console.log(liveOrNot);
        newBox =
            '<div class=container-fluid>' +
            '<div id="' +
            username +
            'Box" class="row">' +
            '<div class="col-md-3 col-lg-4  col-xs-1 col-sm-3"></div>' +
            '<div class="col-md-6 col-xs-10 col-lg-4 col-sm-6">' +
            '<div class="row backgroundDiv">' +
            '<div id="profPicDiv" class="col-md-1 col-xs-1">' +
            streamPic +
            '</div>' +
            '<div class="userDiv col-md-8 col-xs-6">' +
            '<p id="userText"><strong>' +
            username +
            '</strong></p>' +
            '</div>' +
            '<div id="' + username + '" class="twitchIconDiv col-md-1 col-xs-1">' +
            '<input type="image" src="https://cdn1.iconfinder.com/data/icons/simple-icons/2048/twitch-2048-black.png"'+ 
            'name="saveForm" class="btTxt submit ' + fade + '" id="twitchIcon"'+
            'onclick="window.open(' + "'http:" + '//' + "go.twitch.tv/" + username + "', '_blank')" + '"' +
            ' />' +
            '</div>' +
            '<div class="indicator col-md-1 col-xs-1">' +
            '<p id="status"><strong>' +
            liveOrNot +
            '<strong></p>' +
            '</div>' +
            '</div>' +
            '<div class="col-xs-1"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $("body").append(newBox);
    }

    function streamGet() {
        $.ajax({
            headers: {
                "Client-ID": "xnth851asm5l3l401lvyxocfhjkhep",
                Accept: "application/vnd.twitchtv.v5+json"
            },
            //url: "https://api.twitch.tv/kraken/users/?login=" + username,
            url: "https://api.twitch.tv/helix/streams?user_login=" + username,
            success: function(data) {
                if (data.data[0] == undefined) {
                    $("#liveCheck").html(username + " is not broadcasting :(");
                    liveOrNot = "Offln";
                    console.log(liveOrNot);
                    fade = "w3-opacity-max";
                } else {
                    liveOrNot = "Live!";
                    $("#liveCheck").html(username + " is broadcasting!");
                    fade = false;
                    console.log(data.data[0]);
                    console.log(data.data[0].type);
                }
                console.log(liveOrNot);
                buildBox();
            },
            error: function() {
                console.log("Fuck you");
            }
        });
    }

    function userGet() {
        if (document.getElementById("lom").value == "") {
            return $("#liveCheck").html("Enter a streamer!");
        }
        $("#liveCheck").html("checking...");
        username = document.getElementById("lom").value;
        $.ajax({
            headers: {
                "Client-ID": "xnth851asm5l3l401lvyxocfhjkhep",
                Accept: "application/vnd.twitchtv.v5+json"
            },
            url: "https://api.twitch.tv/helix/users?login=" + username,
            success: function(data) {
                if (data.data.length == 0) {
                    return $("#liveCheck").html("Couldn't find that streamer!");
                }
                if (data.data[0].profile_image_url == "") {
                    streamPic = '<div class="noPic"></div>';
                    console.log("no pic");
                } else {
                    streamPic =
                        '<img id="profPic" src="' +
                        data.data[0].profile_image_url +
                        '" width="60px" />';
                    console.log(streamPic);
                    console.log(data);
                }
                streamGet();
            },
            error: function() {
                console.log("userGet failed");
            }
        });
    }

    /*function ajaxCall2(userID) {
        $.ajax({
            headers: {
                "Client-ID": "xnth851asm5l3l401lvyxocfhjkhep",
                "Accept": "application/vnd.twitchtv.v5+json"
            },
            url: "https://api.twitch.tv/kraken/streams/" + userID,
            success: function(moreData) {
                console.log(moreData);
                if (moreData.stream === null) {
                    $("#liveCheck").html("They isn" + "'" + "t live bruh");
                } else {
                    $("#liveCheck").html("They live nigga");
                }
            },
            error: function() {
                console.log("shit don't work nigga");
            }
        });
    };
    */

    $(function() {
        $("#lom").keyup(function(event) {
            if (event.keyCode === 13) {
                $("#button").click();
            }
        });
        $(".btn").click(function() {
            userGet();
            /*$.when(userGet()).done(function() {
                
            }); */
        });
        $(".link").click(function twitchLink() {
            console.log("fuck");
        });
    });


});
