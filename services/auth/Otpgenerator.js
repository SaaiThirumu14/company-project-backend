const otpStore = new Map();

function sendOTPval(identifier) {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(identifier, otp);
    return otp;
}


function verifyOTPval(identifier, otp) {
        const validOtp = otpStore.get(identifier);
    if (validOtp === otp) {
        otpStore.delete(identifier);;
        return true;
    }
    return false;
}

module.exports = { sendOTPval, verifyOTPval };