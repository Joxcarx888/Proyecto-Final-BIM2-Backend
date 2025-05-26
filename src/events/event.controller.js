import Event from './event.model.js';
import Hotel from '../hotels/hotel.model.js';
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

        if (existingEvent) {
            return res.status(400).json({
                msg: 'Ya existe un evento programado en ese hotel para esa fecha y hora.',
            });
        }

        const hotelData = await Hotel.findById(hotel);
        if (!hotelData) {
            return res.status(404).json({
                msg: 'Hotel no encontrado',
            });
        }

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
  
      if (role !== 'HOTEL') {
        return res.status(403).json({ msg: 'Acceso denegado. No eres un hotel.' });
      }
  
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
        const userRole = req.usuario.role;

        const existingEvent = await Event.findById(id);

        if (!existingEvent || !existingEvent.estado) {
            return res.status(404).json({ 
                msg: 'Evento no encontrado' 
            });
        }

        
        if (userRole !== 'ADMIN' && existingEvent.usuario.toString() !== userId.toString()) {
            return res.status(403).json({ 
                msg: 'No tienes permisos para actualizar este evento' 
            });
        }

        const { event, date, time, hotel } = req.body;

        const conflictEvent = await Event.findOne({
            _id: { $ne: id },
            hotel,
            date,
            time,
            estado: true,
        });

        if (conflictEvent) {
            return res.status(400).json({
                msg: 'Ya existe otro evento programado en ese hotel para esa fecha y hora.',
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { event, date, time, hotel },
            { new: true }
        );

        return res.status(200).json({
            msg: 'Evento actualizado correctamente',
            event: updatedEvent,
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

        if (!event || !event.estado) {
            return res.status(404).json({ 
                msg: 'Evento no encontrado' 
            });
        }

        if (userRole !== 'ADMIN' && event.usuario.toString() !== userId.toString()) {
            return res.status(403).json({ 
                msg: 'No tienes permisos para eliminar este evento' 
            });
        }

        event.estado = false;
        await event.save();

        return res.status(200).json({
            msg: 'Evento eliminado correctamente (desactivado)',
            event,
        });
    } catch (error) {
        console.error('Error al eliminar evento:', error);

        return res.status(500).json({
            msg: 'Error al eliminar evento',
            error: error.message,
        });
    }
};

