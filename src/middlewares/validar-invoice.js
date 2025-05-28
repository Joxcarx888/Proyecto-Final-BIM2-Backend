export const validateCreateInvoiceOne = async (diasEstadia, hotelId, res) => {
    try {
        if (!diasEstadia || !hotelId) {
          return res.status(400).json({ message: "Faltan datos obligatorios (diasEstadia y hotelId)" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateCreateInvoiceTwo = async (reservation, res) => {
    try {
        if (!reservation) {
          return res.status(404).json({ message: "No se encontró una reservación activa para el usuario en el hotel indicado" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateGetInvoicesByHotel = async (hotelId, res) => {
    try {
        if (!hotelId) {
          return res.status(400).json({ message: "No tienes un hotel asignado" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateCreateInvoiceEventOne = async (eventId, res) => {
    try {
        if (!eventId) {
          return res.status(400).json({ message: "Falta el ID del evento (eventId)" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateCreateInvoiceEventTwo = async (event, userId, res) => {
  try {
    if (!event) {
      return res.status(404).json({ message: "No se encontró el evento indicado" });
    }

    if (event.usuario.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No tienes permisos para facturar este evento" });
    }

    if (!event.hotel) {
      return res.status(400).json({ message: "El evento no está vinculado a ningún hotel" });
    }
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
      error: e.message
    });
  }
};
