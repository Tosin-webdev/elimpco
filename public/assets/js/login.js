// const logoutButton = document.querySelector('.btn-logout');

const login = async (email, password) => {
  //   alert(email, password);
  console.log(email, password);
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    console.log(data);
    if (data.status == 'success') {
      showAlert('success', 'logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    if (data.status === 'fail') {
      showAlert('error', data.message);
    }
  } catch (err) {
    alert(err);
    console.log(err);
  }
};

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.status == 'success') location.reload(true);
    if (data.status == 'fail') showAlert('error', 'Error logging out! Try again');
  } catch (err) {
    showAlert('error', 'Error logging out! pls Try again');
  }
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password-input').value;
  login(email, password);
});

// if (logoutButton) {
document.querySelector('.btn-logout').addEventListener('click', logout);
// }
