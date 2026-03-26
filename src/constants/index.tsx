import {
    Users,
    BookOpen,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    UserCircle,
    School,
} from 'lucide-react';
import type { TMenuItem } from "../types";

// Thêm dấu [] sau TMenuItem
export const menuItems: TMenuItem[] = [
    {
        label: 'Dashboard',
        icon: <LayoutDashboard />,
        link: '/',
    },
    {
        label: 'Quản lý người dùng',
        icon: <Users />,
        subItems: [
            { label: 'Học sinh', link: '/users/students' },
            { label: 'Giáo viên', link: '/users/teachers' },
        ],
    },
    {
        label: 'Quản lý khóa học',
        icon: <BookOpen />,
        link: '/courses',
    },
    {
        label: 'Quản lý lớp học',
        icon: <GraduationCap />,
        link: '/classes',
    },
]