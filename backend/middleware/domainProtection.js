export const domainProtection = (req, res, next) => {
  const allowedOrigins = [
    "https://www.regreenagro.in",
    "https://regreenagro.in"
  ];

  const origin = req.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    console.log(`❌ Blocked unauthorized origin: ${origin}`);
    return res.status(403).json({ error: "Forbidden: Unauthorized origin" });
  }

  res.header("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
};
