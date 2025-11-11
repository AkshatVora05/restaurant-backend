# 🍴 Restaurant Food App (Backend)

This is a **Node.js + Express + MongoDB + Redis** backend application for a restaurant food ordering platform.  
It follows a **modular MVC-based architecture** with authentication, OTP verification, and secure password reset functionalities.

---

## 🚀 Features

- User authentication and authorization with JWT  
- OTP verification for user registration and password reset  
- Email-based otp verification using **Nodemailer**, **Crypto**, and **Redis**  
- Restaurant, Category, and Food management APIs  
- Order management system  
- Role-based access using custom middlewares  
- Highly modular folder structure for maintainability and scalability  

---

## 🧩 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Redis**
- **Nodemailer**
- **Crypto**
- **JWT Authentication**
- **Dotenv**

---

## 🏗 Folder Structure
├── config/
│ └── db.js
├── controller/
│ ├── authControllers.js
│ ├── categoryController.js
│ ├── foodControllers.js
│ ├── restaurantController.js
│ ├── testControllers.js
│ └── userController.js
├── middlewares/
│ ├── adminMiddleware.js
│ └── authMiddleware.js
├── models/
│ ├── categoryModel.js
│ ├── foodModel.js
│ ├── orderModel.js
│ ├── restaurantModel.js
│ └── userModel.js
├── routes/
│ ├── authRoutes.js
│ ├── categoryRoutes.js
│ ├── foodRoutes.js
│ ├── restaurantRoutes.js
│ ├── testRoutes.js
│ └── userRoutes.js
├── utils/
│ ├── emailService.js
│ └── redisClient.js
├── .env
└── server.js