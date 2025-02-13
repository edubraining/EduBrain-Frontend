import axios from 'axios'
import API from '.'
import { type IEnrollmentResponse } from '../types/enrollment.types'

export const getAllEnrolledCourses = async (): Promise<
  IEnrollmentResponse['enrollments']
> => {
  try {
    console.log("Starting getAllEnrolledCourses");
    
    const { data } = await axios.get<IEnrollmentResponse>(API.enrolledcourses, {
      withCredentials: true,
    })
    console.log("End getAllEnrolledCourses");

    return data.enrollments ?? []
  } catch (error) {
    console.error('Error fetching enrolled courses:', error)
    return []
  }
}
