var DATA_ROOM_LIST = [{
	id: '01',
	maxPlayers: 2,
	signedPlayer: []
}, {
	id: '02',
	maxPlayers: 2,
	signedPlayer: []
}, {
	id: '03',
	maxPlayers: 2,
	signedPlayer: []
}];

$(function(){
	setTimeout(function() {
		$('#splash-screen').fadeOut(function(){
			$('#quickstart-sign-in').on('click', function(){
				var $this = $(this);

				if(!firebase.auth().currentUser) {
					var provider = new firebase.auth.GoogleAuthProvider();
					provider.addScope('https://www.googleapis.com/auth/plus.login');
					firebase.auth().signInWithRedirect(provider);
				}
			});

			$('#quickstart-sign-out').on('click', signOut);

			goAuth();
		});
	}, 2000);
});

function goAuth() {
	showLoadingPage();

	firebase.auth().getRedirectResult().then(function(result) {
		if(result.credential) {
			var token = result.credential.accessToken;
			document.getElementById('quickstart-oauthtoken').textContent = token;
        }else {
			document.getElementById('quickstart-oauthtoken').textContent = 'null';
        }

        var user = result.user;

	}).catch(function(error) {
		var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        if(errorCode === 'auth/account-exists-with-different-credential') {
        	alert('You have already signed up with a different auth provider for that email.');
        }
	});

	initApp();
}

function initApp() {
	firebase.auth().onAuthStateChanged(function(user) {
		if(user) {
			setSign();
			initData(user);
		}

		hideLoadingPage();
	});
}

function signOut() {
	if(firebase.auth().currentUser) {
		showLoadingPage();
		
		firebase.auth().signOut().then(function() {
			initData(null);
			setUnsign();

			console.log('sign out');
		}).catch(function(error) {
			// An error happened.
		});
	}
}

function initData(d) {
	if(d) {
		console.log(d);

		generateRoomList(DATA_ROOM_LIST);
	}
}

function setSign() {
	$('.main-content').addClass('app');
	$('#panel-login').hide();
	$('#signed-view').show();
}
function setUnsign() {
	$('.main-content').removeClass('app');
	$('#panel-login').fadeIn();
	$('#signed-view').hide();
}

/* --------------------------------------------------------------------------------- */
function generateRoomList(data) {
	var roomList = $('#panel-list-room').find('#room-list');

	roomList.html('');

	setTimeout(function() {
		$.each(data, function(i,v){
			var htmlEntity = '';

			htmlEntity += '<li>';
			htmlEntity += '	<div id="button-join-'+v.id+'" class="room-info">';
			htmlEntity += '		<h3>Hangar '+v.id+'</h3>';
			htmlEntity += '		<div class="room-player">';

			for(var x=0;x<v.maxPlayers;x++) {
				htmlEntity += '			<div class="player-avatar">';
				htmlEntity += '			</div>';
			}

			htmlEntity += '		</div>';
			htmlEntity += '		<button class="button styled-button green join-room" id="button-join-'+v.id+'" data-id="'+v.id+'">Join</button>';
			htmlEntity += '	</div>';
			htmlEntity += '</li>';

			roomList.append(htmlEntity);
		});

		$('.join-room').each(function(){
			$(this).on('click', function() {
				var id = $(this).data('id');
				
				generateRoom(id);
			});
		});
	}, 100);
}

function generateRoom(id) {
	$('#panel-list-room').hide();
	$('#panel-room').show();
}