import { useState } from "react";

function EmployeesPage() {
    const [employees, setEmployees] = useState([
        { id: 1, firstName: "Jan", lastName: "Kowalski", position: "Księgacz", fraction: 0.5 },
    ]);

    const handleAdd = () => {
        const newEmployee = {
            id: Date.now(),
            firstName: "New",
            lastName: "Employee",
            position: "Position",
            fraction: 1.0,
        };
        setEmployees([...employees, newEmployee]);
    };

    const handleEdit = (id) => {
        alert(`Edit employee with ID: ${id}`);
    };

    const handleRemove = (id) => {
        setEmployees(employees.filter((e) => e.id !== id));
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#121212",
                color: "#e0e0e0",
                padding: "24px",
            }}
        >
            <h1
                style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    color: "transparent",
                    backgroundImage: "linear-gradient(to right, #00ff88, #0088ff)",
                    WebkitBackgroundClip: "text",
                    marginBottom: "24px",
                    lineHeight: 1.4,
                }}
            >
                Manage employees
            </h1>

            <div
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    backgroundColor: "#1e1e1e",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                    padding: "20px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                    <button
                        onClick={handleAdd}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "12px",
                            border: "none",
                            background: "linear-gradient(to right, #00ff88, #0088ff)",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Add New
                    </button>
                </div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
                        fontSize: "0.9rem",
                        color: "#e0e0e0",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#2a2a2a" }}>
                            <th style={{ padding: "8px", border: "1px solid #333" }}>First Name</th>
                            <th style={{ padding: "8px", border: "1px solid #333" }}>Last Name</th>
                            <th style={{ padding: "8px", border: "1px solid #333" }}>Position</th>
                            <th style={{ padding: "8px", border: "1px solid #333" }}>Fraction</th>
                            <th style={{ padding: "8px", border: "1px solid #333" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} style={{ backgroundColor: "#252525" }}>
                                <td style={{ padding: "8px", border: "1px solid #333" }}>{emp.firstName}</td>
                                <td style={{ padding: "8px", border: "1px solid #333" }}>{emp.lastName}</td>
                                <td style={{ padding: "8px", border: "1px solid #333" }}>{emp.position}</td>
                                <td style={{ padding: "8px", border: "1px solid #333" }}>{emp.fraction}</td>
                                <td style={{ padding: "8px", border: "1px solid #333" }}>
                                    <button
                                        onClick={() => handleEdit(emp.id)}
                                        style={{
                                            marginRight: "8px",
                                            padding: "6px 12px",
                                            borderRadius: "12px",
                                            border: "none",
                                            background: "linear-gradient(to right, #0088ff, #00ff88)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleRemove(emp.id)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "12px",
                                            border: "none",
                                            background: "linear-gradient(to right, #ff4b4b, #b30000)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeesPage;
