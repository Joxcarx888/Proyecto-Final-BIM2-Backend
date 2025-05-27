import Invoice from "./invoice.model.js";
import Reservation from "../reservations/reservation.model.js";
import Event from "../events/event.model.js";
import InvoiceEvent from "./invoiceEvent.model.js";
import Room from "../rooms/room.model.js";
import { validateCreateInvoiceEventOne, validateCreateInvoiceEventTwo, validateCreateInvoiceOne, validateCreateInvoiceTwo, validateGetInvoicesByHotel } from "../middlewares/validar-invoice.js";


export const createInvoice = async (req, res) => {
  try {
    const { diasEstadia, hotelId } = req.body;
  
    await validateCreateInvoiceOne(diasEstadia, hotelId, res)
      if(res.headersSent) return
  
    const userId = req.usuario._id;
  
    const reservation = await Reservation.findOne({ 
      user: userId, 
      hotel: hotelId, 
      state: true 
    })
      .populate("roomList")
      .populate("hotel");
  
    await validateCreateInvoiceTwo(reservation, res)
      if(res.headersSent) return
  
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
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const eventInvoices = await InvoiceEvent.find({ user: userId })
      .populate("event")
      .populate("hotel", "name address")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const invoicesWithType = invoices.map(i => ({ ...i.toObject(), type: 'reservation' }));
    const eventInvoicesWithType = eventInvoices.map(e => ({ ...e.toObject(), type: 'event' }));

    const allInvoices = [...invoicesWithType, ...eventInvoicesWithType];
    allInvoices.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error("Error al obtener facturas del cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

  
export const getInvoicesByHotel = async (req, res) => {
  try {
    const hotelId = req.usuario.hotel;

    await validateGetInvoicesByHotel(hotelId, res)
      if(res.headersSent) return

    const invoices = await Invoice.find({ hotel: hotelId })
      .populate("reservation")
      .populate("hotel", "name address") 
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const eventInvoices = await InvoiceEvent.find({ hotel: hotelId })
      .populate("event")
      .populate("hotel", "name address") 
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const invoicesWithType = invoices.map(i => ({ ...i.toObject(), type: 'reservation' }));
    const eventInvoicesWithType = eventInvoices.map(e => ({ ...e.toObject(), type: 'event' }));

    const allInvoices = [...invoicesWithType, ...eventInvoicesWithType];
    allInvoices.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error("Error al obtener facturas del hotel:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const createInvoiceEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    await validateCreateInvoiceEventOne(eventId, res)
      if(res.headersSent) return

    const userId = req.usuario._id;

    const event = await Event.findOne({
      _id: eventId,
      estado: true 
    }).populate("hotel");
    
    await validateCreateInvoiceEventTwo(event, res)
      if(res.headersSent) return

    const precioEvento = event.precio;
    const total = precioEvento;

    const nuevaFacturaEvento = new InvoiceEvent({
      user: userId,
      hotel: event.hotel._id,
      event: event._id,
      precioEvento,
      total,
      fechaCancelacion: new Date()
    });

    await nuevaFacturaEvento.save();

    event.estado = false;
    await event.save();

    res.status(201).json({
      message: "Factura del evento generada correctamente",
      invoiceEvent: nuevaFacturaEvento,
    });
  } catch (error) {
    console.error("Error al crear factura de evento:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getInvoicesByAdmin = async (req, res) => {
  try {

    const invoices = await Invoice.find()
      .populate("reservation")
      .populate("hotel", "name address")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const eventInvoices = await InvoiceEvent.find()
      .populate("event")
      .populate("hotel", "name address")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const allInvoices = [...invoices, ...eventInvoices];

    allInvoices.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error("Error al obtener facturas para admin:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};