import express from 'express';
import http from 'http';
import { PORT_SERVER } from '../global/enviroments.global';
import path from 'path';

export default class MainServer {

    public static _instance: MainServer;
    
    public app: Express.Application;
    public port: number;
    public httpServer: http.Server;
    
    constructor() {
        this.app = express();
        this.port = PORT_SERVER;

        this.httpServer = new http.Server( this.app );
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private loadPublic() {
        let publicPath = path.resolve( __dirname , '../public' );
        this.app.use( express.static( publicPath ) );
    }

    run( callback: Function ) {
        this.httpServer.listen( this.port, callback() );
        this.loadPublic();
    }

}