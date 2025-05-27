import { hash, verify } from 'argon2';
import Usuario from '../users/user.model.js';
import { validateAceptUser, validateDeleteUser, validateUpdateUser, validateUpdateUserTwo } from '../middlewares/validar-user.js';

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedUserId = req.usuario._id;
        const loggedUserRole = req.usuario.role;

        const { password, newPassword, role, ...data } = req.body;

        const userToUpdateId = loggedUserRole === "CLIENT" ? loggedUserId.toString() : id;

        const user = await Usuario.findById(userToUpdateId);
        await validateUpdateUser(user, loggedUserRole, role, data, loggedUserId, userToUpdateId, res)
         if(res.headersSent) return
        data.role = role;

        data.email = user.email;

        await validateUpdateUserTwo(newPassword, password, user, data, res)
         if(res.headersSent) return
        data.password = await hash(newPassword);

        const updatedUser = await Usuario.findByIdAndUpdate(userToUpdateId, data, { new: true });

        return res.status(200).json({
            msg: "Usuario actualizado correctamente",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                role: updatedUser.role,
                email: updatedUser.email,
                state: updatedUser.state
            }
        });

    } catch (error) {
        console.error("Error en updateUser:", error);
        return res.status(500).json({
            msg: "Error al actualizar usuario",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedUserId = req.usuario._id;
        const loggedUserRole = req.usuario.role;

        const userToDeleteId = loggedUserRole === "CLIENT" ? loggedUserId : id;

        const user = await Usuario.findById(userToDeleteId);
        
        await validateDeleteUser(user, loggedUserRole, req, res)
         if(res.headersSent) return

        user.state = false;
        await user.save();

        return res.status(200).json({
            msg: "Usuario desactivado correctamente",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                state: user.state
            }
        });

    } catch (error) {
        console.error("Error en deleteUser:", error);
        return res.status(500).json({
            msg: "Error al desactivar usuario",
            error: error.message
        });
    }
};

export const acceptUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Usuario.findById(id);
    await validateAceptUser(user, res)
         if(res.headersSent) return

    user.state = true;
    await user.save();

    return res.status(200).json({
      msg: "Usuario activado correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        state: user.state
      }
    });

  } catch (error) {
    console.error("Error en acceptUser:", error);
    return res.status(500).json({
      msg: "Error al activar usuario",
      error: error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { state } = req.query; 
    let query = {};

    if (state !== undefined) {
      query.state = state === "true"; 
    }

    const users = await Usuario.find(query)
      .select("-password")
      .populate("hotel", "name");  

    return res.status(200).json({
      msg: "Usuarios obtenidos correctamente",
      total: users.length,
      users
    });

  } catch (error) {
    console.error("Error en getUsers:", error);
    return res.status(500).json({
      msg: "Error al obtener usuarios",
      error: error.message
    });
  }
};

