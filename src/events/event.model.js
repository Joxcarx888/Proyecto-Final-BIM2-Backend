import { Schema, model } from "mongoose"

const EventSchema = new Schema(
    {
        usuario: {
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        event : {
            type: String,
            required: [true, "Name is required"],
            maxLength: [25, "can't exceed 25 characters"],
            trim: true,
        },
        date : {
            type: Date,
            required : [true, "cronograma is required"],
        },
        time : {
            type : Number,
            required: [true, "time is required"],
        },
        hotel: {
            type: Schema.Types.ObjectId,
            ref: "Hotel",
            default: null,
        },
        precio: {
            type: Number,
            required: [true, "precio is required"]
        },
          estado: {
            type: Boolean,
            default: true,
        },
    }
);
  
export default model("Event", EventSchema);