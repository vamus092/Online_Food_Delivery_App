require('dotenv').config();
const express = require('express');
const app = express();
// Http Server 
// const http = require('http'); // Needed for socket.io
// const { Server } = require('socket.io');

// const server = http.createServer(app); // Wrap express in HTTP server
// // Attach Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:4200', // Angular frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true
//   }
// });



const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoute');
const menuRouter = require('./routes/menuRoute');
const restaurantRouter = require('./routes/restaurantRoute');
const orderRouter = require('./routes/orderRoutes');
const adminRouter = require('./routes/adminRoute');

const errorHandler = require('./middleware/errorhandler');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDb = require('./db/dbConnection');

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies to be sent with requests
}));  

// MiddleWares (To Parse the data send from the Frontend) =======>
// Convert the req body into Json format    
app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// DB CONNECTION ==========>
// mongoose.connect(process.env.Mongo_LOCAL_URL)
//   .then(() => console.log("Mongodb Connected!"))
//   .catch(err => console.log(err));
connectDb();


app.use(cookieParser());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/menu', menuRouter);
app.use('/restaurant',restaurantRouter);
app.use('/order',orderRouter);
app.use('/admin',adminRouter);

// app.all('*',(req,res)=>{
//     console.log(req);
// })

app.use(errorHandler);

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// Export io so controllers can emit events
// module.exports = { app, server, io };

// Now both Express routes and Socket.IO share the same server
// server.listen(process.env.PORT, () => {
//   console.log(`Server is listening at http://localhost:${process.env.PORT}`);
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}` )
});


