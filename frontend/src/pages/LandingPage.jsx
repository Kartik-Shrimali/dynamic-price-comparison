import { Link } from "react-router-dom";


export function LandingPage() {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center flex-col gap-6">

            <div className="text-4xl font-bold text-gray-800">WELCOME!</div>


            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up</div>
                <Link to="/signup/user">
                    <button className = "bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl">Signup as User</button>
                </Link>
                <Link to="/signup/store">
                    <button className = "bg-green-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl">Signup as Shopkeeper</button>
                </Link>
            </div>


            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign In</div>
                <Link to="/signin/user">
                    <button className = "bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl">Signin as User</button>
                </Link>
                <Link to="/signin/store">
                    <button className = "bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl">Signin as Shopkeeper</button>
                </Link>
            </div>
        </div>
    );
}
