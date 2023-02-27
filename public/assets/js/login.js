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
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password-input').value;
  login(email, password);
});
