/* 코드 완성 안됨 */
$(document).ready(() => {
    var loginBtn = document.querySelector('#loginBtn');
    var userName = document.querySelector('#user');

    // 로그인버튼 text가 sign in 이면, 로그인창 열고 로그인
    if(loginBtn.textContent === 'Sign In') {
        // 로그인창 열고 로그인하면
        $('#loginModal').modal();
        loginBtn.textContent = 'Sign Out';
        userName.innerHTML = 'userName db에서 가져와서 넣어줌';
    } else { // 아니면, text를 sign in으로 다시 변경하고 로그아웃
        loginBtn.textContent = 'Sign In';
        userName.innerHTML = '로그아웃';
    }
});