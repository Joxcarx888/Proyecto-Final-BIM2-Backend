import User from '../users/user.model.js';
import Hotel from '../hotels/hotel.model.js';
import Event from '../events/event.model.js';

export const existenteEmail = async (email = '') =>{
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeHotelById = async (id = '') => {
    const existeHotel = await Hotel.findById(id);

    if (!existeHotel) {
        throw new Error(`El hotel con ID ${id} no existe en la base de datos`);
    }
};

export const existenteEvent = async (id = '') => {
    const existeEvent = await Event.findById(id);

    if (!existeEvent) {
        throw new Error(`El evento con ID ${id} no existe en la base de datos`);
    }
}