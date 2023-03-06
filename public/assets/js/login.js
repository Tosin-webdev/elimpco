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

const userDataForm = document.querySelector('.profile-update');

userDataForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const image = document.querySelector('.profile-img-file-input').files[0];
  // console.log(photo);
  // if (photo) {
  //   photo = photo.name;
  // }
  // console.log(name, email, photo);
  // console.log(form);
  //
  try {
    const res = await fetch('/api/v1/users/updateMe', {
      method: 'PATCH',
      body: JSON.stringify({ name, email, image }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(res);

    const data = await res.json();
    console.log(data);
    if (data.status == 'success') {
      // alert('done');
      showAlert('success', 'Profile successfully updated');
    }
  } catch (error) {
    alert(error);
  }
});

const userPasswordForm = document.querySelector('.change-password');

userPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const passwordCurrent = document.getElementById('oldpasswordInput').value;
  const password = document.getElementById('newpasswordInput').value;
  const passwordConfirm = document.getElementById('confirmpasswordInput').value;

  // console.log(passwordCurrent, password, passwordConfirm);
  try {
    const res = await fetch('/api/v1/users/updateMyPassword', {
      method: 'PATCH',
      body: JSON.stringify({ passwordCurrent, password, passwordConfirm }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log(data);
    if (data.status == 'success') {
      showAlert('success', 'Password successfully updated');
    }
    if (data.status == 'fail') showAlert('error', data.message);
  } catch (error) {
    alert(error);
  }
});

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
// document.querySelector('.profile-me').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('emailInput').value;
//   console.log(name, email);

//   updateData(name, email);
// });

// const updateData = async (name, email) => {
//   //   alert(name, email);
//   console.log(name, email);
//   try {
//     const res = await fetch('/api/v1/users/updateMe', {
//       method: 'PATCH',
//       body: JSON.stringify({ name, email }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const data = await res.json();

//     console.log(data);
//     // if (data.status == 'success') {
//     //   showAlert('success', 'profile updated successfully');
//     // }

//     // if (data.status === 'fail') {
//     //   showAlert('error', data.message);
//     // }
//   } catch (err) {
//     alert(err);
//     console.log(err);
//   }
// };
