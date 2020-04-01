function logout() {
    firebase.auth().signOut();
    window.open("index.html", "_self");
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById("pName").innerHTML = user.displayName;
        document.getElementById("divGlobal").hidden = false;
    } else {
        window.open("index.html", "_self");
    }
});

function showAdd() {
    var modal = document.getElementById("modalAdd");
    var inImage = document.getElementById("inImage");
    var btnAdd = document.getElementById("btnAdd");
    var btnCancelar = document.getElementById("btnCancelar");
    sessionStorage.setItem('imgNewProduct', null);
    var user = firebase.auth().currentUser;
    var stock = new Stock();
    var file = null;
    modal.style.display = 'block';

    inImage.addEventListener('change', e => {
        file = e.target.files[0];
        stock.uploadImg(file, user.uid);
    });

    btnAdd.addEventListener('click', () => {
        const name = document.getElementById("inName").value;
        const description = document.getElementById("inDescription").value;
        const price = Number(document.getElementById("inPrice").value);
        const amount = Number(document.getElementById("inAmount").value);
        const imgLink = sessionStorage.getItem('imgNewProduct') == 'null' ? null : sessionStorage.getItem('imgNewProduct');

        stock.addProduct(user.uid, user.email, name, description, price, amount, imgLink)
            .then(resp => {
                console.log(`Producto agregado con exito`);
                modal.style.display = "none";
            })
            .catch(err => {
                console.error(`Error agregando producto => ${err}`);
            });
    });

    btnCancelar.addEventListener('click', () => {
        modal.style.display = "none";
    });
}

function showInStock(){
    const user = firebase.auth().currentUser;
    const stock = new Stock();
    stock.productInStock(user.email);
    document.getElementById("titulo").innerHTML = "Productos con stock"
}

function showOutStock(){
    const user = firebase.auth().currentUser;
    const stock = new Stock();
    stock.productOutStock(user.email);
    document.getElementById("titulo").innerHTML = "Productos sin stock"
}

var btnLogout = document.getElementById("btnLogout");
let liADD = document.getElementById("liAdd");
// let liDelete = document.getElementById("liDelete");
// let liModified = document.getElementById("liModified");
let liInStock = document.getElementById("liInStock");
let liOutStock = document.getElementById("liOutStock");

btnLogout.addEventListener('click', logout);
liADD.addEventListener('click', showAdd);
liInStock.addEventListener('click',showInStock);
liOutStock.addEventListener('click', showOutStock);





   


