import Usuario from "../users/user.model.js";
import { hash, verify } from 'argon2';
export const validateLogin = async (req, res) => {
    try {
        
        const { email, password, username } = req.body;
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;
        
        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });
        
        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }
 
        if(!user.state){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }
 
        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateHotel = async (req, res) => {
    try {
        const { hotel } = req.body;
        if (!hotel) {
          return res.status(400).json({
            message: "El ID del hotel es obligatorio",
          });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}