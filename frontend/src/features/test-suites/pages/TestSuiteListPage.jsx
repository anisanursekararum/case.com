import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const TestSuiteListPage = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axios.get("http://localhost:5000/api/test-suites");
    return response.data;
  };

  const { data } = useSWR("test_suites", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const deleteTestSuite = async (testSuiteId) => {
    await axios.delete(`http://localhost:5000/api/test-suites/${testSuiteId}`);
    mutate("test_suites");
  };

  return (
    <div className="flex flex-col mt-5">
      <div className="w-full">
        <Link
          className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-3 px-5 rounded-lg"
          to="/add"
        >
          Add New
        </Link>
        <div className="realtive shadow rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-6 text-center">Suite Name</th>
                <th className="py-3 px-6 text-center">Suite Code</th>
                <th className="py-3 px-6 text-center">Description</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((test_suite, index) => (
                <tr className="bg-white border-b" key={test_suite.id}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-1 text-center">
                    {test_suite.suite_name}
                  </td>
                  <td className="py-3 px-1 text-center">
                    {test_suite.suite_code}
                  </td>
                  <td className="py-3 px-1 text-center">
                    {test_suite.description}
                  </td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`/edit/${test_suite.id}`}
                      className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTestSuite(test_suite.id)}
                      className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                    >
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

export default TestSuiteListPage;
