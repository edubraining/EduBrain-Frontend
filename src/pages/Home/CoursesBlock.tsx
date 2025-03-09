import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '../../api/courses';
import type { ICourse } from '../../types/course.types';
import { FaChartLine, FaLaptopCode, FaDatabase, FaPaintBrush, FaCode, FaVideo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const CoursesBlock = () => {
    const {
        data: courses = [],
        isLoading,
        isError,
    } = useQuery<ICourse[], Error>({
        queryKey: ['courses'],
        queryFn: getAllCourses,
    });

    useEffect(() => {
        if (courses.length > 0) {
            console.log('Fetched courses:', courses);
        }
    }, [courses]);

    // const getCategoryIcon = (category: string) => {
    //     switch (category) {
    //         case 'Data Analytics':
    //             return <FaChartLine className="text-4xl text-blue-500" />;
    //         case 'Power BI':
    //             return <FaChartLine className="text-4xl text-blue-500" />;
    //         case 'Machine Learning':
    //             return <FaDatabase className="text-4xl text-purple-500" />;
    //         case 'Full Stack Development':
    //             return <FaLaptopCode className="text-4xl text-green-500" />;
    //         case 'UI/UX':
    //             return <FaPaintBrush className="text-4xl text-pink-500" />;
    //         case 'C++':
    //         case 'JAVA':
    //         case '.NET':
    //             return <FaCode className="text-4xl text-orange-500" />;
    //         default:
    //             return <FaCode className="text-4xl text-gray-500" />;
    //     }
    // };
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Data Analytics':
                return <FaChartLine className="text-4xl text-blue-500" />;
            case 'Power BI':
                return <FaChartLine className="text-4xl text-blue-500" />;
            case 'Machine Learning':
                return <FaDatabase className="text-4xl text-purple-500" />;
            case 'Full Stack Development':
                return <FaLaptopCode className="text-4xl text-green-500" />;
            case 'UI/UX':
                return <FaPaintBrush className="text-4xl text-pink-500" />;
            case 'C++':
            case 'JAVA':
            case '.NET':
                return <FaCode className="text-4xl text-orange-500" />;
            default:
                return <FaCode className="text-4xl text-gray-500" />; // Default icon
        }
    };
    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    if (isLoading) return <p className="text-center text-gray-600 dark:text-gray-300">Loading courses...</p>;
    if (isError) return <p className="text-center text-red-500 dark:text-red-400">Error fetching courses. Please try again later.</p>;

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {courses.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300">No courses found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
                        >
                            <img
                                src={course.poster.url}
                                alt={course.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-center mb-4">
                                    {getCategoryIcon(course?.title || "default")}
                                </div>
                                <h2 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-black">
                                    {course.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                                {truncateText(course?.description||"", 14)}
                                </p>
                                <div className="flex justify-between items-center mb-4 text-gray-600 dark:text-gray-300">
                                    <span className="text-sm">
                                        <FaVideo className="inline-block mr-1" />
                                        {course.numOfVideos} Lectures
                                    </span>
                                    <span className="text-sm">
                                        {course.total_duration}
                                    </span>
                                </div>
                                <div className="text-center mb-4">
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        ₹{1299}
                                    </span>
                                   
                                </div>

                                 <Link to={`/course/${course.slug}`} className="w-full">
                                            <SecondaryButton className="w-full">
                                              Let&apos;s Explore It
                                            </SecondaryButton>
                                          </Link>


                               
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesBlock;