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

var database = firebase.database();

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

function initData(user) {
	if(user) {
		$('#player-name').text(user.displayName);
		$('#signed-view').attr('data-id', user.uid);
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
