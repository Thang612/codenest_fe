import { Edit, Eye, Plus, Trash } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { Course } from "../types";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";
import { Link } from "react-router-dom";

// ================= VALIDATION SCHEMA =================
const formSchema = z.object({
    title: z.string().min(3, "Tên khóa học ít nhất 3 ký tự"),
    slug: z.string().min(1, "Slug ít nhất 1 ký tự"),
    description: z.string().optional(),
    minAge: z.number()
        .int()
        .positive("Tuổi phải là số dương"),
    maxAge: z.number()
        .int()
        .positive("Phải là số dương"),
}).refine((data) => data.maxAge >= data.minAge, {
    message: "Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu",
    path: ["maxAge"],
});

// Định nghĩa Type dựa trên Schema để tránh lỗi unknown
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const ManageCourse = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const { token } = useAuthStore();

    // ================= FORM CONFIG =================
    const form = useForm<FormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            minAge: 1,
            maxAge: 18,
        },
    });

    //  AUTO GENERATE SLUG 
    const watchedTitle = form.watch("title");

    useEffect(() => {
        if (watchedTitle) {
            const generatedSlug = watchedTitle
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
                .split(/\s+/) // tách từng từ
                .map(word => word.charAt(0).toUpperCase()) // lấy chữ cái đầu + viết hoa
                .join(""); // nối lại

            form.setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [watchedTitle, form]);

    // ================= API CALLS =================
    useEffect(() => {
        if (token) getCourses();
    }, [token]);

    const getCourses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}course`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) setCourses(res.data);
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 401) toast.error("Không có quyền truy cập");
        }
    };

    const onSubmit = async (values: FormOutput) => {
        try {
            await toast.promise(
                axios.post(`${import.meta.env.VITE_API_URL}course`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                {
                    loading: "Đang tạo khóa học...",
                    success: (res) => {
                        setCourses((prev) => [res.data, ...prev]);
                        form.reset();
                        return "Tạo khóa học thành công";
                    },
                    error: (err) => err.response?.data?.message || "Lỗi khi tạo khóa học",
                }
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Quản lý khóa học</h2>
                    <p className="text-sm text-muted-foreground">Danh sách khóa học trong hệ thống</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg shadow-sm">
                            <Plus size={18} />
                            Thêm khóa học
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md p-6 bg-background rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Thêm khóa học mới</DialogTitle>
                            <DialogDescription>Nhập thông tin chi tiết cho khóa học của bạn.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            {/* TITLE */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Tên khóa học</label>
                                <input
                                    placeholder="Ví dụ: Lập trình Scratch"
                                    {...form.register("title")}
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                {form.formState.errors.title && (
                                    <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                                )}
                            </div>

                            {/* SLUG */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Slug (Tự động)</label>
                                <input
                                    placeholder="lap-trinh-scratch"
                                    {...form.register("slug")}
                                    className="w-full border rounded-md px-3 py-2 text-sm "
                                />
                                {form.formState.errors.slug && (
                                    <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium">Mô tả</label>
                                <textarea
                                    placeholder="Mô tả khóa học"
                                    {...form.register("description")}
                                    className="w-full border rounded-md px-3 py-2 text-sm "
                                />
                                {form.formState.errors.description && (
                                    <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            {/* AGE RANGE */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Tuổi tối thiểu</label>
                                    <input
                                        type="number"
                                        {...form.register("minAge", { valueAsNumber: true })} // Ép kiểu tại đây
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                    {form.formState.errors.minAge && (
                                        <p className="text-xs text-red-500">{form.formState.errors.minAge.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Tuổi tối đa</label>
                                    <input
                                        type="number"
                                        {...form.register("maxAge", { valueAsNumber: true })} // Ép kiểu tại đây
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                    {form.formState.errors.maxAge && (
                                        <p className="text-xs text-red-500">{form.formState.errors.maxAge.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3 pt-4">
                                <DialogClose asChild>
                                    <button type="button" className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
                                        Hủy
                                    </button>
                                </DialogClose>
                                <button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {form.formState.isSubmitting ? "Đang tạo..." : "Xác nhận tạo"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* TABLE */}
            <div className="border border-gray-400 px-4 rounded-xl overflow-hidden shadow-sm bg-foreground">
                <Table>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>Tên khóa học</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Độ tuổi</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <TableRow key={course._id} className="hover:bg-background">
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-semibold">{course.title}</TableCell>
                                    <TableCell className="text-muted-foreground">{course.slug}</TableCell>
                                    <TableCell>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                                            {course.minAge} - {course.maxAge} tuổi
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-2 hover:bg-blue-50 rounded-lg group transition-colors">
                                                <Eye size={16} className="text-gray-400 group-hover:text-blue-500" />
                                            </button>
                                            <Link to={`/courses/${course._id}`} className="p-2 hover:bg-green-50 rounded-lg group transition-colors">
                                                <Edit size={16} className="text-gray-400 group-hover:text-green-500" />
                                            </Link>
                                            <button className="p-2 hover:bg-red-50 rounded-lg group transition-colors">
                                                <Trash size={16} className="text-gray-400 group-hover:text-red-500" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Chưa có khóa học nào được tạo.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="text-right text-sm py-4">
                                Tổng cộng: <span className="font-bold">{courses.length}</span> khóa học
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

export default ManageCourse;