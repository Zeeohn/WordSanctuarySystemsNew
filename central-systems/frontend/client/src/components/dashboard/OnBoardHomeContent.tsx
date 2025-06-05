import AdminDashboardHomeContent from "./AdminDashboardHomeContent";
// import DashboardNavbar from "./DashboardNavbar";
import DashboardWelcomeComponent from "./DashboardWelcomeComponent";

const OnBoardHomeComponent = () => {
  return (

    <div>
    {/* <DashboardNavbar /> */}
    <DashboardWelcomeComponent username={'John'} title={''} />
    <AdminDashboardHomeContent />
  </div>
  
  );
};

export default OnBoardHomeComponent;
