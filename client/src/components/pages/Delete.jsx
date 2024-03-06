import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [table1Data, setTable1Data] = useState([]);
  const [table2Data, setTable2Data] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const table1Response = await axios.get('http://localhost:5000/api/table1');
      const table2Response = await axios.get('http://localhost:5000/api/attendance');
      setTable1Data(table1Response.data.map(entry => ({
        ...entry,
        imageUrl: `http://localhost:5000/${entry.image}` // Correct the concatenation
      })));
      setTable2Data(table2Response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const deleteEntry = async (id, tableName) => {
    try {
      await axios.delete(`http://localhost:5000/api/${tableName}/${id}`);
      // Refetch data after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h2>Table 1</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Image</th> {/* Add Image column */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {table1Data.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.name}</td>
                  <td>{entry.roll}</td>
                  <td><img src={entry.imageUrl} alt="Product" style={{ width: '100px' }} /></td> {/* Display image */}
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteEntry(entry._id, 'table1')}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col">
          <h2>Table 2</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {table2Data.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.name}</td>
                  <td>{entry.time}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteEntry(entry._id, 'attendance')}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
