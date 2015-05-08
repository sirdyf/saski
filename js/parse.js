var parseShortNotation = function(text){
    var arr=text.split(':');
    var white_ = parseShortNotationPart(arr[0]);
    var black_ = parseShortNotationPart(arr[1]);
    var wObj={};
    wObj['white']=white_;
    wObj['black']=black_;
    var res = JSON.stringify(wObj);
    saski_all.sample.push(res);
}
var parseShortNotationPart = function(text){
    var target = [];
    var ind=0;
    for (var i = 0; i < text.length/2; i++) {
        var notifText = text.substring(i * 2 ,i * 2 + 2);
        var indFigure = notifText;
        var wObj={};
        wObj['pos']=indFigure;
        wObj['elType']='normal'
        target[ind]=wObj;
        ind++;
    };
    return target;
}
var parseStartPositionWithType = function(target,figureType){
    var response = saski_all.startPositions
    var json_obj = $.parseJSON(response);//parse JSON
    var output="<li>";
    var whitePos=json_obj[figureType];
    var ind=0;
    for (var i in whitePos) {
        var tmpPos=whitePos[i].pos;
        output+= tmpPos+",";
        var indFigure = getIndexFromNotation(tmpPos);
        var wObj={};
        wObj['pos']=indFigure;
        wObj['elType']=whitePos[i].elType;
        target[ind]=wObj;
        ind++;
    }
    output+="</li>";
    // $("#right_panel ul").append(output);
}
var getSymbolForCurrentGameStep = function(pos){
    var retSymbol= '-';
    for (var i = 0; i < saski_all.currentRemovedWhite.length; i++) {
        if (saski_all.currentRemovedWhite[i] === pos){
            return ':';
        }
    };
    for (var i = 0; i < saski_all.currentRemovedBlack.length; i++) {
        if (saski_all.currentRemovedBlack[i] === pos){
            return ':';
        }
    };
    return retSymbol;
}
var tryParseNotification = function(txt){
    var playersStep = txt.split(' ');
    if (playersStep.length != 2){
        console.log('Error:'+txt+' Step must be two part seprate SPACE');
        return [];
    }
    var first = playersStep[0].split(/[-:]/);
    if (first.length<2){
        console.log('Error: first part must be two or more in ('+playersStep[0]+')');
    }
    var second = playersStep[1].split(/[-:]/);
    if (second.length<2){
        console.log('Error: second part must be two or more in ('+playersStep[1]+')');
    }
    if (!checkStepSequence(first)) {
        console.log('Wrong first sequence:'+first);
        return [];
    };
    if (!checkStepSequence(second)) {
        console.log('Wrong second sequence:'+second);
        return [];
    };
    var stp1=getIndexFromNotation(first[0]);
    var stp2=getIndexFromNotation(second[0]);
    if (!isValidFigurePositionWithTarget(stp1,saski_all.white)){
        console.log('White figure not found in position:'+first[0]+'('+stp1+')');
        return [];
    }
    if (!isValidFigurePositionWithTarget(stp2,saski_all.black)){
        console.log('Black figure not found in position:'+second[0]+'('+stp2+')');
        return [];
    }
    var res={'first':first,'second':second};
    return res;
}
var parseStartPosition = function(response, figureType){
    if (!response || response.length<3) return '';
    var json_obj = $.parseJSON(response);//parse JSON
    var figurePos=json_obj[figureType];
    var output = '';
    for (var i in figurePos) {
        var tmpPos=figurePos[i].pos;
        output+= tmpPos+",";
    }
    return output.substring(0,output.length-1).toUpperCase();
}
