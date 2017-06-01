$(document).ready(function(){
	getAllRoom();

	function getAllRoom(){
		var url = firebase.database().ref('game_room/');

		url.on('value', function(snapshot) {
			var result = snapshot.val();

			generateRoomList(result);
		});
	}

	function getRoomById(id){
		var url = firebase.database().ref('game_room/'+id);
		var result = null;

		url.on('value', function(snapshot) {
			result = snapshot.val();
		});

		return result;
	}

	function generateRoomList(data) {
		var roomList = $('#panel-list-room').find('#room-list');

		roomList.html('');

		setTimeout(function() {
			$.each(data, function(i,v){
				var htmlEntity = '';

				htmlEntity += '<li>';
				htmlEntity += '	<div id="button-join-'+i+'" class="room-info">';
				htmlEntity += '		<h3>Hangar '+v.name+'</h3>';
				htmlEntity += '		<div class="room-player">';

				for(var x=0;x<v.maxPlayers;x++) {
					htmlEntity += '			<div class="player-avatar">';
					htmlEntity += '			</div>';
				}

				htmlEntity += '		</div>';
				htmlEntity += '		<button class="button styled-button green join-room" id="button-join-'+i+'" data-id="'+i+'">Join</button>';
				htmlEntity += '	</div>';
				htmlEntity += '</li>';

				roomList.append(htmlEntity);
			});

			$('.join-room').each(function(){
				$(this).on('click', function() {
					var id = $(this).data('id');
					var uid = $('#signed-view').data('id');

					generateRace(id, uid);
				});
			});
		}, 100);
	}

	function generateRace(id, uid) {
		$('#panel-user').hide();
		$('.logo-main').hide();
		$('#panel-list-room').hide();

		showLoadingPage();

		var datum_room = getRoomById(id);
		var players = datum_room.signedPlayer ? datum_room.signedPlayer : [];

		_.forEach(players, function(value){
			if(players.length > 0) {
				if(value.id == uid) {

				}
			}
		});

		if(players.length <= 0) {
			players.push({
				id: uid,
				selectedPlane: 0,
				isReady: false
			});

			var content = null;

			if(players.length >= 2) {
				content = {
					signedPlayer: players,
					isFull: true
				}
			}else {
				content = { signedPlayer: players }
			}

			if(!content.isFull) {
				firebase.database().ref('game_room/' + id).update(content).then(function(){
					$('#signed-view').attr('data-inroom', true);
					$('#panel-room').fadeIn();
					hideLoadingPage();
				}).catch(function(error) {
					console("Data could not be saved." + error);
					hideLoadingPage();
				});
			}
		}

		/*if(_.indexOf(datum_room.signedPlayer, uid) == -1) {
			players.push({
				id: uid,
				selectedPlane: 0,
				isReady: false
			});

			

			if(players.length >= 2) {
				content = {
					signedPlayer: players,
					isFull: true
				}
			}else {
				content = { signedPlayer: players }
			}

			firebase.database().ref('game_room/' + id).update(content).then(function(){
				$('#signed-view').attr('data-inroom', true);
				$('#panel-room').fadeIn();
				hideLoadingPage();
			}).catch(function(error) {
				console("Data could not be saved." + error);
				hideLoadingPage();
			});
		}*/

		$('#back-to-menu').on('click', function() {
			cancelRace(id, uid);
		});

		$('#ready-game').on('click', function() {
			// TODO : SET READY
		});
	}

	function cancelRace(id, uid) {
		showLoadingPage();

		var datum_room = getRoomById(id);

		if(datum_room.signedPlayer) {
			var idx = _.indexOf(datum_room.signedPlayer, uid);
			
			datum_room.signedPlayer.splice(idx, 1);

			content = {
				signedPlayer: datum_room.signedPlayer,
				isFull: false
			}

			firebase.database().ref('game_room/' + id).update(content).then(function(){
				$('#panel-user').fadeIn();
				$('.logo-main').fadeIn();
				$('#panel-list-room').fadeIn();
				$('#signed-view').attr('data-inroom', false);
				$('#panel-room').hide();
				hideLoadingPage();
			}).catch(function(error) {
				console("Data could not be saved." + error);
				hideLoadingPage();
			});
		}
	}
});