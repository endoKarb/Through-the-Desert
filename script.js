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

var BOARD = new Board(18, 13);


function setImpassable () {
	switch (FLAGS.impassable) {

		case false:

			for (var i = 0; i < IMPASSABLE_TILES.length; i++) {
				BOARD.getTile(IMPASSABLE_TILES[i]).impassable = true;
				console.log(BOARD.getTile(IMPASSABLE_TILES[i]));
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
				console.log(BOARD.getTile(loc[i]));

			};
			// console.log(splice);
			FLAGS.oasis = true;
			return splice;	
			break;

		case true:
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

function prepareMap () {
	setImpassable();
	var splice = setOasis()[0]
	setWaterholes(splice);
}

function Tile () {

	this.impassable = false;
	this.oasis = false;
	this.waterhole = false;

}

function Board (width, heigth) {
	// Transform an array of rows in a Board object made of list of Tile objects
	
	this.board = [];
	this.width = width;
	this.heigth = heigth;

	for (var i = 0; i < width; i++) {
		var column = [];
		for (var j = 0; j < heigth; j++) {
			column.push(new Tile);
		};
		this.board.push(column);
		console.log(this.board);
	};

	this.getTile = function (arr) {
		console.log(arr, arr[0], arr[1]);
		// Takes an array of coordinates and returns the corresponding Tile object
		return this.board[arr[0]][arr[1]];
	}

	this.printBoard = function () {
		draw_hexmap (this.width, this.heigth, 20);
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
		console.log (tiles, tiles.length);
	}

	this.getWaterholes = function () {
		var tiles = [];
		var callback = function (tile, index) {
			if (typeof tile.waterhole === 'number') {
				tiles.push([i, index]);
			}			
		}
		for (var i = 0; i < this.board.length; i++) {
			this.board[i].map(callback);
		};
		console.log (tiles, tiles.length);
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
		console.log (tiles, tiles.length);
	}
}



function draw_hexagon (x, y, side) {

	var canvas = document.getElementById('board');

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		var path = new Path2D();

		var center_x = x;
    	var center_y = y;
    	var side_length = side;

    	path.moveTo((Math.cos(Math.PI * 1 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 1 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 2 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 2 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 3 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 3 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 4 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 4 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 5 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 5 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 6 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 6 / 3) * side_length) + center_y));
    	path.lineTo((Math.cos(Math.PI * 7 / 3) * side_length) + center_x, ((Math.sin(Math.PI * 7 / 3) * side_length) + center_y));

    	ctx.stroke(path);
    	ctx.fillStyle = "#BA8";
    	ctx.fill(path);
	}
}

function draw_hexmap (width, height, tilesize) {
	
	if (typeof width != 'number' || typeof height != 'number' || typeof tilesize != 'number') {
		throw "draw_hexmap: invalid argument";
	};

	for (var i = 0; i < width; i++) {

		for (var j = 0; j < height; j++) {

			if (i % 2 > 0) {
						
				/*console.log ('uneven!');*/
				var x = i * tilesize * 2 + tilesize;
				var y = j * tilesize * 2 + tilesize + tilesize;
				draw_hexagon(x, y, tilesize);

			} else {
						
				/*console.log ('even!');*/
				var x = i * tilesize * 2 + tilesize;
				var y = j * tilesize * 2 + tilesize;
				draw_hexagon(x, y, tilesize);

			}
		};
	};
}

// EVENT HANDLERS

document.body.onload = BOARD.printBoard.bind(BOARD);