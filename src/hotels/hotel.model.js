import { Schema, model } from "mongoose"
const HotelSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            maxLength: [150, "Cant be overcome 150 characters"]
        },
        category: {
            type: String, 
            required: [true, "Category is required"],
            maxLength: [11, "Cant be overcome 11 characters"]
        },
        roomsAvailable: {
            type: Number
        },
        amenities: {
            type: String
        },
        priceEvent: {
            type: Number,
            required: [true, "Price is required"]
        },
        
        state:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Hotel', HotelSchema)