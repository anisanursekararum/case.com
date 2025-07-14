import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const CollapseIcon = ({ open }) =>
  open ? (
    <ChevronDown className="w-4 h-4" />
  ) : (
    <ChevronRight className="w-4 h-4" />
  );

export default function TestSuiteList() {
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
    <div className="p-4 space-y-4">
      <Link
        className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-3 px-5 rounded-lg"
        to="/add"
      >
        Add New
      </Link>
      <Link
        className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-3 px-5 rounded-lg"
        to="/add"
      >
        Export
      </Link>
      {data.map((test_suite) => (
        <SuiteItem
          key={test_suite.suite_name}
          test_suite={test_suite}
          deleteTestSuite={deleteTestSuite}
        />
      ))}
    </div>
  );
}

function SuiteItem({ test_suite, deleteTestSuite }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
      <div
        className="flex justify-between items-center cursor-pointer font-semibold text-lg"
        onClick={() => setOpen(!open)}
      >
        <span>
          [{test_suite.suite_code}] {test_suite.suite_name}
        </span>
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
        <CollapseIcon open={open} />
      </div>
      {open && (
        <div className="mt-2 pl-4 space-y-2">
          {test_suite.modules.map((module) => (
            <ModuleItem key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleItem({ module }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md shadow px-3 py-2">
      <div
        className="flex justify-between items-center cursor-pointer text-base font-medium"
        onClick={() => setOpen(!open)}
      >
        <span>{module.name}</span>
        <CollapseIcon open={open} />
      </div>
      {open && (
        <ul className="mt-2 pl-4 space-y-1 text-sm">
          {module.cases.map((testCase) => (
            <li
              key={testCase.id}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {testCase.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
