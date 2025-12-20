import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./ot.css"
const OTTable = ({
  operations = [],
  searchTerm = "",
  dateRange = { start: new Date(), end: new Date() }, // Change from selectedDate to dateRange
  visibleFields = {},
  departments = [],
  doctors = [],
  onEdit = () => { },
  onDelete = () => { },
  onReorder = () => { },
  isLoading = false,
  error = null
}) => {
  const navigate = useNavigate();
  const safeOperations = Array.isArray(operations) ? operations : [];

  const filteredData = safeOperations.filter(item => {
    if (!item) return false;
    try {
      const searchTermLower = searchTerm.toLowerCase();
      const patient_Name = item.patient_Details?.patient_Name || '';
      const matchesSearch =
        String(item.patient_MRNo || '').toLowerCase().includes(searchTermLower) ||
        patient_Name.toLowerCase().includes(searchTermLower) ||
        String(item.procedure || '').toLowerCase().includes(searchTermLower);

      // Date range filtering
      const operationDate = item.otInformation?.doctor?.operation_Date
        ? new Date(item.otInformation.doctor.operation_Date)
        : null;
      
      const matchesDate = operationDate 
        ? operationDate >= new Date(dateRange.start) && 
          operationDate <= new Date(dateRange.end)
        : true;

      return matchesSearch && matchesDate;
    } catch (err) {
      console.error('Error filtering operation:', item, err);
      return false;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-primary-100 text-primary-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-primary-100 text-primary-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);  // This calls the parent's handleReorder
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  d&d
                </th>
                {visibleFields.patient_MRNo && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MR No
                  </th>
                )}
                {visibleFields.patient && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                )}
                {visibleFields.department && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                )}
                {visibleFields.procedure && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedure
                  </th>
                )}
                {visibleFields.surgeon && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Surgeon
                  </th>
                )}

                {visibleFields.otTime && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                )}
                {visibleFields.otNumber && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OT
                  </th>
                )}
                {visibleFields.anesthesiaType && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anesthesia
                  </th>
                )}
                {visibleFields.operationName && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation
                  </th>
                )}
                {visibleFields.status && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {visibleFields.totalCost && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                )}
                {visibleFields.paymentStatus && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <Droppable droppableId="operations">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef} className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <Draggable key={item._id || index.toString()} draggableId={item._id || index.toString()} index={index} >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="hover:bg-gray-50"
                          >
                            <td
                              {...provided.dragHandleProps}
                              className="px-2 py-4 cursor-grab"
                            >
                              <div className="flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M8 6h8M8 12h8M8 18h8" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </div>
                            </td>
                            {visibleFields.patient_MRNo && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.patient_MRNo}
                              </td>
                            )}
                            {visibleFields.patient && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.patient_Details?.patient_Name}</div>
                              </td>
                            )}
                            {visibleFields.department && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.department}
                              </td>
                            )}
                            {visibleFields.procedure && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.procedure}</div>
                                <div className="text-xs text-gray-500">
                                  {item.otInformation?.equipment_Details?.slice(0, 2).join(", ")}
                                  {item.otInformation?.equipment_Details?.length > 2 &&
                                    ` +${item.otInformation.equipment_Details.length - 2} more`}
                                </div>
                              </td>
                            )}

                            {visibleFields.surgeon && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.otInformation?.doctor?.seniorSurgeon.join(', ')}</div>
                                {item.otInformation?.doctor?.assistantDoctors?.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                     +{item.otInformation.doctor.assistantDoctors.length} assistant(s)
                                  </div>
                                )}
                              </td>
                            )}

                            {visibleFields.otTime && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.otTime.startTime} - {item.otTime.endTime}
                              </td>
                            )}
                            {visibleFields.otNumber && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                  {item.otNumber}
                                </span>
                              </td>
                            )}
                            {visibleFields.anesthesiaType && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.otInformation?.doctor?.anesthesia_Type}
                              </td>
                            )}
                            {visibleFields.operationName && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.otInformation?.operationName || 'No operation name'}</div>
                                <div className="text-xs text-gray-500">{item.otInformation?.reasonForOperation}</div>
                              </td>
                            )}
                            {visibleFields.status && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
                              </td>
                            )}
                            {visibleFields.totalCost && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                PKR-{item.total_Operation_Cost.toLocaleString()}
                              </td>
                            )}
                            {visibleFields.paymentStatus && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(item.operation_PaymentStatus)}`}>
                                  {item.operation_PaymentStatus}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => navigate(`/receptionist/OTPatientDetails/${item.patient_MRNo}`)}
                                  className="text-yellow-600 p-1 rounded-md border border-yellow-300 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
                                  title="View details"
                                  aria-label="View details"
                                >
                                  <AiOutlineEye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onEdit(item)}
                                  className="text-primary-600 p-1 rounded-md border border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                                  title="Edit operation"
                                  aria-label="Edit operation"
                                >
                                  <AiOutlineEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onDelete(item.patient_MRNo, item.patient_Details?.patient_Name)}
                                  className="text-red-600 p-1 rounded-md border border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                                  title="Delete operation"
                                  aria-label="Delete operation"
                                >
                                  <AiOutlineDelete className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={Object.values(visibleFields).filter(v => v).length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No operations match your search.' : 'No operations scheduled for selected date.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

    </div>
  );
};

OTTable.propTypes = {
  operations: PropTypes.array,
  searchTerm: PropTypes.string,
   departments: PropTypes.array,
  doctors: PropTypes.array,
   dateRange: PropTypes.shape({
    start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }),
  visibleFields: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // Add this
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onReorder: PropTypes.func,
};

OTTable.defaultProps = {
  operations: [],
  searchTerm: "",
   dateRange: { start: new Date(), end: new Date() },
    departments: [],
  doctors: [],
  isLoading: false,
  error: null
};

export default OTTable;