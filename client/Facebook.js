window.fbAsyncInit = function () {
    FB.init({
      appId: '570567725581601', // Cambia esto si usas otro appId
      cookie: true,
      xfbml: true,
      version: 'v20.0',
    });
  
    FB.AppEvents.logPageView();
  
    // Verifica el estado del usuario al cargar
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  };
  
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  
    // Manejo de errores
    js.onerror = function () {
      console.error('No se pudo cargar el SDK de Facebook.');
    };
  })(document, 'script', 'facebook-jssdk');
  
  // Define la función globalmente para evitar el error
  window.checkLoginState = function () {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  };
  
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      console.log('Usuario conectado.');
      FB.api('/me', function (response) {
        console.log('Bienvenido, ' + response.name);
        console.log(response);
      });
    } else if (response.status === 'not_authorized') {
      console.log('Usuario conectado pero no autorizó la aplicación.');
    } else {
      console.log('Usuario no conectado a Facebook.');
    }
  }
  
  function facebookLogin() {
    FB.login(function (response) {
      if (response.authResponse) {
        statusChangeCallback(response);
      } else {
        console.log('Inicio de sesión cancelado.');
      }
    }, { scope: 'public_profile,email' });
  }
  