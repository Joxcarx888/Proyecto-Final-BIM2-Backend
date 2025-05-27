import jwt from 'jsonwebtoken';
import Reservation from './reservation.model.js';
import User from '../users/user.model.js';
import Hotel from '../hotels/hotel.model.js';
import Room from '../rooms/room.model.js';
import { 
  validateAddReservationOne, 
  validateAddReservationTwo, 
  validateDeleteReservationOne, 
  validateDeleteReservationTwo, 
  validateListarReservacionesHotel, 
  validateRemoveRoomsOne, 
  validateRemoveRoomsTwo, 
  validateToken 
} from '../middlewares/validar-reservation.js';

export const listarReservacionesCliente = async (req, res) => {
  try {
    const clientId = req.usuario._id;

    const reservaciones = await Reservation.find({ user: clientId, state: true })
      .populate("hotel", "name") 
      .populate("roomList")      
      .populate("user", "name email");

    res.json({
      success: true,
      reservaciones,
    });
  } catch (error) {
    console.error("Error al obtener reservaciones del cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservaciones del cliente",
    });
  }
};

export const listarReservacionesHotel = async (req, res) => {
    try {
      const hotelId = req.usuario.hotel; 
  
      await validateListarReservacionesHotel(hotelId, res)
        if(res.headersSent) return
  
      const reservaciones = await Reservation.find({ hotel: hotelId, state: false })
      .populate("user", "name email")
      .populate("roomList");

  
      res.json({
        success: true,
        reservaciones,
      });
    } catch (error) {
      console.error("Error al obtener reservaciones del hotel:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las reservaciones del hotel",
      });
    }
};

export const listarTodasReservacionesAdmin = async (req, res) => {
  try {
    const reservaciones = await Reservation.find()
      .populate("user", "name email")
      .populate("hotel", "name")
      .populate("roomList");

    res.json({
      success: true,
      reservaciones,
    });
  } catch (error) {
    console.error("Error al obtener todas las reservaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservaciones",
    });
  }
}

export const addReservation = async (req, res) => {
  try {
    const token = req.header('x-token');
    
    await validateToken(token, res)
        if(res.headersSent) return

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params; 
    const { roomList } = req.body;

    const currentUser = await User.findById(uid);

    const hotelRequested = await Hotel.findById(id);

    const rooms = await Room.find({ _id: { $in: roomList } });
    const habitacionesInvalidas = rooms.filter(r => r.hotel.toString() !== id || !r.available);

    await validateAddReservationOne(currentUser, hotelRequested, habitacionesInvalidas, res)
        if(res.headersSent) return

    const validRoomIds = rooms.map(r => r._id.toString());

    const existingReservation = await Reservation.findOne({ user: uid, hotel: id, state: true });

    await validateAddReservationTwo(existingReservation, validRoomIds, res)
        if(res.headersSent) return
        

    const newReservation = await Reservation.create({
      user: uid,
      hotel: id,
      roomList: validRoomIds,
      state: true,
    });

    return res.status(200).json({
      success: true,
      message: "Reserva creada con éxito.",
      newReservation,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al agregar la reservación.",
    });
  }
};


export const removeRooms = async (req, res) => {
  try {
    const token = req.header('x-token');
    await validateToken(token, res)
        if(res.headersSent) return

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { roomList } = req.body;

    const currentUser = await User.findById(uid);
    const checkReservation = await Reservation.findOne({ user: uid, state: true });

    await validateRemoveRoomsOne(currentUser, checkReservation, res)
        if(res.headersSent) return

    const reservationRoomIds = checkReservation.roomList.map(id => id.toString());
    const allExist = roomList.every(roomId => reservationRoomIds.includes(roomId));

    await validateRemoveRoomsTwo(allExist, reservationRoomIds, res)
        if(res.headersSent) return

    const updatedRoomList = checkReservation.roomList.filter(roomId => !roomList.includes(roomId.toString()));

    checkReservation.roomList = updatedRoomList;
    await checkReservation.save();

    return res.status(200).json({
      success: true,
      message: "Habitaciones eliminadas correctamente de la reservación",
      updateReservation: checkReservation
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar habitaciones",
    });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const token = req.header('x-token');
    await validateToken(token, res)
        if(res.headersSent) return

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const hotelId = req.params.id;

    const user = await User.findById(uid);
    await validateDeleteReservationOne(user, res)
        if(res.headersSent) return

    const reservation = await Reservation.findOne({ user: uid, hotel: hotelId, state: true });

    await validateDeleteReservationTwo(reservation, res)
        if(res.headersSent) return

    reservation.state = false;
    await reservation.save();

    return res.status(200).json({
      success: true,
      message: "Reservación cancelada correctamente",
    });

  } catch (error) {
    console.error("Error al cancelar reservación:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al cancelar reservación",
    });
  }
};