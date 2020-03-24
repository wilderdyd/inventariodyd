class Auth {
    loginWithEmail(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                window.open("main.html", "_self");
            })
            .catch(function (error) {
                console.log("Error en loginWithEmail: " + error);

            });
    }

    createWithEmail(name, email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                result.user.updateProfile({
                    displayName: name
                });
                firebase.auth().signOut();
                loginUserState();
            })
            .catch(function (error) {
                console.log("Error en createWithEmail: " + error);
            });
    }
}