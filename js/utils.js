var getIndexFromNotation = function(notations){
    if (notations.length>3) return -1;
    notation = notations.toLowerCase();
    var symbol=0;
    if (notation.charAt(0) === 'a') symbol = 0;
    if (notation.charAt(0) === 'b') symbol = 1;
    if (notation.charAt(0) === 'c') symbol = 2;
    if (notation.charAt(0) === 'd') symbol = 3;
    if (notation.charAt(0) === 'e') symbol = 4;
    if (notation.charAt(0) === 'f') symbol = 5;
    if (notation.charAt(0) === 'g') symbol = 6;
    if (notation.charAt(0) === 'h') symbol = 7;

    var horizontal=notation.charAt(1);
    if (!isNumeric(horizontal)){
        console.log('Error second symbol:'+horizontal+' must be number!');
        return -1;
    }
    return (horizontal - 1) * 8 + symbol;
}
var getNotificationSequenceForArray = function(arr){
    res = '';
    for (var i = 0; i < arr.length; i++) {
        var cPos=arr[i];
        res += getSymbolForCurrentGameStep(cPos);
        res += getNotificationFromIndex(cPos);
    };
    if (res.length>1) {
        res = res.substring(1,res.length);
    }
    return res;
}
var getXYfromVisualIndex = function(visualIndex){
    var index = visualIndex ;
    var bSize = saski_all.boardSize;
    var pX=(index % bSize) ;
    var pY=Math.ceil(index / bSize + 0.01) - 1;
    var result = {};
    result.posX=pX;
    result.posY=pY;
    return result;
}
var getNotificationFromIndex = function(visualIndex){
    var pos=getXYfromVisualIndex(visualIndex);
    var symbol= String.fromCharCode(pos.posX+65);
    return  symbol.toUpperCase()+(pos.posY+1);
}
var getIndexFromVisualIndex = function(visualIndex){
    var pos=getXYfromVisualIndex(visualIndex);
    var arrayIndex=(pos.posY) * 8 + pos.posX;
    return arrayIndex;
}