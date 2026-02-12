const cron = require("node-cron");
const Laboratory = require("../../models/Laboratory");
const sendMail = require("./mail");

const startLabCron = () => {
    // Schedule task to run every day at midnight
    cron.schedule("0 0 * * *", async () => {
                try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            // Find pending test requests created 2 or more days ago
            const pendingTests = await Laboratory.find({
                status: "pending",
                createdAt: { $lte: twoDaysAgo },
            }).populate("patient");

            
            for (const test of pendingTests) {
                if (test.patient && test.patient.name) {
                                        // Using the default email as requested by user
                    await sendMail(test.patient.name);
                }
            }
        } catch (error) {
            console.error("Error in Lab Reminder Cron:", error);
        }
    });
};

module.exports = startLabCron;
