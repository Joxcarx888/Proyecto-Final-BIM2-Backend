import { Schema, model } from "mongoose";

const InvoiceEventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es requerido"],
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "El hotel es requerido"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "El evento es requerido"],
    },
    fechaCancelacion: {
      type: Date,
      default: null,
    },
    precioEvento: {
      type: Number,
      required: [true, "El precio del evento es requerido"],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("InvoiceEvent", InvoiceEventSchema);
