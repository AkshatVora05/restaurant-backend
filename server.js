const dotenv = require('dotenv');
dotenv.config({path: "./.env"});

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDb = require('./config/db');
const redisClient = require('./utils/redisClient');
const testRoute = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const foodRoutes = require('./routes/foodRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/api', testRoute);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/food', foodRoutes);

app.get('/', (req, res) => {
    res.send('<b>Hi there</b>')
});

const startServer = async () => {
    try {
        await connectDb();
        await redisClient.connect();

        console.log('All services connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();