import { useState } from "react";

function EmployerPage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleEdit = () => {
        alert(`Saved company:\nName: ${name}\nAddress: ${address}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-semibold mb-6">Manage company data</h1>
            <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm w-96">
                <h2 className="text-lg mb-4 text-center">Form to edit company data</h2>

                <div className="flex flex-col mb-4">
                    <label className="mb-1 text-sm">Company Name</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-1 text-sm">Address</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleEdit}
                    className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 w-full"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default EmployerPage;
