import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;