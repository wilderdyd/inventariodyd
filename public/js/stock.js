class Stock {
    constructor() {
        this.db = firebase.firestore();
    }

    uploadImg(file, uid) {
        const refStorage = firebase.storage().ref(`imgsProducts/${uid}/${file.name}`);
        const task = refStorage.put(file);

        task.on('state_changed',
            () => { },
            err => {
                console.error(`Error uploading file => ${err.message}`);
            },
            () => {
                task.snapshot.ref.getDownloadURL()
                    .then(url => {
                        sessionStorage.setItem('imgNewProduct', url);
                    })
                    .catch(err => {
                        console.error(`Error getting downloadURL => ${err}`);
                    });
            });
    }

    addProduct(uid, emailUser, name, description, price, amount, imgProduct) {
        return this.db.collection('stock').add({
            uid: uid,
            user: emailUser,
            name: name,
            description: description,
            price: price,
            amount: amount,
            imgProduct: imgProduct,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        })
            .catch(err => {
                console.error(`Error created product => ${err}`);
            });
    }

    productInStock(emailUser) {
        var stockRef = document.getElementById('stock');

        this.db.collection('stock')
            .orderBy('amount', 'asc')
            .orderBy('name', 'asc')
            .where('user', '==', emailUser)
            .where('amount', '>', 0)
            .onSnapshot(querySnapshot => {
                $('#stock').empty();
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(product => {
                        let stockHtml = this.templateProduct(
                            product.data().imgProduct,
                            product.data().name,
                            product.data().description,
                            product.data().price,
                            product.data().amount
                        )
                        $('#stock').append(stockHtml);
                    });
                }
            });
    }

    productOutStock(emailUser) {
        this.db.collection('stock')
            .orderBy('name', 'asc')
            .where('user', '==', emailUser)
            .where('amount', '==', 0)
            .onSnapshot(querySnapshot => {
                $('#stock').empty()
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(product => {
                        let stockHtml = this.templateProduct(
                            product.data().imgProduct,
                            product.data().name,
                            product.data().description,
                            product.data().price,
                            product.data().amount
                        )
                        $('#stock').append(stockHtml);
                    });
                }
            });
    }

    templateProduct(imageLink, name, description, price, amount) {
        if (imageLink) {
            return `<article class="artProduct">
            <div class="divImg">
                <figure class="figImg">
                    <img id="imgProduct" src=${imageLink} alt="ImgProduct">
                </figure>
            </div>
            <div class="divName">
                <h3 id="hName">${name}</h3>
                <h5 id="hDescription">${description}</h5>
            </div>
            <div class="divPrice">
                <h3 id="hPrice"><strong>${price}</strong></h3>
                <h6 id="hAmount">${amount}</h6>
            </div>
        </article>`
        } else {
            return `<article class="artProduct">
            <div class="divImg">
                <figure class="figImg">
                    <img id="imgProduct" src='images/product.jpg' alt="ImgProduct">
                </figure>
            </div>
            <div class="divName">
                <h3 id="hName">${name}</h3>
                <h5 id="hDescription">${description}</h5>
            </div>
            <div class="divPrice">
                <h3 id="hPrice"><strong>${price}</strong></h3>
                <h6 id="hAmount">${amount}</h6>
            </div>
        </article>`
        }
    }
}