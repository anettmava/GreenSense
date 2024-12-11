import React, { useEffect, useState } from "react"; 
import { Formulario } from "./Formulario";
import Inicio from "./Inicio";
import MisPlantas from "./MisPlantas";
import Monitoreo from "./Monitoreo";
import SplashScreen from "./SplashScreen"; // Pantalla de carga inicial
import NavBar from "./NavBar"; // Barra de navegación horizontal
import "./App.css";

function App() {
  const [registeredUser, setRegisteredUser] = useState(null);
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [wateringStatus, setWateringStatus] = useState("desconocido");
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [selectedPage, setSelectedPage] = useState("inicio"); // Página seleccionada
  const [showSplash, setShowSplash] = useState(true); // Control de la Splash Screen
  const [cameraFeed, setCameraFeed] = useState(null); // Variable para la imagen de la cámara
  
  // Nuevos estados para temperatura y humedad
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  // Función para registrar un nuevo usuario
  const handleRegister = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        setRegisteredUser(data.user);
        setUser(data.user);
        setSelectedPage("inicio");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };

  // Función para iniciar sesión
  const handleLogin = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        alert("Correo o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setPlants([]);
  };

  // Función para obtener plantas
  const fetchPlants = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/plants"); // No es necesario pasar el ID
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      }
    } catch (err) {
      console.error("Error al obtener plantas:", err);
    }
  };

  // Función para agregar plantas
  const addPlant = async (plantData) => {
    try {
      const plantWithUser = { ...plantData, id_usuario: user.id };
      const response = await fetch("http://localhost:3001/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plantWithUser),
      });
      if (response.ok) {
        const data = await response.json();
        setPlants((prevPlants) => [...prevPlants, data.newPlant]);
      }
    } catch (err) {
      console.error("Error al agregar planta:", err);
    }
  };

  // Función para obtener la imagen de la cámara
  const fetchCameraFeed = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/camera");
      if (response.ok) {
        const data = await response.json();
        setCameraFeed(data.image);
      } else {
        setCameraFeed(null); // Si no hay imagen disponible
      }
    } catch (err) {
      console.error("Error al obtener la imagen de la cámara:", err);
    }
  };

  // Función para obtener los datos de monitoreo
  const fetchMonitoringData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/monitoring");
      if (response.ok) {
        const data = await response.json();
        setTemperature(data.temp);
        setHumidity(data.humidity);
        setWateringStatus(data.wateringStatus);
      }
    } catch (err) {
      console.error("Error al obtener los datos de monitoreo:", err);
    }
  };

  // Función para controlar el estado del riego (válvula)
  const controlWatering = async (status) => {
    try {
      const response = await fetch("http://localhost:3001/api/watering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const data = await response.json();
        setWateringStatus(status); // Actualiza el estado de riego en el frontend
        setIsWateringActive(status === "ON");
      } else {
        alert("Error al cambiar el estado del riego");
      }
    } catch (err) {
      console.error("Error al controlar el riego:", err);
    }
  };

  // Efecto para manejar la Splash Screen y cargar datos iniciales
  useEffect(() => {
    // Mostrar Splash Screen durante 2 segundos
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    if (user) {
      fetchPlants();
      fetchCameraFeed(); // Llamar a la función para obtener la imagen de la cámara
      // Llamar a la función para obtener datos de monitoreo
      fetchMonitoringData();
      // Configurar un intervalo para actualizar los datos de monitoreo cada 10 segundos
      const interval = setInterval(() => {
        fetchMonitoringData();
      }, 10000); // Actualiza cada 10 segundos

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }

    return () => clearTimeout(splashTimeout);
  }, [user]);

  const renderPage = () => {
    switch (selectedPage) {
      case "inicio":
        return (
          <Inicio
            user={user}
            handleLogout={handleLogout}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
          />
        );
      case "mis-plantas":
        return <MisPlantas plants={plants} addPlant={addPlant} />;
      case "monitoreo":
        return (
          <Monitoreo
            cameraFeed={cameraFeed} // Pasar la imagen de la cámara a la página de monitoreo
            wateringStatus={wateringStatus}
            temperature={temperature} // Pasar la temperatura a la página de monitoreo
            humidity={humidity} // Pasar la humedad a la página de monitoreo
            controlWatering={controlWatering} // Pasar la función para controlar el riego
            isWateringActive={isWateringActive} // Pasar el estado del riego
          />
        );
      default:
        return <Inicio />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      {user ? (
        <>
          {renderPage()}
          <NavBar selected={selectedPage} onNavigate={setSelectedPage} />
        </>
      ) : (
        <Formulario onRegister={handleRegister} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
