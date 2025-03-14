// import React, { useState } from 'react'
// import CourseCard from './CourseCard'
// import type { CourseDetails } from '../CourseDataProvider/CourseDataProvider'
// import CarouselBtn from './CarouselBtn'

// interface Tab {
//   tabName: string
//   link: string
// }

// interface CoursePageProps {
//   courseDetails: CourseDetails[]
//   courseHeading: string
//   tabs: Tab[]
// }

// interface Tab {
//   link: string
//   tabName: string
// }

// const CarouselComponent = ({
//   courseDetails,
//   courseHeading,
//   tabs,
// }: CoursePageProps): JSX.Element => {
//   const [activeTab, setActiveTab] = useState<string>(tabs[0].link)

//   const handleTabChange = (tab: string): void => {
//     setActiveTab(tab)
//   }

//   const [currentSlider, setCurrentSlider] = useState<number>(0)

//   const isSmallScreen: boolean = window.innerWidth <= 768
//   const isMediumScreen: boolean = window.innerWidth >= 1064

//   const prevSlider = (): void => {
//     setCurrentSlider((currentSlider) =>
//       currentSlider === 0 ? 0 : currentSlider - 1
//     )
//   }

//   const nextSlider = (): void => {
//     setCurrentSlider((currentSlider) =>
//       currentSlider ===
//       courseDetails.length - (isSmallScreen ? 1 : isMediumScreen ? 3 : 3)
//         ? 0
//         : currentSlider + 1
//     )
//   }

//   return (
//     <div className="">
//       <div className="mt-16">
//         {/* Heading and horizontal line */}
//         <div className="">
//           <h1 className="text-[24px] dark:text-neutral-10 text-neutral-75 font-Montserrat font-semibold mb-4">
//             {courseHeading}
//           </h1>
//           <div className="dark:bg-neutral-55 bg-neutral-75 opacity-10 w-full h-[1px]"></div>
//         </div>

//         <div className="mt-6 ">
//           {/* Tabs and carousel btn */}
//           <div className="flex justify-between items-center w-full gap-[10px]">
//             {/* Tabs button here */}
//             {/* <div className="flex items-center gap-4 overflow-x-scroll w-4/5">
//                 <button onClick={() => handleTabChange("tab1")} className={activeTab === "tab1" ? ' rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center text-neutral-10 flex-shrink-0' : "h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center text-neutral-10 flex-shrink-0"}>All</button>

//                 <button onClick={() => handleTabChange("tab2")} className={activeTab === "tab2" ? ' rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center text-neutral-10 flex-shrink-0' : "h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center text-neutral-10 flex-shrink-0"}>In progress</button>

//                 <button onClick={() => handleTabChange("tab3")} className={activeTab === "tab3" ? ' rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center text-neutral-10 flex-shrink-0' : "h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center text-neutral-10 flex-shrink-0"}>Yet to start</button>

//                 <button onClick={() => handleTabChange("tab4")} className={activeTab === "tab4" ? ' rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center text-neutral-10 flex-shrink-0' : "h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center text-neutral-10 flex-shrink-0"}>Completed</button>
//             </div> */}

//             {tabs.length > 0 && (
//               <div className="flex items-center gap-4 overflow-x-scroll w-4/5">
//                 {tabs.map((tab, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       handleTabChange(tab.link)
//                     }}
//                     className={
//                       activeTab === tab.link
//                         ? 'rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center dark:text-neutral-10 text-neutral-75 flex-shrink-0'
//                         : 'h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center dark:text-neutral-10 text-neutral-75 flex-shrink-0'
//                     }
//                   >
//                     {tab.tabName}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Carousel Button */}
//             <div className="w-[20%] flex justify-end">
//               <CarouselBtn
//                 slideName={'enrolledCourse'}
//                 btnpressprev={prevSlider}
//                 btnpressnext={nextSlider}
//               />
//             </div>
//           </div>

//           {/* Tabs content Here */}
//           {/* <div className="mt-8">
//   <div className="">
//     {activeTab === 'tab1' && (
//       <div className="flex items-center min-h-[300px]">
//         <div className="overflow-hidden">
//           <div className="flex justify-between items-center">
//             <div
//               className="ease-linear duration-300 flex gap-6"
//               style={{
//                 transform: `translateX(-${currentSlider * 342}px)`,
//               }}
//             >
//               {(courseDetails.length > 0) ? (
//                 courseDetails.map((cd, ind) => (
//                   <CourseCard key={ind} details={cd} />
//                 ))
//               ) : (
//                 <div className='items-center'>
//                 <h1 className="text-white text-2xl md:text-3xl lg:text-4xl text-center">
//                   Your next big opportunity is waiting. <br /> Enroll in a course and explore new possibilities!
//                 </h1></div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     )} */}

//           <div className="mt-8">
//             <div className="">
//               {activeTab === 'tab1' && (
//                 <div className="flex items-center min-h-[300px]">
//                   <div className="overflow-hidden w-full">
//                     <div className="flex justify-between items-center relative">
//                       <div
//                         className="ease-linear duration-300 flex gap-6 w-full"
//                         style={{
//                           transform: `translateX(-${currentSlider * 342}px)`,
//                         }}
//                       >
//                         {courseDetails.length > 0 ? (
//                           courseDetails.map((cd, ind) => (
//                             <CourseCard key={ind} details={cd} />
//                           ))
//                         ) : (
//                           <div className="flex justify-center items-center w-full">
//                             <h1 className="dark:text-white text-background md:text-xl lg:text-3xl text-center">
//                               {/* Your next big span opportunity is waiting. <br /> Enroll in a course and explore new possibilities! */}
//                               Your journey to{' '}
//                               <span className="text-[#4371d4] font-extrabold">
//                                 success starts!
//                               </span>{' '}
//                               <br />
//                               <span className="text-[white] px-2 rounded-md bg-primary-60">
//                                 Enroll Now
//                               </span>{' '}
//                               in a course and{' '}
//                               <p>
//                                 <span className="bg-[yellow] underline font-[600] text-[black] px-3 py-0 rounded-md">
//                                   open new doors!
//                                 </span>
//                               </p>
//                             </h1>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* <div className="mt-8">
//             <div className="">
//               {activeTab === 'tab1' && (
//                 <div className="flex items-center min-h-[300px]">
//                   <div className="overflow-hidden">
//                     <div className="flex justify-between items-center">
//                       <div
//                         className="ease-linear duration-300 flex gap-6"
//                         style={{
//                           transform: `translateX(-${currentSlider * 342}px)`,
//                         }}
//                       >
//                         {courseDetails.length > 0 &&
//                           courseDetails.map((cd, ind) => (
//                             <CourseCard key={ind} details={cd} />
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )} */}

//               <div className="">
//                 {activeTab === 'tab2' && (
//                   <div className="flex justify-center items-center min-h-[300px]">
//                     <h1 className="text-white">This is tab2</h1>
//                   </div>
//                 )}
//               </div>

//               {activeTab === 'tab3' && (
//                 <div className="flex justify-center items-center min-h-[300px]">
//                   <h1 className="text-white">This is tab3</h1>
//                 </div>
//               )}

//               {activeTab === 'tab4' && (
//                 <div className="flex justify-center items-center min-h-[300px]">
//                   <h1 className="text-white">This is tab4</h1>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CarouselComponent



import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import type { CourseDetails } from '../CourseDataProvider/CourseDataProvider';
import CarouselBtn from './CarouselBtn';

interface Tab {
  tabName: string;
  link: string;
}

interface CoursePageProps {
  courseDetails: CourseDetails[];
  courseHeading: string;
  tabs: Tab[];
}

const CarouselComponent = ({
  courseDetails,
  courseHeading,
  tabs,
}: CoursePageProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].link);
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [displayCards, setDisplayCards] = useState<number>(3);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth <= 768) {
        setDisplayCards(1);
      } else if (window.innerWidth <= 1064) {
        setDisplayCards(2);
      } else {
        setDisplayCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
    setCurrentSlider(0);
  };

  const prevSlider = (): void => {
    setCurrentSlider((prev) => Math.max(0, prev - displayCards));
  };

  const nextSlider = (): void => {
    setCurrentSlider((prev) => {
      const maxSlides = courseDetails.length - displayCards;
      return prev >= maxSlides ? 0 : prev + displayCards;
    });
  };

  return (
    <div className="">
      <div className="mt-16">
        <div className="">
          <h1 className="text-[24px] dark:text-neutral-10 text-neutral-75 font-Montserrat font-semibold mb-4">
            {courseHeading}
          </h1>
          <div className="dark:bg-neutral-55 bg-neutral-75 opacity-10 w-full h-[1px]" />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center w-full gap-[10px]">
            {tabs.length > 0 && (
              <div className="flex items-center gap-4 overflow-x-scroll w-4/5">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => { handleTabChange(tab.link); }}
                    className={
                      activeTab === tab.link
                        ? 'rounded-lg h-9 py-2 px-5 border border-neutral-40 flex justify-center items-center dark:text-neutral-10 text-neutral-75 flex-shrink-0'
                        : 'h-9 py-2 px-5 rounded-lg border border-neutral-65 flex justify-center items-center dark:text-neutral-10 text-neutral-75 flex-shrink-0'
                    }
                  >
                    {tab.tabName}
                  </button>
                ))}
              </div>
            )}

            <div className="w-[20%] flex justify-end">
              <CarouselBtn
                slideName={'enrolledCourse'}
                btnpressprev={prevSlider}
                btnpressnext={nextSlider}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="">
              {activeTab === 'tab1' && (
                <div className="flex items-center min-h-[300px]">
                  <div className="overflow-hidden w-full">
                    <div className="flex justify-between items-center relative">
                      <div
                        className="ease-linear duration-300 flex gap-6 w-full"
                        style={{
                          transform: `translateX(-${currentSlider * (342 + 24)}px)`,
                        }}
                      >
                        {courseDetails.length > 0 ? (
                          courseDetails.map((cd, ind) => (
                            <div
                              key={ind}
                              className="flex-shrink-0"
                              style={{ width: '342px' }}
                            >
                              <CourseCard details={cd} />
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-center items-center w-full">
                            <h1 className="dark:text-white text-background md:text-xl lg:text-3xl text-center">
                              Your journey to{' '}
                              <span className="text-[#4371d4] font-extrabold">
                                success starts!
                              </span>{' '}
                              <br />
                              <span className="text-[white] px-2 rounded-md bg-primary-60">
                                Enroll Now
                              </span>{' '}
                              in a course and{' '}
                              <p>
                                <span className="bg-[yellow] underline font-[600] text-[black] px-3 py-0 rounded-md">
                                  open new doors!
                                </span>
                              </p>
                            </h1>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tab2' && (
                <div className="flex justify-center items-center min-h-[300px]">
                  <h1 className="text-white">This is tab2</h1>
                </div>
              )}

              {activeTab === 'tab3' && (
                <div className="flex justify-center items-center min-h-[300px]">
                  <h1 className="text-white">This is tab3</h1>
                </div>
              )}

              {activeTab === 'tab4' && (
                <div className="flex justify-center items-center min-h-[300px]">
                  <h1 className="text-white">This is tab4</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;