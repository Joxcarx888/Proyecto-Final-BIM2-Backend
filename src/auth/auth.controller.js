import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/generate-jwt.js';
 
export const login = async (req, res) => {
 
    const { email, password, username } = req.body;
 
    try {
       
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
 
        const token = await generarJWT( user.id );
 
        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                username: user.username,
                role: user.role,
                token: token,
            }
        })
 
    } catch (e) {
       
        console.log(e);
 
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}
 
export const register = async (req, res) => {
    try {
        const data = req.body;
 
        const encryptedPassword = await hash (data.password);
 
        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
        })
 
        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });
 
    } catch (error) {
        console.log(error);
    
        return res.status(500).json({
            message: "User registration failed",
            error: error.message 
        });
    }
    
}

export const registerHotelAdmin = async (req, res) => {
    try {
      const { name, username, email, password, hotel } = req.body;
  
      if (!hotel) {
        return res.status(400).json({
          message: "El ID del hotel es obligatorio",
        });
      }
  
      const encryptedPassword = await hash(password);
  
      const user = await Usuario.create({
        name,
        username,
        email,
        password: encryptedPassword,
        role: "HOTEL",
        hotel,
        state: false,
      });
  
      return res.status(201).json({
        message: "Administrador de hotel registrado correctamente (pendiente de activación)",
        userDetails: {
          id: user._id,
          email: user.email,
          role: user.role,
          hotel: user.hotel,
          state: user.estado,
        },
      });
  
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        message: "Fallo al registrar administrador de hotel",
        error: error.message,
      });
    }
  };
  