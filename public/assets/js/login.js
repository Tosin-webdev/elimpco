// const logoutButton = document.querySelector('.btn-logout');
// const stripe = Stripe('')
const signInForm = document.querySelector('.form1');
const bookingTour = document.querySelector('.book-tour');
const signUpForm = document.querySelector('.needs-validation');
const logoutButton = document.querySelector('.btn-logout');

const showAlert = (type, msg) => {
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log(data);

    if (data.status === 'success') {
      showAlert('success', 'logged out successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    if (data.status == 'success') location.reload(true);
    if (data.status == 'fail') showAlert('error', 'Error logging out! Try again');
  } catch (err) {
    showAlert('error', 'Error logging out! pls Try again');
  }
};

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

const bookTour = async (tourId) => {
  try {
    // const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    console.log(data);
    // return data;

    if (data.status === 'success') {
      window.location = data.session.url;
    }
    // create cheout form + change credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (error) {
    console.log(error);
  }
};

if (bookingTour)
  bookingTour.addEventListener('click', (e) => {
    // e.preventDefault();
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

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
const signup = async (name, email, password, passwordConfirm) => {
  //   alert(email, password);
  console.log(email, password);
  try {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, passwordConfirm }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    console.log(data);
    if (data.status == 'success') {
      showAlert('success', 'signed up successfully');
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

if (signInForm) {
  signInForm.addEventListener('submit', (e) => {
    console.log('123...');
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password-input').value;
    login(email, password);
  });
}

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('useremail').value;
    const password = document.getElementById('password-input').value;
    const passwordConfirm = document.getElementById('password-confirm-input').value;
    signup(name, email, password, passwordConfirm);
  });
}

const userDataForm = document.querySelector('.profile-update');

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    console.log(form);
    form.append('name', document.getElementById('nameInput').value);
    form.append('email', document.getElementById('emailInput').value);
    form.append('photo', document.getElementById('profile-img-file-input').files[0]);

    console.log(form);
    try {
      const res = await fetch('/api/v1/users/updateMe', {
        method: 'PATCH',
        body: form,
      });
      console.log(res);

      const data = await res.json();
      console.log(data);
      console.log(form);
      if (data.status == 'success') {
        showAlert('success', 'Profile successfully updated');
        window.location.reload();
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

// const bookingTour = document.querySelector('.book-tour');
// bookingTour.addEventListener('click', (e) => {
//   // e.preventDefault();
//   // const { tourId } = e.target.dataset;
//   // bookTour(tourId);
//   console.log('hiii');
// });

// if (logoutButton) {
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
