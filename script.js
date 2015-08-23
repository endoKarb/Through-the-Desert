var DEFAULT_BOARD = [
	[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
];

var OASIS_LOCATION = [
	[1, 2],
	[6, 6],
	[9, 2],
	[11, 10],
	[15, 2],
	[17, 7]
];

var WATERHOLE_LOCATION = [
	[0, 5],
	[1, 0],
	[1, 6],
	[2, 4],
	[3, 1],
	[3, 6],
	[3, 8],
	[4, 4],
	[5, 9],
	[6, 1],
	[6, 3],
	[6, 5],
	[6, 8],
	[7, 11],
	[8, 8],
	[8, 10],
	[9, 4],
	[10, 1],
	[10, 3],
	[11, 8],
	[11, 11],
	[12, 2],
	[12, 4],
	[13, 5],
	[13, 9],
	[13, 11],
	[14, 0],
	[14, 8],
	[15, 4],
	[16, 3],
	[16, 9],
	[17, 5]
];


var FLAGS = {
	'oasis': false,
	'waterhole': false
};

var BOARD = new Board(DEFAULT_BOARD);


function row (arr) {
	// Takes and array of integers and return an array of Tile objects
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		result.unshift(new Tile(arr[i]));
	};
	return result;
}

function addOasis () {

	switch (FLAGS.oasis) {

		case false:
			//Make a copy of the list of Oasis tiles with slice 0, then splice away one random element,
			//then set the corresponding Tile objects Oasis flag to true, then set the general oasis flag to true

			var rnd = Math.floor(Math.random()*6);
			var loc = OASIS_LOCATION.slice(0);
			var splice = loc.splice(rnd, 1);
			
			for (var i = 0; i < loc.length; i++) {
				BOARD.getTile(loc[i]).oasis = true;
				console.log(BOARD.getTile(loc[i]));

			};
			console.log(splice);
			FLAGS.oasis = true;
			return splice;	
			break;

		case true:
			break;
	}
}

function addWaterhole (arr) {

	//Takes the last remaining free Oasis tile as argument, and adds Waterholes

	switch (FLAGS.waterhole) {

		case false:
			
			var holes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, ];
			var loc = WATERHOLE_LOCATION.slice(0);
			loc.push(arr);
			// debugger;

			while (loc.length > 0) {
				var rnd = Math.floor(Math.random() * holes.length);
				var tile = loc.splice(0, 1)[0];
				BOARD.getTile(tile).waterhole = holes.splice(rnd, 1)[0];
				console.log(holes);
			}
			FLAGS.waterhole = true;
			break;

		case true:
			break;
	}
}

function populateMap () {
	// addOasis();
	addWaterhole([9, 2]);
}

function Tile (int) {

	this.oasis = false;
	this.waterhole = false;

	// Takes an int representing walkability and returns a tile object with that property
	switch (int) {
		case 0:
			this.walkable = false;
			break;
		case 1:
			this.walkable = true;
			break;

	}	
}

function Board (arr) {
	// Transform an array of rows in a Board object made of list of Tile objects
	
	this.board = [];
	for (var i = 0; i < arr.length; i++) {
		this.board.unshift(row(arr[i]));
	};

	this.getTile = function (arr) {
		// Takes an array of coordinates and returns the corresponding Tile object
		return this.board[arr[0]][arr[1]];
	}
}
