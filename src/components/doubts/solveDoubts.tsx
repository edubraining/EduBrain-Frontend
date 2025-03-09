import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import axios from "axios";
import SecondaryButton from "../buttons/SecondaryButton";
import PrimaryButton from "../buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";

interface Doubt {
    _id: string;
    studentId: string;
    message: string;
    fileUrl?: string;
    status: "pending" | "resolved";
    createdAt: string | Date;
    mentorResponse?: string;
}

const SolveDoubts = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL + "/api/v1";
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [loading, setLoading] = useState(false);
    const [mentorResponses, setMentorResponses] = useState<{ [key: string]: string }>({});
    const [filter, setFilter] = useState<"pending" | "resolved">("pending");
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state?.userSlice?.user?._id);

    const fetchDoubts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/all-doubt`);
            if (response.status === 200) {
                setDoubts(response.data);
            } else {
                alert("Failed to fetch doubts.");
            }
        } catch (error) {
            console.error("Error fetching doubts:", error);
            alert("An error occurred while fetching doubts.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDoubt = async (doubtId: string) => {
        const mentorResponse = mentorResponses[doubtId];
        if (!mentorResponse) {
            alert("Please enter a mentor response.");
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/update-doubt/${doubtId}`, {
                status: "resolved",
                mentorResponse,
            });

            if (response.status === 200) {
                alert("Doubt updated successfully!");
                fetchDoubts();
            } else {
                alert("Failed to update doubt.");
            }
        } catch (error) {
            console.error("Error updating doubt:", error);
            alert("An error occurred while updating the doubt.");
        }
    };

    const handleDeleteDoubt = async (doubtId: string) => {
        if (window.confirm("Are you sure you want to delete this doubt?")) {
            try {
                const response = await axios.delete(`${BASE_URL}/delete-doubt/${doubtId}`);
                if (response.status === 200) {
                    alert("Doubt deleted successfully!");
                    fetchDoubts();
                } else {
                    alert("Failed to delete doubt.");
                }
            } catch (error) {
                console.error("Error deleting doubt:", error);
                alert("An error occurred while deleting the doubt.");
            }
        }
    };

    useEffect(() => {
        fetchDoubts();
    }, []);

    const filteredDoubts = doubts.filter(doubt => doubt.status === filter);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <p className="text-white text-2xl" onClick={() => navigate(-1)}>
                <SecondaryButton>Go back</SecondaryButton>
            </p>
            <h1 className="text-2xl font-bold mb-6 text-white">Admin Doubt Resolution Panel</h1>

            <div className="flex gap-4 mb-6 text-white">
                <button
                    onClick={() => setFilter("pending")}
                    className={`py-2 px-4 rounded-lg ${filter === "pending" }`}
                >
                   {filter === "pending"? <PrimaryButton> Pending</PrimaryButton>:<SecondaryButton>Pending</SecondaryButton> }
                </button>
                <button
                    onClick={() => setFilter("resolved")}
                    className={`py-2 px-4 rounded-lg ${filter === "resolved" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} transition`}
                >
                     {filter === "resolved"? <PrimaryButton> Resolved</PrimaryButton>:<SecondaryButton>Resolved</SecondaryButton> }
                </button>
            </div>

            {loading ? (
                <p>Loading doubts...</p>
            ) : filteredDoubts.length === 0 ? (
                <p className="text-white text-2xl">No doubts found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredDoubts.map((doubt) => (
                        <div key={doubt._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-lg font-semibold">Doubt - {doubt.message}</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        doubt.status === "pending"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : "bg-green-200 text-green-800"
                                    }`}
                                >
                                    <SecondaryButton> {doubt.status}</SecondaryButton>
                                </span>
                            </div>

                            {doubt.fileUrl && (
                                <div className="mb-4">
                                    <a
                                        href={doubt.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        <SecondaryButton> View Attached File</SecondaryButton>
                                    </a>
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mb-4">
                                <PrimaryButton>Submitted on:</PrimaryButton> <SecondaryButton>{new Date(doubt.createdAt).toLocaleString()}</SecondaryButton>
                            </p>

                            <div className="mb-4">
                                <label className="block text-2xl font-medium text-gray-700">Mentor Response</label>
                                <textarea
                                    value={mentorResponses[doubt._id] || ""}
                                    onChange={(e) =>
                                        setMentorResponses((prev) => ({
                                            ...prev,
                                            [doubt._id]: e.target.value,
                                        }))
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Enter your response..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleUpdateDoubt(doubt._id)}
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    <PrimaryButton>Mark as Resolved</PrimaryButton>
                                </button>
                                <button
                                    onClick={() => handleDeleteDoubt(doubt._id)}
                                    className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    <PrimaryButton>Delete Doubt</PrimaryButton>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

           
        </div>
    );
};

export default SolveDoubts;