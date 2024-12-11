import React, { useState } from "react";
import "./MisPlantas.css";

function MisPlantas({ addPlant }) {
  const [nombrePlanta, setNombrePlanta] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [humedadMin, setHumedadMin] = useState("");
  const [humedadMax, setHumedadMax] = useState("");
  const [foto, setFoto] = useState("");
  const [plantas, setPlantas] = useState([]); // Estado para almacenar las plantas
  const [message, setMessage] = useState(""); // Mensaje de éxito o error

  const handleAgregarPlanta = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombrePlanta || !tempMin || !tempMax || !humedadMin || !humedadMax) {
      setMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (parseFloat(tempMin) >= parseFloat(tempMax)) {
      setMessage("La temperatura mínima debe ser menor que la máxima.");
      return;
    }

    if (
      parseFloat(humedadMin) < 0 ||
      parseFloat(humedadMin) > 100 ||
      parseFloat(humedadMax) < 0 ||
      parseFloat(humedadMax) > 100
    ) {
      setMessage("La humedad debe estar entre 0 y 100.");
      return;
    }

    const nuevaPlanta = {
      nombre: nombrePlanta,
      temp_min: parseFloat(tempMin),
      temp_max: parseFloat(tempMax),
      humedad_min: parseFloat(humedadMin),
      humedad_max: parseFloat(humedadMax),
      foto: foto || null, // Si no se proporciona foto, se envía como null
    };

    // Agregar la planta al estado
    setPlantas((prevPlantas) => [...prevPlantas, nuevaPlanta]);
    setMessage("Planta agregada exitosamente.");

    // Limpiar los campos del formulario
    setNombrePlanta("");
    setTempMin("");
    setTempMax("");
    setHumedadMin("");
    setHumedadMax("");
    setFoto("");

    // Opcional: Llamar a la función para guardar en el backend
    if (addPlant) {
      addPlant(nuevaPlanta);
    }
  };

  return (
    <div className="mis-plantas">
      <h1>Mis Plantas</h1>

      {/* Mensaje de éxito o error */}
      {message && <p className={`message ${message.includes("error") ? "error" : "success"}`}>{message}</p>}

      {/* Formulario para agregar plantas */}
      <form onSubmit={handleAgregarPlanta} className="plant-form">
        <input
          type="text"
          placeholder="Nombre de la Planta"
          value={nombrePlanta}
          onChange={(e) => setNombrePlanta(e.target.value)}
        />
        <input
          type="number"
          placeholder="Temperatura Mínima"
          value={tempMin}
          onChange={(e) => setTempMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Temperatura Máxima"
          value={tempMax}
          onChange={(e) => setTempMax(e.target.value)}
        />
        <input
          type="number"
          placeholder="Humedad Mínima"
          value={humedadMin}
          onChange={(e) => setHumedadMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Humedad Máxima"
          value={humedadMax}
          onChange={(e) => setHumedadMax(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL de la Foto de la Planta"
          value={foto}
          onChange={(e) => setFoto(e.target.value)}
        />
        <button type="submit">Agregar Planta</button>
      </form>

      {/* Lista de plantas */}
      <div className="plantas-list">
        {plantas.map((planta, index) => (
          <div key={index} className="planta">
            {planta.foto && <img src={planta.foto} alt={planta.nombre} />}
            <h2>{planta.nombre}</h2>
            <p>Temperatura: {planta.temp_min}°C - {planta.temp_max}°C</p>
            <p>Humedad: {planta.humedad_min}% - {planta.humedad_max}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisPlantas;
