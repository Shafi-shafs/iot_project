import React, { useState } from "react";
import axios from "axios";

function AddDataForm() {
  // State variables for Table 1
  const [name1, setName1] = useState("");
  const [roll, setRoll] = useState("");
  const [branch1, setBranch1] = useState("");
  const [year1, setYear1] = useState("");
  const [section1, setSection1] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [errorMessage1, setErrorMessage1] = useState("");

  // State variables for Table 2
  const [name2, setName2] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const [errorMessage2, setErrorMessage2] = useState("");

  // Function to handle Table 1 form submission
  const handleSubmitTable1 = async (event) => {
    event.preventDefault();
    setIsLoading1(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name1);
      formData.append("roll", roll);
      formData.append("branch", branch1);
      formData.append("year", year1);
      formData.append("section", section1);

      await axios.post("https://iot-back-8ktl.onrender.com/api/table1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName1("");
      setRoll("");
      setBranch1("");
      setYear1("");
      setSection1("");
      setImage(null);
      setErrorMessage1("");
    } catch (error) {
      setErrorMessage1("Failed to add data. Please try again.");
    } finally {
      setIsLoading1(false);
    }
  };

  // Function to handle Table 2 form submission
  const handleSubmitTable2 = async (event) => {
    event.preventDefault();
    setIsLoading2(true);
    try {
      await axios.post("https://iot-back-8ktl.onrender.com/api/attendance", { name: name2 });

      setName2("");
      setErrorMessage2("");
    } catch (error) {
      setErrorMessage2("Failed to add data. Please try again.");
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <div>
      <h2>Add Data TO Main Database</h2>
      {errorMessage1 && <p className="text-danger">{errorMessage1}</p>}
      <form
        onSubmit={handleSubmitTable1}
        className="mb-3"
        encType="multipart/form-data"
      >
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <label htmlFor="name1" className="col-form-label">
              Name:
            </label>
            <input
              type="text"
              id="name1"
              className="form-control"
              value={name1}
              onChange={(event) => setName1(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="roll" className="col-form-label">
              Roll:
            </label>
            <input
              type="text"
              id="roll"
              className="form-control"
              value={roll}
              onChange={(event) => setRoll(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="branch1" className="col-form-label">
              Branch:
            </label>
            <input
              type="text"
              id="branch1"
              className="form-control"
              value={branch1}
              onChange={(event) => setBranch1(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="year1" className="col-form-label">
              Year:
            </label>
            <input
              type="text"
              id="year1"
              className="form-control"
              value={year1}
              onChange={(event) => setYear1(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="section1" className="col-form-label">
              Section:
            </label>
            <input
              type="text"
              id="section1"
              className="form-control"
              value={section1}
              onChange={(event) => setSection1(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="image" className="col-form-label">
              Image:
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              accept="image/*"
              onChange={(event) => setImage(event.target.files[0])}
            />
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading1}
            >
              {isLoading1 ? "Adding Data..." : "Add Data to Table 1"}
            </button>
          </div>
        </div>
      </form>

      <h2>Add Data To Attendence</h2>
      {errorMessage2 && <p className="text-danger">{errorMessage2}</p>}
      <form onSubmit={handleSubmitTable2} className="mb-3">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <label htmlFor="name2" className="col-form-label">
              Name:
            </label>
            <input
              type="text"
              id="name2"
              className="form-control"
              value={name2}
              onChange={(event) => setName2(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading2}
            >
              {isLoading2 ? "Adding Data..." : "Add Data to Table 2"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDataForm;
