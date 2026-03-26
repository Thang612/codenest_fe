export const ERole = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
} as const;

export type ERole = (typeof ERole)[keyof typeof ERole];