# elimpco

![elimpco](https://user-images.githubusercontent.com/64624808/233012366-139f61d9-576e-4322-ac0a-3d0840329847.png)

### Description
This is a booking application where you can book a tour

### Postman Documentation [here](https://documenter.getpostman.com/view/16204872/2s8ZDU6jX8)



* features:

   * Nodejs: which runs the entire backend of this application
   * ejs: for rendering data from the backend
   * Mongoose Schema to model the application data
   * stripe: for handling booking payments
   
### Setup

```
create a .env file and add the following
Mongo_URI= "YOUR MONOGO URI"
NODE_ENV= "development"
JWT_EXPIRES_IN = "put the Expiry date"
EMAIL_HOST= "YOUR EMAIL host"
EMAIL_USERNAME= "YOUR EMAIL username"
EMAIL_PASSWORD= "YOUR EMAIL password"
EMAIL_FROM= "YOUR EMAIL"
EMAIL_PORT= "YOUR email PORT"
JWT_COOKIE_EXPIRES_IN=""
STRIPE_SECRET_KEY="Your STRIPE secret key"

```


## Install dependencies & Run
```
npm i
npm start
```
