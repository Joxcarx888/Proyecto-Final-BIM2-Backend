import Event from './event.model.js';
import Hotel from '../hotels/hotel.model.js';
import {validateCreateEvent, validateListEventsAdmin, validateUpdateEvent, validateUpdateEventTwo} from '../middlewares/validar-events.js'
import { response } from 'express';

export const createEvent = async (req, res = response) => {
    try {
        const { event, cronograma, time, hotel } = req.body;
        const user = req.usuario._id;
        const existingEvent = await Event.findOne({
          hotel,
          date: cronograma,
          time,
        });
        
        const hotelData = await Hotel.findById(hotel);

        await validateCreateEvent(existingEvent, hotelData, res)
          if(res.headersSent) return

        const newEvent = await Event.create({
          usuario: user,
          event,
          date: cronograma,
          time,
          hotel,
          precio: hotelData.priceEvent,
        });

        return res.status(201).json({
            msg: 'Evento creado exitosamente',
            event: newEvent,
        });
    } catch (error) {
        console.error('Error al crear evento:', error);

        return res.status(500).json({
            msg: 'Error al crear evento',
            error: error.message,
        });
    }
};



export const getEvents = async (req, res = response) => {
  try {
    const userId = req.usuario._id;

    const events = await Event.find({ usuario: userId, estado: true })
      .populate('hotel', 'name address');

    return res.status(200).json({ 
      events 
    });
  } catch (error) {
    console.error('Error al obtener eventos del usuario:', error);
    return res.status(500).json({
      msg: 'Error al obtener eventos del usuario',
      error: error.message,
    });
  }
};
  
  export const listEventsAdmin = async (req, res) => {
    try {
      const { role, hotel } = req.usuario;
  
      await validateListEventsAdmin(role, res)
        if(res.headersSent) return
  
      const events = await Event.find({ hotel, estado: false })
        .populate('hotel', 'name address');
  
      return res.json({
        msg: 'Eventos inactivos de tu hotel',
        total: events.length,
        events
      });
    } catch (error) {
      console.error('Error al listar eventos inactivos del hotel:', error);
      return res.status(500).json({
        msg: 'Error interno al obtener eventos',
        error: error.message
      });
    }
  };

  export const listAllEvents = async (req, res = response) => {
  try {
    const events = await Event.find()
      .populate('hotel', 'name address'); 

    return res.json({
      msg: 'Lista de todos los eventos',
      total: events.length,
      events
    });
  } catch (error) {
    console.error('Error al listar todos los eventos:', error);
    return res.status(500).json({
      msg: 'Error interno al obtener eventos',
      error: error.message
    });
  }
};

  export const updateEvent = async (req, res = response) => {
  try {
    const { id } = req.params;
    const userId = req.usuario._id;

    const existingEvent = await Event.findById(id);

    await validateUpdateEvent(existingEvent, userId, res)
        if(res.headersSent) return

    const { event, date, time } = req.body;

    existingEvent.event = event ?? existingEvent.event;
    existingEvent.date = date ?? existingEvent.date;
    existingEvent.time = time ?? existingEvent.time;

    await existingEvent.save();

    return res.status(200).json({
      msg: 'Evento actualizado correctamente',
      event: existingEvent,
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);

    return res.status(500).json({
      msg: 'Error al actualizar evento',
      error: error.message,
    });
  }
};



export const deleteEvent = async (req, res = response) => {
  try {
    const { id } = req.params;
    const userId = req.usuario._id;
    const userRole = req.usuario.role;

    const event = await Event.findById(id);

    await validateUpdateEventTwo(event, res)
        if(res.headersSent) return

    await event.deleteOne();

    return res.status(200).json({
      msg: 'Evento eliminado permanentemente',
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);

    return res.status(500).json({
      msg: 'Error al eliminar evento',
      error: error.message,
    });
  }
};

export const listEventsByHotel = async (req, res = response) => {
  try {
    const { id } = req.params; 

    const hotelExists = await Hotel.findById(id);
    if (!hotelExists) {
      return res.status(404).json({
        msg: 'Hotel no encontrado',
      });
    }

    const events = await Event.find({ hotel: id, estado: false })

    return res.status(200).json({
      msg: 'Eventos del hotel',
      total: events.length,
      events,
    });
  } catch (error) {
    console.error('Error al listar eventos por hotel:', error);
    return res.status(500).json({
      msg: 'Error interno al obtener eventos por hotel',
      error: error.message,
    });
  }
};

