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
import type { User } from "../types";
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
import DashboardModal from "../components/common/DashboardModal";

// ================= VALIDATION =================
const formSchema = z.object({
    name: z.string().min(5, "Tên ít nhất 5 ký tự").max(32),
    username: z
        .string()
        .min(3)
        .max(10)
        .regex(/^[a-z0-9]+$/, "Chỉ chữ thường và số"),
    email: z.string().email(),
    dob: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Ngày không hợp lệ",
        })
        .refine((date) => new Date(date) < new Date(), {
            message: "Phải nhỏ hơn hiện tại",
        }),
});

const ManageTeacher = () => {
    const [teachers, setTeachers] = useState<User[]>([]);
    const { token } = useAuthStore();

    // ================= FORM =================
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dob: "",
        },
    });

    // ================= FETCH =================
    useEffect(() => {
        if (token) {
            getTeacher();
        }
    }, [token]);

    const getTeacher = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}user/teacher`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 200) {
                setTeachers(res.data);
            }
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 401) {
                toast.error("Không có quyền truy cập");
            }
        }
    };

    // ================= CREATE =================
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await toast.promise(
                axios.post(
                    `${import.meta.env.VITE_API_URL}user/teacher`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
                {
                    loading: "Đang tạo...",
                    success: (res) => {
                        setTeachers((prev) => [res.data, ...prev]);
                        form.reset();
                        return "Tạo thành công";
                    },
                    error: (err) =>
                        err.response?.data?.message || "Lỗi",
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Quản lý giáo viên
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Quản lý danh sách giáo viên trong hệ thống
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg shadow-sm">
                                <Plus size={18} />
                                Thêm giáo viên
                            </button>
                        </DialogTrigger>

                        {/* ================= DIALOG ================= */}
                        <DialogContent className="sm:max-w-md bg-background backdrop-blur-xl p-6 rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Thêm giáo viên</DialogTitle>
                                <DialogDescription>
                                    Nhập thông tin giáo viên
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 mt-4"
                            >
                                {/* NAME */}
                                <div>
                                    <input
                                        placeholder="Tên"
                                        {...form.register("name")}
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <p className="text-xs text-red-500">
                                        {form.formState.errors.name?.message}
                                    </p>
                                </div>

                                {/* USERNAME */}
                                <div>
                                    <input
                                        placeholder="Username"
                                        {...form.register("username")}
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <p className="text-xs text-red-500">
                                        {form.formState.errors.username?.message}
                                    </p>
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <input
                                        placeholder="Email"
                                        {...form.register("email")}
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <p className="text-xs text-red-500">
                                        {form.formState.errors.email?.message}
                                    </p>
                                </div>

                                {/* DOB */}
                                <div>
                                    <input
                                        type="date"
                                        {...form.register("dob")}
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <p className="text-xs text-red-500">
                                        {form.formState.errors.dob?.message}
                                    </p>
                                </div>

                                {/* BUTTON */}
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <button className="px-3 py-1.5 border rounded-md hover:bg-gray-100">
                                            Đóng
                                        </button>
                                    </DialogClose>

                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ================= TABLE ================= */}
                <div className="border border-gray-400 px-4 rounded-xl overflow-hidden shadow-sm bg-foreground">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 ">
                                <TableHead>#</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">
                                    Hành động
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {teachers.map((teacher, index) => (
                                <TableRow
                                    key={teacher._id}
                                    className="hover:bg-muted/40 hover:bg-background"
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.username}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>

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
                                <TableCell
                                    colSpan={5}
                                    className="text-right text-sm text-muted-foreground"
                                >
                                    Tổng: {teachers.length} giáo viên
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>

        </>
    );
};

export default ManageTeacher;