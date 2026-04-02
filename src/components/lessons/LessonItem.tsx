import { Link } from "react-router-dom"
import type { Lesson } from "../../types"
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Check, Pencil, PlusCircle, X, ExternalLink } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useAuthStore } from "../../store/auth.store"

const LessonItem = ({ lesson }: { lesson: Lesson }) => {
    const { token } = useAuthStore()
    const [isEditTitle, setIsEditTitle] = useState(false)
    const [isEditContent, setIsEditContent] = useState(false)

    // Khởi tạo state từ props ban đầu
    const [lessonData, setLessonData] = useState<Lesson>(lesson)

    // Hàm cập nhật chung cho API
    const updateLessonAPI = async (updatedData: Lesson) => {
        const promise = axios.patch(
            `${import.meta.env.VITE_API_URL}lesson/${lesson._id}`,
            updatedData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.promise(promise, {
            loading: "Đang cập nhật...",
            success: () => {
                setLessonData(updatedData);
                return "Cập nhật bài học thành công!";
            },
            error: "Cập nhật bài học thất bại!",
        });

        return promise;
    }

    const handleSaveTitle = async () => {
        await updateLessonAPI(lessonData);
        setIsEditTitle(false);
    }

    const handleCancelTitle = () => {
        setLessonData({ ...lessonData, title: lesson.title });
        setIsEditTitle(false);
    }

    const handleSaveContent = async () => {
        await updateLessonAPI(lessonData);
        setIsEditContent(false);
    }

    const handleCancelContent = () => {
        setLessonData({ ...lessonData, content: lesson.content });
        setIsEditContent(false);
    }

    const addMaterial = async () => {
        const newMaterial = { title: "Tài liệu mới", url: "https://example.com" };
        const updatedMaterials = lessonData.materials
            ? [...lessonData.materials, newMaterial]
            : [newMaterial];

        const newData = { ...lessonData, materials: updatedMaterials };
        await updateLessonAPI(newData);
    }

    // Xóa tài liệu
    const deleteMaterial = async (index: number) => {
        const updatedMaterials = lessonData.materials.filter((_, i) => i !== index);
        const newData = { ...lessonData, materials: updatedMaterials };
        await updateLessonAPI(newData);
    };

    // Sửa tài liệu (Ví dụ dùng prompt đơn giản hoặc bạn có thể làm UI xịn hơn)
    const editMaterial = async (index: number) => {
        const material = lessonData.materials[index];
        const newTitle = prompt("Nhập tên tài liệu mới:", material.title);
        const newUrl = prompt("Nhập URL mới:", material.url);

        if (newTitle && newUrl) {
            const updatedMaterials = [...lessonData.materials];
            updatedMaterials[index] = { title: newTitle, url: newUrl };
            const newData = { ...lessonData, materials: updatedMaterials };
            await updateLessonAPI(newData);
        }
    };

    return (
        <AccordionItem key={lesson._id} value={`item-${lesson._id}`} className="px-4 py-2 bg-foreground mb-4 border border-gray-500 rounded-2xl">
            <AccordionTrigger className="hover:no-underline">
                {isEditTitle ? (
                    <div className="flex items-center gap-2 w-full pr-4" onClick={(e) => e.stopPropagation()}>
                        <Input
                            className="h-8"
                            value={lessonData.title}
                            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <button onClick={handleSaveTitle} className="p-1 hover:bg-green-100 text-green-600 rounded">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={handleCancelTitle} className="p-1 hover:bg-red-100 text-red-600 rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 group">
                        <span className="font-medium text-left text-xl">{lessonData.title}</span>
                        <Pencil
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditTitle(true);
                            }}
                        />
                    </div>
                )}
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4 h-auto overflow-visible">
                <div className="space-y-4">
                    {/* Phần nội dung bài học */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mô tả</h4>
                            {!isEditContent && (
                                <Pencil
                                    className="w-3 h-3 cursor-pointer hover:text-primary"
                                    onClick={() => setIsEditContent(true)}
                                />
                            )}
                        </div>

                        {isEditContent ? (
                            <div className="space-y-2">
                                <Input
                                    value={lessonData.content}
                                    onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveContent} className="text-xs bg-primary text-white px-2 py-1 rounded">Lưu</button>
                                    <button onClick={handleCancelContent} className="text-xs bg-secondary px-2 py-1 rounded">Hủy</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary">{lessonData.content || "Chưa có mô tả."}</p>
                        )}
                    </div>

                    {/* Phần tài liệu đính kèm */}
                    <div className="border-t flex flex-col gap-2 pt-4">
                        <div className='flex items-center gap-2 mb-3'>
                            <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Tài liệu học tập</h4>
                            <PlusCircle
                                className='w-4 h-4 cursor-pointer text-primary hover:scale-110 transition-transform'
                                onClick={addMaterial}
                            />
                        </div>

                        {lessonData.materials && lessonData.materials.length > 0 ? (
                            <ul className='grid gap-2 '>
                                {lessonData.materials.map((material: any, index: number) => (
                                    <li key={`${lesson._id}-mat-${index}`} className="group flex items-center justify-between p-3 border rounded-md hover:bg-foreground transition-colors">
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium truncate">{material.title}</span>
                                            <Link
                                                to={material.url}
                                                target="_blank"
                                                className="text-xs text-blue-500 flex items-center gap-1 hover:underline truncate"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                {material.url}
                                            </Link>
                                        </div>

                                        {/* Nút hành động hiện lên khi hover */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => editMaterial(index)}
                                                className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"
                                                title="Sửa tài liệu"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Xác nhận xóa tài liệu này?")) deleteMaterial(index)
                                                }}
                                                className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                                                title="Xóa tài liệu"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Chưa có tài liệu đính kèm.</p>
                        )}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default LessonItem