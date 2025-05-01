import Reservation from '../reservations/reservation.model.js';

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
  };
  
  
