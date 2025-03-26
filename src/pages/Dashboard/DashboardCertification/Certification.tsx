import React, { useState, useEffect } from 'react'
// import image from '../../../assets/images/Frame 664.svg'
import number1 from '../../../assets/images/Number.png'
import number2 from '../../../assets/images/Number2.png'
import number3 from '../../../assets/images/Number3.png'
import number4 from '../../../assets/images/Number4.png'
import number5 from '../../../assets/images/Number5.png'
import image from '../../../assets/images/Frame 664.svg'
import { getAllEnrolledCourses } from '../../../api/enrolledCourses'
import { type IEnrollmentDetails } from '../../../types/enrollment.types'
import { handleGetUser } from '../../../api/user'
import { PDFDocument, rgb } from 'pdf-lib';
import { useQuery } from '@tanstack/react-query'
import { FaDownload, FaCertificate } from 'react-icons/fa';
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import toast from 'react-hot-toast'


interface CertificationState {
  courseCompleted: boolean
  showCertificate: boolean
  userName: string
  courseName: string
  completionDate: string
  overallProgress: number
  error: string | null
  loading: boolean
  enrollmentDetails?: IEnrollmentDetails
}
interface UserData {
  name: string
}
// const Certification = ():void => {
const Certification: React.FC = (): JSX.Element => {
  const [state, setState] = useState<CertificationState>({
    courseCompleted: false,
    showCertificate: false,
    userName: 'John Doe',
    courseName: '',
    completionDate: '',
    overallProgress: 0,
    error: null,
    loading: true,
  })
  interface StepProps {
    index: number
    number: number
    title: string
    description: string
  }



  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Ensures two digits
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = today.getFullYear();
  const CertificatecompletionDate = `${day}/${month}/${year}`; // Format: MM/DD/YYYY
  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true }))

        const userData = (await handleGetUser()) as UserData
        setState((prev) => ({
          ...prev,
          userName: userData?.name || 'John Doe',
          error: null,
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch user data',
        }))
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    const fetchEnrollmentData = async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true }))

        const enrollmentDetails = await getAllEnrolledCourses()
        console.log('Enrollment Details:', enrollmentDetails)

        if (!enrollmentDetails || !enrollmentDetails.length) {
          throw new Error('No enrolled courses found')
        }

        const latestEnrollment = enrollmentDetails[0]

        setState((prev) => ({
          ...prev,
          courseName: latestEnrollment.title || '',
          overallProgress: parseInt(
            latestEnrollment.overallProgress?.toString() || '0'
          ),
          courseCompleted:
            parseInt(latestEnrollment.overallProgress?.toString() || '0') >= 1,
          completionDate: latestEnrollment.enrollmentDate
            ? new Date(latestEnrollment.enrollmentDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )
            : '',
          enrollmentDetails: latestEnrollment,
          error: null,
        }))
      } catch (error) {
        console.error('Error fetching enrollment data:', error)
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch enrollment data',
        }))
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchUserData()
    fetchEnrollmentData()
  }, [])



  interface CourseDetails {
    courseName: string;
    overallProgress: string;
  }
  const [enrolledCourses, setEnrolledCourses] = useState<CourseDetails[]>([]);




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


  const generateCertificate = async (studentName: string, courseName: string, completionDate: string) => {
    try {
      const response = await fetch('/images/Coursecertificate.pdf');
      if (!response.ok) {
        throw new Error('Failed to fetch the PDF template');
      }
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];


      const { width, height } = firstPage.getSize();

      // Calculate center-aligned positions (adjust multipliers as needed)
      const centerX = (width - 400) / 2; // 400 = estimated max text width

      // Dynamic positioning (A4: 595x842 points)
      const positions = {
        // "YOUR NAME" placement (centered, below title)
        name: {
          x: centerX + 100,  // Increased from +20 to push right
          y: height * 0.50,  // Lowered from 0.55 (now 45% from bottom = lower on page)
          size: 50,
          color: rgb(0, 0, 0),
        },
        // Course name ("XYZ" replacement)
        course: {
          x: centerX + 360,
          y: height * 0.415, // Slightly above name
          size: 18,
          color: rgb(0, 0, 0)
        },
        // Date overlay (right-aligned to existing date)
        date: {
          x: width * 0.55, // 60% from left
          y: height * 0.37,
          size: 18,
          color: rgb(0, 0, 0)
        }
      };




      // Draw dynamic text
      firstPage.drawText(studentName, positions.name);
      firstPage.drawText(courseName, positions.course);
      firstPage.drawText(completionDate, positions.date);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${studentName}-certificate.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: handleGetUser,
    retry: 0,
  })

  const user: any = userData
  const username: string = user?.name || ''


  const handleDownloadCertificate = (course: CourseDetails) => {
    const studentName = username;
    const courseName = course.courseName;
    const completionDate = CertificatecompletionDate;

    generateCertificate(studentName, courseName, completionDate);

    toast.success(`Dear ${username} Certificate for ${courseName} has been downloaded!`);


  };

 
  

  const steps = [
    {
      number: 1,
      title: 'Enroll in a Course',
      description: 'Engage in lectures and complete requirements.',
    },
    {
      number: 2,
      title: 'Complete Course Requirements',
      description: 'Complete all required lectures and assignments.',
    },
    {
      number: 3,
      title: 'Submit Assessments',
      description: 'Submit assessments to complete the course.',
    },
    {
      number: 4,
      title: 'Achieve Certification Criteria',
      description: 'Meet all certification requirements.',
    },
    {
      number: 5,
      title: 'Receive Your Certificate',
      description: 'Download your certificate upon completion.',
    },
  ]

  // const handleCertificateDownload = (): void => {
  //   if (!state.courseCompleted) {
  //     alert('Please complete the course before downloading your certificate.')
  //     return
  //   }

  //   if (!state.userName || !state.courseName || !state.completionDate) {
  //     alert('Certificate information is incomplete. Please try again later.')
  //     return
  //   }

  //   setState((prev) => ({ ...prev, showCertificate: true }))
  // }

  // const Step = ({ index, number, title, description }) => {
  const Step: React.FC<StepProps> = ({ index, number, title, description }) => {
    const stepImages = [image, number1, number2, number3, number4, number5]
    const topPosition = index === 0 ? 'top-0' : 'top-[-76px]'

    return (
      <div
        className="relative border dark:border-[#FFFFFF8A] p-2 rounded-xl hover:border-primary transition-colors"
        role="listitem"
      >
        <img
          src={stepImages[number]}
          className={`absolute left-[380px] ${topPosition}`}
          alt={`Step ${number}`}
          loading="lazy"
        />
        <div className="p-2 font-Roboto flex flex-col gap-4">
          <h3 className="text-[24px] text-black dark:text-white font-medium">
            {title}
          </h3>
          <p className="text-[16px] text-black dark:text-[#FFFFFF8A]">
            {description}
          </p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{state.error}</p>
          <button
            onClick={() => {
              window.location.reload()
            }}
            className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col lg:flex-row gap-16 py-16 max-w-[1440px] mx-auto px-4">
      {/* Left Column */}
      <div className="flex-1 max-w-[600px]">
     
      <div className="relative w-full max-w-[522px] h-auto mx-auto p-4">
  {/* Background container */}
  <div className="absolute inset-0 bg-[#FFF2C9] rounded-2xl"></div>
  
  {/* "Purpose" text */}
  <div className="relative mt-4">
    <h1 className="text-[#121212] font-bold text-2xl md:text-3xl tracking-tight">Purpose of certificate</h1>
  </div>
  
  {/* Paragraph text */}
  <div className="relative mt-4">
    <p className="text-[#121212] text-base md:text-lg leading-relaxed">
      This certificate acknowledges your dedication and successful completion of the course. Use it to celebrate your personal growth, track your learning journey, and motivate future endeavors. This helps you document your newly acquired skills and knowledge for your professional portfolio. Share it with employers or on professional networking sites to showcase your commitment to learning and career advancement.
    </p>
  </div>
  
  {/* Large yellow circle */}
  <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] max-w-[182px] max-h-[182px] rounded-full bg-[#FFC107] bg-opacity-20"></div>
  <div className="absolute bottom-[11%] left-[6%] w-[28vw] h-[28vw] max-w-[180px] max-h-[180px] rounded-full border border-[#FFBF00] border-opacity-50"></div>
  
  {/* Medium yellow circle */}
  <div className="absolute top-[50%] right-[10%] w-[10vw] h-[10vw] max-w-[57px] max-h-[57px] rounded-full bg-[#FFC107] bg-opacity-20"></div>
  <div className="absolute top-[51%] right-[11%] w-[9vw] h-[9vw] max-w-[56px] max-h-[56px] rounded-full border border-[#FFBF00] border-opacity-50"></div>
  
  {/* Small yellow circle (top right) */}
  <div className="absolute top-[-5%] right-[-5%] w-[30vw] h-[30vw] max-w-[182px] max-h-[182px] rounded-full bg-[#FFC107] bg-opacity-20"></div>
</div>

        <div className="flex pt-4">
          <h1 className="text-[24px] font-Montserrat font-bold text-black dark:text-white">
            Earn your certificate in just {steps.length} steps
          </h1>
        </div>
        <div className="py-6 flex flex-col gap-8" role="list">
          {steps.map((step, index) => (
            <Step key={index} index={index} {...step} />
          ))}
        </div>
      </div>

      {/* Right Column */}
      {/* <div className="flex-1 max-w-[650px] space-y-10">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 h-[500px] flex items-center justify-center shadow-sm">
          {state.loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-neutral-600 dark:text-neutral-300">
                Loading certificate preview...
              </p>
            </div>
          ) : (
            <CertificatePreview
              userName={state.userName}
              courseName={state.courseName}
              completionDate={state.completionDate}
              isCompleted={state.courseCompleted}
            />
          )}
        </div>

        <p className="text-[16px] text-black dark:text-white font-Roboto">
          Download your certificate instantly upon course completion—an emblem
          of your accomplished learning journey awaits you.
        </p>

        <Progressbutton
          progressText={`Complete Course (${state.overallProgress}%)`}
          completeText="Download Your Certificate"
          onClick={handleCertificateDownload}
          disabled={!state.courseCompleted}
        />

        <div className="space-y-6">
          <h2 className="text-black dark:text-white text-[36px] font-bold">
            Frequently Asked Questions
          </h2>
          <FAQs
            faqs={FAQ.faqs}
            faqButtonProps={{
              className:
                '!bg-background !border-neutral-95 hover:border-primary transition-colors',
            }}
          />
        </div>
      </div> */}

      {/* Certificate Modal */}
      {/* {state.showCertificate && (
        <CertificateModal
          onClose={() => {
            setState((prev) => ({ ...prev, showCertificate: false }))
          }}
          userName={state.userName}
          courseName={state.courseName}
          completionDate={state.completionDate}
          logoUrl="logoUrl"
        />
      )} */}


      {/* Certificate  */}


      {/* <div className='text-white'>
        {enrolledCourses.map((course) => (
          <div key={course.courseName}>
            <p>{course.courseName}</p>
            {parseFloat(course.overallProgress) > 98 ? (
              <button onClick={() => handleDownloadCertificate(course)}>
                Download Certificate
              </button>
            ) : (
              <p>Please finish this course to get the certificate.</p>
            )}
          </div>
        ))}
      </div> */}

<div className=" mx-auto px-4 py-8 text-gray-900">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        My Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course.courseName}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
               <PrimaryButton> {course.courseName}</PrimaryButton>
              </h3>
              {parseFloat(course.overallProgress) > 98 ? (
                <button
                  onClick={() => handleDownloadCertificate(course)}
                  className="flex items-center justify-center w-full py-2 px-4 mt-4 bg-blue-600 hover:bg-blue-700 text-grey-900 font-semibold rounded-lg shadow-md transition-colors duration-300"
                >
                  <FaDownload className="mr-2" />
                  Download Certificate
                </button>
              ) : (
                <div className="flex items-center mt-4 text-gray-600">
                  <FaCertificate className="text-yellow-400 mr-2" />
                  <p>Please finish this course to get the certificate.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>






    </div>
  )
}

export default Certification
