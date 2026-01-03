import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import sql from "mssql";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";
const ENC_SECRET = process.env.ENC_SECRET || "ACCOUNT_SECRET_32BYTE_KEY_123456";

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
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
  AND (cp.Status NOT IN (5, 6) OR cp.Status IS NULL)
ORDER BY
CASE
    -- Savings
    WHEN p.ProductName IN (
        'Saving Account','Super Saving','Smart Saving Plus',
        'FLEXI DAILY ACCOUNT','FLEXI DAILY SAVING ACCOUNT',
        'SCHY-DMND-SAVING','SCHY-GOLD-SAVING','SCHY-SLVR-SAVING'
    ) THEN 1

    -- RD
    WHEN p.ProductName IN (
        'Recurring Deposit','RD101','SFR-RD',
        'SCHY-DMND-RD','SCHY-GOLD-RD','SCHY-SLVR-RD'
    ) THEN 2

    -- FD
    WHEN p.ProductName IN (
        'FIX DEPOSIT','SFR-FD','SFC-FD','SFW-FD',
        'SMART PLUS FD','SCHY-DMND-FD','SCHY-GOLD-FD','SCHY-SLVR-FD'
    ) THEN 3

    -- Capital Builder
    WHEN p.ProductName IN (
        'Capital Builder 60','Capital Builder 72','Capital Builder 84'
    ) THEN 4

    -- Wealth Creator
    WHEN p.ProductName IN (
        'Wealth Creator 24','Wealth Creator 30',
        'Wealth Creator 36','Wealth Creator 48','SFW-WC'
    ) THEN 5

    -- MIS / Schemes
    WHEN p.ProductName IN (
        'MIS','Silver 20','Silver 25',
        'Akshaya Tritiya','Dhan Vruddhi Yojana'
    ) THEN 6

    -- Loans
    WHEN p.ProductName IN (
        'Personal Loan','Education Loan','Vehicle Loan',
        'Business Loan','Gold Loan','Group Loan',
        'Consumer Loan','Flexi Loan'
    ) THEN 7

    ELSE 99
  END;
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
