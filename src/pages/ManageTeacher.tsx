import { Edit, Eye, Plus, Trash } from "lucide-react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import axios from "axios"
import { useEffect, useState } from "react"
import type { User } from "../types"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { process } from "zod/v4/core"

const formSchema = z.object({
    name: z
        .string()
        .min(5, "Tên ít nhất 5 ký tự")
        .max(32, "Tên quá dài"),

    username: z
        .string()
        .min(3, "Username nên có ít nhất 3 ký tự.")
        .max(10, "Username nên có nhiều nhất 10 ký tự")
        .regex(
            /^[a-z0-9]+$/,
            "Username chỉ gồm chữ, số không viết hoa"
        ),

    email: z
        .string()
        .email("Email không hợp lệ"),
    dob: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Ngày sinh không hợp lệ",
        })
        .refine((date) => {
            const today = new Date();
            const birth = new Date(date);
            return birth < today;
        }, {
            message: "Ngày sinh phải nhỏ hơn hiện tại",
        }),
});
const ManageTeacher = () => {
    const [teachers, setTeachers] = useState<User[]>([])

    // Form 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dob: "",
        },
    });

    useEffect(() => {
        getTeacher()
    }, [])

    // Submit
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWMyMTRkZGUyOTBlNmY2MDQ4ZjI2MTEiLCJ1c2VybmFtZSI6InRoYW5nNjEyMzM0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc0MzMwNjIxLCJleHAiOjE3NzQzMzE3MzF9.1sBUlDK41QdkHSa5PledhiSs7c05V13KQMoYlMupd0o'

        try {
            const res = await toast.promise(
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
                    loading: "Đang tạo giáo viên...",
                    success: (res) => {
                        // update UI
                        setTeachers((prev) => [res.data, ...prev]);
                        form.reset();

                        return "Tạo giáo viên thành công";
                    },
                    error: (err) => {
                        return err.response?.data?.message || "Có lỗi xảy ra";
                    },
                }
            );

            // nếu bạn vẫn cần dùng res
            console.log(res);

        } catch (err) {
            console.log(err);
        }
    };


    const getTeacher = async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWMyMTRkZGUyOTBlNmY2MDQ4ZjI2MTEiLCJ1c2VybmFtZSI6InRoYW5nNjEyMzM0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc0MzMwNjIxLCJleHAiOjE3NzQzMzE3MzF9.1sBUlDK41QdkHSa5PledhiSs7c05V13KQMoYlMupd0o'
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}user/teacher`, {
                headers: {
                    'Authorization': `Bear ${token}`
                }
            })
            if (res.status === 200) {
                setTeachers(res.data)
            }
        } catch (err) {
            console.log({ err })
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Quản lý giáo viên</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md">
                            <Plus /> Thêm giáo viên
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-background shadow-xs px-6 py-5 shadow-gray-400">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-primary">Thêm giáo viên</DialogTitle>
                            <DialogDescription>
                                Anyone who has this link will be able to view this.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* NAME */}
                            <div>
                                <input
                                    placeholder="Tên"
                                    {...form.register("name")}
                                    className="border p-2 w-full"
                                />
                                {form.formState.errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* USERNAME */}
                            <div>
                                <input
                                    placeholder="Username"
                                    {...form.register("username")}
                                    className="border p-2 w-full"
                                />
                                {form.formState.errors.username && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <input
                                    placeholder="Email"
                                    {...form.register("email")}
                                    className="border p-2 w-full"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* DOB */}
                            <div>
                                <input
                                    type="date"
                                    {...form.register("dob")}
                                    className="border p-2 w-full"
                                />
                                {form.formState.errors.dob && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.dob.message}
                                    </p>
                                )}
                            </div>

                            {/* SUBMIT */}
                            <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                    <button className="cursor-pointer border border-gray-500 px-3 py-1 rounded-md hover:shadow ">Đóng</button>
                                </DialogClose>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded cursor-pointer"
                                >
                                    Tạo giáo viên
                                </button>
                            </div>
                        </form>

                    </DialogContent>
                </Dialog>

            </div>

            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Idx</TableHead>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Mã giáo viên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers && teachers.map((teacher: User, index) => (
                            <TableRow key={teacher._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.username}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 text-xs justify-end">
                                        <Eye className="text-blue-400 hover:bg-blue-400/10 p-1 rounded-md cursor-pointer" />
                                        <Edit className="text-green-400 hover:bg-green-400/10 p-1 rounded-md cursor-pointer" />
                                        <Trash className="text-red-400 hover:bg-red-400/10 p-1 rounded-md cursor-pointer" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="text-right">
                                <div>Trang 1/1</div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>


        </>
    )
}

export default ManageTeacher