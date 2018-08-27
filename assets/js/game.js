var monsters = [
	'x0y11', 'x1y11', 'x2y11', 'x8y11', 'x9y11', 'x10y11',
	'x1y10', 'x2y10', 'x3y10', 'x5y10', 'x7y10', 'x8y10', 'x9y10',
	'x2y9', 'x3y9', 'x4y9', 'x5y9', 'x6y9', 'x7y9', 'x8y9',
	'x1y8', 'x2y8', 'x3y8', 'x4y8', 'x6y8', 'x7y8', 'x8y8', 'x9y8',
	'x4y7', 'x5y7', 'x6y7',
	'x5y6'
];

var shipPos = {
	'0px' : '0',
	'50px' : '1',
	'100px' : '2',
	'150px' : '3',
	'200px' : '4',
	'250px' : '5',
	'300px' : '6',
	'350px' : '7',
	'400px' : '8',
	'450px' : '9',
	'500px' : '10'
};

var currentMonsters = [];
var score = 0;
var firstLaunch = true;

var difficulties = {
	easy : {
		name : "EASY",
		const : 0,
		time : 2000
	},
	medium : {
		name : "MEDIUM",
		const : 1,
		time : 1500
	},
	hard : {
		name : "HARD",
		const : 2,
		time : 1000
	}
}

var difficulty = difficulties.medium;

$(document).ready(function() {

	updateScoreTable();

	$('.new-game-button').on('click', function() {
		$('#new-game-screen').hide();
		$("#perdu-screen").hide();
		launchGame();
	});

	$('.option-button').on('click', function() {
		$('#option-screen').show();
		$('#new-game-screen').hide();
		$("#perdu-screen").hide();
	});

	$('.back-menu-button').on('click', function() {
		$('#option-screen').hide();
		$('#new-game-screen').show();
		$("#perdu-screen").hide();
	});

	$(".arrow").on("click", function() {
		changeDifficulty($(this).attr('id'));
	});

	$('#player-name-button').on('click', function() {
		saveScore();
	});

	$('html').keydown(function(e) {

		var key = e.which;

		if (key == 37) {
			e.preventDefault();
			moveLeft();
		}
		else if (key == 39) {
			e.preventDefault();
			moveRight();
		}
		else if (key == 32) {
			e.preventDefault();
			shot();
		}
       
    });
    
});

function launchGame() {

	if (firstLaunch) {
		firstLaunch = false;
		initGrid();
	}
	else {
		clearGrid();
	}
	generateGrid();
	score = 0;
	$('#score').html(score);
	$('.score-container').show();

    var gameInterval = setInterval(function(){
    	desc();
    	if(checkLose()) {
    		clearInterval(gameInterval);
    		lostGame();
    	}
    		    	
    }, difficulty.time);
}

function moveLeft() {
	if ($('#ship').css('left') != '0px') {
		$('#ship').css({'left' : "-=50"});
	}
	
}

function moveRight() {
	if ($('#ship').css('left') != '500px') {
		$('#ship').css({'left' : "+=50"});
	}
}

function shot() {

	var x = shipPos[$('#ship').css('left')];
	var y = 0;
	var shotInterval = setInterval(function() {
	    if($('#x' + x + 'y' + y).hasClass('monster') || y > 11) {
	    	clearInterval(shotInterval);
	    	$('#x' + x + 'y' + y).removeClass('shot');
	    	$('#x' + x + 'y' + y).removeClass('monster');
	    	if (y <= 11) {
	    		updateScore();
	    	}
	    	
	    }
	    else {
	    	$('#x' + x + 'y' + y).removeClass('shot');
	    	y++;
	    	$('#x' + x + 'y' + y).addClass('shot');
	    	
	    }
	}, 50);
}

function updateScore() {
	score += 50;
	/*if (score >= 500) {
		descTime = 1000;
	}*/
	$('#score').html(score);
}

function initGrid() {

	var bottom = 0;
	var left = 0;
	var id = "";
	var pos = "";

	$('#game-screen').prepend('<div id="ship"></div>');

	for( var y = 0; y < 12; y++) {
		for( var x = 0; x < 11; x++) {
			id = "x"+x+"y"+y;
			bottom = y*50;
			left = x*50;

			pos = '<div class="grid" id="'+ id +'" style="left: '+ left + 'px; bottom: '+ bottom +'px;"></div>';
			$("#game-screen").prepend(pos);
		}
	}
}

function generateGrid() {

	var id = "";

	$('.grid').each(function() {
		id = $(this).attr('id');

		if ($.inArray(id, monsters) > -1) {
			$(this).addClass("monster");
		}

		if (id.includes('y0')) {
			$(this).addClass('ship-line');
		}
	});

}

function clearGrid() {
	$('.grid').each(function() {
		$(this).removeClass('monster');
	});
	$('#ship').css({'left' : '250px'});
}

function desc() {
	currentMonsters = [];
	var numY = -1;
	var id = "";
	var nb = -1;
	//var nbNewLine = Math.trunc(score / 10000) + 1;

	$(".grid").each(function() {
		if ($(this).hasClass('monster')) {
			id = $(this).attr('id');
			numY = parseInt(id.substring(id.indexOf('y') + 1)) - 1;
			id = id.substring(0, id.indexOf('y') + 1) + numY.toString();
			currentMonsters.push(id);
			$(this).removeClass('monster');
		}
	});

		nb = Math.floor((Math.random() * 5) + 6);
			for (var i =0; i < nb; i++) {
				id = "x"+ Math.floor((Math.random() * 11)) +"y11";
				currentMonsters.push(id);
			}
		
	

	$(".grid").each(function() {

		if ($.inArray($(this).attr('id'), currentMonsters ) > -1) {
			$(this).addClass('monster');
		}
	});
}

function checkLose() {
	for( var i = 0; i < 10; i++) {
		if ($('#x'+i+'y0').hasClass('monster')) {
			return  true;
		}
	}
	return false;
}

function lostGame() {
	if (difficulty.name == difficulties.hard.name) {
		$('#name-entered').hide();
		$('#enter-name').show();
	}
	else {
		$('#name-entered').show();
		$('#enter-name').hide();
	}
	$('#score-saved').hide();
	$('#score-at-end').html(score);
	$("#perdu-screen").show();
	$('.score-container').hide();
}

function changeDifficulty(value) {
	if (value == 'left-arrow') {
		if (difficulty.const != difficulties.easy.const) {
			for(var key in difficulties)
			{
			    if (difficulties[key]['const']==difficulty.const -1) {
			    	difficulty = difficulties[key];
			    	break;
			    }
			}
		}
		else {
			difficulty = difficulties.hard;
		}
	}
	else if (value == 'right-arrow') {
		if (difficulty.const != difficulties.hard.const) {
			for(var key in difficulties)
			{
			    if (difficulties[key]['const']==difficulty.const +1) {
			    	difficulty = difficulties[key];
			    	break;
			    }
			}
		}
		else {
			difficulty = difficulties.easy;
		}
	}

	$('#difficulty-label').html(difficulty.name);
}