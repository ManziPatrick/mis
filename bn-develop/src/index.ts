import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './database/config';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import swaggerDocument from '../swagger.json';
import { createServer } from 'http';
import { setupNotificationSocket } from './modules/notification/services/notificationSocket';
import { Server } from 'socket.io';
import { FinanceController } from './modules/finance/controller/financeController';
import { LibraryController } from './modules/library/controller/libraryController';
import { ProcurementController } from './modules/procurement/Controller/procurementController';
import { hrController } from './modules/hr/controller/hrController';
import './utils/cronJob';

// Swagger API Documentation
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'https://mis-fn.vercel.app'];

export const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

setupNotificationSocket(io);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Initialize controllers
new FinanceController(); // This will set up the notification listeners
new LibraryController();
new ProcurementController();
new hrController();

server.listen(port, async() => {
  try {
    await connectDB();
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
});