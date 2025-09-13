import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";



function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await api.get("/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err) {
        console.error(err);

        // Handle expired session or not authenticated
        if (
          err.response?.status === 401 &&
          err.response?.data?.message === "Session expired. Please login again."
        ) {
          localStorage.removeItem("token"); // clear invalid token
          alert("Your session has expired. Please login again.");
          navigate("/login");
        } else if (err.response?.status === 401) {
          localStorage.removeItem("token");
          alert("You are not authenticated. Please login.");
          navigate("/login");
        } else {
          setError(err.message);
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center text-primary mb-4"> User Info</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Date of Birth</th>
              </tr>
            </thead>
           
           
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.dob).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
        
        
        
          </table>


        </div>
      </div>
    </div>
  );
}

export default Dashboard;
