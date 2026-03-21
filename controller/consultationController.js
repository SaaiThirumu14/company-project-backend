const Consultation = require("../models/Consultation");
const Appointment = require("../models/Appointment");

// Record Consultation (Vitals + Chief Complaint)
exports.recordConsultation = async (req, res) => {
    try {
        const { patientId, appointmentId, doctor, vitals, chiefComplaint, diagnosis, notes, prescriptionId, status } = req.body;

        // Check if there's already a pending consultation for this patient today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let consultation = await Consultation.findOne({
            patient: patientId,
            status: 'pending',
            createdAt: { $gte: today, $lt: tomorrow }
        });

        if (consultation) {
            // Update existing pending consultation
            consultation.vitals = vitals || consultation.vitals;
            consultation.chiefComplaint = chiefComplaint || consultation.chiefComplaint;
            if (doctor) consultation.doctor = doctor;
            if (diagnosis) consultation.diagnosis = diagnosis;
            if (notes) consultation.notes = notes;
            if (prescriptionId) consultation.prescription = prescriptionId;
            if (status) consultation.status = status;
            await consultation.save();
        } else {
            // Create new consultation
            consultation = await Consultation.create({
                patient: patientId,
                appointmentId: appointmentId,
                doctor: doctor || (req.user.role === 'doctor' ? req.user.id : null),
                vitals,
                chiefComplaint,
                diagnosis,
                notes,
                prescription: prescriptionId,
                status: status || 'pending'
            });
        }

        // If consultation is completed, update any associated appointment for today
        if (status === 'completed' || (consultation && consultation.status === 'completed')) {
            await Appointment.findOneAndUpdate({
                patient: patientId,
                date: { $gte: today, $lt: tomorrow },
                status: { $ne: 'Cancelled' }
            }, { status: 'Completed' });
        }

        res.status(consultation.isNew ? 201 : 200).json(consultation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Pending Consultations (for Doctor Queue)
exports.getPendingConsultations = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const consultationQuery = { status: "pending" };
        const appointmentQuery = {
            status: { $in: ["Confirmed", "Completed"] },
            date: { $gte: today, $lt: tomorrow }
        };

        // If doctor, only show patients assigned to them
        if (req.user.role === 'doctor') {
            consultationQuery.doctor = req.user.id;
            appointmentQuery.doctor = req.user.id;
        }

        const [consultations, appointments, allConsultationsForToday] = await Promise.all([
            Consultation.find(consultationQuery).populate('patient'),
            Appointment.find(appointmentQuery).populate('patient'),
            Consultation.find({ createdAt: { $gte: today, $lt: tomorrow } })
        ]);

        const mergedQueue = [
            ...consultations.map(c => ({
                ...c._doc,
                queueType: 'consultation',
                timeSort: c.createdAt
            })),
            ...appointments.map(a => {
                const hasConsultation = allConsultationsForToday.some(c => 
                    c.patient?.toString() === a.patient?._id.toString()
                );
                if (hasConsultation) return null;

                return {
                    ...a._doc,
                    queueType: 'appointment',
                    timeSort: new Date(a.date.setHours(parseInt(a.time.split(':')[0]), parseInt(a.time.split(':')[1]), 0, 0))
                };
            })
        ].filter(Boolean).sort((a, b) => a.timeSort - b.timeSort);

        res.json(mergedQueue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get History for a Patient
exports.getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await Consultation.find({ patient: patientId })
            .populate('doctor', 'username')
            .populate('prescription')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Consultation (when Doctor adds diagnosis/prescription)
exports.updateConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, notes, prescriptionId } = req.body;

        const consultation = await Consultation.findByIdAndUpdate(id, {
            doctor: req.user.id,
            diagnosis,
            notes,
            prescription: prescriptionId,
            status: 'completed'
        }, { new: true });

        // Update Associated Appointment for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (consultation) {
            await Appointment.findOneAndUpdate({
                patient: consultation.patient,
                date: { $gte: today, $lt: tomorrow },
                status: { $ne: 'Cancelled' }
            }, { status: 'Completed' });
        }

        res.json(consultation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Stats for Doctor
exports.getDoctorStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const queryPending = { status: "pending" };
        if (req.user.role === 'doctor') {
            queryPending.doctor = req.user.id;
        }

        const pendingCount = await Consultation.countDocuments(queryPending);
        const completedToday = await Consultation.countDocuments({
            status: "completed",
            doctor: req.user.id,
            updatedAt: { $gte: today }
        });

        res.json({
            pendingCount,
            completedToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
