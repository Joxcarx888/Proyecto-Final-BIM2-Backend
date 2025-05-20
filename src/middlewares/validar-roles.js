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
