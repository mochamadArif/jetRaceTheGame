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
				htmlEntity += '	<div id="join-'+i+'" class="room-info">';
				htmlEntity += '		<h3>Hangar&nbsp&nbsp'+v.name+'</h3>';
				htmlEntity += '		<div class="room-player">';

				for(var x=0;x<v.maxPlayers;x++) {
					htmlEntity += '			<div class="player-avatar color-'+x+'">';
					htmlEntity += '			</div>';
				}

				htmlEntity += '		</div>';
				if(!v.isFull) {
					htmlEntity += '<button class="button styled-button green join-room" id="button-join-'+i+'" data-id="'+i+'">Join</button>';
				}else {
					htmlEntity += '<button class="button styled-button green join-room full" data-id="'+i+'" disabled="disabled">Full</button>';
				}
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

		/* TODO : CHECK IF PLAYER REFRESH THE PAGE BUH HAS ALREADY SIGNED TO THE ROOM */

		players.push({
			id: uid,
			selectedPlane: 0,
			isReady: false
		});

		var content = null;

		if(players.length >= datum_room.maxPlayers) {
			content = {
				signedPlayer: players,
				isFull: true
			}
		}else {
			content = { signedPlayer: players }
		}

		firebase.database().ref('game_room/' + id).update(content).then(function(){
			$('#signed-view').attr('data-inroom', true);
			$('#panel-room').fadeIn(function(){
				setRace(id, uid);
			});

			hideLoadingPage();
		}).catch(function(error) {
			console("Data could not be saved." + error);
			hideLoadingPage();
		});

		$('#back-to-menu').on('click', function() {
			cancelRace(id, uid);
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

	function setRace(idRoom, uid) {
		var room = getRoomById(idRoom);
		var roomData = null;
		var playerKey = null;

		if(room.signedPlayer) {
			_.forEach(room.signedPlayer, function(value, key){
				if(value.id == uid) {
					roomData = value;
					playerKey = key + 1;

					checkOtherPlayer(idRoom);
				}
			});
		}

		$('.button-plane.player-'+playerKey).each(function(){
			$(this).on('click', function(){
				$('.button-plane.player-'+playerKey).removeClass('selected');
				
				$(this).addClass('selected');
			});
		});

		$('#ready-game').on('click', function() {
			var selectedPlaneId = $('.button-plane.selected').data('id');
			setReady(roomData, playerKey, selectedPlaneId)
		});
	}

	function checkOtherPlayer(id, room) {
		var url = firebase.database().ref('game_room/'+id);
			result = null;

		url.on('value', function(snapshot) {
			result = snapshot.val();

			if(result.signedPlayer.length < 2) {
				url = firebase.database().ref('game_room/'+id);
			}

			showSelector(result);
		}, function(error) {
			console.log(error)
		});
	}

	function setReady(data, playerKey, planeId) {
		$('#ready-game').hide();
		$('.room-status').show();
	}

	function showSelector(roomData) {
		_.forEach(roomData.signedPlayer, function(value, key){
			var i = key+1;

			$('#selector-noplayer-'+i).hide();
			$('#selector-'+i).show();
		});
	}
});