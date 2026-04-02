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
import axios from "axios";
import { useEffect, useState } from "react";
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

// ================= TYPE =================
type Class = {
    _id: string;
    name: string;
    code: string;
    courseId: { title: string };
    homeroomTeacher: { name: string };
};

// ================= SCHEMA =================
const formSchema = z.object({
    name: z.string().min(3, "Tên lớp ít nhất 3 ký tự"),
    code: z.string().min(3, "Mã lớp ít nhất 3 ký tự"),
    courseId: z.string().min(1, "Chọn khóa học"),
    homeroomTeacher: z.string().min(1, "Chọn giáo viên"),
});

type FormValues = z.infer<typeof formSchema>;

const ManageClass = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const { token } = useAuthStore();

    // ================= FORM =================
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            code: "",
            courseId: "",
            homeroomTeacher: "",
        },
    });

    // ================= FETCH =================
    useEffect(() => {
        if (token) {
            getClasses();
            getCourses();
            getTeachers();
        }
    }, [token]);

    const getClasses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}class`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClasses(res.data);
        } catch (err) {
            toast.error("Lỗi load lớp");
        }
    };

    const getCourses = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}course`);
        setCourses(res.data);
    };

    const getTeachers = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}user/teacher`);
        setTeachers(res.data);
    };

    // ================= CREATE =================
    const onSubmit = async (values: FormValues) => {
        try {
            await toast.promise(
                axios.post(`${import.meta.env.VITE_API_URL}class`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                {
                    loading: "Đang tạo lớp...",
                    success: (res) => {
                        setClasses((prev) => [res.data, ...prev]);
                        form.reset();
                        return "Tạo lớp thành công";
                    },
                    error: "Tạo thất bại",
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">Quản lý lớp học</h2>
                        <p className="text-sm text-muted-foreground">
                            Danh sách lớp và giáo viên
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg shadow-sm">
                                <Plus size={18} />
                                Thêm lớp học
                            </button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm lớp</DialogTitle>
                                <DialogDescription>
                                    Nhập thông tin lớp học
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* NAME */}
                                <input
                                    placeholder="Tên lớp"
                                    {...form.register("name")}
                                    className="w-full border p-2 rounded"
                                />
                                <p className="text-red-500 text-xs">
                                    {form.formState.errors.name?.message}
                                </p>

                                {/* CODE */}
                                <input
                                    placeholder="Mã lớp"
                                    {...form.register("code")}
                                    className="w-full border p-2 rounded"
                                />
                                <p className="text-red-500 text-xs">
                                    {form.formState.errors.code?.message}
                                </p>

                                {/* COURSE */}
                                <select {...form.register("courseId")} className="w-full border p-2 rounded">
                                    <option value="">-- Chọn khóa học --</option>
                                    {courses.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>

                                {/* TEACHER */}
                                <select {...form.register("homeroomTeacher")} className="w-full border p-2 rounded">
                                    <option value="">-- Chọn giáo viên --</option>
                                    {teachers.map((t) => (
                                        <option key={t._id} value={t._id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>

                                {/* ACTION */}
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <button className="border px-3 py-1 rounded">Hủy</button>
                                    </DialogClose>
                                    <button className="bg-black text-white px-4 py-2 rounded">
                                        Tạo
                                    </button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* TABLE */}
                <div className="border rounded-xl p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Tên lớp</TableHead>
                                <TableHead>Mã lớp</TableHead>
                                <TableHead>Khóa học</TableHead>
                                <TableHead>Giáo viên</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {classes.map((cls, index) => (
                                <TableRow key={cls._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{cls.name}</TableCell>
                                    <TableCell>{cls.code}</TableCell>
                                    <TableCell>{cls.courseId?.title}</TableCell>
                                    <TableCell>{cls.homeroomTeacher?.name}</TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-2 hover:bg-blue-50 rounded-lg group transition-colors">
                                                <Eye size={16} className="text-gray-400 group-hover:text-blue-500" />
                                            </button>
                                            <button className="p-2 hover:bg-green-50 rounded-lg group transition-colors">
                                                <Edit size={16} className="text-gray-400 group-hover:text-green-500" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg group transition-colors">
                                                <Trash size={16} className="text-gray-400 group-hover:text-red-500" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6} className="text-right">
                                    Tổng: {classes.length} lớp
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>

            {/* <DashboardModal /> */}
        </>
    );
};

export default ManageClass;