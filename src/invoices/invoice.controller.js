import Invoice from "./invoice.model.js";
import Reservation from "../reservations/reservation.model.js";
import Room from "../rooms/room.model.js";


export const createInvoice = async (req, res) => {
    try {
      const { diasEstadia, hotelId } = req.body;
    
      if (!diasEstadia || !hotelId) {
        return res.status(400).json({ message: "Faltan datos obligatorios (diasEstadia y hotelId)" });
      }
    
      const userId = req.usuario._id;
    
      const reservation = await Reservation.findOne({ 
        user: userId, 
        hotel: hotelId, 
        state: true 
      })
        .populate("roomList")
        .populate("hotel");
    
      if (!reservation) {
        return res.status(404).json({ message: "No se encontró una reservación activa para el usuario en el hotel indicado" });
      }
    
      const totalPorDia = reservation.roomList.reduce((sum, room) => {
        return sum + (room.price || 0);
      }, 0);
    
      const total = totalPorDia * diasEstadia;
    
      for (const room of reservation.roomList) {
        room.available = false;
        await room.save();
      }
    
      reservation.state = false;
      await reservation.save();
    
      const nuevaFactura = new Invoice({
        user: reservation.user._id,
        hotel: reservation.hotel._id,
        reservation: reservation._id,
        fechaCancelacion: new Date(),
        estadoCliente: "CANCELADO",
        diasEstadia,
        total,
      });
    
      await nuevaFactura.save();
    
      res.status(201).json({
        message: "Factura generada correctamente",
        invoice: nuevaFactura,
      });
    
    } catch (error) {
      console.error("Error al crear factura:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  
  

export const getInvoicesByClient = async (req, res) => {
    try {
      const userId = req.uid;
      const invoices = await Invoice.find({ user: userId })
        .populate("reservation")
        .populate("hotel", "name address")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        invoices,
      });
    } catch (error) {
      console.error("Error al obtener facturas del cliente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  export const getInvoicesByHotel = async (req, res) => {
    try {
      const userId = req.uid;
      const hotelId = req.hotel?.toString();
  
      if (!hotelId) {
        return res.status(400).json({ message: "No tienes un hotel asignado" });
      }
  
      const invoices = await Invoice.find({ hotel: hotelId })
        .populate("reservation")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        invoices,
      });
    } catch (error) {
      console.error("Error al obtener facturas del hotel:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  

