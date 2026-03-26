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
