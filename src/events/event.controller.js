import Event from './event.model.js';
import { response } from 'express';

export const createEvent = async (req, res = response) => {
    try {
        const { event, date, time, hotel, precio } = req.body;
        const role = req.usuario.role;
        const newEvent = await Event.create({
            event,
            date,
            time,
            hotel,
            precio, 
            role,
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
        const events = await Event.find({ estado: true });

        return res.status(200).json({ 
            events 
        });
    } catch (error) {
        console.error('Error al obtener eventos:', error);

        return res.status(500).json({
            msg: 'Error al obtener eventos',
            error: error.message,
        });
    }
};

export const listEventsAdmin = async (req, res) => {
    try {
        const { estado } = req.query;
        const filtro = { role: 'ADMIN' };

        if (estado !== undefined) {
            filtro.estado = estado === 'true';
        }

        const events = await Event.find(filtro);

        res.json({
            ok: true,
            events
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al listar los eventos de admin',
            error: error.message
        });
    }
};

export const updateEvent = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { role: userRole } = req.usuario;

        const existingEvent = await Event.findById(id);

        if (!existingEvent || !existingEvent.estado) {
            return res.status(404).json({ 
                msg: 'Evento no encontrado' 
            });
        }

        if (userRole !== 'ADMIN' && req.usuario.role !== existingEvent.role) {
            return res.status(403).json({ 
                msg: 'No tienes permisos para actualizar este evento' 
            });
        }

        const { event, date, time, hotel } = req.body;

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
        const { role: userRole } = req.usuario;

        const event = await Event.findById(id);

        if (!event || !event.estado) {
            return res.status(404).json({ 
                msg: 'Evento no encontrado' 
            });
        }

        if (userRole !== 'ADMIN' && req.usuario.role !== event.role) {
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
