'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import reservationRoutes from '../src/reservations/reservation.routes.js';
import hotelRouter from '../src/hotels/hotel.routes.js'
import roomRouter from '../src/rooms/room.routes.js';
import invoiceRouter from '../src/invoices/invoice.routes.js';
import userRouter from '../src/users/user.routes.js';
import eventRouter from '../src/events/event.routes.js';


const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/penguinManagement/v1/auth', authRoutes);
    app.use('/penguinManagement/v1/hotels', hotelRouter);
    app.use('/penguinManagement/v1/reservations', reservationRoutes);
    app.use('/penguinManagement/v1/rooms', roomRouter);
    app.use('/penguinManagement/v1/invoice', invoiceRouter);
    app.use('/penguinManagement/v1/users', userRouter);
    app.use('/penguinManagement/v1/events', eventRouter);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    }catch(error){
        console.error('Error Conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3333;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port:  ${port}`)

    } catch (err) {
        console.log(`Server init fail : ${err}`)
    }
}