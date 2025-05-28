import Room from '../rooms/room.model.js'

export const validateAddRoom = async (user, res) => {
    try {
      if (!user || user.role !== "HOTEL" || !user.hotel) {
        console.log(" Usuario no autorizado o sin hotel asignado");
        return res.status(403).json({
          success: false,
          message: "Unauthorized to add rooms."
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateAddRoomTwo = async (hotel, res) => {
    try {
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found."
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateAddRoomThree = async (currentRoomCount, hotel, res) => {
    try {
      if (currentRoomCount >= hotel.roomsAvailable) {
        return res.status(400).json({
          success: false,
          message: `No se pueden agregar más habitaciones. Límite alcanzado (${hotel.roomsAvailable})`
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateGgetMyHotelRooms = async (user, res) => {
    try {
      if (!user || user.role !== "HOTEL" || !user.hotel) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view hotel rooms."
        });
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateGgetMyHotelRoomsTwo = async (invoices, now, res) => {
    try {
      for (const invoice of invoices) {
        const { diasEstadia, fechaCancelacion, reservation, estadoCliente } = invoice;
        if (!reservation || !fechaCancelacion) continue;
  
        const fechaInicio = new Date(fechaCancelacion);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + diasEstadia);
  
        const { roomList } = reservation;
  
        if (now >= fechaFin) {
          await Room.updateMany(
            { _id: { $in: roomList }, available: false },
            { $set: { available: true } }
          );
        } else {
          await Room.updateMany(
            { _id: { $in: roomList }, available: true },
            { $set: { available: false } }
          );
  
          if (estadoCliente !== "HOSPEDADO") {
            invoice.estadoCliente = "HOSPEDADO";
            await invoice.save();
          }
        }
      }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}