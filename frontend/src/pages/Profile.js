import { useState } from "react";

function ProfilePage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleEdit = () => {
        alert(`Saved: ${firstName} ${lastName}`);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#121212",
                color: "#e0e0e0",
            }}
        >
            <div
                style={{
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "24px",
                    backgroundColor: "#1e1e1e",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                    width: "320px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        color: "transparent",
                        backgroundImage: "linear-gradient(to right, #00ff88, #0088ff)",
                        WebkitBackgroundClip: "text",
                        marginBottom: "20px",
                        lineHeight: 1.4,
                    }}
                >
                    Manage your Profile
                </h1>

                <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px", width: "100%" }}>
                    <label style={{ marginBottom: "4px", fontSize: "0.9rem" }}>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                            borderRadius: "12px",
                            border: "1px solid gray",
                            padding: "8px 12px",
                            backgroundColor: "#2a2a2a",
                            color: "#e0e0e0",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px", width: "100%" }}>
                    <label style={{ marginBottom: "4px", fontSize: "0.9rem" }}>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{
                            borderRadius: "12px",
                            border: "1px solid gray",
                            padding: "8px 12px",
                            backgroundColor: "#2a2a2a",
                            color: "#e0e0e0",
                            outline: "none",
                        }}
                    />
                </div>

                <button
                    onClick={handleEdit}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "12px",
                        background: "linear-gradient(to right, #00ff88, #0088ff)",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
