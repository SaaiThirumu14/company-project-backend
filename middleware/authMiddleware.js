const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
