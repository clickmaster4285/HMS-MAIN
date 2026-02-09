import React from "react";
import TestReport from "./TestReport";
import StatsCard from "./StatsCard";
import Header from "./Header";
const TestReportPage = () => {
  return (
    <div className=" bg-[#f1f5f9] min-h-screen">
      <Header/>
      
      {/* <div className="mt-5">
        <StatsCard/>
      </div> */}
      <TestReport/>
    </div>
  );
};

export default TestReportPage;
