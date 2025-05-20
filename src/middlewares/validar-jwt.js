import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log("UID extraído del token:", uid);  // Verifica que el UID está correctamente extraído
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario no existe en la base de datos"
            });
        }
        if(!usuario.state){
            return res.status(401).json({
                msg: "Token no válido - Usuario con estado: false"
            });
        }

        req.usuario = usuario;  // Esto asegura que req.usuario se asigna correctamente
        req.uid = uid;  // Aquí estamos asignando el UID correctamente
        console.log("UID asignado en req:", req.uid);  // Verifica si se asigna correctamente
        req.usuario = usuario
        next()
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no válido"
        });
    }
};

