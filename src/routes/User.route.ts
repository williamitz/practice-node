import { Request, Response, Router } from 'express';
import { IBodyUser } from '../interfaces/body_user.interface';
import { IResponse } from '../interfaces/response.interface';
import { Address } from '../models/address.model';
import { User } from '../models/user.model';

const UserRoutes = Router();

UserRoutes.get( '/getusers', [], (req: Request, res: Response) => {

    User.find( {}, (err, docs) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            data: docs
        });

    }).populate( 'address', [ 'street', 'state', 'city' ,'country' ,'zip' ], Address );

    
});

UserRoutes.post('/createUsers', [], async(req: Request, res: Response) => {

    let body: IBodyUser = req.body;

    let resVerify = await verifyUser( body.name );

    if (!resVerify.ok) {
        return res.status(400).json({
            ok: false,
            error: resVerify.error,
            showError: 0
        });
    }

    if (resVerify.ok && resVerify.showError !== 0) {
        return res.status(400).json({
            ok: true,
            error: resVerify.error,
            showError: resVerify.showError
        });
    }

    let newAddress = {
        street: body.street,
        state: body.state,
        city: body.city,
        country: body.country,
        zip: body.zip
    };

    Address.create( newAddress, (err, doc) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        let newUser = {
            name: body.name,
            birthDate: body.birthDate,
            address: doc._id
        };

        User.create( newUser , (errUser, docUser) => {

            if (errUser) {
                return res.status(400).json({
                    ok: false,
                    error: errUser
                });
            }

            res.json({
                ok: true,
                data: {
                    address: doc,
                    user: docUser
                },
                showError: resVerify.showError
            });

        });

    });

});

UserRoutes.put('/updateUsersById/:pkUser', [], async(req: Request, res: Response) => {

    let body: IBodyUser = req.body;
    let pkUser = req.params.pkUser;

    // let resVerify = await verifyUser( body.name );

    let setAddress = {
        $set : {
            street: body.street,
            state: body.state,
            city: body.city,
            country: body.country,
            zip: body.zip
        }
    };    

    let setUser = {
        $set: {
            name: body.name,
            birthDate: body.birthDate
        }
    };
    

    User.findById( pkUser, (errVerif: any, docFind: any) => {

        if (errVerif) {
            return res.status(400).json({
                ok: false,
                error: errVerif
            });
        }

        if (!docFind) {
            return res.status(400).json({
                ok: true,
                error: {
                    message: 'User not found'
                },
                showError: 2
            });
        }
    
        User.updateOne( { _id: docFind._id }, setUser , (errUser: any, infoUser: any) => {
    
            if (errUser) {
                return res.status(400).json({
                    ok: false,
                    error: errUser
                });
            }
    
            Address.updateOne( { _id: docFind.address }, setAddress, (err: any, infoAddress: any) => {
    
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }
        
                res.json({
                    ok: true,
                    data: {
                        address: infoAddress,
                        user: infoUser
                    },
                    showError: 0
                });
        
            });
    
        });

    });


});

UserRoutes.delete('/deleteUsersById/:pkUser', [], async(req: Request, res: Response) => {

    let pkUser = req.params.pkUser;

    // let resVerify = await verifyUser( body.name );

    User.findById( pkUser, (errVerif: any, docFind: any) => {

        if (errVerif) {
            return res.status(400).json({
                ok: false,
                error: errVerif
            });
        }

        if (!docFind) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            });
        }

        Address.deleteOne( {_id: docFind.address}, (errUser: any, infoDelUser: any) => {

            if (errUser) {
                return res.status(400).json({
                    ok: false,
                    error: errUser
                });
            }

            User.deleteOne( {_id: docFind._id}, (errAddress: any, infoDelAddress: any) => {
                
                if (errUser) {
                    return res.status(400).json({
                        ok: false,
                        error: errUser
                    });
                }

                res.json({
                    ok: true,
                    data: {
                        infoDelUser,
                        infoDelAddress
                    }
                });

            });

        });

    });

});

function verifyUser( nameUser: string ): Promise<IResponse> {
    return new Promise( (resolve) => {

        User.findOne( { name: nameUser }, (err: any, doc: any) => {
            if (err) {
                resolve({
                    ok: false,
                    error: err,
                    showError: 0
                });
            }
            
            resolve({
                ok: true,
                error: {
                    message: 'Ya existe un usuario con este nombre'
                },
                showError: doc ? 1 : 0
            });

        });
    });
}

export default UserRoutes;