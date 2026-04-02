import { MoveRight } from "lucide-react"
import AuthencationImg from "../assets/403_Unauthencation_Banner.webp"
import { Link } from "react-router-dom"

const Authentication = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden  ">
            <img src={AuthencationImg} alt="Authentication" className=" h-72 object-cover bg-center dark:grayscale-50" />
            <p>Hình như bạn không có quyền truy cập trang này.</p>
            <p>Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là sai sót.</p>
            <Link to="/" className="text-xl flex font-bold items-center gap-2 text-primary group">
                Quay lại
                <MoveRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    )
}

export default Authentication