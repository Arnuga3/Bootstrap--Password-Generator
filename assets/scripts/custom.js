////Small object event Listeners////

//Focus out result input on click
$('.displayWindow').on("click", function() {
    $('.displayWindow').blur();
});

//Read more button
$('.readMore').on("click", function() {
    
    //Switch to 'Read less' and change a chevron
    if ($(this).find("span").html() == "Read more") {
        
        $('.titleText').css({'height':"100%"});
        $(this).find("span").html("Read less");
        $(this).find("i").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");

    //Switch to 'Read more' and change a chevron
    } else {
        $(this).find("span").html("Read more");
        $(this).find("i").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
        $('.titleText').css({
            'line-height': '1.3em',
            'overflow': 'hidden',
            'height': '2.6em'
        });
    }
});





////Option buttons open appropriate containers////

var containers = $('.actionContainer');

var buttons = $('.nav-sidebar li').each(function(ind) {

    $(this).on("click", function() {
        var targetContainer = $(containers[ind]).fadeIn(300);
        var siblings = $(targetContainer).siblings();

        //Reset and clear a form
        siblings.hide();
        siblings.find(".tick").hide();
        siblings.find("input[type=number]").val("");
        siblings.find("textarea").val("");
        $('.displayWindow').val("");
    });
});

//Change color of focused option and its siblings
$('.nav-sidebar li a').focus(function() {
    $(this).css({"background-color": "rgba(0,0,0,.4)", "color": "white"}).parent().siblings().find("a").css({"background-color": "#333"});
});

$(".checkboxRange input").prop("disabled", true);

$(".checkboxContainer label.checkbox").on("click", function() {

    var checkbox = $(this).find("input");
    var x = $(this).next().find("input");

    if (checkbox.prop("checked")) {
        x.prop("disabled", false);
        x.val("1");

    } else {
        x.prop("disabled", true);
        x.val("");
    }
});


////Module////

var psswdGenObj = (function() {

    var elem = "";

    //Public method 'create button'
    var generatePsswd = function(item) {

        elem = item;

        //Option, one of the five
        var option = elem.parent().parent().parent().attr("id");

        switch(option) {

            case "option1": _generateNumPsswd();
            break;

            case "option2": _generateLetPsswd();
            break;

            case "option3": _generateCustPsswd();
            break;

            case "option4": _convertPhrasePsswd();
            break;

            default: alert("error");
        }
    };

    //Public method 'copy button'
    var selectCopyPsswd = function (item) {

        elem = item;
        
        elem.parent().find(".displayWindow").select();
        _copyPsswd();
        _showTick();

    };

    //Copies selected text into a clipboard
    var _copyPsswd = function () {
        document.execCommand("copy");
    };


    //Generate 'Numbers only' password
    var _generateNumPsswd = function() {

        var psswdLenght = elem.parent().find("input").val();
        var psswd = "";
        var displayDiv = elem.parent().next().find(".displayWindow");

        if (psswdLenght > 0 && psswdLenght != "") {

            for (var i=0; i<psswdLenght; i++) {
                psswd += _getRandomNumber(0, 9);
            }

        } else {
            psswd = "Please specify a length of a password.";
        }

        displayDiv.val(psswd);
        _hideTick();
    };

    //Generate 'Letters only' password
    var _generateLetPsswd = function() {

        var selectedType = elem.parent().parent().find(".radioLet input[name='letters']:checked").val();
        var psswdLenght = elem.parent().find("input").val();
        var psswd = "";
        var displayDiv = elem.parent().next().find(".displayWindow");

        if (psswdLenght > 0 && psswdLenght != "") {

            for (var i=0; i<psswdLenght; i++) {
                psswd += _generateRandomChar(selectedType);
            }

        } else {
            psswd = "Please specify a length of a password.";
        }

        

        displayDiv.val(psswd);
        _hideTick();
    };


    //Generate 'Custom type' password
    var _generateCustPsswd = function() {
      
        var checkedItemsObjects = [];

        //Create objects of selected options to simplify later use
        elem.parent().parent().find(".checkboxContainer .checkbox input:checked").each(function(){
            var type = $(this).attr("name");
            var value = $(this).parent().next().find("input").val();

            //object with type and amount of characters of that group
            var object = new CustomObject(type, value);

            //save objects into an array
            checkedItemsObjects.push(object);
        });

        //Total length (user input)
        var psswdLenght = elem.parent().find("input").val();
        var psswd = "";
        var displayDiv = elem.parent().next().find(".displayWindow");

        //Amount of selected groups
        var customGroupsLength = checkedItemsObjects.length;

        //Total characters of selected groups nned to be included into a password
        var customGroupsTotalAmount = 0;

        //Generate a password from selected groups
        if (customGroupsLength > 0) {

            for (var i=0; i<customGroupsLength; i++) {

                var groupType = checkedItemsObjects[i].type;
                var groupAmount = checkedItemsObjects[i].amount;
                customGroupsTotalAmount += +groupAmount;

                for (var j=0; j<groupAmount; j++) {

                    var randomItem = groupType == "number" ? _getRandomNumber(0, 9) : groupType == "symbol" ? _generateRandomSymbol() : _generateRandomChar(groupType);

                    psswd += randomItem;
                }
                //Shuffle before output a result
                psswd = _shuffleString(psswd);
            }
            
            //Total length is not empty
            if (psswdLenght) {

                //Total length is more then a sum of selected groups
                if (psswdLenght >= customGroupsTotalAmount) {

                    //Number of characters need to be added
                    var difference = psswdLenght - customGroupsTotalAmount;

                    //Add random characters from selected groups
                    for (var i=0; i<difference; i++) {

                        var randIndex = _getRandomNumber(0, customGroupsLength - 1);
                        var randomCheckedItem = checkedItemsObjects[randIndex].type;
                        var randomItem = randomCheckedItem == "number" ? _getRandomNumber(0, 9) : randomCheckedItem == "symbol" ? _generateRandomSymbol() : _generateRandomChar(randomCheckedItem);

                        psswd += randomItem;
                    }

                    //Shuffle before output a result
                    psswd = _shuffleString(psswd);

                } else {
                    psswd = "Length is less then the total length of selected groups above.";
                }
            }

        } else {
            psswd = "Please tick at least one group of characters.";
        }

        displayDiv.val(psswd);
        _hideTick();
    };

    var _convertPhrasePsswd = function() {

        var keys = {

            "a": "@",
            "A": "@",
            "b": "6",
            "B": "I3",
            "f": "4",
            "H": "|-|",
            "K": "|{",
            "l": "|",
            "L": "|_",
            "m": "^^",
            "M": "^^",
            "o": "0",
            "O": "()",
            "Q": "?",
            "s": "$",
            "V": "\\/",
            "w": "vv",
            "W": "VV",
            "x": "><",
            "X": "%"
        };

        var phraseValue = elem.parent().find("textarea").val();
        var phrase = "";
        var displayDiv = elem.parent().next().find(".displayWindow");

        if (phraseValue) {

            var phraseArr = phraseValue.split("");

            TOP_LOOP: for (var i=0; i<phraseArr.length; i++) {

                for (var key in keys) {
                    
                    if (keys.hasOwnProperty(key)) {
                        
                        if (key == phraseValue[i]) {
                            
                            phrase += keys[key]; continue TOP_LOOP;

                        }
                    }
                }
                phrase += phraseValue[i];

            }

        } else {
            phrase = "Please type a phrase.";
        }

        displayDiv.val(phrase);
        _hideTick();

    };


    //Hide tick ('copied' text)
    var _hideTick = function() {
        elem.parent().parent().find(".tick").hide();
    };

    //Show tick ('copied' text)
    var _showTick = function() {    
        elem.parent().parent().find(".tick").show();
    };



    ////Constructors////

    var CustomObject = function(type, amount) {
        this.type = type;
        this.amount = amount;
        return this;
    };


    ////Calculations & Actions////

    //Random Number
    var _getRandomNumber = function(min, max) {
        var min = min, max = max, num;
        num = min + Math.random() * (max - min + 1);
        num = Math.floor(num);
        return num;
    };

    //Random Character
    var _generateRandomChar = function(type) {

        var type = type;
        var lower = "abcdefghijklmnopqrstuvwxyz";
        var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var mix = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var char = "";

        var selectedType = (type == "lowercase") ? lower : (type == "uppercase") ? upper : mix;
        char = selectedType.charAt(_getRandomNumber(0, selectedType.length - 1));
        return char;
    };

    //Random Symbol
    var _generateRandomSymbol = function() {

        var symbols = "`~!@#$%^&-_=+[{]}.";
        var pickedSymbol = symbols[_getRandomNumber(0, symbols.length - 1)];
        return pickedSymbol;
    };

    //Shuffle elements in an array
    var _shuffle = function(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    };

    //Shuffle string
    var _shuffleString = function(a) {
        var arrayToShuffle = a.split("");
        _shuffle(arrayToShuffle);
        var shuffledPsswd = "";
        for (var i=0; i<arrayToShuffle.length; i++) {
            shuffledPsswd += arrayToShuffle[i];
        }
        return shuffledPsswd;
    };

    
    return {
        generatePsswd: generatePsswd,
        selectCopyPsswd: selectCopyPsswd
    };

})();






////Options form controls event listeners////

//'Create' a password button
$('.createPsswdBtn').on("click", function() {
    psswdGenObj.generatePsswd($(this));
});

//Copy generated password
$('.copyBtn').on("click", function() {
    psswdGenObj.selectCopyPsswd($(this));
});