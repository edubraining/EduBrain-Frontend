import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import arrowUp from '../../assets/icons/arrow-up.svg'
import completed from '../../assets/icons/completed.svg'

interface LectureCloudLink {
  domain_url: string
  bucket: string
  folder_name: string
  file_name: string
}

interface Lecture {
  _id: string
  lecture_no: number
  lecture_name: string
  lecture_cloud_link: LectureCloudLink
  lecture_file_path: string
}

interface Section {
  _id: string
  section_no: number
  section_name: string
  section_lectures: Lecture[]
}

interface CoursePartProps {
  handleVideoChange: (
    url: string,
    lectureNumber: number,
    lectureName: string
  ) => void
  i: number
  progress: string
  course_name: string
  sections: Section[]
  currentLectureNumber: number
  completedLectures: number[]
}

const CoursePart: React.FC<CoursePartProps> = ({
  handleVideoChange,
  i,
  progress,
  course_name,
  sections,
  currentLectureNumber,
  completedLectures,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isCourseExpanded, setIsCourseExpanded] = useState(false)

  const normalizedProgress =
    isNaN(Number(progress)) || progress === '' ? '0' : progress

  // Calculate section progress
  const getSectionProgress = (sectionLectures: Lecture[]): number => {
    if (!sectionLectures.length) return 0
    const completedInSection = sectionLectures.filter((lecture) =>
      completedLectures.includes(lecture.lecture_no)
    ).length
    return (completedInSection / sectionLectures.length) * 100
  }

  const toggleSection = (sectionId: string): void => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Course Overview Card */}
      <motion.div className="flex flex-col justify-between gap-8 items-start border-foreground-light border-opacity-20 dark:border-opacity-100 border dark:border-neutral-90 rounded-[20px] p-6 w-full overflow-hidden">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="body-text-md text-foreground-light/80 dark:text-neutral-20">
              Course 
            </span>
            <button
              onClick={() => {
                setIsCourseExpanded((prev) => !prev)
              }}
            >
              <motion.img
                layout
                src={arrowUp}
                alt="arrow up"
                className="transition-transform invert dark:invert-0"
                style={{
                  transform: !isCourseExpanded
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                }}
              />
            </button>
          </div>
          <div
            onClick={() => {
              setIsCourseExpanded((prev) => !prev)
            }}
          >
            <h3 className="h3 text-foreground-light dark:text-neutral-10 max-w-[80%]">
              {course_name}
            </h3>
            
            <div className="flex justify-between items-center gap-6 w-full mt-2">
            
              <div className="flex-grow bg-foreground-light/80 dark:bg-neutral-90 h-1.5 w-full rounded-full relative">
                <div
                  style={{ width: `${normalizedProgress}%` }}
                  className="dark:bg-primary-30 bg-primary-50 h-1.5 rounded-full absolute top-0 left-0 bottom-0"
                />
              </div>
              <span className="font-Montserrat text-[20px] leading-[30px] text-foreground-light dark:text-neutral-10">
                {Math.round(parseFloat(normalizedProgress))}%
              </span>
            </div>
            <span className="body-text-md text-foreground-light/80 dark:text-neutral-20">
              Video Progress 
            </span>
          </div>
        </div>
      </motion.div>

      {/* Section Cards */}
      <AnimatePresence>
        {isCourseExpanded &&
          sections.map((section, sectionIndex) => (
            <motion.div
              key={section._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col justify-between gap-8 items-start border-foreground-light border-opacity-20 dark:border-opacity-100 border dark:border-neutral-90 rounded-[20px] p-6 w-full overflow-hidden"
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="body-text-md text-foreground-light/80 dark:text-neutral-20">
                    Section {sectionIndex + 1}
                  </span>
                  <button
                    onClick={() => {
                      toggleSection(section._id)
                    }}
                  >
                    <motion.img
                      layout
                      src={arrowUp}
                      alt="arrow up"
                      className="transition-transform invert dark:invert-0"
                      style={{
                        transform: !expandedSections.includes(section._id)
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                      }}
                    />
                  </button>
                </div>
                <div
                  onClick={() => {
                    toggleSection(section._id)
                  }}
                >
                  <h3 className="h3 text-foreground-light dark:text-neutral-10 max-w-[80%]">
                    {section.section_name}
                  </h3>
                  <div className="flex justify-between items-center gap-6 w-full mt-2">
                    <div className="flex-grow bg-foreground-light/80 dark:bg-neutral-90 h-1.5 w-full rounded-full relative">
                      <div
                        style={{
                          width: `${getSectionProgress(section.section_lectures)}%`,
                        }}
                        className="dark:bg-primary-30 bg-primary-50 h-1.5 rounded-full absolute top-0 left-0 bottom-0"
                      />
                    </div>
                    <span className="font-Montserrat text-[20px] leading-[30px] text-foreground-light dark:text-neutral-10">
                      {Math.round(getSectionProgress(section.section_lectures))}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.includes(section._id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="flex flex-col gap-2 w-full"
                  >
                    {section.section_lectures.map((lecture) => (
                      <button
                        key={lecture._id}
                        onClick={() => {
                          const { domain_url, bucket, folder_name, file_name } =
                            lecture.lecture_cloud_link
                          handleVideoChange(
                            `${domain_url}${bucket}/${folder_name}/${file_name}.mp4`,
                            lecture.lecture_no,
                            lecture.lecture_name
                          )
                        }}
                        className={`w-full body-text-sm text-foreground-light dark:text-neutral-10 flex justify-between items-center px-4 py-3 rounded-xl ${
                          lecture.lecture_no === currentLectureNumber
                            ? 'dark:bg-neutral-95 bg-foreground-light/10'
                            : 'border dark:border-neutral-90 border-foreground-light/20'
                        }`}
                      >
                        <span>
                          {lecture.lecture_no}. {lecture.lecture_name}
                        </span>
                        {completedLectures.includes(lecture.lecture_no) && (
                          <span>
                            <img
                              src={completed}
                              width={'22rem'}
                              alt="checkmark"
                            />
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

export default CoursePart

// import React, { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import arrowUp from '../../assets/icons/arrow-up.svg'
// import completed from '../../assets/icons/completed.svg'
// interface LectureCloudLink {
//   domain_url: string
//   bucket: string
//   folder_name: string
//   file_name: string
// }

// interface Lecture {
//   _id: string
//   lecture_no: number
//   lecture_name: string
//   lecture_cloud_link: LectureCloudLink
//   lecture_file_path: string
// }

// interface Section {
//   _id: string
//   section_no: number
//   section_name: string
//   section_lectures: Lecture[]
// }

// interface CoursePartProps {
//   handleVideoChange: (
//     url: string,
//     lectureNumber: number,
//     lectureName: string
//   ) => void
//   i: number
//   progress: string
//   course_name: string
//   sections: Section[]
//   currentLectureNumber: number
//   completedLectures: number[]
// }

// const CoursePart: React.FC<CoursePartProps> = ({
//   handleVideoChange,
//   i,
//   progress,
//   course_name,
//   sections,
//   currentLectureNumber,
//   completedLectures,
// }) => {
//   const [isActive, setIsActive] = useState(false)
//   const normalizedProgress =
//     isNaN(Number(progress)) || progress === '' ? '0' : progress

//   return (
//     <motion.div className="flex flex-col justify-between gap-8 items-start border-foreground-light border-opacity-20 dark:border-opacity-100 border dark:border-neutral-90 rounded-[20px] p-6 w-full overflow-hidden">
//       <div className="flex flex-col gap-1 w-full">
//         <div className="flex items-center justify-between w-full">
//           <span className="body-text-md text-foreground-light/80 dark:text-neutral-20">
//             Part {i + 1}
//           </span>
//           <button
//             onClick={() => {
//               setIsActive((prev) => !prev)
//             }}
//           >
//             <motion.img
//               layout
//               src={arrowUp}
//               alt="arrow up"
//               className="transition-transform invert dark:invert-0"
//               style={{
//                 transform: !isActive ? 'rotate(180deg)' : 'rotate(0deg)',
//               }}
//             />
//           </button>
//         </div>
//         <div
//           onClick={() => {
//             setIsActive((prev) => !prev)
//           }}
//         >
//           <h3 className="h3 text-foreground-light dark:text-neutral-10 max-w-[80%]">
//             {course_name}
//           </h3>
//           <div className="flex justify-between items-center gap-6 w-full mt-2">
//             <div className="flex-grow bg-foreground-light/80 dark:bg-neutral-90 h-1.5 w-full rounded-full relative">
//               <div
//                 style={{
//                   width: `${normalizedProgress}%`,
//                 }}
//                 className="dark:bg-primary-30 bg-primary-50 h-1.5 rounded-full absolute top-0 left-0 bottom-0"
//               />
//             </div>
//             <span className="font-Montserrat text-[20px] leading-[30px] text-foreground-light dark:text-neutral-10">
//               {Math.round(parseFloat(normalizedProgress))}%
//             </span>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isActive && (
//           <motion.div
//             initial={{ height: 0 }}
//             animate={{ height: 'auto' }}
//             exit={{ height: 0 }}
//             className="flex flex-col gap-6 w-full"
//           >
//             {sections.map((section) => (
//               <div key={section._id} className="flex w-full flex-col gap-3">
//                 <span className="body-text-md text-foreground-light dark:text-neutral-10">
//                   {section.section_name}
//                 </span>
//                 <div className="flex flex-col gap-2 w-full">
//                   {section.section_lectures.map((lecture) => (
//                     <button
//                       onClick={() => {
//                         const { domain_url, bucket, folder_name, file_name } =
//                           lecture.lecture_cloud_link
//                         handleVideoChange(
//                           `${domain_url}${bucket}/${folder_name}/${file_name}.mp4`,
//                           lecture.lecture_no,
//                           lecture.lecture_name
//                         )
//                       }}
//                       key={lecture._id}
//                       className={`w-full body-text-sm text-foreground-light dark:text-neutral-10 flex justify-between items-center px-4 py-3 rounded-xl ${
//                         lecture.lecture_no === currentLectureNumber
//                           ? 'dark:bg-neutral-95 bg-foreground-light/10'
//                           : 'border dark:border-neutral-90 border-foreground-light/20'
//                       }`}
//                     >
//                       <span>
//                         {lecture.lecture_no}. {lecture.lecture_name}
//                       </span>
//                       {completedLectures.includes(lecture.lecture_no) && (
//                         <span>
//                           <img
//                             src={completed}
//                             width={'22rem'}
//                             alt="checkmark"
//                             // className="invert dark:invert-0"
//                           />
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

// export default CoursePart
