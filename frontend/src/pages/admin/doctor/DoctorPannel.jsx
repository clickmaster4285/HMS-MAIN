import React, { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaPlus, FaUserMd } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { fetchAllDoctors, deleteDoctorById } from "../../../features/doctor/doctorSlice";
import DeleteConfirmationModal from './DeleteDoctor';
import { toast } from "react-toastify";
import { getRoleRoute } from "../../../utils/getRoleRoute"

const statusBadge = (status) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Available"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"}`}
    >
      {status}
    </span>
  );
};

const DoctorList = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [specializationFilter, setSpecializationFilter] = useState(null);
  const [, setViewLoading] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const { doctors, status, error } = useSelector((state) => state.doctor);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter((doc) => {
      const matchesSearch = search.toLowerCase() === "" ||
        doc.user.user_Name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.user.user_Identifier?.toLowerCase().includes(search.toLowerCase()) ||
        doc.user.user_Email?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doctor_Department?.toLowerCase().includes(search.toLowerCase()) ||
        doc.user.user_CNIC?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(doc.doctor_Qualifications) &&
          doc.doctor_Qualifications.some(q => q.toLowerCase().includes(search.toLowerCase()))) ||
        doc.doctor_Specialization?.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment = !departmentFilter ||
        doc.doctor_Department === departmentFilter;

      const matchesSpecialization = !specializationFilter ||
        doc.doctor_Specialization === specializationFilter;

      return matchesSearch && matchesDepartment && matchesSpecialization;
    })
    : [];

  const handleAddDoctor = () => {
    navigate(getRoleRoute('add-doctor'))
  };

  const departmentOptions = [...new Set(doctors?.map(doc => doc.doctor_Department).filter(Boolean))];
  const specializationOptions = [...new Set(doctors?.map(doc => doc.doctor_Specialization).filter(Boolean))];

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg mx-4 my-6">
        Error loading doctors: {error}
      </div>
    );
  }

  return (
    <div className=" ">

      <div className="max-w-9xl mx-auto">
        <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md mb-4">
          {/* Header Section */}
          <div className=" flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <h1 className="text-2xl font-bold ">Doctor Management</h1>
            </div>
            <p className="text-primary-700 font-semibold rounded-md px-3 py-1 bg-white ">{filteredDoctors.length} doctors found</p>
          </div>

          {/* Search and Filter Section */}
          <div className="w-full md:w-auto flex flex-col xl:flex-row  gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <FaSearch className="absolute left-3 top-3.5 text-primary-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border text-primary-700 border-primary-300 bg-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-3 focus:outline-none focus:ring-primary-400 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              {/* Department Filter Dropdown */}
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg bg-white text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <FaFilter />
                    {departmentFilter ? `Dept: ${departmentFilter}` : 'Department'}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none z-100">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setDepartmentFilter(null)}
                            className={`${active ? 'bg-primary-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            All Departments
                          </button>
                        )}
                      </Menu.Item>
                      {departmentOptions.map((dept) => (
                        <Menu.Item key={dept}>
                          {({ active }) => (
                            <button
                              onClick={() => setDepartmentFilter(dept)}
                              className={`${active ? 'bg-primary-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              {dept}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Specialization Filter Dropdown */}
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg bg-white text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <FaFilter />
                    {specializationFilter ? `Spec: ${specializationFilter}` : 'Specialization'}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none z-100">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setSpecializationFilter(null)}
                            className={`${active ? 'bg-primary-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            All Specializations
                          </button>
                        )}
                      </Menu.Item>
                      {specializationOptions.map((spec) => (
                        <Menu.Item key={spec}>
                          {({ active }) => (
                            <button
                              onClick={() => setSpecializationFilter(spec)}
                              className={`${active ? 'bg-primary-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              {spec}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Add Doctor Button */}
              <button
                className="flex items-center gap-2 text-primary-600 bg-white px-4 py-2.5 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={handleAddDoctor}
              >
                <FaPlus /> Add Doctor
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNIC
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualifications
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-primary-50 transition-colors cursor-pointer   {`hover:bg-primary-50 transition-colors cursor-pointer ${viewLoading === doc._id ? 'bg-primary-50' : ''}`}  "
                      role="button"
                      tabIndex={0}
                      aria-label={`View details of Dr. ${doc.doctor_Name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setViewLoading(doc._id);
                          navigate(getRoleRoute(`doctor-details/${doc._id}`));
                        }
                      }}
                      onClick={(e) => {
                        // Only navigate if the click wasn't on a button
                        if (!e.target.closest('button')) {
                          setViewLoading(doc._id);
                          navigate(getRoleRoute(`doctor-details/${doc._id}`));
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 ">
                            <img
                              className="h-10 w-10 rounded-full border object-cover"
                              src={
                                doc.doctor_Image?.filePath
                                  ? `${API_URL}${doc.doctor_Image.filePath}`
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.user?.user_Name || "D")}&background=random`
                              }
                              alt={doc.user?.user_Name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-primary-900 group-hover:text-primary-600">
                              {doc.user?.user_Name}
                            </div>
                            <div className="text-sm text-primary-500">{doc.user?.user_Identifier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary-900">{doc.doctor_Department || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary-900">{doc.user?.user_CNIC || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary-900">{doc.doctor_Specialization || "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary-900">{doc.user?.user_Email}</div>
                        <div className="text-sm text-primary-600">{doc.user?.user_Contact}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-primary-900 max-w-xs truncate">
                          {Array.isArray(doc.doctor_Qualifications)
                            ? doc.doctor_Qualifications.join(", ")
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(doc.doctor_Status || "Available")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              //  e.stopPropagation(); 
                              navigate(`/admin/edit-doctor/${doc._id}`)
                            }}
                            className="text-primary-600 p-1 rounded-md border border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                            title="Edit doctor"
                            aria-label="Edit doctor"
                          >
                            <AiOutlineEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              // e.stopPropagation();
                              setDoctorToDelete(doc);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 p-1 rounded-md border border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                            title="Delete doctor"
                            aria-label="Delete doctor"
                          >
                            <AiOutlineDelete className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FaUserMd className="h-12 w-12 mb-4" />
                        <p className="text-lg font-medium">No doctors found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        <button
                          onClick={handleAddDoctor}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FaPlus className="mr-2" /> Add New Doctor
                        </button>
                      </div>
                    </td>
                  </tr>

                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination would go here */}
        {filteredDoctors.length > 0 && (
          <div className="mt-4 border border-primary-500  flex items-center justify-center px-4 py-3 bg-white border-t-gray-200 rounded-b-lg">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredDoctors.length}</span> of{' '}
              <span className="font-medium">{filteredDoctors.length}</span> results
            </div>
          </div>
        )}
        {showDeleteModal && (
          <DeleteConfirmationModal
            doctor={doctorToDelete}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              try {
                await dispatch(deleteDoctorById(doctorToDelete._id)).unwrap();
                toast.success('Doctor deleted successfully');
                await dispatch(fetchAllDoctors());
                setShowDeleteModal(false);
              } catch (error) {
                toast.error(error.message || 'Failed to delete doctor');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorList;