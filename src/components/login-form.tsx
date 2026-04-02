import axios from "axios";
import { cn } from "../lib/utils";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner"; // Đảm bảo đã cài sonner
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const { setToken } = useAuthStore();
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Tạo một promise để toast.promise theo dõi
    const loginPromise = axios.post(`${import.meta.env.VITE_API_URL}auth/login`, {
      username,
      password,
    });

    toast.promise(loginPromise, {
      loading: 'Đang xác thực tài khoản...',
      success: (res) => {
        const token = res.data.access_token;
        setToken(token)
        navigate("/");
        setIsLoading(false);
        return 'Đăng nhập thành công!';
      },
      error: (err) => {
        setIsLoading(false);
        // Kiểm tra nếu lỗi 401 hoặc các lỗi auth thông thường
        if (err.response?.status === 401 || err.response?.status === 400) {
          return "Kiểm tra lại tài khoản và mật khẩu";
        }
        return "Đã có lỗi xảy ra, vui lòng thử lại sau";
      },
    });
  };

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            Đăng nhập tài khoản của bạn nhé!!!
          </h1>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="costnest"
            required
            disabled={isLoading} // Disable khi đang login
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-background !focus:border-0 disabled:opacity-50"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            disabled={isLoading} // Disable khi đang login
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background disabled:opacity-50"
          />
        </Field>

        <Field>
          <button
            type="submit"
            disabled={isLoading} // Disable nút bấm
            className={cn(
              "w-full text-white bg-primary py-2 rounded-2xl transition-all",
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primary/90"
            )}
          >
            {isLoading ? "Đang xử lý..." : "Login"}
          </button>
        </Field>
      </FieldGroup>
    </form>
  );
}