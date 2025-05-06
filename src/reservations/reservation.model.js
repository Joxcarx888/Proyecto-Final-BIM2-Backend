import { Schema, model } from "mongoose";

const ReservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "El hotel es obligatorio"],
    },
<<<<<<< HEAD
    roomList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      }
    ],
=======
    roomList: {
      type: []
    },
>>>>>>> acarrillo-2020412
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Reservation", ReservationSchema);
