import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TestSuiteEditPage = () => {
  const [suite_name, setSuiteName] = useState("");
  const [suite_code, setSuiteCode] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getTestSuiteById = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/test-suites/${id}`
      );
      setSuiteName(response.data.suite_name);
      setSuiteCode(response.data.suite_code);
      setDescription(response.data.description);
    };
    getTestSuiteById();
  }, [id]);

  const updateTestSuite = async (e) => {
    e.preventDefault();
    await axios.patch(`http://localhost:5000/api/test-suites/${id}`, {
      suite_name: suite_name,
      suite_code: suite_code,
      description: description,
    });
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <form onSubmit={updateTestSuite} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Suite Name</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Suite Name"
              value={suite_name}
              onChange={(e) => setSuiteName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Suite Code</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Suite Code"
              value={suite_code}
              onChange={(e) => setSuiteCode(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Description</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
          >
            UPDATE
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestSuiteEditPage;
