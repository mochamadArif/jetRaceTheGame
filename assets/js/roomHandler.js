$(document).ready(function(){
	getAllRoom()

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
		$('#panel-room').fadeIn();
		
		var datum_room = getRoomById(id);
		var players = datum_room.signedPlayer ? (datum_room.signedPlayer.length ? datum_room.signedPlayer : []) : [];

		_.indexOf(datum_room, uid) > -1 ? null : players.push(uid);

		var content = {
			signedPlayer: players
		}

		var safeData = firebase.database().ref('game_room/' + id).update(content);
		console.log(safeData);

		$('#back-to-menu').on('click', function() {
			cancelRace(id);
		});

		$('#ready-game').on('click', function() {
			// TODO : SET READY
		});
	}
});