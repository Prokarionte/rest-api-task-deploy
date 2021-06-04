import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import TaskRoutes from './routes/taskroutes';

const app = express();

// setings
app.set('port', process.env.PORT || 3000);


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// routes
app.get('/', (req, res) => {
	res.json({ message: 'Bienvenido a mi aplicacion' });
});

app.use('/api/task', TaskRoutes);

export default app;