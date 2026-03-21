const OnlineRequest = require("../models/OnlineRequest");

// CREATE (From n8n external source)
exports.receiveAppointmentRequest = async (req, res) => {
    try {
        const { name, phno, date, time } = req.body;
        if (!name || !date || !time || !phno) {
            return res.status(201).json({status:false, message: "Please provide your name, date and time for appointment booking and Phone Number is also must give all things in a single message" });
        }
        const count = await OnlineRequest.countDocuments();
        const requestId = `REQ-${1000 + count + 1}`;

        const request = await OnlineRequest.create({
            patientName: name,
            patientContact: phno,
            date,
            time,
            requestId,
            status: "Pending"
        });

        res.status(201).json({
            message: "Request received successfully. Data left blank for hospital verification.",
            requestId: request._id,
            appid:requestId,
            status:true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE (Cancel request by phone number)
exports.deleteByPhone = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "There no id on that name please check it" });
        }
        const onlineDelete = await OnlineRequest.deleteMany({ requestId: id, status: "Pending" });

        res.status(200).json({
            message: "Deletion sequence completed across all clinical buffers.",
            onlineRequestsDeleted: onlineDelete.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.viewbyId=async(req,res)=>{
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "There no id on that name please check it" });
        }
        const onlineRequest = await OnlineRequest.find({requestId:id});
        res.status(200).json(onlineRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.updatebyId = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        // ✅ Remove empty fields
        const updates = {};
        for (let key in req.body) {
            if (
                req.body[key] !== "" &&
                req.body[key] !== null &&
                req.body[key] !== undefined
            ) {
                updates[key] = req.body[key];
            }
        }
        console.log(updates);
        // ❗ If nothing to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const onlineRequest = await OnlineRequest.findOneAndUpdate(
            { requestId: id, status: "Pending" },
            updates,
            { new: true, runValidators: true }
        );
        if (!onlineRequest) {
            return res.status(404).json({ message: "No pending request found with this ID" });
        }

        res.status(200).json(onlineRequest);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};