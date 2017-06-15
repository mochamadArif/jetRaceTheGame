var stageSize = { width: $(window).width(), height: $(window).height() },
	centerPoint = { x:stageSize.width / 2, y:stageSize.height / 2 };

var game = new Phaser.Game(stageSize.width, stageSize.height, Phaser.AUTO, 'game', {
				preload: gamePreload,
				create: gameCreate,
				update: gameUpdate
			});

var bgm_menu;
var bgm_game;

function gamePreload () {
	/*Sounds*/
	game.load.audio('bgm_menu','./assets/musics/bgm-home.mp3');
	game.load.audio('bgm_game','./assets/musics/bgm-game.mp3');
}

function gameCreate () {
	game.stage.backgroundColor = "#271e54";

	bgm_menu = game.add.audio('bgm_menu', 1, true);
    bgm_menu.play();
}

function gameUpdate () {}