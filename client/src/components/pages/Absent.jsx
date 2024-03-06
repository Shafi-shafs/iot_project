import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

function Table4Data() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/table4");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data from table4");
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/table4/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="container">
      <h2>Absent Student Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.name}</td>
              <td>{entry.roll}</td>
              <td>{entry.time}</td>
              <td>
                <Button className="btn btn-danger" onClick={() => deleteEntry(entry._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Table4Data;
