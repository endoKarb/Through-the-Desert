var BOARD = {
	'tileSize': 26,
	'impassableTiles': [
		[0, 0],
		[0, 1],
		[0, 9],
		[0, 10],
		[0, 11],
		[0, 12],
		[1, 0],
		[1, 11],
		[1, 12],
		[2, 11],
		[2, 12],
		[3, 12],
		[4, 12],
		[5, 6],
		[5, 7],
		[6, 6],
		[6, 7],
		[7, 7],
		[8, 7],
		[9, 0],
		[9, 7],
		[10, 0],
		[10, 12],
		[11, 0],
		[11, 12],
		[12, 11],
		[12, 12],
		[13, 11],
		[13, 12],
		[14, 10],
		[14, 11],
		[14, 12],
		[15, 10],
		[15, 11],
		[15, 12],
		[16, 9],
		[16, 10],
		[16, 11],
		[16, 12],
		[17, 0],
		[17, 8],
		[17, 9],
		[17, 10],
		[17, 11],
		[17, 12]
],
	'oasisTiles': [
		[ 16, 2 ],
		[ 12, 6 ],
		[ 9, 2 ],
		[ 7, 10 ],
		[ 3, 2 ],
		[ 1, 7 ]
],
	'waterholeTiles':[
		[ 17, 5 ],
		[ 16, 0 ],
		[ 16, 6 ],
		[ 15, 4 ],
		[ 14, 1 ],
		[ 14, 6 ],
		[ 14, 8 ],
		[ 13, 4 ],
		[ 12, 9 ],
		[ 11, 1 ],
		[ 11, 3 ],
		[ 11, 5 ],
		[ 11, 8 ],
		[ 10, 11 ],
		[ 9, 8 ],
		[ 9, 10 ],
		[ 8, 4 ],
		[ 7, 1 ],
		[ 7, 3 ],
		[ 6, 8 ],
		[ 6, 11 ],
		[ 5, 2 ],
		[ 5, 4 ],
		[ 4, 5 ],
		[ 4, 9 ],
		[ 4, 11 ],
		[ 3, 0 ],
		[ 3, 8 ],
		[ 2, 4 ],
		[ 1, 3 ],
		[ 1, 9 ],
		[ 0, 5 ],
]};

var GAME = {
	'board': new Board(18, 13),
	'turns': [],
	'riders_placed': [[],[]],
	'points': [0,0],
	'currentTurn': function () {
		if (this.turns.length < 11) {
			return this.turns.length;
		} else {
			return Math.floor((this.turns.length - 10) / 2) + 10;
		}
	},
	'activePlayer': function () {
		return this.currentTurn() % 2;
	},
	'riderWasPlayed': function (color) {
		var ply = this.activePlayer();
		for (var i = 0; i < this.riders_placed[ply].length; i++) {
			if (this.riders_placed[ply][i] === color) {
				console.log('was played');
				return true;
			}
		};
	}
};

var STASH = {
	'Mint': 24,
	'Lime': 24,
	'Grape': 24,
	'Lemon': 24,
	'Orange': 24
}

var UI = {
	'selectedTile': null,
	'returnSelected': function () {
		if ('selectedTile' === null) {
			return null;
		} else {
			return this.selectedTile;
		}
	}
};



// #########################################################################
// ##																	  ##
// ##						   	GAME.board GENERATION						  ##
// ##																	  ##
// #########################################################################

Board.prototype.setImpassable = function () {
	for (var i = 0; i < BOARD.impassableTiles.length; i++) {
		GAME.board.getTile(BOARD.impassableTiles[i]).impassable = true;
	};
}

Board.prototype.setOasis = function () {

	var rnd = Math.floor(Math.random()*6);
	var loc = BOARD.oasisTiles.slice(0);
	var splice = loc.splice(rnd, 1);
	for (var i = 0; i < loc.length; i++) {
		GAME.board.getTile(loc[i]).oasis = true;
	};
	return splice;
}

Board.prototype.setWaterholes = function (arr) {
	//Takes the last remaining free Oasis tile as argument, and adds Waterholes
	var holes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, ];
	var loc = BOARD.waterholeTiles.slice(0);
	loc.push(arr);

	while (loc.length > 0) {
		var rnd = Math.floor(Math.random() * holes.length);
		var tile = loc.splice(0, 1)[0];
		GAME.board.getTile(tile).waterhole = holes.splice(rnd, 1)[0];
	}
}


// CREATORS

function Turn (player, color, coor) {
	this.player = player;
	this.move = [coor[0], coor[1]];
	this.color = color;
}

function Camel (owner, color, rider) {
	this.owner = owner;
	this.color = color;
	this.rider = rider;
}

function Tile (arr) {

	this.impassable = false;
	this.oasis = false;
	this.waterhole = false;
	this.camel = false;
	this.selected = false;
	
	var x = arr[0] * BOARD.tileSize * 1.75 + BOARD.tileSize;
	if (arr[0] % 2 > 0) {
		var y = arr[1] * BOARD.tileSize * 2 + BOARD.tileSize * 2;
	} else {
		var y = arr[1] * BOARD.tileSize * 2 + BOARD.tileSize;
	}

	this.center = [x, y];
	this.coor = [arr[0], arr[1]]
}

function Board (width, height) {
	
	this.board = [];
	this.width = width;
	this.height = height;

	for (var i = 0; i < width; i++) {
		var column = [];
		for (var j = 0; j < height; j++) {
			var coor = [i,j];
			column.push(new Tile(coor));
		};
		this.board.push(column);
	};

	this.getTile = function (arr) {
		// Takes an array of coordinates and returns the corresponding Tile object
		if (arr[0] < 0 || arr[0] >= this.width || arr[1] < 0 || arr[1] >= this.height) {
			return null;
		} else {
			return this.board[arr[0]][arr[1]];
		}
	}

	this.getAdjacent = function (arr) {
		// Takes an array of coordinates and returns the adjacent Tile objects
		var x = arr[0];
		var y = arr[1];
		var tiles_to_find = [];
		var adj_tiles = [];

		switch (x % 2) {
			case 0:
				tiles_to_find = [
					[x, y+1],
					[x+1,y],
					[x,y-1],
					[x-1,y-1],
					[x-1,y],
					[x+1,y-1],
				];
				break;
			default:
				tiles_to_find = [
					[x,y-1],
					[x,y+1],
					[x-1,y+1],
					[x-1,y],
					[x+1,y],
					[x+1,y+1],
				];
				break;
		}

		for (var i = 0; i < tiles_to_find.length; i++) {
			if (tiles_to_find[i][0] < 0 || tiles_to_find[i][0] >= this.width || tiles_to_find[i][1] < 0 || tiles_to_find[i][1] >= this.height) {
			} else {
				adj_tiles.push(GAME.board.board[tiles_to_find[i][0]][tiles_to_find[i][1]])
			}
		};
	return adj_tiles;
	}

	this.getCoorList = function () {
		var list = [];
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				list.push([this.board[i][j].center, this.board[i][j].coor]);
			};
		};
		return list;
	}

	this.resetClicked = function () {
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				this.board[i][j].selected = false;
			};
		};
	}

	this.clearBoard = function () {
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				this.board[i][j].camel = false;
			};
		};
		drawBoardState();
	}

	
	this.colorRider = function (color) {
		// Checks if current player has already placed a rider of that color
		var riders = '';
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				var camel = this.board[i][j].camel;
				if (camel.rider === true && camel.owner === (GAME.activePlayer()) && camel.color === color) {
					// debugger;
					riders = riders.concat(this.board[i][j].camel.color);
				}
			};
		};
		
		return riders;
	}
}

// #########################################################################
// ##																	  ##
// ##						DRAWING FUNCTIONS							  ##
// ##																	  ##
// #########################################################################

function drawBoardState () {

	var canvas = document.getElementById('board');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < GAME.board.board.length; i++) {
		for (var j = 0; j < GAME.board.board[i].length; j++) {
			
			var tile = GAME.board.board[i][j]
			var circrad = BOARD.tileSize
			var x = tile.coor[0] * circrad * 1.75 + circrad;
			var y = tile.coor[1] * circrad * 2 + circrad * ((i % 2 > 0) ? 2 : 1);

			 if (tile.camel != false) {
				var color = '#FFF'
				switch	(tile.camel.color) {
					case 'Mint':
						color = '#BEF6E9';
						break;
					case 'Lime':
						color = '#DBFEA5';
						break;
					case 'Grape':
						color = '#E7CBF7';
						break;
					case 'Lemon':
						color = '#FBFDE3';
						break;
					case 'Orange':
						color = '#F5A886';
						break;
					default:
						break;
				}
				draw_hexagon(x, y, circrad, color);
				if (tile.camel.rider === true) {
				var color = '#FFF';
				switch	(tile.camel.owner) {
					case 0:
						color = '#FFF';
						break;
					case 1:
						color = '#000';
						break;
					default:
						break;
				}
				drawRider(x, y, circrad, color);
				}
			} else if (tile.impassable === true) {
				draw_hexagon(x, y, circrad, '#353520');
			} else if (tile.waterhole != false) {
				draw_hexagon(x, y, circrad, '#36D');
				drawNumber(tile);
			} else if (tile.oasis === true) {
				draw_hexagon(x, y, circrad, '#9D2');
			} else {
				draw_hexagon(x, y, circrad, '#AA8');
			}

			if (tile.selected === true) {
				drawEmptyHex(x, y, circrad, '#FA8');
			}
		};
	};
}

function draw_hexagon (x, y, cirumradius, fill) {

	var canvas = document.getElementById('board');
	var ctx = canvas.getContext('2d');
	var path = new Path2D();

	var center_x = x;
	var center_y = y;

	path.moveTo((Math.cos(Math.PI * 1 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 1 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 2 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 2 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 3 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 3 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 4 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 4 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 5 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 5 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 6 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 6 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 7 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 7 / 3) * cirumradius) + center_y));

	ctx.stroke(path);
	ctx.fillStyle = fill;
	ctx.fill(path);
}

function drawEmptyHex (x, y, cirumradius, fill) {

	var canvas = document.getElementById('board');

	var ctx = canvas.getContext('2d');
	var path = new Path2D();

	var center_x = x;
	var center_y = y;

	path.moveTo((Math.cos(Math.PI * 1 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 1 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 2 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 2 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 3 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 3 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 4 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 4 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 5 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 5 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 6 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 6 / 3) * cirumradius) + center_y));
	path.closePath();

	cirumradius = cirumradius * 1.275

	path.moveTo((Math.cos(Math.PI * 7 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 7 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 6 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 6 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 5 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 5 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 4 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 4 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 3 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 3 / 3) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 2 / 3) * cirumradius) + center_x, ((Math.sin(Math.PI * 2 / 3) * cirumradius) + center_y));
	path.closePath();

	ctx.stroke(path);
	ctx.fillStyle = fill;
	ctx.fill(path);
}

function drawCamel (x, y, cirumradius, fill) {

	var canvas = document.getElementById('board');
	var ctx = canvas.getContext('2d');
	var path = new Path2D();

	var center_x = x;
	var center_y = y;

	cirumradius = cirumradius * 0.75

	path.moveTo((Math.cos(Math.PI * 1 / 4) * cirumradius) + center_x, ((Math.sin(Math.PI * 1 / 4) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 3 / 4) * cirumradius) + center_x, ((Math.sin(Math.PI * 3 / 4) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 5 / 4) * cirumradius) + center_x, ((Math.sin(Math.PI * 5 / 4) * cirumradius) + center_y));
	path.lineTo((Math.cos(Math.PI * 7 / 4) * cirumradius) + center_x, ((Math.sin(Math.PI * 7 / 4) * cirumradius) + center_y));

	ctx.stroke(path);
	ctx.fillStyle = fill;
	ctx.fill(path);

}

function drawRider (x, y, cirumradius, fill) {

	var canvas = document.getElementById('board');
	var ctx = canvas.getContext('2d');
	var path = new Path2D();

	var center_x = x;
	var center_y = y;
	console.log (x, y);

	// debugger;
	ctx.beginPath();
	ctx.arc(x, y, cirumradius * 0.25, 0, Math.PI * 2, true);

	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.fillStyle = fill;
	ctx.fill();

}

function drawNumber (tile) {
	var x = tile.coor[0]
	var y = tile.coor[1]

	var circumradius = BOARD.tileSize * 0.6;

	var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

	var center_x = x * 1.75 * BOARD.tileSize + BOARD.tileSize;
	var center_y = y * 2 * BOARD.tileSize + BOARD.tileSize * ((x % 2 > 0) ? 2 : 1);

	var origin_x = (Math.cos(Math.PI * 6 / 8) * circumradius) + center_x;
	var origin_y = (Math.sin(Math.PI * 3 / 8) * circumradius) + center_y;

	var end_x = Math.abs(origin_x - ((Math.cos(Math.PI * 1 / 3) * circumradius) + center_x));

	ctx.fillStyle = '#FFF';

	ctx.font = end_x * 2 + 'px Helvetica, sans-serif';
	ctx.fillText('' + tile.waterhole,  origin_x, origin_y);

}



// #################################################################
// #################################################################
// ##					Click-related FUNCTIONS					####
// #################################################################
// #################################################################


function isTile (arr, arr1) {
	//Tells if the first point belongs to the tile centered in the second point
	if (PITAGORA(arr, arr1) <= BOARD.tileSize) {
		return true;
	} else {
		return false;
	}
}

function closestTile (arr) {
	//Finds the closest tile on the board given an array containing two coordinates. Returns their board coordinates
	var distances = [];
	var coor_list = GAME.board.getCoorList();
	for (var i = 0; i < coor_list.length; i++) {
		distances.push(PITAGORA(arr, coor_list[i][0]));
	};
	var closest = coor_list[findSmallest(distances)];
	var is_tile = isTile(arr, [closest[0][0], closest[0][1]]);
	// console.log([closest[2], closest[3], is_tile]);
	return ([closest[1][0], closest[1][1], is_tile]);
}

function findSmallest (arr) {
	// Finds the smalles element in an array and returns his index
	var list = arr;
	var gindex = 0;
	var callback = function (acc, current, index) {
		if (acc <= current) {
			return acc;
		} else {
			gindex = index
			return current;
		}
	}
	console.log('dist:', list.reduce(callback), '#:', gindex);
	return gindex;
}

function PITAGORA (arr, arr2) {
	// Calculates distances between two points, taking two array with their coordinates as argument
	var point1 = [arr[0], arr[1]];
	var point2 = [arr2[0], arr2[1]];
	var x1x2 = Math.abs(point1[0] - point2[0]);
	var y1y2 = Math.abs(point1[1] - point2[1]);
	// console.log (Math.sqrt(Math.pow(x1x2, 2) + Math.pow(y1y2, 2)));
	return Math.sqrt(Math.pow(x1x2, 2) + Math.pow(y1y2, 2));
}

// #########################################################################
// ##																	  ##
// ##						   	EVENT HANDLERS							  ##
// ##																	  ##
// #########################################################################


function updateUI () {

	var colors = {
		'Mint': '#BEF6E9',
		'Lime': '#DBFEA5',
		'Grape': '#E7CBF7',
		'Lemon': '#FBFDE3',
		'Orange': '#F5A886'
	};
	var player1 = document.querySelector('div .white.player');
	var player2 = document.querySelector('div .black.player');
	var white_points = document.querySelector('div .white.points');
	var black_points = document.querySelector('div .black.points');
	var buttons = document.querySelector('div#color');

	if (GAME.activePlayer() === 0) {
		player1.style.borderColor = 'red';
		player2.style.borderColor = 'white';
	} else {
		player1.style.borderColor = 'white';
		player2.style.borderColor = 'red';
	}
	
	if (GAME.currentTurn() < 10) {
		for (var i = 0; i < buttons.children.length; i++) {
			if (GAME.riderWasPlayed(buttons.children[i].value) === true) {
				buttons.children[i].style.backgroundColor = 'black';
			} else {
				buttons.children[i].style.backgroundColor = colors[buttons.children[i].value];
			}
		}
	} else {
		for (var i = 0; i < buttons.children.length; i++) {
			buttons.children[i].style.backgroundColor = colors[buttons.children[i].value];
		}
	}

	white_points.textContent = GAME.points[0];
	black_points.textContent = GAME.points[1];

}

function testClick (ev) {

	console.log('clickCoor', ev.layerX, ev.layerY);

	var coordinates = [ev.layerX, ev.layerY];
	var tile = closestTile(coordinates);
	if (tile[2] === true) {

		GAME.board.resetClicked();

		GAME.board.board[tile[0]][tile[1]].selected = true;
		UI.selectedTile = GAME.board.board[tile[0]][tile[1]];

		console.log('Tile', GAME.board.board[tile[0]][tile[1]].coor[0], GAME.board.board[tile[0]][tile[1]].coor[1], 'selected.');

		drawBoardState();

	} else {

		GAME.board.resetClicked();
		UI.selectedTile = null;
		console.log("Not a tile");
		drawBoardState();
	}
}




function play (color) {
	if (GAME.currentTurn() >= 10) {
		placeCamel(color);
	} else {
		placeRider(color);
	}
	updateUI();
}

function placeCamel (color) {

		var tile = UI.selectedTile;
		var act_pl = GAME.activePlayer();

		var legal = camelLegality(color);

		if (legal != false) {

			if (UI.selectedTile.waterhole > 0) {
				GAME.points[act_pl] = GAME.points[act_pl] + UI.selectedTile.waterhole;
				console.log ('POINTS: ' + GAME.points[act_pl])
			};

			var coor = [UI.selectedTile.coor[0], UI.selectedTile.coor[1]]
			tile.camel = new Camel(act_pl, color, false);
			console.log(tile.camel);
			STASH[color]--
			GAME.turns.push(new Turn(act_pl, color, coor));

			drawBoardState();

			console.log('Camel placed!', UI.selectedTile);
			console.log(color + ' left ' + STASH[color]);
			
		} else {
			
			console.log('Illegal move')
		}
		
	
}

function placeRider (color) {
		
		var tile = UI.selectedTile;
		var act_pl = GAME.activePlayer();

		var legal = riderLegality(color);

		if (legal != false) {

			var coor = [UI.selectedTile.coor[0], UI.selectedTile.coor[1]]
			tile.camel = new Camel(act_pl, color, true);
			STASH[color]--
			GAME.turns.push(new Turn(act_pl, color, coor));
			GAME.riders_placed[act_pl].push(color);

			drawBoardState();

			console.log('Rider placed!', UI.selectedTile)
			console.log(color + ' left ' + STASH[color])

			if (STASH[color] === 0) {
				window.alert('GAME OVER!');
			};
			
		} else {
			
			console.log('Illegal move')
		}
	
}

function camelLegality (color) {
	var adj_til = GAME.board.getAdjacent(UI.selectedTile.coor);

	if (GAME.turn < 10) {
		console.log('No camels before turn 10');
		return false;
	} else if (UI.selectedTile.camel !=	 false) {
		console.log('Tile already occupied');
		return false
	} else if (UI.selectedTile.impassable === true || UI.selectedTile.oasis === true) {
		console.log('Can\'t play there');
		return false
	} else if (allyColorExists(color, adj_til) === false) {
		console.log('Must play adjacent to same color');
		return false
	} else if (enemyColorExists(color, adj_til) === true) {
		console.log('Can\'t play next to enemy of same color');
		return false
	}
}

function riderLegality (color) {
	
	var adj_til = GAME.board.getAdjacent(UI.selectedTile.coor);

	if (GAME.turn > 10) {
		console.log('No riders after turn 10');
		return false;
	} else if (UI.selectedTile.camel !=	 false) {
		console.log('Tile already occupied');
		return false
	} else if (UI.selectedTile.impassable === true || UI.selectedTile.oasis === true || UI.selectedTile.waterhole > 0) {
		console.log('Can\'t play there');
		return false
	} else if (GAME.board.colorRider(color) === color) {
		console.log('One rider per color');
		return false
	} else if (riderExists(adj_til) === true) {
		console.log('Can\'t play adjacent other riders');
		return false
	} else if (oasisExists(adj_til) === true) {
		console.log('Can\'t play near oasis');
		return false
	} else if (GAME.currentTurn() === 1 && GAME.turns[0].color === color) {
		console.log('Can\'t play same color as opponent first turn');
		return false
	}
}

function allyColorExists (color, tile_arr) {
	//Tells you if a camel of "color" exists in the tiles specified in the "tile_arr"
	for (var i = 0; i < tile_arr.length; i++) {
		if (tile_arr[i].camel.color === color && tile_arr[i].camel.owner === GAME.activePlayer()) {
			return true;
		}
	};
	return false;
}

function enemyColorExists (color, tile_arr) {
	//Tells you if a camel of "color" exists in the tiles specified in the "tile_arr"
	for (var i = 0; i < tile_arr.length; i++) {
		if (tile_arr[i].camel.color === color && tile_arr[i].camel.owner != GAME.activePlayer()) {
			return true;
		}
	};
	return false;
}

function riderExists (tile_arr) {
	//Tells you if a rider exists in the tiles specified in the "tile_arr"
	for (var i = 0; i < tile_arr.length; i++) {
		if (tile_arr[i].camel.rider === true) {
			return true;
		}
	};
	return false;
}

function oasisExists (tile_arr) {
	//Tells you if an oasis in the tiles specified in the "tile_arr"
	for (var i = 0; i < tile_arr.length; i++) {
		if (tile_arr[i].oasis === true) {
			return true;
		}
	};
	return false;
}

document.body.onload = prepareBoard;

function prepareBoard () {
	
	addListeners();
	GAME.board.setImpassable();
	var splice = GAME.board.setOasis()[0];
	GAME.board.setWaterholes(splice);
	drawBoardState();
	updateUI();
}

function buttonHandler (ev) {
	if (ev.target.type == 'submit' && UI.returnSelected() != null) {
		play(ev.target.value);
	}
}

function addListeners () {
	document.querySelector('canvas').addEventListener('click', testClick);
	document.querySelector('div#color').addEventListener('click', buttonHandler);
}
