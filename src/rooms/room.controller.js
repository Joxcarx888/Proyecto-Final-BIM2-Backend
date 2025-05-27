import Room from "./room.model.js";
import User from "../users/user.model.js";
import Invoice from "../invoices/invoice.model.js";
import Reservation from "../reservations/reservation.model.js";
import Hotel from "../hotels/hotel.model.js";
import { validateAddRoom, validateAddRoomThree, validateAddRoomTwo, validateGgetMyHotelRooms, validateGgetMyHotelRoomsTwo } from "../middlewares/validar-room.js";


export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, price } = req.body;
    const uid = req.uid;

    console.log(" UID recibido:", uid);

    const user = await User.findById(uid);
    console.log(" Usuario encontrado:", user);

    await validateAddRoom(user, res)
        if(res.headersSent) return

    console.log(" ID del hotel asignado al usuario:", user.hotel);

    const hotel = await Hotel.findById(user.hotel);
    console.log(" Hotel encontrado en la BD:", hotel);

    await validateAddRoomTwo(hotel, res)
        if(res.headersSent) return

    const currentRoomCount = await Room.countDocuments({ hotel: user.hotel });
    console.log(` Habitaciones actuales: ${currentRoomCount} / ${hotel.roomsAvailable}`);

    await validateAddRoomThree(currentRoomCount, hotel, res)
        if(res.headersSent) return

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
  
      await validateGgetMyHotelRooms(user, res)
        if(res.headersSent) return
  
      const hotelId = user.hotel;
  
      const invoices = await Invoice.find({ hotel: hotelId }).populate("reservation");
  
      const now = new Date();
  
      await validateGgetMyHotelRoomsTwo(invoices, now, res)
        if(res.headersSent) return
  
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