// // 로그인의 상태 체크
// function checkLoginStatus() {
//     var loginBtn = document.querySelector('#loginBtn');
//     // 로그인이 된 상태이면, GoogleAuth.isSignedIn.get() 이 true 리턴.
//     if(gauth.isSignedIn.get()) {
//         console.log('logined');
//         loginBtn.value = 'Sign Out';
//     } else {
//         console.log('logouted');
//         loginBtn.value = 'Sign In';
//     }
// }
//
// function init() {
//     console.log('init');
//     // 'auth2 라이브러리'의 로드가 끝나면 뒤에 있는 콜백함수 실행.
//     gapi.load('auth2', function() {
//         console.log('auth2');
//         // client_id 값을 주면 GoogleAuth 객체 리턴.
//         // window로 전역변수 전환
//         window.gauth = gapi.auth2.init({
//             client_id:'402915477831-9a1ogje7q6p3t498kv0ke5gbio5rm49v.apps.googleusercontent.com'
//         });
//
//         gauth.then(function () {
//             console.log('googleAuth success!!');
//             checkLoginStatus();
//         }, function () {
//             console.log('googleAuth fail!!');
//         });
//     });
// }
//
// $('#loginBtn').on('click', function () {
//     // var loginText = document.getElementById("loginBtn").textContent;
//
//     if (document.getElementById("loginBtn").textContent === 'Sing In') {
//         // .then() 은 signIn() 함수가 끝나면 then()의 파라미터로 들어간 콜백함수 호출.
//         gauth.signIn().then(function() {
//             console.log('gauth.signIn()');
//             // checkLoginStatus();
//         });
//         document.getElementById("loginBtn").textContent = 'Sign Out';
//     } else {
//         gauth.signOut().then(function() {
//             console.log('gauth.signOut()');
//             // checkLoginStatus();
//         });
//         document.getElementById("loginBtn").textContent = 'Sign In';
//     }
// });