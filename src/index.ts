import express from 'express';
import cors from 'cors';
import MainServer from './classes/server';
import bodyParser from 'body-parser';
import http from 'http';
import MainRouter from './routes/Main.router';
import { MONGODB_CONNECT } from './global/enviroments.global';
import mongoose from 'mongoose';

let server = MainServer.instance;

// parse application/x-www-form-urlencoded
server.app.use( bodyParser.urlencoded( {extended: true} ) );

// parse application/json
server.app.use( bodyParser.json() );

// config cors
server.app.use( cors( { origin: true, credentials: true } ) );


// ruting de mis apiRest
server.app.use( MainRouter );

server.run( (err: any) => {

    if (err) {
        return console.error('Error al iniciar servidor');    
    }

    console.log('servidor corriendo en puerto', server.port);

    mongoose.connect( MONGODB_CONNECT , { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err: any) => {
        if (err) {
            throw err;
        }
        // let psw = bcrypt.hashSync('123456Cq', 10);
     
        console.log('Conectado a base de datos!! ✅');
    });

})