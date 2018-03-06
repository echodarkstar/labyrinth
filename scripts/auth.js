(function() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogout = document.getElementById('btnLogout');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
   
    btnLogin.addEventListener('click', e => {
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        console.log(email, password);
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => alert(e.message));
    });

    btnSignUp.addEventListener('click', e => {
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        console.log(email, password);
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise.catch(e => alert(e.message));
        // console.log(promise);
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            // console.log(firebaseUser.email);
            // window.location = 'editor.html';
            btnLogout.style.display = 'block';
        } else {
            console.log("not logged in");
        }
        // console.log(firebase.auth().currentUser);
    });


    // btnLogout.addEventListener('click', e => {
    //     firebase.auth().signOut().then(function(user) {
    //         // Sign-out successful.
    //         console.log('bye' + user.email);
    //         btnLogout.classList.remove('hide');
    //       }).catch(function(error) {
    //         // An error happened.
    //         console.log('kuch ho gaya hai');
    //         btnLogout.classList.remove('hide');

    //       });
    // });
}());