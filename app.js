const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL);
const app = express();

app.use(express.json());
app.disable('x-powered-by');
app.use((req, res, next) => {
  req.user = {
    _id: '63499f39bfb9da8e1d5e9949',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})