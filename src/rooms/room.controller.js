import Room from "./room.model.js";
import User from "../users/user.model.js";
import Invoice from "../invoices/invoice.model.js";
import Reservation from "../reservations/reservation.model.js";
import Hotel from "../hotels/hotel.model.js";


export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, price } = req.body;
    const uid = req.uid;

    console.log(" UID recibido:", uid);

    const user = await User.findById(uid);
    console.log(" Usuario encontrado:", user);

    if (!user || user.role !== "HOTEL" || !user.hotel) {
      console.log(" Usuario no autorizado o sin hotel asignado");
      return res.status(403).json({
        success: false,
        message: "Unauthorized to add rooms."
      });
    }

    console.log(" ID del hotel asignado al usuario:", user.hotel);

    const hotel = await Hotel.findById(user.hotel);
    console.log(" Hotel encontrado en la BD:", hotel);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found."
      });
    }

    const currentRoomCount = await Room.countDocuments({ hotel: user.hotel });
    console.log(` Habitaciones actuales: ${currentRoomCount} / ${hotel.roomsAvailable}`);

    if (currentRoomCount >= hotel.roomsAvailable) {
      return res.status(400).json({
        success: false,
        message: `No se pueden agregar más habitaciones. Límite alcanzado (${hotel.roomsAvailable})`
      });
    }

    const newRoom = new Room({
      hotel: user.hotel,
      roomNumber,
      type,
      price
    });

    await newRoom.save();

    console.log(" Habitación guardada:", newRoom);

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      room: newRoom
    });
  } catch (error) {
    console.error(" Error al agregar habitación:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding room",
      error: error.message
    });
  }
};


export const getRoomsByHotelId = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({ hotel: id });
    res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving rooms",
      error: error.message
    });
  }
};

export const getMyHotelRooms = async (req, res) => {
    try {
      const uid = req.uid;
      const user = await User.findById(uid);
  
      if (!user || user.role !== "HOTEL" || !user.hotel) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view hotel rooms."
        });
      }
  
      const hotelId = user.hotel;
  
      const invoices = await Invoice.find({ hotel: hotelId }).populate("reservation");
  
      const now = new Date();
  
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
  
      const rooms = await Room.find({ hotel: hotelId });
  
      res.status(200).json({
        success: true,
        rooms
      });
  
    } catch (error) {
      console.error("Error retrieving your hotel rooms:", error.message);
      res.status(500).json({
        success: false,
        message: "Error retrieving your hotel rooms",
        error: error.message
      });
    }
  };