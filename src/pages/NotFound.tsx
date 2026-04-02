import { MoveRight } from "lucide-react"
import NotFoundImage from "../assets/NotFound_Banner.webp"
import { Link } from "react-router-dom"
const NotFound = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden  ">
            <img src={NotFoundImage} alt="Not Found" className=" h-72 object-cover bg-center dark:grayscale-50" />
            <p>Hình như bạn đang lạc ở đâu đó.</p>
            <p>Mình đưa bạn quay lại trang chủ nhe.</p>
            <Link to="/" className="text-xl flex font-bold items-center gap-2 text-primary group">
                Quay lại
                <MoveRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    )
}

export default NotFound