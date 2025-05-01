import jwt from 'jsonwebtoken';

import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: "Usuario no existe en la base de datos"
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: "Token no valido - Usuario con estado: false"
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}

export const tieneRol = (...roles) => {
    return (req, res, next) => {
      if (!req.usuario) {
        return res.status(500).json({
          msg: "Se quiere verificar el rol sin validar el token primero"
        });
      }
  
      if (!roles.includes(req.usuario.role)) {
        return res.status(403).json({
          msg: `Este servicio requiere uno de los siguientes roles: ${roles.join(', ')}`
        });
      }
  
      next();
    };
};
