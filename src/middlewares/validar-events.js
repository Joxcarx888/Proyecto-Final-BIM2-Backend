export const validateCreateEvent = async (existingEvent, hotelData, res) => {
    try {
        if (existingEvent) {
            return res.status(400).json({
                msg: 'Ya existe un evento programado en ese hotel para esa fecha y hora.',
            });
        }
        if (!hotelData) {
            return res.status(404).json({
                msg: 'Hotel no encontrado',
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateListEventsAdmin = async (role, res) => {
    try {
        if (role !== 'HOTEL') {
            return res.status(403).json({ msg: 'Acceso denegado. No eres un hotel.' });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateUpdateEvent = async (existingEvent, userId, res) => {
    try {
        if (!existingEvent || !existingEvent.estado) {
          return res.status(404).json({ msg: 'Evento no encontrado' });
        }

        if (existingEvent.usuario.toString() !== userId.toString()) {
          return res.status(403).json({ msg: 'No tienes permiso para editar este evento.' });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateUpdateEventTwo = async (event, res) => {
    try {
        if (!event) {
          return res.status(404).json({ 
            msg: 'Evento no encontrado' 
          });
        }

        if (event.estado === false) {
          return res.status(400).json({ 
            msg: 'No se puede eliminar un evento ya pagado' 
          });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}