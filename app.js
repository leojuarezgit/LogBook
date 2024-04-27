/*----------------------- Importar Express-----------------------*/
const express = require("express");
const app = express();

/*-----------------------Firebase/Firestore--------------------- */
const firebaseAdmin = require("firebase-admin");
const functions = require("firebase-functions")
const serviceAccount = require("./credentials/firebase/subiza-logbook-firebase-adminsdk-6i5c3-e59b4f3da4.json");
// Inicializar Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});
// Obtener una referencia a Firestore
const db = firebaseAdmin.firestore();
/*---------------------------BodyParser-------------------------- */
const bodyParser = require("body-parser");
// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

/*--------------------------Configuracion de Puerto-------------- */
const PORT = 3000;

/*----------------------Creacion de paciente y validaciones-----------------------*/
// Middleware para validar los datos del paciente
const validatePatientData = (req, res, next) => {
  const {
    Name,
    Lastname,
    HealthCareSys,
    HealtCareSysNumber,
    IdCardNr,
    Telephone,
    Address,
    Locality,
    Province,
  } = req.body;
  if (
    !Name ||
    !Lastname ||
    !HealthCareSys ||
    !HealtCareSysNumber ||
    !Telephone ||
    !Address ||
    !Locality ||
    !Province
  ) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Faltan campos obligatorios",
    });
  }
  next();
};


// Controlador de ruta para crear un nuevo paciente
app.post("/CreatePatient", validatePatientData, async (req, res) => {
  try {
    const {
      Name,
      Lastname,
      HealthCareSys,
      HealtCareSysNumber,
      IdCardNr,
      Telephone,
      Address,
      Locality,
      Province,
    } = req.body;

    //si IdCardNr no viene indefinida, le asigno a la variable idCardNr el valor de IdCardNr (notar diferencia entre idCardNr e IdCardNr), si viene indefinida asignarle null
    const idCardNr = typeof IdCardNr !== 'undefined' ? IdCardNr : null;
    
    // Guardar los datos del paciente en Firestore
    const pacienteRef = await db.collection("Patients").add({
      Name,
      Lastname,
      HealthCareSys,
      HealtCareSysNumber,
      IdCardNr: idCardNr,
      Telephone,
      Address,
      Locality,
      Province,
    });

    res.status(201).json({
      success: true,
      code: 201,
      message: "Paciente creado exitosamente",
      data: {
        id: pacienteRef.id,
        Name,
        Lastname,
        HealthCareSys,
        HealtCareSysNumber,
        IdCardNr,
        Telephone,
        Address,
        Locality,
        Province,
      },
    });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({
      success: false,
      code: 500,
      message: "Error al crear paciente en la base de datos",
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});




exports.app = functions.https.onRequest(app);
