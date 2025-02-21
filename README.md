#  Greensense: Smart Plant Monitoring and Management System (IoT-Enabled)

This repository contains a **full-stack IoT-enabled system** for monitoring and managing plants in real-time. It integrates sensors, cameras, and an automated irrigation system with a **React frontend** and a **Node.js backend**, using MQTT for real-time communication and **MariaDB** hosted on a Raspberry Pi.

---

## Features

###  General
- **IoT Integration**:
  - Connects with sensors to monitor **temperature, humidity, and irrigation status** in real-time.
  - Live camera feed to observe plants.
  - Remote control for irrigation activation.
- **User Authentication**:
  - Secure registration and login system.
- **Intuitive UI**:
  - User-friendly and responsive design

### Frontend (React)
- **Real-Time IoT Monitoring**:
  - Displays live data from temperature, humidity, and irrigation sensors.
  - Shows live camera feed.
- **Plant Management**:
  - Add, view, and organize plants.
- **Irrigation Control**:
  - Activate or deactivate irrigation with real-time feedback.

### Backend (Node.js)
- **MQTT Integration**:
  - Enables real-time updates for monitoring and irrigation control.
- **IoT Device Communication**:
  - Connects to sensors and actuators via Raspberry Pi.
- **Database Management**:
  - Uses **MariaDB** for scalable data storage.
- **Live Camera Feed Support**:
  - Retrieves and streams real-time images from the camera.
- **Irrigation System Control**:
  - Manages irrigation valves directly from the app.

### IoT Functionalities
- **Sensor Monitoring**:
  - Real-time temperature and humidity tracking.
- **Camera Integration**:
  - Live video stream from the connected camera.
- **Automated Irrigation**:
  - Activate/deactivate valves based on user input or future automation rules.

---

## System Architecture

- **Frontend**: React-based UI.
- **Backend**: Node.js server with MQTT support.
- **Database**: MariaDB hosted on Raspberry Pi.
- **IoT Hardware**:
  - **Sensors**: Temperature and humidity monitoring.
  - **Actuators**: Controls irrigation valves.
  - **Camera**: Captures live video.
  - **Raspberry Pi**: Acts as the central hub for all devices.

---

## Technologies Used

### **Frontend**
- **React**: For dynamic and interactive UI.
- **CSS**: For responsive design.
- **Fetch API**: To communicate with the backend.

### **Backend**
- **Node.js**: For server logic and MQTTcommunication.
- **Express.js**: For handling RESTful routes.
- **MQTT**: For real-time updates.

### **Database**
- **MariaDB**: For efficient and scalable data management.

### **IoT Hardware**
- **Raspberry Pi**: Hosts the database and connects to IoT devices.
- **Sensors**: Collect environmental data.
- **Camera**: Streams real-time video.
- **Actuators**: Control irrigation.

---


## Setup Instructions

### **Prerequisites**
- Node.js installed.
- MariaDB installed and configured on a Raspberry Pi.
- React installed
- IoT hardware (sensors, actuators, camera) connected to a Raspberry Pi.

## Screenshots
![image](https://github.com/user-attachments/assets/7071976f-24c1-49dd-86bb-4bcb33c0430f)
![image](https://github.com/user-attachments/assets/4d320483-4510-4d0b-8224-e3c57f65e490)
![image](https://github.com/user-attachments/assets/fe4b3151-9531-457c-b053-c23a8d41d865)
![image](https://github.com/user-attachments/assets/9a561899-d2af-4414-b3a6-9d3c357c9ed7)
![image](https://github.com/user-attachments/assets/f9b9fbb6-d884-4b21-8fa6-ff3886bbd3bd)





