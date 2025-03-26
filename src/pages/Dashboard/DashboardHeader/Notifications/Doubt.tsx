import { useState } from "react";
import axios from "axios";
import { AiOutlineCloudUpload, AiOutlineCloseCircle, AiOutlineMessage } from "react-icons/ai";
import { CiViewList } from "react-icons/ci";

import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/index' // Import the RootState type
import PrimaryButton from "../../../../components/buttons/PrimaryButton";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL + '/api/v1'
interface Doubt {
    _id: string;
    studentId: string;
    message: string;
    fileUrl?: string; // Optional because not all doubts may have a file
    status: "pending" | "resolved";
    createdAt: string | Date;
    mentorResponse?: string; // Optional because not all doubts may have a mentor response
    mentorFileUrl?:string
}

const DoubtModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);




    const [isReviewOpen, setIsReviewOpen] = useState(false); // For the review modal
    const [doubts, setDoubts] = useState<Doubt[]>([]);


    const [reviewLoading, setReviewLoading] = useState(false); // Loading state for fetching dou
    const user = useSelector((state: RootState) => state?.userSlice?.user?._id)





    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };


    const handleSubmit = async () => {
        if (!message) {
            alert("Please enter your doubt before submitting.");
            return;
        }

        if (!user) {
            alert("You must be logged in to submit a doubt.");
            return;
        }


        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("studentId", user); // Replace with actual student ID (e.g., from auth context)
            formData.append("message", message);
            if (file) {
                formData.append("file", file);
            }

            const response = await axios.post(`${BASE_URL}/doubts/submit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert("Doubt submitted successfully!");
                setIsOpen(false); // Close the modal
                setMessage(""); // Reset the message
                setFile(null); // Reset the file
            } else {
                alert("Failed to submit doubt. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting doubt:", error);
            alert("An error occurred while submitting your doubt.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDoubts = async () => {
        setReviewLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/student-doubt/${user}`);
            if (response.status === 200) {
                setDoubts(response.data);
                console.log("Fetched doubtes", response);
                
            } else {
                alert("Failed to fetch doubts.");
            }
        } catch (error) {
            console.error("Error fetching doubts:", error);
            alert("An error occurred while fetching doubts.");
        } finally {
            setReviewLoading(false);
        }
    };

    // Open review modal and fetch doubts
    const openReviewModal = async () => {
        setIsReviewOpen(true);
        await fetchDoubts();
    };

    return (
        <div className="bg-opacity-40">
          
          <button
    className="text-gray-800 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition duration-300 ease-in-out"
    onClick={() => setIsOpen(true)}
>
    <AiOutlineMessage size={32} />
</button>
<button
    className="text-gray-800 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition duration-300 ease-in-out ml-4"
    onClick={() => openReviewModal()}
>
    <CiViewList size={32} />
</button>
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative opacity-100 scale-100">
                        {/* Close Button */}
                        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={() => setIsOpen(false)}>
                            <AiOutlineCloseCircle size={28} />
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Submit Your Doubt</h2>

                        <textarea
                            placeholder="Enter your doubt..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 resize-none"
                            rows={4}
                        />

                        {/* File Upload */}
                        <label className="flex items-center gap-3 p-3 border border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
                            <AiOutlineCloudUpload size={24} className="text-blue-500" />
                            <span className="text-gray-600">{file ? file.name : "Upload a file"}</span>
                            <input type="file" onChange={handleFileChange} className="hidden"  accept="image/png, image/jpeg, image/jpg"
                            />
                        </label>

                        {/* Submit Button */}
                        <div className="bg-blue-500 text-red-900">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-4 py-2  rounded-lg hover:bg-blue-600 transition"
                            >
                                {loading ? "Submitting..." : "Submit Doubt"}
                            </button>
                        </div>
                    </div>
                </div>
            )}



{/* Review Doubts Modal */}
{isReviewOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all duration-300 ease-in-out">
            {/* Close Button */}
            <button
                className="absolute top-6 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setIsReviewOpen(false)}
            >
                <AiOutlineCloseCircle size={48} />
            </button>

            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Your Doubts
            </h2>

            {reviewLoading ? (
                <p className="text-center text-lg text-gray-600">Loading doubts...</p>
            ) : doubts.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No doubts found.</p>
            ) : (
                <ul className="space-y-6">
                    {doubts.map((doubt) => (
                        <li key={doubt?._id} className="border border-gray-300 p-6 rounded-lg bg-gray-50 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-lg font-semibold text-gray-800">Doubt - {doubt?.message}</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${doubt.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                                        }`}
                                >
                                   <SecondaryButton> {doubt.status}</SecondaryButton>
                                </span>
                            </div>

                            {doubt.fileUrl && (
                                <div className="mt-2">
                                    <a
                                        href={doubt.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        <SecondaryButton>View File </SecondaryButton>
                                    </a>
                                </div>
                            )}
                            {doubt.mentorFileUrl && (
                                <div className="mt-2">
                                    <a
                                        href={doubt.mentorFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        <SecondaryButton>View Mentor File </SecondaryButton>
                                    </a>
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2 mr-4">
                                <SecondaryButton className="mr-5">Submitted on:</SecondaryButton><PrimaryButton> {new Date(doubt.createdAt).toLocaleString()}</PrimaryButton>
                            </p>

                            <p className="mt-4 text-gray-700">
                                <span className="font-semibold"><SecondaryButton>Mentor Response:</SecondaryButton></span>{" "}
                                {doubt.mentorResponse ? (
                                    <span>{doubt.mentorResponse}</span>
                                ) : (
                                    <PrimaryButton><span>Mentor Will Respond Soon</span></PrimaryButton>
                                )}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
)}
        </div>
    );
};

export default DoubtModal;
