import cors from "cors";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";
import sql from "mssql";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";
const ENC_SECRET = process.env.ENC_SECRET || "ACCOUNT_SECRET_32BYTE_KEY_123456";

app.use(cors());
app.use(express.json());

// const dbConfig = {
//   user: "sa",
//   password: "Bsit@321",
//   database: "BSCCSL_New",
//   server: "LION-SERVER",
//   MultipleActiveResultSets: true,
//   options: {
//     trustServerCertificate: true,
//     enableArithAbort: true,
//     instancename: "SQLEXPRESS",
//   },
//   port: 1434,
// };
const dbConfig = {
  user: "sa",
  password: "bsit",
  database: "BSCCSL_New",
  server: "DESKTOP-079RN7B",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: "SQLEXPRESS",
  },
};

let pool;
await sql.connect(dbConfig).then((p) => {
  pool = p;
  console.log("MSSQL connected");
});

function encryptAccountNumber(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENC_SECRET.slice(0, 32)),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

const otpStore = {};

app.post("/auth/send-otp", async (req, res) => {
  const { customerId } = req.body;
  if (!customerId)
    return res.status(400).json({ message: "CustomerId required" });

  const request = pool.request();
  request.input("clientId", sql.VarChar(50), customerId.trim());

  const result = await request.query(`
    SELECT ClienId, CustomerId
    FROM customer
    WHERE LTRIM(RTRIM(ClienId)) = @clientId
  `);

  if (!result.recordset.length)
    return res.status(404).json({ message: "Customer not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[customerId] = { otp, expires: Date.now() + 5 * 60000 };

  res.json({ message: "OTP sent", otp });
});

app.post("/auth/verify-otp", (req, res) => {
  const { customerId, otp } = req.body;
  const record = otpStore[customerId];

  if (!record || record.otp !== otp || Date.now() > record.expires)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  record.verified = true;
  res.json({ message: "OTP verified" });
});

app.post("/auth/login", (req, res) => {
  const token = jwt.sign({ customerId: "08013750" }, JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  const request = pool.request();
  request.input("clientId", sql.VarChar(50), req.user.customerId.trim());

  const result = await request.query(`
    SELECT 
      c.ClienId AS CustomerId,
      pd.FirstName,
      pd.MiddleName,
      pd.LastName,
      pd.DOB AS Dob,
      ca.MobileNo,
      ca.PerMobileNo
    FROM customer c
    LEFT JOIN customerPersonalDetail pd ON c.CustomerId = pd.CustomerId
    LEFT JOIN customerAddress ca ON c.CustomerId = ca.CustomerId
    WHERE LTRIM(RTRIM(c.ClienId)) = @clientId
  `);

  res.json(result.recordset[0]);
});

app.get("/auth/user-products", authMiddleware, async (req, res) => {
  const request = pool.request();
  request.input("clientId", sql.VarChar(50), req.user.customerId.trim());

  const result = await request.query(`
    SELECT
    cp.AccountNumber,
    p.ProductName,
    cp.Balance,
    cp.Status,
    cp.IsActive
    FROM customer c
    INNER JOIN customerProduct cp
        ON c.CustomerId = cp.CustomerId
    INNER JOIN product p
        ON cp.ProductId = p.ProductId
    WHERE LTRIM(RTRIM(c.ClienId)) = @clientId
      AND cp.IsActive = 1
      AND (cp.Status NOT IN (5, 6) OR cp.Status IS NULL);
  `);

  console.log("USER PRODUCTS:", result.recordset);
  const products = result.recordset.map((p) => ({
    ...p,
    encryptedAccount: encryptAccountNumber(p.AccountNumber),
  }));

  res.json({ products });
});

app.get("/auth/transactions", authMiddleware, async (req, res) => {
  try {
    const encryptedAcc = req.query.acc;
    if (!encryptedAcc)
      return res.status(400).json({ message: "Account missing" });

    const accountNumber = Buffer.from(encryptedAcc, "base64").toString("utf-8");

    const request = pool.request();
    request.input("AccountNumber", sql.VarChar(50), accountNumber);

    const result = await request.query(`
      SELECT
    t.TransactionId,
    t.Type,
    t.Amount,
    t.Balance,
    t.Description,
    t.TransactionTime
    FROM Transactions AS t
    INNER JOIN customerProduct AS cp
        ON t.CustomerProductId = cp.CustomerProductId
    WHERE cp.AccountNumber = @AccountNumber
    ORDER BY t.TransactionTime DESC;
    `);
    console.log("TRANSACTIONS:", result.recordset);
    console.log("TRANSACTIONS:", result.rowsAffected);
    res.json({ data: { transactions: result.recordset } });
  } catch (err) {
    console.error("TRANSACTION ERROR:", err);
    res
      .status(500)
      .json({ message: "Transaction fetch failed", error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
