import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store';
import type { Course } from '../types';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import LessonItem from '../components/lessons/LessonItem';
import { Input } from '../components/ui/input';

const UpdateCourse = () => {
    const { id } = useParams()
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const { token } = useAuthStore()

    const getCourse = async (id: string) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}course/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data)
            setCourse(res.data)
            getAllLessons();
        }
        catch (error) {
            console.error("Failed to fetch course", error);
        }

    }

    const addLesson = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}lesson`, {
                title: "Bài học mới",
                content: "bai-hoc-moi",
                courseId: id
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.promise(
                Promise.resolve(res),
                {
                    loading: "Đang thêm bài học...",
                    success: "Thêm bài học thành công!",
                    error: "Thêm bài học thất bại!"
                }
            );
            course && setLessons([...lessons, res.data])

        }
        catch (error) {
            console.error("Failed to add lesson", error);
        }
    }

    const getAllLessons = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}lesson/course/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data)
            setLessons(res.data)
        }
        catch (error) {
            console.error("Failed to fetch lessons", error);
        }
    }

    useEffect(() => {
        if (id) {
            getCourse(id);
        }
    }, [id]);

    return (
        <div>
            <h2 className="font-bold text-2xl">Thông tin khóa học: <span className='text-primary'>{course ? `${course.title} - ${course.slug}` : "Loading..."}</span> </h2>
            {course && (
                <div>
                    <p>Mô khóa học: {course.description ? course.description : "Chưa có mô tả"}</p>
                </div>
            )}

            <div className='flex items-center gap-2 mt-3'>
                <h3 className="font-bold  block text-2xl">Giáo trình:</h3>
                <div className='tooltip' onClick={() => addLesson()}>
                    <PlusCircle className='text-primary hover:grayscale-25 cursor-pointer' />
                    <span className='tooltiptext'>
                        Thêm giáo trình
                    </span>
                </div>
            </div>
            <div>
                <Accordion type="single" collapsible className="max-w-lg rounded-lg ">
                    {lessons.map((lesson) => (
                        <LessonItem key={lesson._id} lesson={lesson} />
                    ))}
                </Accordion>

            </div>


        </div>
    )
}


export default UpdateCourse