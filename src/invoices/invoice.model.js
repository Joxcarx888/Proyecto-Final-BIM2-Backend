import { Schema, model } from "mongoose";

const InvoiceSchema = new Schema(
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
    reservation: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: [true, "La reservación es requerida"],
    },
    fechaCancelacion: {
      type: Date,
      required: [true, "La Fecha es requerida"],
    },
    estadoCliente: {
      type: String,
      enum: ["HOSPEDADO", "CANCELADO"],
      required: [true, "El estado del cliente es requerido"],
    },
    diasEstadia: {
      type: Number,
      required: [true, "Los días de estadía son requeridos"],
      min: [1, "Debe haber al menos 1 día de estadía"],
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

export default model("Invoice", InvoiceSchema);
