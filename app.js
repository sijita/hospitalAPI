const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// Create a new doctor
app.post("/register", async (req, res) => {
  let { identification, name, lastName, email, password } = req.body;
  password = await bcrypt.hash(password, 10);
  try {
    const doctor = await prisma.doctor.create({
      data: { identification, name, lastName, email, password },
    });
    return res.json({
      error: false,
      data: {
        id: doctor.id,
        name: doctor.name,
        lastName: doctor.lastName,
        email: doctor.email,
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: { code: error.code, target: error.meta.target },
    });
  }
});

// Login as a doctor
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const doctor = await prisma.doctor.findUnique({
    where: {
      email: email,
    },
  });

  const correctLogin =
    doctor === null ? false : await bcrypt.compare(password, doctor.password);

  if (!correctLogin) {
    return res
      .status(401)
      .json({ error: true, message: "Correo o contraseña incorrectos" });
  }

  res.json({
    error: false,
    message: {
      email: doctor.email,
      name: doctor.name,
      lastName: doctor.lastName,
    },
  });
});

// Get all appointments
app.get("/appointments", async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        select: {
          identification: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  res.json(appointments);
});

// Get a single appointment
app.get("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(id) },
  });
  res.json(appointment);
});

// Create a new appointment
app.post("/appointment", async (req, res) => {
  const { condition, patientId, createdAt } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: { condition, patientId, createdAt },
    });
    return res.json(appointment);
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: { code: error.code, target: error.meta.target },
    });
  }
});

// Update a appointment
app.put("/appointment/:id", async (req, res) => {
  const { id } = req.params;
  const { condition, patientId } = req.body;
  const appointment = await prisma.appointment.update({
    where: { id: Number(id) },
    data: { condition, patientId },
  });
  res.json(appointment);
});

// Delete a appointment
app.delete("/appointment/:id", async (req, res) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.delete({
    where: { id: Number(id) },
  });
  res.json("Eliminado correctamente");
});

// Get all patients
app.get("/patients", async (req, res) => {
  const patients = await prisma.patient.findMany();
  res.json(patients);
});

// Get a single patient
app.get("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const patient = await prisma.patient.findUnique({
    where: { id: Number(id) },
  });
  res.json(patient);
});

// Create a new patient
app.post("/patient", async (req, res) => {
  const { identification, name, lastName, email, phoneNumber } = req.body;
  try {
    const patient = await prisma.patient.create({
      data: { identification, name, lastName, email, phoneNumber },
    });
    return res.json(patient);
  } catch (error) {
    return res.json({
      error: true,
      message: { code: error.code, target: error.meta.target },
    });
  }
});

// Update a patient
app.put("/patient/:id", async (req, res) => {
  const { id } = req.params;
  const { identification, name, lastName, email, phoneNumber } = req.body;
  try {
    const patient = await prisma.patient.update({
      where: { id: Number(id) },
      data: { identification, name, lastName, email, phoneNumber },
    });
    res.json(patient);
  } catch (error) {
    return res.json({
      error: true,
      message: { code: error.code, target: error.meta.target },
    });
  }
});

// Delete a patient
app.delete("/patient/:id", async (req, res) => {
  const { id } = req.params;
  const patient = await prisma.patient.delete({ where: { id: Number(id) } });
  res.json("Eliminado correctamente");
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
