var clearAlls = function(){
    clearAllBorder();
}
var clearBoard = function(){
    var ind=0;
    var indY=56 + 16;
    $('tr td').each(function(index, liEl){
        if (index % 9 === 0) {
            indY = indY - 16;
        } else{
            $(liEl).text('');
            $(liEl).removeClass('white_figure');
            $(liEl).removeClass('black_figure');
            $(liEl).removeClass('white_figure_high');
            $(liEl).removeClass('black_figure_high');
            var visualIndex = indY + ind;
            $(liEl).attr('id','pl_' + visualIndex);
            // $(liEl).text(visualIndex);
            $(liEl).on( "click",{indexPos:visualIndex},squareClick);
            ind++;
        };
    });
    ind = 0;
    $('tr').each(function(index, liEl){
        var child=$(liEl).children()[0];
        $(child).text(9-ind);
        ind++;
    });
}
var showCurrentAvailablePosition = function(){
    for (var i = 0; i < saski_all.currentAvailablePosition.length; i++) {
        var cPos=saski_all.currentAvailablePosition[i];
        $('#pl_'+cPos).addClass('markGreen');
    };
}
var showCurrentLostPosition = function(){
    for (var i = 0; i < saski_all.currentLostPosition.length; i++) {
        var cPos=saski_all.currentLostPosition[i];
        $('#pl_'+cPos).addClass('markRed');
    };
}

var showCurrentStepInInput = function(){
    var res= getNotificationSequenceForArray(saski_all.whiteSelectedPosition);
    res +=' ';
    res +=getNotificationSequenceForArray(saski_all.blackSelectedPosition);
    $('#notifText').val(res);
}
var clearAllBorder = function(){
    $('tr td').each(function(index, liEl){
        $(liEl).removeClass('selWhiteFigure');
        $(liEl).removeClass('selBlackFigure');
        $(liEl).removeClass('markWhite');
        $(liEl).removeClass('markBlack');
        $(liEl).removeClass('markGreen');
        $(liEl).removeClass('markRed');
    });
    showCurrentPlayer();
}
var showCurrentPlayer = function(){
    var _player = '-';
    if (saski_all.currentPlayer === 1){
        _player = 'White';
    }else{
        _player = 'Black';
    };
    $('#currentPlayerButton').text(_player);
}
var reRenderSelected = function(){
    showCurrentAvailablePosition();
    showCurrentLostPosition();
    for (var i = 0; i < saski_all.whiteSelectedPosition.length; i++) {
        var cPos=saski_all.whiteSelectedPosition[i];
        if (i === 0){
            selectWhitePosition(cPos);
        }else{
            markWhitePosition(cPos);
        };
    };
    for (var i = 0; i < saski_all.blackSelectedPosition.length; i++) {
        var cPos=saski_all.blackSelectedPosition[i];
        if (i === 0){
            selectBlackPosition(cPos);
        }else{
            markBlackPosition(cPos);
        };
    };
}
var selectWhitePosition = function(pos){
    $('#pl_'+pos).addClass('selWhiteFigure');
}
var markWhitePosition = function(pos){
    $('#pl_'+pos).addClass('markWhite');
}
var selectBlackPosition = function(pos){
    $('#pl_'+pos).addClass('selBlackFigure');
}
var markBlackPosition = function(pos){
    $('#pl_'+pos).addClass('markBlack');
}
var reRender = function(elements,elType){
    for (var i = 0; i < elements.length; i++) {
        var el=elements[i].pos;
        var elNum=el;//getIndexFromNotation(el);
        console.log(elNum);
        var ind='#pl_'+elNum;
        $(ind).text(elType);
        if (elType === 'w') {
            if (elements[i].elType == 'high'){
                $(ind).addClass('white_figure_high');
            }else{
                $(ind).addClass('white_figure');
            }
        }
        if (elType === 'b') {
            if (elements[i].elType == 'high'){
                $(ind).addClass('black_figure_high');
            }else{
                $(ind).addClass('black_figure');
            }
        }
    };
}
var addTwoRow = function(){
    var line1=$('#first_line').html();
    var row = '<tr>'+line1+'</tr>';
    $('#board').append(row);
    var line2=$('#second_line').html();
    var row2 = '<tr>'+line2+'</tr>';
    $('#board').append(row2);
}
var renderFigure = function(){
    clearAlls();
    reRender(saski_all.white,'w');
    reRender(saski_all.black,'b');
    reRenderSelected();
}
