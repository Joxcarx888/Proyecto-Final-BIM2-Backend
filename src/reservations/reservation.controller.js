import jwt from 'jsonwebtoken';
import Reservation from './reservation.model.js';
import User from '../users/user.model.js';
import Hotel from '../hotels/hotel.model.js';
import Room from '../rooms/room.model.js';

export const listarReservacionesCliente = async (req, res) => {
  try {
    const clientId = req.usuario._id;

    const reservaciones = await Reservation.find({ user: clientId })
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
  
      if (!hotelId) {
        return res.status(400).json({
          success: false,
          message: "Este usuario no tiene hotel asignado",
        });
      }
  
      const reservaciones = await Reservation.find({ hotel: hotelId })
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
    if (!token) {
      return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params; 
    const { roomList } = req.body;

    const currentUser = await User.findById(uid);
    if (!currentUser) {
      return res.status(400).json({
        success: false,
        message: "El usuario no existe en la base de datos.",
      });
    }

    const hotelRequested = await Hotel.findById(id);
    if (!hotelRequested || hotelRequested.state === false) {
      return res.status(400).json({
        success: false,
        message: 'El hotel no existe o está inactivo.',
      });
    }

    const rooms = await Room.find({ _id: { $in: roomList } });
    const habitacionesInvalidas = rooms.filter(r => r.hotel.toString() !== id || !r.available);
    
    if (habitacionesInvalidas.length > 0) {
      const ids = habitacionesInvalidas.map(r => r._id).join(', ');
      return res.status(400).json({
        success: false,
        message: `Las siguientes habitaciones están ocupadas, no existen o no pertenecen al hotel: ${ids}`,
      });
    }

    const validRoomIds = rooms.map(r => r._id.toString());

    const existingReservation = await Reservation.findOne({ user: uid, hotel: id, state: true });

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
    if (!token) {
      return res.status(401).json({ msg: 'No hay token en la peticion' });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { roomList } = req.body;

    const currentUser = await User.findById(uid);
    const checkReservation = await Reservation.findOne({ user: uid, state: true });

    if (!currentUser || !checkReservation) {
      return res.status(400).json({
        success: false,
        message: "No tienes una reservación activa para modificar"
      });
    }

    const reservationRoomIds = checkReservation.roomList.map(id => id.toString());
    const allExist = roomList.every(roomId => reservationRoomIds.includes(roomId));

    if (!allExist) {
      return res.status(400).json({
        success: false,
        message: "Una o más habitaciones no están en tu reservación actual",
        available: reservationRoomIds
      });
    }

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
    if (!token) {
      return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const hotelId = req.params.id;


    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    
    const reservation = await Reservation.findOne({ user: uid, hotel: hotelId, state: true });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "No se encontró una reservación activa para este hotel",
      });
    }

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


