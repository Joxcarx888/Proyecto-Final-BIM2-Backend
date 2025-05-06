<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import Reservation from './reservation.model.js';
import User from '../users/user.model.js';
import Hotel from '../hotels/hotel.model.js';
import Room from '../rooms/room.model.js';
=======
import Reservation from '../reservations/reservation.model.js'
import User from '../users/user.model.js'
import Hotel from '../hotels/hotel.model.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
>>>>>>> acarrillo-2020412

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

<<<<<<< HEAD



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

    const checkReservation = await Reservation.findOne({ user: uid, state: true });

    const hotelRequested = await Hotel.findById(id);
    if (!hotelRequested || hotelRequested.state === false) {
      return res.status(400).json({
        success: false,
        message: 'El hotel no existe o está inactivo.',
      });
    }

    let roomsStateFalse = '';
    let roomsAlreadyInReservation = '';
    let newRoomList = []; 

    if (checkReservation) {
      const existingRoomIds = checkReservation.roomList.map(room => room.toString());

      for (const roomId of roomList) {
        const room = await Room.findById(roomId);
        
        if (!room || room.hotel.toString() !== id) {
          roomsStateFalse += `, ${roomId}`; 
        } else if (!room.available) {
          roomsStateFalse += `, ${roomId}`; 
        } else if (existingRoomIds.includes(roomId)) {
          roomsAlreadyInReservation += `, ${roomId}`; 
        } else {
          newRoomList.push(room._id);
        }
      }

      if (roomsStateFalse || roomsAlreadyInReservation) {
        return res.status(400).json({
          success: false,
          message: [
            roomsStateFalse ? `Habitaciones inválidas o no disponibles: ${roomsStateFalse.slice(2)}` : '',
            roomsAlreadyInReservation ? `Habitaciones ya reservadas: ${roomsAlreadyInReservation.slice(2)}` : ''
          ].filter(Boolean).join(' | ')
        });
      } else {
        checkReservation.roomList.push(...newRoomList);
        const updateReservation = await checkReservation.save();

        return res.status(200).json({
          success: true,
          message: "Reserva actualizada con éxito",
          updateReservation,
        });
      }
    } else {
      for (const roomId of roomList) {
        const room = await Room.findById(roomId);
        if (!room || room.hotel.toString() !== id || !room.available) {
          roomsStateFalse += `, ${roomId}`;
        } else {
          newRoomList.push(room._id);
        }
      }

      if (roomsStateFalse) {
        return res.status(400).json({
          success: false,
          message: `Las siguientes habitaciones están ocupadas, no existen o no pertenecen al hotel: ${roomsStateFalse.slice(2)}`,
        });
      } else {
        const newReservation = await Reservation.create({
          user: uid,
          hotel: id,
          roomList: newRoomList,
        });

        return res.status(200).json({
          success: true,
          message: "Reserva creada con éxito",
          newReservation,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al agregar la reservación",
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


=======
export const addReservation = async (req, res) => {
  try {
    const token = await req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    const { id } = req.params
    const { roomList } = req.body
    
    const currentUser = await User.findById(uid)
    const checkReservation = await Reservation.findOne({user:uid, state:true})
    const hotelRequested = await Hotel.findById(id)
    let hotelsRoomsList = hotelRequested.rooms
    let roomsStateFalse = ''
    let newRoomList = []
    if(hotelRequested.state == false){
      return res.status(400.).json({
        success: false,
        message: 'Your hotel doesnt exist'
      })
    }
    if(currentUser){
      if(!checkReservation || checkReservation.state == false ){
        roomList.map( localRoom => {
          let room = hotelsRoomsList.find(lRomm => lRomm.number == localRoom)
          if(!room || room.state == false){
            roomsStateFalse = roomsStateFalse + `, ${localRoom}`
          } else{
            newRoomList.push(room)
          }
        })
        
        if(roomsStateFalse){
          return res.status(400).json({
            success: false,
            message: `Following one or more rooms are occupied or out of service${roomsStateFalse}`,
          });
        } else{
          roomList.map(localRoom => {
            let room = hotelsRoomsList.find(h => h.number == localRoom)
            if(room){
              room.state = false
            }
          })
          console.log(hotelsRoomsList)
          await Hotel.findByIdAndUpdate(id, {rooms: hotelsRoomsList}, {new:true})
          
          const newReservation = await Reservation.create({
            user: uid,
            hotel: id,
            roomList: newRoomList
          })
          
          res.status(200).json({
            success: true,
            message: "Reservation created successfuly",
            newReservation
          });
        }
      } else{
        const clientsReservation = await Reservation.findOne({user:uid, state:true})
        const clientsRoomReservated = clientsReservation.roomList
        roomList.map( localRoom => {
          let room = hotelsRoomsList.find(lRomm => lRomm.number == localRoom)
          if(!room || room.state == false){
            roomsStateFalse = roomsStateFalse + `, ${localRoom}`
          } else{
            newRoomList.push(room)
          }
        })
        
        if(roomsStateFalse){
          return res.status(400).json({
            success: false,
            message: `Following one or more rooms are occupied or out of service${roomsStateFalse}`,
          });
        } else{
          console.log(clientsReservation)
          clientsRoomReservated.push(...newRoomList)
          console.log(hotelsRoomsList)
          const updateResevation = await Reservation.findByIdAndUpdate(clientsReservation.id,{
            roomList: clientsRoomReservated
          }, {new:true})
          roomList.map(localRoom => {
            let room = hotelsRoomsList.find(h => h.number == localRoom)
            if(room){
              room.state = false
            }
          })
          await Hotel.findByIdAndUpdate(id, {rooms: hotelsRoomsList}, {new:true})
          
          res.status(200).json({
            success: true,
            message: "Reservation updated successfuly",
            updateResevation
          });
        }
      }
    } else{
      res.status(400).json({
        success: false,
        message: "You have to create an account",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding reservations",
    })
  }
}

export const removeRooms = async (req, res) => {
  try {
    const token = await req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    const { id } = req.params
    const { roomList } = req.body
    
    const currentUser = await User.findById(uid)
    const hotelRequested = await Hotel.findById(id)
    let hotelsRoomsList = hotelRequested.rooms
    const checkReservation = await Reservation.findOne({user:uid, state:true})
    let reservationsRooms = checkReservation.roomList

    let newRoomList = []
    if(currentUser){
      if(!checkReservation || checkReservation.state == false ){
        return res.status(400).json({
          success:false,
          message: "You dont have any reservation to make a change to"
        })
      } else{
        let numberList = []
        reservationsRooms.map( localReservatino => {
          numberList.push(localReservatino.number)
        })
        let allExist = roomList.every(roomId => numberList.includes(roomId))
        if(!allExist){
          return res.status(400).json({
            success:false,
            message: "One or more of your rooms of your request dont exist on your reservation",
            available: reservationsRooms
          })
        }
        let reservationsRemaining = []
        newRoomList = numberList.filter(roomId => !roomList.includes(roomId))
        newRoomList.map( localReservation => {
          reservationsRooms.map( localReservationDB =>{
            if(localReservation == localReservationDB.number){
              reservationsRemaining.push(localReservationDB)
            }
          })
        })
        const updateReservation = await Reservation.findByIdAndUpdate(checkReservation.id,{roomList: reservationsRemaining},{ new:true })
        
        roomList.map(localRoom => {
          let room = hotelsRoomsList.find(h => h.number == localRoom)
          if(room){
            room.state = true
          }
        })

        await Hotel.findByIdAndUpdate(checkReservation.hotel, {rooms: hotelsRoomsList},{new:true})

        return res.status(200).json({
          success: true,
          message: "Rooms deleted successfully",
          updateReservation
        })
      }
    } else{
      res.status(400).json({
        success: false,
        message: "You have to create an account",
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing rooms",
    });
  }
}

export const cancelReservation = async () => {
  try {
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing reservation",
    });
  }
}
>>>>>>> acarrillo-2020412
