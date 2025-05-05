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
            type: String,
            required: [true, "time is required"],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (hh:mm)"],
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