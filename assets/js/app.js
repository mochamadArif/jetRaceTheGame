class App {
	constructor() {
		this._btnMenuPlay = $('#button-menu-play'),
		this._btnMenuCheck = $('#button-menu-check'),
		this._btnMenuCustomize = $('#button-menu-customize');

		this._popup_mission = $('#popup-mission');
		this._popup_statistic = $('#popup-statistic');
	}

	init() {
		const that = this;

		showLoadingPage();

		auth.getResultAuth();

		firebase.auth().onAuthStateChanged(function(user) {
			const $homeScene = $('#home'),
				  $signInScene = $('#signin');

			if(user) {
				/* SIGNED IN */

				$signInScene.hide();
				$homeScene.css({display: 'flex'});

				showMenu();
			}else {
				/*  PUBLIC */

				$signInScene.css({display: 'flex'});
				$homeScene.hide();
			}

			hideLoadingPage();
		});

		this._btnMenuPlay.on('click', function() {
			showPopup(that._popup_mission, function(){
				that.collectingMission()
			});
		});

		this._btnMenuCheck.on('click', function() {
			showPopup(that._popup_statistic, function(){
				
			});
		});

		this._btnMenuCustomize.on('click', function() {
			console.log('go to hangar')
		});
	}

	collectingMission() {
		/* GET LIST MISSION */
		call.getListMission();
	}
}

const call = new Call();
const app = new App();

$(function(){
	app.init();
});