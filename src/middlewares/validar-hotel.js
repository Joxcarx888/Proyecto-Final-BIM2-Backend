export const validarGetHotelByName = async (hotel, res) => {
    try {
        if (!hotel) {
          return res.status(404).json({ message: "Hotel not found" });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}