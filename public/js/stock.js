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
        return this.db.collection('stock')
            .add({
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

    modifiedProduct(idP, nameP, descP, priceP, amountP) { 
        const data = {
            idP: idP,
            nameP: nameP,
            descP: descP,
            priceP: priceP,
            amountP: amountP,
        };    

        var modifiedStock = firebase.functions().httpsCallable('modifiedStock');
        return modifiedStock(data)
        .catch(err => {
            console.log(`${err.code} => ${err.message}`);
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
                            product.id,
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
                            product.id,
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

    templateProduct(id, imageLink, name, description, price, amount) {
        if (imageLink) {
            return `
            <div class="divProduct">
                <article class="artProduct">
                    <div class="mod divImg">
                        <figure class="mod figImg">
                            <img id="imgProduct" class="mod" src=${imageLink} alt="ImgProduct">
                        </figure>
                    </div>
                    <div class="mod divName">
                        <h3 id="n${id}" class="mod">${name}</h3>
                        <h5 id="d${id}" class="mod">${description}</h5>
                    </div>
                    <div class="mod divPrice">
                        <h3><strong id="p${id}" class="mod">${price}</strong></h3>
                        <h6 id="a${id}" class="mod">${amount}</h6>
                    </div>
                    </article>
                    <div class="divWrapper" id=${id}></div>
            </div>
        `
        } else {
            return `
            <div class="divProduct">
                <article class="artProduct">
                    <div class="mod divImg">
                        <figure class="mod figImg">
                            <img id="imgProduct" class="mod" src='images/product.jpg' alt="ImgProduct">
                        </figure>   
                    </div>
                    <div class="mod divName">
                        <h3 id="n${id}" class="mod">${name}</h3>
                        <h5 id="d${id}" class="mod">${description}</h5>
                    </div>
                    <div class="mod divPrice">
                        <h3><strong id="p${id}" class="mod">${price}</strong></h3>
                        <h6 id="a${id}" class="mod">${amount}</h6>
                    </div>
                </article>
                <div class="divWrapper" id=${id}></div>
            </div>
            `
        }
    }
}