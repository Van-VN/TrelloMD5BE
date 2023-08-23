import express from 'express';
import ConnectDB from './models/connectDB';
const db = new ConnectDB();
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRoute from './routes/user.router';
import 'dotenv/config';
import taskRoute from './routes/task.router';
import projectRoute from './routes/project.router';
import columnRoute from './routes/column.router';
import columnOrderRoute from './routes/columnOrder.router';
import boardRoute from './routes/board.router';
import workSpaceRoute from './routes/workspace.router';
import { createServer } from 'http';
import { Server } from 'socket.io';

db.connect()
  .then((res) => {
    console.log('Database connected successfully');
  })
  .catch((err) => console.log(err));

const app = express();
app.use(cors({ origin: true }));
export const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.VITE_CORS_URL || '*'
  }
});

io.on('connection', (socket) => {
  console.log('Socket is active to be connected!');
  socket.on('chat', (payload) => {
    io.emit('chat', payload);
  });
  socket.on('drag', (payload) => {
    io.emit('drag', payload);
  });
  socket.on('noti', (payload) => {
    io.emit('noti', payload);
  });
});

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// KIỂM TRA TRẠNG THÁI API
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.use('/api', userRoute);
app.use('/api', taskRoute);
app.use('/api', projectRoute);
app.use('/api', columnRoute);
app.use('/api', columnOrderRoute);
app.use('/api', boardRoute);
app.use('/api', workSpaceRoute);

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
