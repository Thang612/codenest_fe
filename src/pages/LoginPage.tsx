import { LoginForm } from "../components/login-form"
import LoginBanner from '../assets/banner_login.webp';


export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md bg-foreground backdrop-blur-2xl px-15 py-10 rounded-md shadow shadow-gray-500">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="max-h-screen rounded-2xl overflow-hidden relative hidden bg-muted lg:block">
                <img
                    src={LoginBanner}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:grayscale-50 "
                />
            </div>
        </div>
    )
}
