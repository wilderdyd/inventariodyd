function logout(){
    firebase.auth().signOut();
    window.open("index.html", "_self");
}

firebase.auth().onAuthStateChanged(function(user){
    if(user){        
        document.getElementById("pName").innerHTML = user.displayName;
    }else{
        window.open("index.html", "_self");
    }
});

var btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener('click', logout)



