import type { ReactNode } from "react";
import type { ERole } from "../enum";

export type TMenuItem = {
    label: string;
    icon?: ReactNode; // Cần dùng ReactNode để nhận được <LayoutDashboard />
    link?: string;
    subItems?: TMenuItem[];
}

export interface User {
    _id: string;
    name: string;
    username: string;
    password: string
    roles: ERole;
    email: string
    dob?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    _id: string;
    title: string;
    slug: string;
    minAge?: number;
    maxAge?: number;
    description?: string;
    isDeleted: boolean
    createdAt: Date;
    updatedAt: Date;
}

export interface Lesson {
    _id: string;
    title: string;
    content: string;
    materials: {
        title: string;
        url: string;
    }[];
    courseId: string;
    order: number;
}

export type ProtectedRouteProps = {
    children: React.ReactNode;
};