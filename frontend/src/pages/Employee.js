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
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-semibold mb-6">Manage employees</h1>

            <div className="w-full max-w-4xl bg-white p-4 border border-gray-300 rounded-xl shadow-sm">
                <div className="flex justify-end mb-3">
                    <button
                        onClick={handleAdd}
                        className="bg-green-200 hover:bg-green-300 text-sm px-4 py-2 rounded"
                    >
                        Add New
                    </button>
                </div>

                <table className="w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-2 border">First Name</th>
                            <th className="p-2 border">Last Name</th>
                            <th className="p-2 border">Position</th>
                            <th className="p-2 border">Fraction</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id} className="border-t">
                                <td className="p-2 border">{emp.firstName}</td>
                                <td className="p-2 border">{emp.lastName}</td>
                                <td className="p-2 border">{emp.position}</td>
                                <td className="p-2 border">{emp.fraction}</td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        onClick={() => handleEdit(emp.id)}
                                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleRemove(emp.id)}
                                        className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
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
