import express from 'express';
import ConnectDB from './models/connectDB';
const db = new ConnectDB();
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRoute from './routes/user.router';
import 'dotenv/config';

db.connect()
  .then((res) => {
    console.log('Database connected successfully');
  })
  .catch((err) => console.log(err));

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// KIỂM TRA TRẠNG THÁI API
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.use('/api', userRoute);

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    try {
      res.locals.userLogin = req.user;
    } catch (error) {
      console.error('Error fetching: ', error);
    }
  }
  next();
});