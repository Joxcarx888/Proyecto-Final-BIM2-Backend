import { response, request } from "express"
import Hotel from "./hotel.model.js"
import Room from "../rooms/room.model.js"
import jwt from "jsonwebtoken"
import { validarGetHotelByName } from "../middlewares/validar-hotel.js"

export const getHotels = async  (req = request, res = response) => {
    try {
        const {limit = 10, since = 0} = req.query
        const query = {state : true}

        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(Number(since))
                .limit(Number(limit))
        ])
        
        res.status(200).json({
            succes: true,
            total,
            hotels
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error obtaining hotels',
            error
        })
    }
}

export const addHotel = async (req, res)=>{
    try {
        const data = req.body
        const hotel = await Hotel.create({ 
            name: data.name,
            address: data.address,
            category: data.category,
            roomsAvailable: data.roomsAvailable,
            amenities: data.amenities,
            priceEvent: data.priceEvent
        })
        
        return res.status(200).json({
            success: true,
            message: "Hotel created successfully",
            hotel
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Hotel creation failed",
            error: e.message
        })
    }
}

export const updateHotel = async (req, res = response)=>{
    try {
        const data = req.body
        const { id } = req.params
        const hotel = await Hotel.findByIdAndUpdate(id, { 
            name: data.name,
            address: data.address,
            category: data.category,
            roomsAvailable: data.roomsAvailable,
            amenities: data.amenities,
            priceEvent: data.priceEvent
        } , {new:true})
        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            hotel
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Hotel update failed",
            error: e.message
        })
    }
}

export const getHotelById = async (req, res = response)=>{
    try {
        const { id } = req.params
    
        const hotel = await Hotel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Hotel found",
            hotel
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Hotel not found",
            error: e.message
        })
    }
}

export const deleteHotel = async (req, res = response)=>{
    try {
        const data = req.body
        const { id } = req.params
        const hotel = await Hotel.findByIdAndUpdate(id, { 
            state:false
        } , {new:true})
        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
            hotel
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Hotel deletion failed",
            error: e.message
        })
    }
}

export const getHotelByName = async (req, res) => {
  try {
    const { name } = req.params;

    const hotel = await Hotel.findOne({ name });
    
    await validarGetHotelByName(hotel, res)
        if(res.headersSent) return

    const rooms = await Room.find({ hotel: hotel._id });

    return res.status(200).json({
      success: true,
      message: "Hotel and rooms found",
      hotel,
      rooms,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error fetching hotel",
      error: e.message,
    });
  }
};