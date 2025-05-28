import { verify } from "argon2";

export const validateUpdateUser = async (user, loggedUserRole, role, data, loggedUserId, userToUpdateId, res) => {
    try {
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }   
        if (loggedUserRole !== "ADMIN" && loggedUserId.toString() !== userToUpdateId) {
            return res.status(403).json({ msg: "No tienes permisos para modificar este usuario" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateUpdateUserTwo = async (newPassword, password, user, data, res) => {
    try {
        if (newPassword) {
            if (!password) {
                return res.status(400).json({ msg: "Debe ingresar su contraseña actual para cambiarla" });
            }

            const match = await verify(user.password, password);
            if (!match) {
                return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
            }
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateDeleteUser = async (user, loggedUserRole, req, res) => {
    try {
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
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateAceptUser = async (user, res) => {
    try {
        if (!user) {
          return res.status(404).json({ msg: "Usuario no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateGetUsers = async (user, res) => {
    try {
        if (!user) {
          return res.status(404).json({ msg: "Usuario no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}