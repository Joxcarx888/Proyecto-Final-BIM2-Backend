export const validateListarReservacionesHotel = async (hotelId, res) => {
    try {
        if (!hotelId) {
          return res.status(400).json({
            success: false,
            message: "Este usuario no tiene hotel asignado",
          });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateToken = async (token, res) => {
    try {
      if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
      }

    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateAddReservationOne = async (currentUser, hotelRequested, habitacionesInvalidas, res) => {
    try {
      if (!currentUser) {
        return res.status(400).json({
          success: false,
          message: "El usuario no existe en la base de datos.",
        });
      }
      if (!hotelRequested || hotelRequested.state === false) {
        return res.status(400).json({
          success: false,
          message: 'El hotel no existe o está inactivo.',
        });
      }

      if (habitacionesInvalidas.length > 0) {
        const ids = habitacionesInvalidas.map(r => r._id).join(', ');
        return res.status(400).json({
          success: false,
          message: `Las siguientes habitaciones están ocupadas, no existen o no pertenecen al hotel: ${ids}`,
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateAddReservationTwo = async (existingReservation, validRoomIds, res) => {
    try {
      if (existingReservation) {
        const existingRoomIds = existingReservation.roomList.map(r => r.toString());
        const newRoomIds = validRoomIds.filter(roomId => !existingRoomIds.includes(roomId));

        if (newRoomIds.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Todas las habitaciones ya están en la reservación.",
          });
        }

        existingReservation.roomList.push(...newRoomIds);
        const updateReservation = await existingReservation.save();

        return res.status(200).json({
          success: true,
          message: "Reserva actualizada con éxito.",
          updateReservation,
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateRemoveRoomsOne = async (currentUser, checkReservation, res) => {
    try {
      if (!currentUser || !checkReservation) {
        return res.status(400).json({
          success: false,
          message: "No tienes una reservación activa para modificar"
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateRemoveRoomsTwo = async (allExist, reservationRoomIds, res) => {
    try {
      if (!allExist) {
        return res.status(400).json({
          success: false,
          message: "Una o más habitaciones no están en tu reservación actual",
          available: reservationRoomIds
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateDeleteReservationOne = async (user, res) => {
    try {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateDeleteReservationTwo = async (reservation, res) => {
    try {
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "No se encontró una reservación activa para este hotel",
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}