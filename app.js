const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const { loggingMiddleware } = require('./middleware/authMiddleware');

const app = express();

// For Middleware
app.use(bodyParser.json());
app.use(loggingMiddleware);

// For Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});