// MAP width = 0..17 (18)
// MAP height = 0..12 (13)

var IMPASSABLE_TILES = [
	[0, 0],
	[0, 1],
	[0, 9],
	[0, 10 ],
	[0, 11 ],
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
];

var OASIS_TILES = [
	[ 16, 2 ],
	[ 12, 6 ],
	[ 9, 2 ],
	[ 7, 10 ],
	[ 3, 2 ],
	[ 1, 7 ]
];

var WATERHOLES_TILES = [
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
];


var FLAGS = {
	'impassable': false,
	'oasis': false,
	'waterhole': false
};

var TILESIZE = 26;
var BOARD = new Board(18, 13);

var UI = {
	'selectedTile': null
}



// #########################################################################
// ##																	  ##
// ##						   	BOARD GENERATION						  ##
// ##																	  ##
// #########################################################################


function setImpassable () {
	switch (FLAGS.impassable) {

		case false:

			for (var i = 0; i < IMPASSABLE_TILES.length; i++) {
				BOARD.getTile(IMPASSABLE_TILES[i]).impassable = true;
				// console.log(BOARD.getTile(IMPASSABLE_TILES[i]));
			};

			FLAGS.impassable = true;
			break;

		case true:
			break;
	}
}

function setOasis () {

	switch (FLAGS.oasis) {

		case false:
			//Make a copy of the list of Oasis tiles with slice 0, then splice away one random element,
			//then set the corresponding Tile objects Oasis flag to true, then set the general oasis flag to true

			var rnd = Math.floor(Math.random()*6);
			var loc = OASIS_TILES.slice(0);
			var splice = loc.splice(rnd, 1);

			for (var i = 0; i < loc.length; i++) {
				BOARD.getTile(loc[i]).oasis = true;
				// console.log(BOARD.getTile(loc[i]));

			};
			// console.log(splice);
			FLAGS.oasis = true;
			return splice;
			break;

		case true:
			throw 'Oasis already generated';
			break;
	}
}

function setWaterholes (arr) {

	//Takes the last remaining free Oasis tile as argument, and adds Waterholes

	switch (FLAGS.waterhole) {

		case false:

			var holes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, ];
			var loc = WATERHOLES_TILES.slice(0);
			loc.push(arr);
			// debugger;

			while (loc.length > 0) {
				var rnd = Math.floor(Math.random() * holes.length);
				var tile = loc.splice(0, 1)[0];
				BOARD.getTile(tile).waterhole = holes.splice(rnd, 1)[0];
				// console.log(holes);
			}
			FLAGS.waterhole = true;
			break;

		case true:
			break;
	}
}

function prepareBoard () {
	// BOARD.printBoard();
	setImpassable();
	var splice = setOasis()[0];
	setWaterholes(splice);
	drawBoardState();

	document.querySelector('button').addEventListener('click', playPiece);
	document.querySelector('button + button').addEventListener('click', removePiece);

	// draw_impassable('#333');
	// draw_oasis('#4F4');
	// draw_waterholes();
}



function Tile (arr) {

	this.impassable = false;
	this.oasis = false;
	this.waterhole = false;
	this.piece = {
		'exists': false,
		'color': false,
	}
	
	var x = arr[0] * TILESIZE * 1.75 + TILESIZE;
	if (arr[0] % 2 > 0) {
		var y = arr[1] * TILESIZE * 2 + TILESIZE * 2;
	} else {
		var y = arr[1] * TILESIZE * 2 + TILESIZE;
	}

	this.center = [x, y, arr[0], arr[1]];

	this.selected = false;
}

function Board (width, height) {
	// Transform an array of rows in a Board object made of list of Tile objects

	this.board = [];
	this.width = width;
	this.height = height;
	this.tilesize = TILESIZE;

	for (var i = 0; i < width; i++) {
		var column = [];
		for (var j = 0; j < height; j++) {
			var coor = [i,j];
			column.push(new Tile(coor));
		};
		this.board.push(column);
		// console.log(this.board);
	};

	this.getTile = function (arr) {
		// console.log(arr, arr[0], arr[1]);
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
				console.log('duh');
				break;
		}
		
		for (var i = 0; i < tiles_to_find.length; i++) {
			if (tiles_to_find[i][0] < 0 || tiles_to_find[i][0] >= this.width || tiles_to_find[i][1] < 0 || tiles_to_find[i][1] >= this.height) {
			} else {
				adj_tiles.push(BOARD.board[tiles_to_find[i][0]][tiles_to_find[i][1]])
			}
		console.log(adj_tiles);
		};
	}

	this.getImpassable = function () {
		var tiles = [];
		var callback = function (tile, index) {
			if (tile.impassable === true) {
				tiles.push([i, index]);
			}
		}
		for (var i = 0; i < this.board.length; i++) {
			this.board[i].map(callback);
		};
		return tiles;
	}

	this.getWaterholes = function () {
		var tiles = [];
		var callback = function (tile, index) {
			if (typeof tile.waterhole === 'number') {
				tiles.push([i, index, tile.waterhole]);
			}
		}
		for (var i = 0; i < this.board.length; i++) {
			this.board[i].map(callback);
		};
		return tiles;
	}

	this.getOasis = function () {
		var tiles = [];
		var callback = function (tile, index) {
			if (tile.oasis === true) {
				tiles.push([i, index]);
			}
		}
		for (var i = 0; i < this.board.length; i++) {
			this.board[i].map(callback);
		};
		return tiles;
	}

	this.getCoorList = function () {
		var list = [];
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				list.push(this.board[i][j].center);
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

	for (var i = 0; i < BOARD.board.length; i++) {
		for (var j = 0; j < BOARD.board[i].length; j++) {

			var tile = BOARD.board[i][j]
			var circrad = BOARD.tilesize
			var x = tile.center[2] * circrad * 1.75 + circrad;
			var y = tile.center[3] * circrad * 2 + circrad * ((i % 2 > 0) ? 2 : 1);

			if (tile.impassable === true) {
				draw_hexagon(x, y, circrad, '#353520');
			} else if (tile.oasis === true) {
				draw_hexagon(x, y, circrad, '#9D2');
			} else if (tile.waterhole != false) {
				draw_hexagon(x, y, circrad, '#36D');
				drawNumber(tile);
			} else {
				draw_hexagon(x, y, circrad, '#AA8');
			}

			if (tile.selected === true) {
				drawEmptyHex(x, y, circrad, '#FA8');
			}

			if (tile.piece.exists === true) {
				var color = '#FFF'
				switch	(tile.piece.color) {
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
				drawPiece(x, y, circrad, color);
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

function drawPiece (x, y, cirumradius, fill) {

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

function drawNumber (tile) {
	var x = tile.center[2]
	var y = tile.center[3]


	var circumradius = BOARD.tilesize * 0.6;

	var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

	var center_x = x * 1.75 * BOARD.tilesize + BOARD.tilesize;
	var center_y = y * 2 * BOARD.tilesize + BOARD.tilesize * ((x % 2 > 0) ? 2 : 1);

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
	if (PITAGORA(arr, arr1) <= BOARD.tilesize) {
		return true;
	} else {
		return false;
	}
}

function closestTile (arr) {
	//Finds the closest tile on the board given an array containing two coordinates. Returns their board coordinates
	var distances = [];
	var coor_list = BOARD.getCoorList();
	for (var i = 0; i < coor_list.length; i++) {
		distances.push(PITAGORA(arr, coor_list[i]));
	};
	var closest = coor_list[findSmallest(distances)];
	var is_tile = isTile(arr, [closest[0], closest[1]]);
	// console.log([closest[2], closest[3], is_tile]);
	return ([closest[2], closest[3], is_tile]);
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


function testClick (ev) {

	console.log('clickCoor', ev.layerX, ev.layerY);

	var coor = [ev.layerX, ev.layerY];
	var tile = closestTile(coor);

	if (tile[2] === true) {

		BOARD.resetClicked();

		BOARD.board[tile[0]][tile[1]].selected = true;
		UI.selectedTile = BOARD.board[tile[0]][tile[1]];

		console.log('Tile', BOARD.board[tile[0]][tile[1]].center[2], BOARD.board[tile[0]][tile[1]].center[3], 'selected.');

		drawBoardState();

	} else {
		console.log("Not a tile");
	}
}

function playPiece (ev) {
	
	var buttons = document.querySelector('div#pieceColor').children;
	var color = '';

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].checked === true) {
			color = buttons[i].value;
		};
	};

	if (typeof UI.selectedTile != 'undefined' && UI.selectedTile.piece.exists === false) {

		UI.selectedTile.piece.exists = true;
		UI.selectedTile.piece.color = color;
		drawBoardState();
		console.log('Piece Played!');

	}
}

function removePiece (ev) {

	if (typeof UI.selectedTile != 'undefined' && UI.selectedTile.piece.exists === true) {

		UI.selectedTile.piece.exists = false;
		UI.selectedTile.piece.color = false;
		drawBoardState();
		console.log('Piece Removed');

	}
}

document.body.onload = prepareBoard;
document.querySelector('canvas').addEventListener('click', testClick);