const Userschema = require("../models/Userschema");

// FETCH ALL DOCTORS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Userschema.find({ isActive: true }).populate("user_id", "username role");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FETCH DOCTOR BY ID
exports.getUserById = async (req, res) => {
    try {
                const user = await Userschema.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// SEARCH DOCTORS BY SPECIALIZATION
exports.getUsersBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.query;
        const query = { isActive: true };
        if (specialization) {
            query.specializations = { $in: [specialization] };
        }
        const users = await Userschema.find(query).populate("user_id", "username role");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
    try {
        const updated = await Userschema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE USER (AND AUTH)
exports.deleteUser = async (req, res) => {
    try {
        const User = require("../models/User");
        const profile = await Userschema.findById(req.params.id);
        if (profile) {
            await User.findByIdAndDelete(profile.user_id);
            await Userschema.findByIdAndDelete(req.params.id);
        }
        res.json({ message: "Staff record and auth purged successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
