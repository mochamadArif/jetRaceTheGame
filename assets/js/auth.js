class Auth {
	constructor() {
		this.scope = 'https://www.googleapis.com/auth/plus.login';
	}

	signIn() {
		if(!firebase.auth().currentUser) {
			var provider = new firebase.auth.GoogleAuthProvider();

			provider.addScope(this.scope);
			firebase.auth().signInWithRedirect(provider);
		}
	}

	getResultAuth() {
		firebase.auth().getRedirectResult().then(function(result) {
			if(result.credential) {
				var token = result.credential.accessToken;
				document.getElementById('quickstart-oauthtoken').textContent = token;
			}else {
				document.getElementById('quickstart-oauthtoken').textContent = 'null';
			}
		}).catch(function(error) {
			var errorCode = error.code,
				errorMessage = error.message,
				email = error.email,
				credential = error.credential;

			if(errorCode === 'auth/account-exists-with-different-credential') {
				alert('You have already signed up with a different auth provider for that email.');
			}
		});
	}

	signOut() {
		var result = confirm("Do you want to sign out from current session?");
		
		if(result) {
			if(firebase.auth().currentUser) {			
				firebase.auth().signOut().then(function() {
					console.log('sign out');
				}).catch(function(error) {
					console.log(error);
				});
			}
		}
	}
}

const auth = new Auth();

$(function(){
	$('#button-signin').on('click', function(){ auth.signIn(); });
	$('#button-signout').on('click', function(){ auth.signOut(); });
});