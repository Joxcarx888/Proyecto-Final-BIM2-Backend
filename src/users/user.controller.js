import { hash, verify } from 'argon2';
import Usuario from '../users/user.model.js';

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedUserId = req.usuario._id;
        const loggedUserRole = req.usuario.role;

        const { password, newPassword, role, ...data } = req.body;

        const userToUpdateId = loggedUserRole === "CLIENT" ? loggedUserId.toString() : id;

        const user = await Usuario.findById(userToUpdateId);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (loggedUserRole === "ADMIN" && role) {
            data.role = role;
        } else if (loggedUserRole !== "ADMIN" && loggedUserId.toString() !== userToUpdateId) {
            return res.status(403).json({ msg: "No tienes permisos para modificar este usuario" });
        }

        data.email = user.email;

        if (newPassword) {
            if (!password) {
                return res.status(400).json({ msg: "Debe ingresar su contraseña actual para cambiarla" });
            }

            const match = await verify(user.password, password);
            if (!match) {
                return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
            }

            data.password = await hash(newPassword);
        }

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
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (loggedUserRole === "CLIENT") {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ msg: "Debe ingresar su contraseña para desactivar su cuenta" });
            }

            const match = await verify(user.password, password);
            if (!match) {
                return res.status(400).json({ msg: "La contraseña es incorrecta" });
            }
        }

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
