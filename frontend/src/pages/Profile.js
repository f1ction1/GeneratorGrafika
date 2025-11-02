import { useState } from "react";

function ProfilePage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleEdit = () => {
        alert(`Saved: ${firstName} ${lastName}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-semibold mb-6">Manage your Profile</h1>
            <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm">
                <div className="flex flex-col mb-4">
                    <label className="mb-1 text-sm">First Name</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-1 text-sm">Last Name</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleEdit}
                    className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
