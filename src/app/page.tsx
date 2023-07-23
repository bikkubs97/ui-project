"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";

import {
  FaRegSmile,
  FaRegSadTear,
  FaRegGrinSquint,
  FaRegDizzy,
} from "react-icons/fa";

const iconMap = {
  FaRegSmile: FaRegSmile,
  FaRegSadTear: FaRegSadTear,
  FaRegGrinSquint: FaRegGrinSquint,
  FaRegDizzy: FaRegDizzy,
};

export default function Overview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const savedDashboards = JSON.parse(localStorage.getItem("dashboards"));
    if (savedDashboards) {
      setData(savedDashboards);
    }
  }, []);

  const deleteRow = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dashboard?"
    );
    if (!confirmDelete) {
      return;
    }

    const updatedData = data.filter((row) => row.id !== id);
    setData(updatedData);
    localStorage.setItem("dashboards", JSON.stringify(updatedData));
  };

  const renderIcon = (icon) => {
    // Check if the icon string exists in the iconMap
    const IconComponent = iconMap[icon];
    if (IconComponent) {
      // Return the corresponding icon component
      return <IconComponent size={24} color="#0077e6" />;
    } else {
      // Return a default icon if the icon string is not found
      return <FaRegSmile size={24} color="#0077e6" />;
    }
  };

  return (
    <>
      <h1 className="text-4xl text-white bg-blue-900 p-4">
        Welcome to Dashboards!
      </h1>
      <h2 className="text-3xl pt-1 font-light p-4">Overview</h2>
      <div className="flex justify-center align-center h-full">
        <table className="w-3/4 text  border-collapse border border-blue-500 bg-white mx-5">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2 text-blue-800">Icon</th>
              <th className="px-4 py-2 text-blue-800">Dashboard Name</th>
              <th className="px-4 py-2 text-blue-800">Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr className="bg-blue-100 hover:bg-blue-50 " key={row.id}>
                <td className="flex align-center justify-center">
                  {renderIcon(row.icon)}
                </td>
                <td>{row.name}</td>
                <td>{row.date}</td>
                <td>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white rounded-md"
                    onClick={() => deleteRow(row.id)}
                  >
                    Delete
                  </button>
                  
                </td>
                <td>
                  <Link href={`/edit/${row.id}`}> 
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded-md">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/new">
        <button className="mt-10 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md">
          Add New Dashboard
        </button>
      </Link>
    </>
  );
}
