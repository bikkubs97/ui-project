"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ConfirmationModal from './modal';


interface DashboardData {
  id: string;
  icon: string;
  name: string;
  date: string;
}



export default function Overview() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState('');

  const deleteRow = (id: string) => {
    setDeleteRowId(id);
    setModalOpen(true);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setDeleteRowId('');
  };

  const handleConfirmDelete = () => {
    const updatedData = data.filter((row) => row.id !== deleteRowId);
    setData(updatedData);
    localStorage.setItem("dashboards", JSON.stringify(updatedData));
    setModalOpen(false);
    setDeleteRowId('');
  };

  useEffect(() => {
    const savedDashboardsString = localStorage.getItem("dashboards");
    if (savedDashboardsString) {
      const savedDashboards = JSON.parse(savedDashboardsString);
      setData(savedDashboards);
    }
  }, []);

  const renderIcon = (icon: string) => {
    
    return <img src={icon} alt="Dashboard Icon" width="300" height="250" />
    
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
      {/* Render the confirmation modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
