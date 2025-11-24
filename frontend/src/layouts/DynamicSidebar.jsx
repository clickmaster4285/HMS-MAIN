import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import {
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  LocalHospital as HospitalIcon,
  MeetingRoom as RoomIcon,
  LocalPharmacy as PharmacyIcon,
  CalendarToday as CalendarIcon,
  Schedule as AppointmentsIcon,
  SingleBed as IPDIcon,
  Build as OTIcon,
  AttachMoney as AccountsIcon,
  Inventory as InventoryIcon,
  Science as LabIcon,
  Settings as AdminIcon,
  Logout,
  Settings as SettingsIcon,
  Description as ReportIcon,
  NoteAlt as NotesIcon,
  MedicalInformation as PrescriptionIcon,
  EventNote as PatientRecordIcon,
  PostAdd as NewOpdIcon,
  AssignmentInd as StaffIcon,
  Domain as DepartmentsIcon,
  Medication as MedicineIcon,
  Ballot as StockIcon,
  CalendarMonth as HRDashboardIcon,
  Assignment as TestIcon,
  AssignmentTurnedIn as TestReportIcon,
  Paid as BillingIcon,
  FolderShared as PatientTestIcon,
  Summarize as AllReportsIcon,
  ReceiptLong as BillListIcon,
  AssignmentOutlined as AllTestsIcon,
  ListAlt as AllPatientsIcon,
} from "@mui/icons-material";

const DynamicSidebar = ({ userRole, isOpen, toggleSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const getBasePath = () => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "/admin";
      case "receptionist":
        return "/receptionist";
      case "lab":
        return "/lab";
      case "doctor":
        return "/doctor";
      case "radiology":
        return "/radiology";
      default:
        return "/";
    }
  };

  const basePath = getBasePath();

  const menuConfigurations = {
    admin: [
      {
        name: "Dashboards",
        icon: <DashboardIcon className="text-lg" />,
        links: [{ href: "dashboard", label: "Admin Dashboard" }],
      },

      {
        name: 'Departments',
        icon: <GroupsIcon className="text-lg" />,
        links: [
          { href: 'departments', label: `All Departments` },
        ],
      },
      {
        name: "Doctors Managment",
        icon: <AdminIcon className="text-lg" />,
        links: [{ href: "doctors", label: `All Doctor's` }],
      },
      {
        name: 'Staff Managment',
        icon: <AdminIcon className="text-lg" />,
        links: [
          { href: 'staff', label: `All Staff` },
        ],
      },
      {
        name: 'Lab Managment',
        icon: <AdminIcon className="text-lg" />,
        links: [
          { href: 'test-report', label: `All Lab Tests` },
        ],
      },
      {
        name: 'Patient Managment',
        icon: <AdminIcon className="text-lg" />,
        links: [
          { href: 'OPD/manage', label: `All Patients` },
        ],
      },
      {
        name: 'Finance Managment',
        icon: <AdminIcon className="text-lg" />,
        links: [
          { href: 'opd-finance', label: `OPD` },
          { href: 'ipd-finance', label: `IPD` },
          { href: 'test-billing', label: `Lab` },
          { href: 'RadiologyPennal', label: `Radiology` },
        ],
      },

    ],
    doctor: [
      {
        name: "Dashboard",
        icon: <DashboardIcon className="text-lg" />,
        links: [{ href: "dashboard", label: "Dashboard" }],
      },
      {
        name: "My Appointments",
        icon: <AppointmentsIcon className="text-lg" />,
        links: [
          { href: 'book-appointments', label: 'My Appointments' }
        ]
      },
      {
        name: "Patient Records",
        icon: <PatientRecordIcon className="text-lg" />,
        links: [{ href: "patient-records", label: "Patient Records" }],
      },
      {
        name: "Prescriptions",
        icon: <PrescriptionIcon className="text-lg" />,
        links: [{ href: "prescriptions", label: "Prescriptions" }],
      },
      {
        name: "Reports",
        icon: <ReportIcon className="text-lg" />,
        links: [{ href: "reports", label: "Reports" }],
      },
      {
        name: "Notes / Diagnosis",
        icon: <NotesIcon className="text-lg" />,
        links: [{ href: "notes", label: "Notes / Diagnosis" }],
      },

      {
        name: "Settings",
        icon: <SettingsIcon className="text-lg" />,
        links: [{ href: "settings", label: "Settings" }],
      },

    ],
    receptionist: [
      {
        name: "Dashboards",
        icon: <DashboardIcon className="text-lg" />,
        links: [
          { href: "dashboard", label: "Reception Dashboard" },
        ],
      },
      {
        name: "Wards",
        icon: <RoomIcon className="text-lg" />,
        links: [{ href: "ward-management", label: "Ward Management" }],
      },
      {
        name: "Appointments",
        icon: <AppointmentsIcon className="text-lg" />,
        links: [{ href: "patient-appointment", label: "Appointments" }],
      },
      {
        name: "OPD",
        icon: <HospitalIcon className="text-lg" />,
        links: [
          { href: "opd/newopd", label: "New OPD" },
          { href: "OPD/manage", label: "Manage OPD" },
        ],
      },
      {
        name: "IPD",
        icon: <IPDIcon className="text-lg" />,
        links: [
          { href: "ipd/Admitted", label: "Admission list" },
          { href: "ipd/ssp", label: "SSP Admissions" },
          { href: "ipd/private", label: "Private Admissions" },
        ],
      },
      {
        name: "OT",
        icon: <OTIcon className="text-lg" />,
        links: [{ href: "OTMain", label: "OT Schedule" }],
      },
      {
        name: "Refunds",
        icon: <AccountsIcon className="text-lg" />,
        links: [
          { href: "refunds", label: "Refund Opd" },
          { href: "manage-refunds", label: "All Opd Refunds" }
        ],
      },
      {
        name: "Pharmacy",
        icon: <PharmacyIcon className="text-lg" />,
        links: [
          { href: "Med-list", label: "Medicine List" },
          { href: "prescription-management", label: "Prescription Management" },
          { href: "stock-management", label: "Stock Management" },
        ],
      },
      {
        name: "Inventory",
        icon: <InventoryIcon className="text-lg" />,
        links: [{ href: "inventory", label: "Inventory" }],
      },
      {
        name: "Calendar",
        icon: <CalendarIcon className="text-lg" />,
        links: [{ href: "calendar", label: "Calendar" }],
      },
      {
        name: "Expenses",
        icon: <CalendarIcon className="text-lg" />,
        links: [{ href: "expenses", label: "Expenses" }],
      },
      {
        name: "Summary",
        icon: <NotesIcon className="text-lg" />,
        links: [
          { href: "summary", label: "Summary" },
        ],
      },
    ],
    lab: [
      {
        name: 'Dashboards',
        icon: <DashboardIcon className="text-lg" />,
        links: [{ href: 'dashboard', label: 'Lab Dashboard' }],
      },
      {
        name: 'Test Managment',
        icon: <TestIcon className="text-lg" />,
        links: [
          { href: 'add-test', label: 'Add Test' },
          { href: 'all-tests', label: 'All Test' },
        ],
      },
      {
        name: 'Patient Managment',
        icon: <PatientTestIcon className="text-lg" />,
        links: [
          { href: 'patient-test', label: 'Patients Test' },
          { href: 'all-patients', label: 'All patients' },
        ],
      },
      {
        name: 'Report Managment',
        icon: <TestReportIcon className="text-lg" />,
        links: [
          { href: 'test-report', label: 'Patients Reports' },
          { href: 'critical-reports', label: 'Critical Reports' },
          // { href: "all-reports", label: "All reports" },
        ],
      },
      {
        name: 'Billing Managment',
        icon: <BillingIcon className="text-lg" />,
        links: [{ href: 'test-billing', label: 'Patients Bills' }],
      },
      {
        name: "Expenses",
        icon: <CalendarIcon className="text-lg" />,
        links: [{ href: "expenses", label: "Expenses" }],
      },
      {
        name: 'Ultrasound ',
        icon: <TestReportIcon className="text-lg" />,
        links: [
          { href: 'RadiologyForm', label: 'Ultrasound Test' },
          { href: 'RadiologyPennal', label: 'Ultrasound Report' },
        ],
      },
    ],
    radiology: [
      {
        name: "Ultrasound ",
        icon: <TestReportIcon className="text-lg" />,
        links: [
          { href: "RadiologyPennal", label: "Ultrasound patient" }
        ],
      },
    ],
  };

  const menuItems = (menuConfigurations[userRole?.toLowerCase()] || []).map(
    (menu) => ({
      ...menu,
      links: menu.links.map((link) => ({
        ...link,
        href: `${basePath}/${link.href}`,
      })),
    })
  );

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
    setActiveMenu(menuName);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (submenuName) => {
    setActiveSubMenu(submenuName);
    if (isOpen) toggleSidebar();
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed lg:relative z-30 h-full w-64 bg-primary-600 text-white flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
    >
      <div className="p-4 border-b border-primary-300 flex items-center justify-between">
        <h1 className="text-xl py-1.5 font-semibold">Al-Shahbaz Hospital</h1>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1 rounded-md hover:bg-primary-700 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        {menuItems.map((menu, index) => (
          <div key={index} className="mb-1">
            {menu.links.length === 1 ? (
              <Link
                to={menu.links[0].href}
                onClick={() => handleSubMenuClick(menu.links[0].label)}
                className={`flex items-center px-4 py-3 transition-colors ${activeSubMenu === menu.links[0].label
                  ? "bg-primary-700"
                  : "hover:bg-primary-700"
                  }`}
              >
                <span className="mr-3">{menu.icon}</span>
                <span className="font-medium">{menu.name}</span>
              </Link>
            ) : (
              <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${activeMenu === menu.name
                  ? "bg-primary-700"
                  : "hover:bg-primary-700"
                  }`}
                onClick={() => toggleMenu(menu.name)}
              >
                <div className="flex items-center">
                  <span className="mr-3">{menu.icon}</span>
                  <span className="font-medium">{menu.name}</span>
                </div>
                {menu.links.length > 0 && (
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedMenus[menu.name] ? "rotate-180" : ""
                      }`}
                  />
                )}
              </div>
            )}
            {expandedMenus[menu.name] && menu.links.length > 0 && (
              <div className="pl-9 py-2 space-y-1">
                {menu.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.href}
                    onClick={() => handleSubMenuClick(link.label)}
                    className={`block px-3 py-2 text-sm transition-colors rounded ${activeSubMenu === link.label
                      ? "bg-primary-600 text-white"
                      : "hover:bg-primary-600 text-white"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicSidebar;
