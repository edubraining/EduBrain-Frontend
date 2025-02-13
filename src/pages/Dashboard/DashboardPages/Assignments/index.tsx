import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
// import { handleGetUser } from '../../../../api/user';
import { getAllEnrolledCourses } from '../../../../api/enrolledCourses'; // Import your API function

interface Assignment {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
  };
  pdfUrls: string[];
  status: 'Approved' | 'Submitted' | 'Pending/Rejected';
}

interface CourseDetails {
  courseName: string;
  overallProgress: string;
}


const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Data Analytics Intro',
    course: { id: 'data-analytics', title: 'Data Analytics' },
    pdfUrls: [
      '/assignments/DATA ANALYTICS  PYTHON ASSIGNMNET .pdf',
      '/assignments/Data Analysis with Python.pdf',
      '/assignments/DATA ANALYTICS  PYTHON ASSIGNMNET .pdf',
      '/assignments/DATA ANALYTICS EXCEL ASSIGNMENT .pdf',
      '/assignments/DATA ANLAYTICS  SQL ASSIGNMENT .pdf',
      '/assignments/DataAnalysi_Tableau_Assignment.pdf',
    ],
    status: 'Approved',
  },
  {
    id: '2',
    title: 'C++ Assignments',
    course: { id: 'cpp', title: 'C++' },
    pdfUrls: [

      '/assignments/cpp_assignment1.docx',
      '/assignments/cpp_assignment2.docx',


    ],
    status: 'Approved',
  },
  {
    id: '3',
    title: 'CSS Assignments',
    course: { id: 'css', title: 'Full Stack Development' },
    pdfUrls: [

      '/assignments/css_assignment1.docx',
      '/assignments/css_assignment2.docx',


    ],
    status: 'Approved',
  },
  {
    id: '4',
    title: 'HTML Assignments',
    course: { id: 'html', title: 'Full Stack Development' },
    pdfUrls: [

      '/assignments/html_assignment1.docx',
      '/assignments/html_assignment2.docx',


    ],
    status: 'Approved',
  },
  {
    id: '5',
    title: 'Java',
    course: { id: 'java', title: 'JAVA' },
    pdfUrls: [

      '/assignments/java_assignment1.docx',
      '/assignments/java_assignment2.docx',
      '/assignments/java_assignment3.docx',
      '/assignments/java_assignment4.docx',


    ],
    status: 'Approved',
  },
  {
    id: '6',
    title: 'JavaScript Assignments',
    course: { id: 'js', title: 'Full Stack Development' },
    pdfUrls: [

      '/assignments/js_assignment1.docx',
      '/assignments/js_assignment2.docx',

    ],
    status: 'Approved',
  },
  {
    id: '7',
    title: 'Machine Learning Assignments',
    course: { id: 'ml', title: 'Machine Learning' },
    pdfUrls: [

      '/assignments/MACHINE LEARNING KNN .pdf',


    ],
    status: 'Approved',
  },
  {
    id: '8',
    title: 'React Assignments',
    course: { id: 'react', title: 'Full Stack Development' },
    pdfUrls: [

      '/assignments/react_assignment1.docx',
      '/assignments/react_assignment2.docx',


    ],
    status: 'Approved',
  },

];

const AssignmentPage: React.FC = () => {
  // const [selectedCourse, setSelectedCourse] = useState<string>('');
  // const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [enrolledCourses, setEnrolledCourses] = useState<CourseDetails[]>([]);

  // Fetch user data on mount
  // useEffect(() => {
  //   handleGetUser()
  //     .then((userData) => {
  //       setUser(userData);
  //       console.log('User data:', userData);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching user data:', err);
  //     });
  // }, []);

  // Fetch enrolled courses with progress
  useEffect(() => {
    const fetchEnrolledCourses = async (): Promise<void> => {
      try {
        const enrollmentDetails = await getAllEnrolledCourses();
        console.log("enrollmentDetails", enrollmentDetails);
        const formattedCourses: CourseDetails[] = enrollmentDetails.map(
          (course: any) => ({
            courseName: course.title,
            overallProgress: course.overallProgress
              .toString(),
          })
        );
        setEnrolledCourses(formattedCourses);


      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Filter assignments based on enrolled courses and progress
  const filteredAssignments = assignments.filter((assignment) => {
    const enrolledCourse = enrolledCourses.find(
      (course) =>
        course.courseName === assignment.course.title &&
        parseFloat(course.overallProgress) > 70
    );
    return (
      enrolledCourse
    );
  });

  return (
    <DashboardLayout>
      <main className="h-full w-full flex flex-col gap-5 min-h-[calc(100vh-100px)] p-6 bg-black text-white">
        {/* Header */}
       
        <div className="mt-4">
          <h3 className="text-2xl font-bold">My Assignments</h3>
          <hr className="w-full h-0.5 bg-white mt-2" />
        </div>

        {/* Filters */}
        {/* <div className="flex justify-between mt-4 items-center text-white bg-black">
      <div className="flex gap-4">
        {['Approved', 'Submitted', 'Pending/Rejected'].map((status, i) => (
          <button
            key={i}
            className={`border rounded-lg py-1 px-4 min-w-12 body-text-md 
              ${selectedStatus === status
                ? 'border-white text-white'
                : 'border-gray-600 text-gray-400'
              }`}
            onClick={() => {
              setSelectedStatus(status);
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <select
        className="max-w-fit cursor-pointer bg-black border border-white text-black px-3 rounded-lg py-2 bg-black"
        value={selectedCourse}
        onChange={(e) => {
          setSelectedCourse(e.currentTarget.value);
        }}
      >
        <option value="">All Courses</option>
        {enrolledCourses.map((course, i) => (
          <option key={i} value={course.courseName} className=" bg-black">
            {course.courseName}
          </option>
        ))}
      </select>
    </div> */}

        {/* Legend */}
        {/* <div className="flex gap-6 mt-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-green-500 h-4 w-4 rounded-md" />
            <span className="text-white">Approved</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-orange-500 h-4 w-4 rounded-md" />
            <span className="text-white">Submitted</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-red-500 h-4 w-4 rounded-md" />
            <span className="text-white">Pending/Rejected</span>
          </div>
        </div> */}

        {/* Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center w-full text-white h-44 flex items-center flex-col justify-center">
              <span>No assignments found</span>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-white p-4 rounded shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{assignment.title}</h2>
                <p className="text-gray-300">{assignment.course.title}</p>
                <div className="mt-2">
                  {assignment.pdfUrls.map((pdfUrl, index) => (
                    <div key={index} className="flex justify-between items-center mt-1">
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        View Assignment {index + 1}
                      </a>
                      <button
                        onClick={() => {
                          downloadPDF(pdfUrl);
                        }}
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </DashboardLayout>

  );
};

// Utility function to handle PDF download
const downloadPDF = (url: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = url.substring(url.lastIndexOf('/') + 1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default AssignmentPage;