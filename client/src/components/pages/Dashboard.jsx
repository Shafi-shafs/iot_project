import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap"; // Import Modal from react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Dashboard.css";
import PercentageCard from "./PercentageCard.js";

function Dashboard() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [alertShown, setAlertShown] = useState({});
  const [countdown, setCountdown] = useState({});
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image

  useEffect(() => {
    fetchData1();
    fetchData2();
    const interval = setInterval(() => {
      fetchData1();
      fetchData2();
    }, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/table1");
      setData1(response.data);
      setLoading1(false);
    } catch (error) {
      setError1("Error fetching data from table1");
      setLoading1(false);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendance");
      setData2(response.data);
      setLoading2(false);
    } catch (error) {
      setError2("Error fetching data from attendance");
      setLoading2(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (Object.values(countdown).some((value) => value > 0)) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = { ...prevCountdown };
          for (const name in newCountdown) {
            if (newCountdown[name] > 0) {
              newCountdown[name]--;
            }
          }
          return newCountdown;
        });
      }, 1000);
    }

    // Stop the timer for entries displaying green tick
    for (const name in countdown) {
      if (countdown[name] === "✔️") {
        setCountdown((prevCountdown) => ({
          ...prevCountdown,
          [name]: 0,
        }));
      }
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  const getStatusIcon = (name) => {
    const matchingEntries = data2.filter((entry) => entry.name === name);

    if (matchingEntries.length === 0) {
      return { icon: "Absent", time: "" };
    }

    const entryCount = matchingEntries.length;

    if (entryCount === 1) {
      // One matching entry
      return {
        icon: "✔️",
        time: matchingEntries[0].time || "",
      };
    }

    const isEvenEntry = entryCount % 2 === 0;

    if (isEvenEntry) {
      // Even entry
      if (!alertShown[name]) {
        // Start countdown from 10 seconds for this entry
        setCountdown((prevCountdown) => ({ ...prevCountdown, [name]: 10 }));
        // Mark the alert as shown for this entry
        setAlertShown((prevAlertShown) => ({
          ...prevAlertShown,
          [name]: true,
        }));
      }
      return {
        icon: countdown[name] > 0 ? countdown[name] : "❌",
        time: matchingEntries.map((entry) => entry.time).join(", "),
      };
    } else {
      // Odd entry
      if (countdown[name] > 0) {
        // Stop the timer countdown and show green tick
        return {
          icon: "✔️",
          time: matchingEntries[0].time || "",
        };
      } else {
        // Timer expired, show red cross
        return {
          icon: "❌",
          time: matchingEntries[0].time || "",
        };
      }
    }
  };

  const toggleStatus = async (name, roll) => {
    try {
      await handleStatusIcon(name, roll);
      const currentTime = new Date().toISOString();
      const existingEntryIndex = data2.findIndex(
        (entry) => entry.name === name
      );
      if (existingEntryIndex !== -1) {
        const newData2 = [...data2];
        newData2.splice(existingEntryIndex, 1);
        setData2(newData2);
      } else {
        const newData2 = [...data2, { name, time: currentTime }];
        setData2(newData2);
      }
      await axios.post("http://localhost:5000/api/attendance", {
        name,
        time: currentTime,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleStatusIcon = async (name, roll) => {
    const statusIcon = getStatusIcon(name).icon;
    const currentTime = new Date().toISOString();
    if (statusIcon === "Absent") {
      await axios.post("http://localhost:5000/api/table3", {
        name,
        roll,
        time: currentTime,
      });
    } else if (statusIcon === "✔️") {
      await axios.post("http://localhost:5000/api/table4", {
        name,
        roll,
        time: currentTime,
      });
    }
  };

  const deleteDuplicateEntry = async (name) => {
    try {
      await axios.post("http://localhost:5000/api/deleteDuplicates", { name });
      await axios.delete("http://localhost:5000/api/table4", {
        params: { name },
      });
      if (typeof fetchData2 === "function") {
        fetchData2();
      }
    } catch (error) {
      console.error("Error deleting duplicate entry:", error);
    }
  };

  const creteDelete = (name) => {
    const statusIcon = getStatusIcon(name).icon;
    if (statusIcon !== "✔️" && statusIcon !== "Absent" && statusIcon !== "❌") {
      return (
        <td>
          <Button className="button" onClick={() => deleteDuplicateEntry(name)}>
            Cancel
          </Button>
        </td>
      );
    } else {
      return null;
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="containerDash">
        <h2 className="mb-3">Welcome...! To Attendance Management System</h2>
        {(loading1 || loading2) && <p>Loading...</p>}
        {(error1 || error2) && <p>{error1 || error2}</p>}
        <div className="table">
          <Table bordered>
            <thead>
              <tr>
                <th>Picture</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Section</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data1.map((entry, index) => (
                <tr key={entry.name}>
                  <td className="sImg">
                    <img
                      src={`http://localhost:5000/${entry.image}`}
                      alt="User"
                      className="uImage"
                      style={{ width: "70px", height: "90px" }}
                      onClick={() => handleImageClick(entry.image)} // Attach onClick handler to the image
                    />
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.roll}</td>
                  <td>{entry.branch}</td>
                  <td>{entry.year}</td>
                  <td>{entry.section}</td>
                  <td>{getStatusIcon(entry.name).time}</td>
                  <td className="status">{getStatusIcon(entry.name).icon}</td>
                  <td>
                    <Button
                      className="button"
                      onClick={() => toggleStatus(entry.name, entry.roll)}
                    >
                      Toggle
                    </Button>
                  </td>
                  {creteDelete(entry.name)}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Modal to display the selected image */}
      <Modal show={showModal} onHide={closeModal} className="custom-modal">
        <Modal.Body>
          <div className="row p-1 justify-content-center">
            <h2><span>Profile Details</span></h2> 
            <div className="col-md-6">
              <div className="card bg-transparent">
                {selectedImage && (
                  <img
                    src={`http://localhost:5000/${selectedImage}`}
                    alt="Selected User"
                    className="uImage"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                )}
                <h3>
                  {selectedImage
                    ? data1.find((entry) => entry.image === selectedImage)?.roll
                    : ""}
                </h3>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="modal-right"
                style={{ marginLeft: "20px", textAlign: "left" }}
              >
                <PercentageCard percentage={75} /> 
                         

              </div>
            </div>
            <div>
                  <h4>Roll No : {selectedImage
                    ? data1.find((entry) => entry.image === selectedImage)?.name: ""} &emsp; Present : 10/7<sub>days</sub></h4>
                  
                </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;
