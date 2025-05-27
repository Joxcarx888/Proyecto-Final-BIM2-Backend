import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '', role = 'user', hotel = null) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, role, hotel };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};
