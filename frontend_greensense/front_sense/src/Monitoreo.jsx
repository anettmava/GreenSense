import React, { useState, useEffect } from "react";
import mqtt from "mqtt"; // Importar MQTT para recibir las imágenes
import "./Monitoreo.css";

function Monitoreo({ temperature, humidity, wateringStatus, cameraFeed }) {
  console.log("Props recibidos - Temperatura:", temperature, "Humedad:", humidity);

  const [localTemp, setLocalTemp] = useState(temperature);
  const [localHumidity, setLocalHumidity] = useState(humidity);
  const [localWateringStatus, setLocalWateringStatus] = useState(wateringStatus);
  const [cameraImage, setCameraImage] = useState(cameraFeed);

  // Dirección del broker MQTT
  const brokerURL = "ws://172.20.10.4:9001"; // Reemplaza por tu broker MQTT

  // Sincronizar los props con los estados locales cuando cambian
  useEffect(() => {
    setLocalTemp(temperature);
    setLocalHumidity(humidity);
    setLocalWateringStatus(wateringStatus);
    setCameraImage(cameraFeed);
  }, [temperature, humidity, wateringStatus, cameraFeed]);

  // Conexión al broker MQTT
  useEffect(() => {
    const client = mqtt.connect(brokerURL);

    client.on("connect", () => {
      console.log("Conectado al broker MQTT");

      // Suscripciones
      client.subscribe("home/camera/equipo1/feed", (err) => {
        if (err) console.error("Error al suscribirse al feed de la cámara:", err);
        else console.log("Suscrito al feed de la cámara");
      });

      client.subscribe("home/temperature/data/equipo1", (err) => {
        if (err) console.error("Error al suscribirse al tema de temperatura:", err);
        else console.log("Suscrito al tema de temperatura");
      });

      client.subscribe("valvula/control/equipo1", (err) => {
        if (err) console.error("Error al suscribirse al tema de riego:", err);
        else console.log("Suscrito al tema de riego");
      });
    });

    client.on("message", (topic, message) => {
      console.log("Mensaje recibido:", topic, message.toString());

      try {
        if (topic === "home/camera/equipo1/feed") {
          setCameraImage(`data:image/jpeg;base64,${message.toString()}`);
        } else if (topic === "home/temperature/data/equipo1") {
          const data = JSON.parse(message.toString());
          const temp = data.temperature;
          const hum = data.humidity;

          if (temp >= -10 && temp <= 50) {
            setLocalTemp(temp);
          } else {
            console.warn("Temperatura fuera de rango:", temp);
          }

          if (hum >= 0 && hum <= 100) {
            setLocalHumidity(hum);
          } else {
            console.warn("Humedad fuera de rango:", hum);
          }
        } else if (topic === "valvula/control/equipo1") {
          setLocalWateringStatus(message.toString());
        }
      } catch (error) {
        console.error("Error al procesar el mensaje MQTT:", error);
      }
    });

    client.on("error", (err) => {
      console.error("Error de conexión MQTT:", err);
    });

    client.on("reconnect", () => {
      console.log("Reconectando al broker MQTT...");
    });

    return () => {
      client.end();
    };
  }, [brokerURL]);

  // Función para controlar el estado de riego
  const toggleWatering = async () => {
    const newStatus = localWateringStatus === "ON" ? "OFF" : "ON";
    try {
      const response = await fetch("http://localhost:3001/api/watering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setLocalWateringStatus(newStatus);
      }
    } catch (error) {
      console.error("Error al cambiar el estado del riego:", error);
    }
  };

  return (
    <div className="monitoreo">
      <h1>Monitoreo de Plantas</h1>

      {/* Mostrar datos de sensores */}
      <div className="sensor-data">
        <p>Temperatura: {localTemp ? `${localTemp}°C` : "Cargando..."}</p>
        <p>Humedad: {localHumidity ? `${localHumidity}%` : "Cargando..."}</p>
        <p>Estado del riego: {localWateringStatus || "Desconocido"}</p>
      </div>

      {/* Mostrar el feed de la cámara */}
      <div className="camera-section">
        {cameraImage ? (
          <div className="camera-feed">
            <img src={cameraImage} alt="Cámara en vivo" />
          </div>
        ) : (
          <p>Esperando feed de la cámara...</p>
        )}
      </div>

      {/* Botón de riego */}
      <button
        onClick={toggleWatering}
        className={`irrigation-btn ${localWateringStatus === "ON" ? "on" : "off"}`}
      >
        {localWateringStatus === "ON" ? "Desactivar Riego" : "Activar Riego"}
      </button>
    </div>
  );
}

export default Monitoreo;
