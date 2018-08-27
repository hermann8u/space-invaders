var baseUrl = 'http://api.florianhermann.fr';

function saveScore() {
  var data = JSON.stringify({
    playerName: $('#player-name').val(),
    score: score
  });

  $.ajax({
    headers: {"Content-Type": "application/json"},
    url: baseUrl + '/game/scores',
    data: data,
    dataType: 'json',
    method: 'POST',
    success: function(json) {
      if (typeof json.id !== 'undefined') {
        $('#enter-name').hide();
        $('#score-saved').show();
        $('#score-saved p').animate({'font-size' : '40px'}, 600);
        setTimeout(function(){ $('#score-saved').hide(); }, 600);
        setTimeout(function(){ $('#name-entered').show(); }, 1200);
        updateScoreTable();
      }
    }
  });
}
  
  function updateScoreTable() {
    $.ajax({
      url: baseUrl + '/game/scores',
      dataType: 'json',
      method: 'get',
      success: function(json) {
        $('#score-table tbody').html('');
        
        var iMax;
        if (json.length < 10){
          iMax = json.length + 1;
        }
        else {
          iMax = 11;
        }
  
        for (var i = 1; i < iMax; i++) {
          $('#score-table tbody').append('<tr><td>'+ i +'</td><td>'+ json[i - 1].playerName +'</td><td>' + json[i - 1].score + '</td><td>'+ formatDate(new Date(json[i - 1].createdAt)) +'</td></tr>')
        }
      }
    });
  }

  function formatDate(date) {
    var formatedDate;
    var month = parseInt(date.getMonth()) + 1;
  
    if (date.getDate() < 10) {
      formatedDate = "0" + date.getDate();
    }
    else {
      formatedDate = date.getDate();
    }
  
    if (month < 9) {
      formatedDate += " / 0" + month;
    }
    else {
      formatedDate += " / " + month;
    }
  
    formatedDate += " / " + date.getFullYear();
    
    return formatedDate;
  }