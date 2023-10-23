const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 8000;

const url = process.env.MONGO_URI;

const client = new MongoClient(url);

app.get("/", async (req, res) => {
  try {
    const db = client.db("ListaDeTareas");
    const collection = db.collection("Tareas");
    const document = await collection.find().toArray();
    client.close();
    res.json(document);
  } catch (error) {
    console.log("ocurrio un error en tu conexion ", error);
  }
});

app.post("/", async (req, res) => {
  const newUser = {
    nameTask: "Informe mensual",
    description: "Preparar el informe mensual de los trabajos realizados",
    isCompleted: false,
    priority: "alta",
    category: "Trabajo",
  };
  try {
    await client.connect();
    const db = client.db("ListaDeTareas");
    const collection = db.collection("Tareas");
    const document = await collection.insertOne(newUser);
    client.close();
    res
      .status(200)
      .json({ Msj: "El documento se creo correctamente", document });
  } catch (error) {
    console.log("ocurrio un error en tu conexion ", error);
  }
});

app.put("/:id", async (req, res) => {
  const update = {
    $set: {
      nameTask: "Mantenimiento",
      description: "Llevar el carro para cambio de aceite",
      isCompleted: true,
      priority: "alta",
      category: "personal",
    },
  };
  try {
    const documentId = req.params.id;
    const objectId = new ObjectId(documentId);
    await client.connect();
    const db = client.db("ListaDeTareas");
    const collection = db.collection("Tareas");
    const document = await collection.updateOne({ _id: objectId }, update);
    client.close();
    res
      .status(200)
      .json({ Msj: "El documento se actualizo correctamente", document });
  } catch (error) {
    console.log("Error en la conexion", error);
  }
  res.status(500).send("Error interno en el servidor");
});

app.delete("/:id", async (req, res) => {
  try {
    const documentId = req.params.id;
    const objectId = new ObjectId(documentId);
    await client.connect();
    const db = client.db("ListaDeTareas");
    const collection = db.collection("Tareas");
    const document = await collection.deleteOne({ _id: objectId });
    client.close();
    res
      .status(200)
      .json({ Msj: "El documento se elimino correctamente", document });
  } catch (error) {
    console.log("erro en el servidor", error);
  }
  res.status(500).send("Error interno en el servidor");
});

app.listen(port, () => {
  console.log("servidor corriendo en el ", port);
});
