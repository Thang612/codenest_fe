import { X, Plus, Trash2, CheckCircle2, BookOpen, Users, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardHeader, CardTitle } from "../ui/card";

const DashboardModal = ({ onClose }: any) => {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full md:w-[700px] lg:w-[850px] h-screen bg-[#0f0f1a] shadow-2xl border-l border-white/10 flex flex-col overflow-hidden">

                {/* HEADER: Thông tin chung luôn hiển thị */}
                <div className="p-6 border-b border-white/10 bg-foreground">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Lớp Scratch cơ bản 1</h2>
                            <div className="flex gap-3 mt-1">
                                <span className="text-red-400 font-mono text-sm">Mã: SCR-01</span>
                                <span className="text-green-500 text-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Đang học
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-sm">
                            <p className="text-gray-500">Lịch học</p>
                            <p className="text-white font-medium">Thứ 2 - Thứ 4</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Giờ học</p>
                            <p className="text-white font-medium">18:00 - 19:30</p>
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-500">Sĩ số</p>
                            <div className="flex items-center gap-2">
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden w-20">
                                    <div className="bg-red-500 h-full w-[66%]" />
                                </div>
                                <p className="text-white font-medium text-xs">8/12</p>
                            </div>
                        </div>
                        <div className="text-sm text-right">
                            <p className="text-gray-500">Giáo viên</p>
                            <p className="text-white font-medium truncate text-red-400 underline underline-offset-4">Đặng Trung Thắng</p>
                        </div>
                    </div>
                </div>

                {/* TABS AREA */}
                <Tabs defaultValue="students" className="flex-1 flex flex-col">
                    <div className="px-6 pt-4 bg-background border-b border-white/5">
                        <TabsList className="bg-transparent gap-6 p-0 h-12 justify-start border-none">
                            <TabsTrigger value="students" className="data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:border-b-2 text-text border-red-500 hover:!text-primary px-2 rounded-md font-bold">
                                <Users size={16} className="mr-2" /> Danh sách học viên
                            </TabsTrigger>
                            <TabsTrigger value="curriculum" className="data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:border-b-2 text-text border-red-500 hover:!text-primary px-2 rounded-md font-bold">
                                <BookOpen size={16} className="mr-2" /> Tiến độ bài học
                            </TabsTrigger>
                            <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:border-b-2 text-text border-red-500 hover:!text-primary px-2 rounded-md font-bold">
                                <Info size={16} className="mr-2" /> Chi tiết lớp
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-background custom-scrollbar">
                        {/* TAB 1: DANH SÁCH HỌC SINH */}
                        <TabsContent value="students" className="p-6 m-0 outline-none">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Quản lý lớp học</h3>
                                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                                    <Plus size={18} /> Thêm học sinh
                                </button>
                            </div>

                            <div className="border border-white/5 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 font-medium italic">#</th>
                                            <th className="px-4 py-3 font-medium">Họ và tên</th>
                                            <th className="px-4 py-3 font-medium">Ngày sinh</th>
                                            <th className="px-4 py-3 font-medium">Học phí</th>
                                            <th className="px-4 py-3 font-medium text-right italic font-mono uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <tr key={i} className="hover:bg-white/2 transition-colors group">
                                                <td className="px-4 py-4 text-gray-500">{i}</td>
                                                <td className="px-4 py-4 font-medium text-white">Nguyễn Văn Bé {i}</td>
                                                <td className="px-4 py-4 text-gray-400 font-mono">15/05/2015</td>
                                                <td className="px-4 py-4 text-gray-400">
                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-bold">HOÀN TẤT</span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <button className="text-gray-500 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>

                        {/* TAB 2: TIẾN ĐỘ BÀI HỌC */}
                        <TabsContent value="curriculum" className="p-6 m-0 outline-none">
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((lesson) => (
                                    <Card key={lesson} className="bg-white/5 border-white/5 border overflow-hidden group hover:border-red-500/20 transition-all">
                                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                            <div>
                                                <CardTitle className="text-white text-base">Buổi {lesson}: Làm quen với Scratch</CardTitle>
                                                <p className="text-xs text-gray-500 mt-1">Nội dung: Tạo tài khoản, làm quen giao diện</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Điểm danh:</span>
                                                    <span className="text-xs text-white">8/8</span>
                                                </div>
                                                <CheckCircle2 className="text-green-500" size={20} />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* TAB 3: CHI TIẾT KHÁC (Overview bổ sung) */}
                        <TabsContent value="info" className="p-6 m-0 outline-none">
                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                                <p className="text-sm text-gray-400 leading-relaxed italic">
                                    Lớp học dành cho các bé từ 8-10 tuổi bắt đầu làm quen với tư duy lập trình kéo thả.
                                    Yêu cầu: Bé cần mang theo laptop cá nhân.
                                </p>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default DashboardModal;