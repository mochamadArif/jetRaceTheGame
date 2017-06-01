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
					htmlEntity += '			<div id="player-avatar-room-'+x+'" class="player-avatar color-'+x+'">';
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

		firebase.database().ref('game_room/' + id + '/signedPlayer/' + uid).update({
			selectedPlane: 0,
			isReady: false
		}).then(function(){
			$('#signed-view').attr('data-inroom', true);
			$('#panel-room').fadeIn(function(){
				/* SET ROOM DATA */
				setRace(id, uid);
			});

			var datum_room = getRoomById(id);

			if(datum_room.signedPlayer && _.keys(datum_room.signedPlayer).length >= datum_room.maxPlayers) {
				firebase.database().ref('game_room/' + id).update({
					isFull: true
				});
			}

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
			_.forEach(datum_room.signedPlayer, function(value, key){
				if(key == uid) {
					firebase.database().ref('game_room/'+ id + '/signedPlayer/' + key).remove().then(function(){
						firebase.database().ref('game_room/'+ id).update({ isFull: false }).then(function(){
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

					}).catch(function(error) {
						console("Data could not be saved." + error);
					});
				}
			});
		}
	}

	function setRace(idRoom, uid) {
		var room = getRoomById(idRoom);
		var roomData = null;
		var playerKey = null;

		if(room.signedPlayer) {
			var i = 1;

			_.forEach(room.signedPlayer, function(value, key){
				if(key == uid) {
					roomData = value;
					playerKey = i;

					$('#room-name').text('Hangar '+room.name);

					checkOtherPlayer(idRoom);
				}

				i++;
			});
		}

		firebase.database().ref('players/').on('value', function(snapshot) {
			var result = snapshot.val();

			_.forEach(result, function(value, key) {
				if(key == uid) {
					$('#player-name-'+playerKey).text(value.name);
				}
			});
		});

		$('.button-plane.player-'+playerKey).each(function(){
			$(this).on('click', function(){
				$('.button-plane.player-'+playerKey).removeClass('selected');
				$('.button-plane.player-'+playerKey).parent().find('.player-avatar img').removeClass('selected');
				
				$(this).addClass('selected');
				$(this).parent().find('.player-avatar img').addClass('selected');

				var planeID = $(this).data('id');

				firebase.database().ref('game_room/'+idRoom+'/signedPlayer/'+uid).update({ selectedPlane: planeID }).then(function(){
					checkOtherPlayer(idRoom);
				}).catch(function(error){
					console("Data could not be saved." + error);
				});
			});
		});

		$('#ready-game').on('click', function() {
			setReady(idRoom, uid, playerKey)
		});
	}

	function checkOtherPlayer(id) {
		var url = firebase.database().ref('game_room/'+id);
			result = null;

		url.on('value', function(snapshot) {
			result = snapshot.val();

			if(result.signedPlayer && result.signedPlayer.length < 2) {
				url = firebase.database().ref('game_room/'+id);
			}

			goToGame(result, id);
			showSelector(result);
		}, function(error) {
			console.log(error)
		});
	}

	function setReady(idRoom, uid, pKey) {
		/*$('#selector-readyplayer-'+pKey).show();
		$('#selector-'+pKey).hide();*/
		$('#ready-game').hide();
		$('.room-status').show();

		firebase.database().ref('game_room/'+ idRoom +'/signedPlayer/'+ uid ).update({ isReady: true }).then(function(){
			checkOtherPlayer(idRoom);
		}).catch(function(error) {
			console("Data could not be saved." + error);
		});

	}

	function goToGame(roomData, idRoom) {
		var playersReady = 0;

		_.forEach(roomData.signedPlayer, function(value, key){
			if(value.isReady) {
				playersReady = playersReady + 1;
			}
		});

		if(playersReady == roomData.maxPlayers) {
			firebase.database().ref('game_room/'+ idRoom ).update({ isPlaying: true }).then(function(){
				
				$('#panel-room').hide();
				$('#panel-game').fadeIn();

			}).catch(function(error) {
				console("Data could not be saved." + error);
			});
		}
	}

	function showSelector(roomData) {
		var i = 1;

		_.forEach(roomData.signedPlayer, function(value, key){
			$('#selector-noplayer-'+i).hide();
			$('#selector-'+i).show();

			/*var keyUid = key;

			firebase.database().ref('players/').on('value', function(snapshot) {
				var result = snapshot.val();

				_.forEach(result, function(value, key) {
					if(key == keyUid) {
						$('#player-name-'+i).text(value.name);
					}
				});
			});*/

			$('.button-plane.player-'+i).removeClass('selected');
			$('.button-plane.player-'+i+'[data-id="'+value.selectedPlane+'"]').addClass('selected');

			$('.button-plane.player-'+i).parent().find('.player-avatar img').removeClass('selected');
			$('.button-plane.player-'+i+'[data-id="'+value.selectedPlane+'"]').parent().find('.player-avatar img').addClass('selected');

			i++;
		});
	}
});