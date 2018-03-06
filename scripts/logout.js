(function() {
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function(user) {
            // Sign-out successful.
            // console.log('bye');
            window.location = 'index.html';
            // btnLogout.classList.remove('hide');
            }).catch(function(error) {
            // An error happened.
            console.log(error);
            // btnLogout.classList.remove('hide');
    
            });
    });
}());