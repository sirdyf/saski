var num=1;
var saski_all = {};
saski_all.sample = [];

saski_all.white=[];
saski_all.black=[];
saski_all.boardSize = 8;
saski_all.currentPlayer = 1;
saski_all.whiteSelectedPosition=[];
saski_all.blackSelectedPosition=[];
saski_all.steps = [];
saski_all.currentRemovedWhite = [];
saski_all.currentRemovedBlack = [];
saski_all.currentAvailablePosition = [];
saski_all.currentLostPosition = [];
saski_all.currentFavorite = [];

var isFigureDamka = function(posIndex,target){
    if (!isNumeric(posIndex) || posIndex<0){
        console.log('Wrong position index:'+posIndex);
        return false;
    }
    var _white = target;
    for (var i = 0; i < _white.length; i++) {
        var nFigure = _white[i].pos;
        var indFigure = nFigure;//getIndexFromNotation(nFigure);
        if (posIndex === indFigure){
            if (_white[i].elType == 'high'){
                return true;
            }
        }
    };
    return false;
}
var isValidSaskaStep = function(pos1,pos2,target,mode){
    var revertTarget = getRevertTarget(target);
    var path=getPath(pos1,pos2);
    if ((path.length<1)&&(mode != 'emulate')){
        if (target === saski_all.white){
            if (pos2>pos1) return true;
        }else{
            if (pos2<pos1) return true;
        }
        return false;
    }
    if (path.length>1) return false;
    if (isValidFigurePositionWithTarget(path[0],revertTarget)) {
        saski_all.currentLostPosition.push(path[0]);
        saski_all.currentFavorite.push(pos2);
        return true;}
    return false;
}
var squareClick = function(event){
    console.log('Click on '+ event.data.indexPos);
    var ind=event.data.indexPos;
    ind = getIndexFromVisualIndex(ind);
    console.log('array index ='+ind);
    if (!isNumeric(ind)) return;
    if (saski_all.currentPlayer === 1){
        var _white=saski_all.whiteSelectedPosition;
        if (_white.length>0) {
            if (!isValidStep(_white[_white.length-1],ind)) return;
            if (isValidFigurePositionWithTarget(ind,saski_all.white)) return;
            if (isValidFigurePositionWithTarget(ind,saski_all.black)) return;
            if (!isFigureDamka(_white[0],saski_all.white)){
                if (!isValidSaskaStep(_white[_white.length-1],ind,saski_all.white)){
                    return;
                }
            }
        }else{
            if (!isValidFigurePositionWithTarget(ind,saski_all.white)) return;
            clearAllBorder();
        }
        addWhitePositionToArray(ind);
    }else{
        var _black=saski_all.blackSelectedPosition;
        if (_black.length>0) {
            if (!isValidStep(_black[_black.length-1],ind)) return;
            if (isValidFigurePositionWithTarget(ind,saski_all.white)) return;
            if (isValidFigurePositionWithTarget(ind,saski_all.black)) return;
            if (!isFigureDamka(_black[0],saski_all.black)){
                if (!isValidSaskaStep(_black[_black.length-1],ind,saski_all.black)){
                    return;
                }
            }
        }else{
            if (!isValidFigurePositionWithTarget(ind,saski_all.black)) return;
            clearAllBorder();
        }
        addBlackPositionToArray(ind);
    }
    showCurrentStepInInput();
    reRenderSelected();
}
var changePlayerButtonClick = function(){
    if (saski_all.currentPlayer === 1){
        saski_all.currentPlayer = 2;
    }else{
        saski_all.currentPlayer = 1;
    };
    showCurrentPlayer();
}
var addWhitePositionToArray = function(pos){
    for (var i = 0; i < saski_all.whiteSelectedPosition.length; i++) {
        var indFigure = saski_all.whiteSelectedPosition[i];
        if (indFigure === pos) return;
    };
    saski_all.whiteSelectedPosition.push(pos);
}
var addBlackPositionToArray = function(pos){
    for (var i = 0; i < saski_all.blackSelectedPosition.length; i++) {
        var indFigure = saski_all.blackSelectedPosition[i];
        if (indFigure === pos) return;
    };
    saski_all.blackSelectedPosition.push(pos);
}
var undoButtonClick = function(){
    if (saski_all.currentPlayer === 1) {
        if (saski_all.whiteSelectedPosition.length>0){
            saski_all.whiteSelectedPosition.pop();
        }
    } else{
        if (saski_all.blackSelectedPosition.length>0){
            saski_all.blackSelectedPosition.pop();
        }
    };
    clearAllBorder();
    reRenderSelected();
    showCurrentStepInInput();
}
var commitStepButtonClick = function() {
    var text=$('#notifText').val();
    // $('#notifText').val('');
    console.log(text);
    if (text.length>0){
        var result=tryParseNotification(text);
        // TODO check
        makeStep();
    }
}
var showErrorMessage = function(){
    var message = 'Error step!\nUndo step?';
    var result = confirm(message);
    if (result) undoButtonClick();
}
var commitButtonClick = function() {
    saski_all.currentAvailablePosition = [];
    saski_all.currentLostPosition = [];
    saski_all.currentFavorite = [];
    if (saski_all.currentPlayer === 1){
        if (!makeStepWhite()) {
            showErrorMessage();
            return;
        }
        clearBoard();
        markCurrentAvailablePosition(saski_all.black,0);
    }else{
        if (!makeStepBlack()) {
            showErrorMessage();
            return;
        }
        showCurrentStepInInput();
        var text=$('#notifText').val();
        saski_all.steps.push(text);
        saski_all.whiteSelectedPosition=[];
        saski_all.blackSelectedPosition=[];
        saski_all.currentRemovedWhite=[];
        saski_all.currentRemovedBlack=[];
        clearBoard();
        markCurrentAvailablePosition(saski_all.white,0);
    }
    clearAllBorder();
    renderFigure();
    changePlayerButtonClick();
}
var convertToDamka = function(pos,target){
    var _white = target;
    for (var i = 0; i < _white.length; i++) {
        if (_white[i].pos == pos){
            _white[i].elType = 'high';
            return;
        }
    };    
}
var makeStepWhite = function(){
    var _white = saski_all.whiteSelectedPosition;
    for (var i = 0; i < _white.length-1; i++) {
        if (isStepContainSelfFigure(_white[i],_white[i+1],saski_all.white)) {
            return false;}
        if (isStepHaveTwoСontinuousFigure(_white[i],_white[i+1])) {
            return false};
        if ((_white[i]>=56)||(_white[i+1]>=56)){
            convertToDamka(_white[0],saski_all.white);
        }
        removeFigureFromArrays(_white[i],_white[i+1]);
    };
    moveFigureWithTarget(_white[0],_white[_white.length-1],saski_all.white);
    return true;
}
var isStepHaveTwoСontinuousFigure = function(pos1,pos2){
    var path=getPath(pos1,pos2);
    if (path.length<2) return false;
    for (var i = 0; i < path.length-1; i++) {
        var flagFirst=isValidFigurePositionWithTarget(path[i],saski_all.white) || isValidFigurePositionWithTarget(path[i],saski_all.black);
        var flagSecond=isValidFigurePositionWithTarget(path[i+1],saski_all.white) || isValidFigurePositionWithTarget(path[i+1],saski_all.black);
        if (flagFirst && flagSecond) return true;
    }
    return false;
}
var isStepContainSelfFigure = function(pos1,pos2,target){
    var path=getPath(pos1,pos2);
    for (var i = 0; i < path.length; i++) {
        if (isValidFigurePositionWithTarget(path[i],target)) {
            return true;}
    };
    return false;
}
var makeStepBlack = function(){
    var _black = saski_all.blackSelectedPosition;
    for (var i = 0; i < _black.length-1; i++) {
        if (isStepContainSelfFigure(_black[i],_black[i+1],saski_all.black)) return false;
        if ((_black[i]<=7)||(_black[i+1]<=7)) {
            convertToDamka(_black[0],saski_all.black);
        } ;
        removeFigureFromArrays(_black[i],_black[i+1]);
    };
    moveFigureWithTarget(_black[0],_black[_black.length-1],saski_all.black);
    return true;
}
var removeFigureFromArrays = function(pos1,pos2){
    var path=getPath(pos1,pos2);
    console.log('Path:'+path);
    console.log('end path.')
    for (var i = 0; i < path.length; i++) {
        var delW=removeFigureFromTarget(path[i],saski_all.white);
        if (delW.length>0){
            console.log('Info: white removed! black pos='+pos2);
            saski_all.currentRemovedWhite.push(pos2);
        }
        
        var delW=removeFigureFromTarget(path[i],saski_all.black);
        if (delW.length>0){
            console.log('Info: white removed! white pos='+pos2);
            saski_all.currentRemovedBlack.push(pos2);
        }
    };
}
var removeFigureFromTarget = function(index,target){
    var removedArr = [];
    for (var i = 0; i < target.length; i++) {
        if (target[i].pos === index) {
            removedArr.push(target[i]);
            var index = target.indexOf(target[i]);
            if (index > -1) {
                target.splice(index, 1);
            }
            continue;
        }
    };
    return removedArr;
}
var getPath = function(pos1,pos2){
    var retPath = [];
    var ind1 = pos1;
    var ind2 = pos2;
    if (ind1 > pos2){
        ind1 = pos2;
        ind2 = pos1;
    }
    for (var i = ind1+1; i < ind2; i++) {
        if (isValidStep(i,ind1) && isValidStep(i,ind2)){
            retPath.push(i);
        }
    };
    return retPath;
}
var moveFigureWithTarget = function(pos1,pos2,target){
        var _white = target;
    for (var i = 0; i < _white.length; i++) {
        if (_white[i].pos === pos1){
            _white[i].pos = pos2;
            return;
        }
    };
}
var isNumeric = function( obj ) {
    // http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}
var isValidStep = function(tpos1,tpos2){
    if (!isNumeric(tpos1) || !isNumeric(tpos2)){
        console.log("not valid value: "+tpos1+' or '+tpos2);
        return false;
    }
    var pos1 = tpos1 - 0;
    var pos2 = tpos2 - 0;
    var bSize = saski_all.boardSize;
    var maxSize=bSize*bSize;
    if (pos1>maxSize || pos2>maxSize){
        console.log("Value big!");
        return false;
    }
    if (pos1 === pos2) return false;
    var validDelta1 = bSize + 1;
    var validDelta2 = bSize - 1;
    var delta = Math.abs(pos2 - pos1);
    if (((delta % validDelta1) === 0) || ((delta % validDelta2) === 0)) {
        var posX1 = (pos1 % bSize);
        var posY1 = Math.ceil(pos1 / bSize + 0.01) - 1;
        var posX2 = (pos2 % bSize);
        var posY2 = Math.ceil(pos2 / bSize + 0.01) - 1;
        var dX = Math.abs(posX1 - posX2);
        var dY = Math.abs(posY1 - posY2);
        if (dX === dY){
            return true;
        }
    };
    return false;
}
var isValidFigurePositionWithTarget = function(posIndex,target){
    if (!isNumeric(posIndex) || posIndex<0){
        console.log('Wrong position index:'+posIndex);
        return false;
    }
    var _white = target;
    for (var i = 0; i < _white.length; i++) {
        var nFigure = _white[i].pos;
        var indFigure = nFigure;//getIndexFromNotation(nFigure);
        if (posIndex === indFigure){
            return true;
        }
    };
    return false;
}
var checkStepSequence = function(steps){
    if (steps.length<2) return false;
    console.log('Info: ckeck sequence-'+steps);
    for (var i = 0; i < steps.length - 1; i++) {
        var stp1=getIndexFromNotation(steps[i]);
        var stp2=getIndexFromNotation(steps[i+1]);
        if (!isNumeric(stp1) || !isNumeric(stp2) || (stp1<0)||(stp2<0)){
            console.log('Error parse:'+stp1+' and '+stp2);
            return false;
        }
        if (!isValidStep(stp1,stp2)){
            console.log('Error step! from:'+steps[i]+'('+stp1+')'+' to '+steps[i+1]+'('+stp2+')');
            return false;
        }
    };
    return true;
}
var testParseNotification = function(){
    tryParseNotification("asd");
    tryParseNotification("asd dsa");
    tryParseNotification('c2-b1 d1:e2');
    tryParseNotification('b2-b1 d1:e2');
    tryParseNotification('a2-b1 d1:e2');
    console.log('-----')
    tryParseNotification('d1:e2 a2-b1');
}
var testNotificationFromIndex = function(){
    for (var i = 0; i < 63; i++) {
        console.log(getNotificationFromIndex(i));
    };
}
var exportButtonClick =  function(){
    var sampleNum=$.inArray(saski_all.startPositions ,saski_all.sample)+1;
    var question = 'Copy and paste result.\n\n';
    question += 'Start position('+sampleNum+'):\n';
    question += 'White:'+parseStartPosition(saski_all.startPositions,'white')+'\n';
    question += 'Black:'+parseStartPosition(saski_all.startPositions,'black')+'\n';
    question += '\nSteps:\n';
    for (var i = 0; i < saski_all.steps.length; i++) {
        question += (i+1)+'.'+saski_all.steps[i]+'\n';
    };
    var result = confirm(question);
}
var sampleButtonClick = function(event){
    console.log('Click on '+ event.data.btnNum);
    saski_all.startPositions = saski_all.sample[event.data.btnNum];
    $('#notifText').val('');
    saski_all.currentPlayer = 1;
    saski_all.steps = [];
    saski_all.whiteSelectedPosition=[];
    saski_all.blackSelectedPosition=[];
    saski_all.currentRemovedWhite=[];
    saski_all.currentRemovedBlack=[];
    saski_all.white=[];
    saski_all.black=[];
    saski_all.currentAvailablePosition = [];
    saski_all.currentLostPosition = [];
    saski_all.currentFavorite = [];
    clearBoard();
    clearAlls();
    parseStartPositionWithType(saski_all.white,'white');
    parseStartPositionWithType(saski_all.black,'black');
    markCurrentAvailablePosition(saski_all.white,0);
    renderFigure();
}
var addSamples = function(){
    //{"white":[{"pos":"c3"}],"black":[{"pos":"e5"}]}
    saski_all.sample.push('{"white":[{"pos":"g1"},{"pos":"g3"}],"black":[{"pos":"e7","elType":"normal"}]}');
    saski_all.sample.push('{"white":[{"pos":"c3"},{"pos":"f2"},{"pos":"g3"}],"black":[{"pos":"e5"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"c5"},{"pos":"e3"},{"pos":"g3"}],"black":[{"pos":"d4"},{"pos":"g5"}]}');
    saski_all.sample.push('{"white":[{"pos":"f2"},{"pos":"f4"},{"pos":"g1"}],"black":[{"pos":"d6"},{"pos":"f6"}]}');
    saski_all.sample.push('{"white":[{"pos":"a3"},{"pos":"a5"},{"pos":"e1"},{"pos":"h2"}],"black":[{"pos":"e3"},{"pos":"c5"}]}');
    saski_all.sample.push('{"white":[{"pos":"a5"},{"pos":"c5"}],"black":[{"pos":"c7"},{"pos":"d8"}]}');
    saski_all.sample.push('{"white":[{"pos":"c3"},{"pos":"d4"},{"pos":"f2"}],"black":[{"pos":"a3"},{"pos":"a5"},{"pos":"f6"},{"pos":"g5"}]}');
    saski_all.sample.push('{"white":[{"pos":"e3"},{"pos":"g1"},{"pos":"g3"}],"black":[{"pos":"e5"},{"pos":"e7"},{"pos":"f6"}]}');
    saski_all.sample.push('{"white":[{"pos":"e3"},{"pos":"f2"},{"pos":"f4"},{"pos":"h4"}],"black":[{"pos":"b4"},{"pos":"c5"},{"pos":"f8"},{"pos":"g7"}]}');
    saski_all.sample.push('{"white":[{"pos":"c1"},{"pos":"c3"},{"pos":"g5"}],"black":[{"pos":"a5"},{"pos":"d6"},{"pos":"f8"}]}');
    //11
    saski_all.sample.push('{"white":[{"pos":"d2"},{"pos":"e3"},{"pos":"f2"},{"pos":"g3"}],"black":[{"pos":"a5"},{"pos":"a7"},{"pos":"e7"},{"pos":"f6"}]}');
    saski_all.sample.push('{"white":[{"pos":"d4"},{"pos":"f2"},{"pos":"f4"},{"pos":"g1"}],"black":[{"pos":"d8"},{"pos":"g7"},{"pos":"h4"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"c1"},{"pos":"d2"},{"pos":"e3"},{"pos":"f4"}],"black":[{"pos":"b8"},{"pos":"c7"},{"pos":"d8"},{"pos":"e7"}]}');
    saski_all.sample.push('{"white":[{"pos":"c1"},{"pos":"c3"},{"pos":"d2"},{"pos":"e3"},{"pos":"f4"},{"pos":"g3"},{"pos":"h2"}],"black":[{"pos":"b6"},{"pos":"c5"},{"pos":"c7"},{"pos":"d6"},{"pos":"e5"},{"pos":"f6"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"b4"},{"pos":"d2"},{"pos":"e3"},{"pos":"f2"},{"pos":"g3"},{"pos":"h2"}],"black":[{"pos":"b6"},{"pos":"d6"},{"pos":"d8"},{"pos":"c5"},{"pos":"g5"},{"pos":"g7"}]}');
    saski_all.sample.push('{"white":[{"pos":"a5"},{"pos":"b4"},{"pos":"d2"},{"pos":"d4"},{"pos":"g3"}],"black":[{"pos":"a7"},{"pos":"d6"},{"pos":"f6"},{"pos":"g5"},{"pos":"h6"}]}');
    //17
    saski_all.sample.push('{"white":[{"pos":"a3"},{"pos":"c1"},{"pos":"c3"},{"pos":"d2"},{"pos":"e1"},{"pos":"f2"},{"pos":"h4"}],"black":[{"pos":"a7"},{"pos":"b8"},{"pos":"c5"},{"pos":"c7"},{"pos":"d6"},{"pos":"e5"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"a3"},{"pos":"b2"},{"pos":"c3"},{"pos":"e1"},{"pos":"f2"},{"pos":"f4"},{"pos":"g3"},{"pos":"h2"}],"black":[{"pos":"d6"},{"pos":"e5"},{"pos":"g5"},{"pos":"h4"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"d2"},{"pos":"d4"},{"pos":"e3"},{"pos":"f2"},{"pos":"g5"},{"pos":"h2"},{"pos":"h4"}],"black":[{"pos":"b6"},{"pos":"c5"},{"pos":"d6"},{"pos":"e7"},{"pos":"f6"},{"pos":"f8"}]}');
    //20
    saski_all.sample.push('{"white":[{"pos":"b2"},{"pos":"c1"},{"pos":"c3"},{"pos":"d2"},{"pos":"e3"},{"pos":"h4"}],"black":[{"pos":"b6"},{"pos":"c7"},{"pos":"e5"},{"pos":"f4"},{"pos":"f6"},{"pos":"g5"}]}');
    parseShortNotation('a1a3b2b4c3d2e1h4:a5a7b6e5e7f4f6');
    parseShortNotation('a1a3b2b4c3f4g1g3h4:a5a7b6c7d6e5e7f6g7');
    parseShortNotation('a3a5b2c3e3f2g1g3h2:c5c7d4d6d8e5e7h4');
    parseShortNotation('b2c1d2d4e3f2g1g3g5:a3b6c7d6e7f6f8h4h8');
    parseShortNotation('b2b4c3d2d4e3f2f4g3:a5b8c7d6e7g5g7h6h8');
    //26
    parseShortNotation('b4c3d2d4e1e3e5f2f4h2:a5a7c7d6d8e7g5g7h6');
    saski_all.sample.push('{"white":[{"pos":"c3","elType":"high"},{"pos":"d6","elType":"high"},{"pos":"e3","elType":"high"}],"black":[{"pos":"d8","elType":"high"}]}');
    parseShortNotation('d4e1e3f4:b6b8g5h6');
    parseShortNotation('b4d4f2g3:b6d6g7');
    parseShortNotation('b4e1g1:e5g5h2');
    //31
    parseShortNotation('a3d2d4e3f2f4:a5d6e7f6g5h6');
    parseShortNotation('c1c3d2h4:c5e7f8g7');
    saski_all.sample.push('{"white":[{"pos":"a1","elType":"high"},{"pos":"c1"}],"black":[{"pos":"a3"},{"pos":"a5"},{"pos":"b4"},{"pos":"b6"},{"pos":"c5"},{"pos":"c7"},{"pos":"d6"}]}');
    saski_all.sample.push('{"white":[{"pos":"b6","elType":"high"},{"pos":"h2"}],"black":[{"pos":"f4"},{"pos":"g3"},{"pos":"g5"},{"pos":"h4"},{"pos":"h6"}]}');
    saski_all.sample.push('{"white":[{"pos":"a3","elType":"high"},{"pos":"c3"},{"pos":"g1"}],"black":[{"pos":"b6","elType":"high"},{"pos":"g7"}]}');
    saski_all.sample.push('{"white":[{"pos":"e5","elType":"high"},{"pos":"h6","elType":"high"}],"black":[{"pos":"a3","elType":"high"},{"pos":"b4"}]}');
    var maxSample=37;
    var beginSample=$('#selectSamples');
    for (var i = 1; i < maxSample; i++) {
        // $(liEl).on( "click",{indexPos:ind},squareClick);
        // var sampleButton='<button id=\'sampleButtonClick'+i+ '\'>Sample '+i+'</button>';
        var sampleButton=$('<button>Sample '+i+'</button>');
        $(sampleButton).on( "click",{btnNum:i-1},sampleButtonClick);
        var newButton=$(beginSample).append(sampleButton);
    };
    saski_all.startPositions=saski_all.sample[0];
}
var getRevertTarget = function(target){
    var rTarget = null;
    if (target === saski_all.white) {
        rTarget = saski_all.black;
    }else{
        rTarget = saski_all.white;
    }
    return rTarget;
}
var checkValidPosition = function(figure,pos2,target){
    var ind = figure.pos;
    if (target.length>0) {
        if (!isValidStep(ind,pos2)) return false;
        if (isValidFigurePositionWithTarget(pos2,saski_all.white)) return false;
        if (isValidFigurePositionWithTarget(pos2,saski_all.black)) return false;
        if (isFigureDamka(ind,target)){
            return true;
        }else{
            if (isValidSaskaStep(ind,pos2,target,figure.elType)){
                return true;
            }
        }
    }
    return false;
}
var markCurrentAvailablePosition = function(target,level){
    var _available = saski_all.currentFavorite;
    var recursive = _available.length;
    for (var j=0; j<target.length; j++){
        for (var i = 0; i < 63; i++) {
            if (checkValidPosition(target[j],i,target)) {
                saski_all.currentAvailablePosition.push(i);
            }
        }
    }
    if (recursive != _available.length){
        for (var i = 0; i < _available.length; i++) {
            var wObj={};
            wObj['pos']=_available[i];
            wObj['elType']='emulate';
            target.push(wObj);
            var cStep = $('#pl_'+_available[i]).text();
            if (!isNumeric(cStep)){
                // if (cStep>level) level=cStep;
            
                $('#pl_'+_available[i]).text(level+1);
            }
        };
        markCurrentAvailablePosition(target,level + 1);
    }
    for (var i = target.length - 1; i >= 0; i--) {
        if (target[i].elType == 'emulate') target.pop();
    };
}
addTwoRow();
addTwoRow();
addTwoRow();
clearBoard();

addSamples();

parseStartPositionWithType(saski_all.white,'white');
parseStartPositionWithType(saski_all.black,'black');
console.log(saski_all.white);
console.log(saski_all.black);

markCurrentAvailablePosition(saski_all.white,0);
renderFigure();
// testStepValidPositions();
// testParseNotification();
// testNotificationFromIndex();
console.log('----======----');
