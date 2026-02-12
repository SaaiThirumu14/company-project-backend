const User = require("../models/User");

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" });
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};