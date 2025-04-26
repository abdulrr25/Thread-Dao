import express from 'express';
import cors from 'cors';
import daoRoutes from './routes/dao';
import activityRoutes from './routes/activities';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/daos', daoRoutes);
app.use('/api/activities', activityRoutes);

export default app; 