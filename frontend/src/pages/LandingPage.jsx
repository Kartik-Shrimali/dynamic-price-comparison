import { Link } from "react-router-dom";
import { Button } from "../components/Button"

export function LandingPage() {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center flex-col gap-6">

            <div className="text-4xl font-bold text-gray-800">WELCOME!</div>


            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up</div>
                <Link to="/signup/user">
                    <Button input="Signup as User" color="blue"></Button>
                </Link>
                <Link to="/signup/store">
                    <Button input="Signup as Shopkeeper" color="green"></Button>
                </Link>
            </div>


            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign In</div>
                <Link to="/signin/user">
                    <Button input="Signin as User" color="blue"></Button>
                </Link>
                <Link to="/signin/store">
                    <Button input="Signin as Shopkeeper" color="green"></Button>
                </Link>
            </div>
        </div>
    );
}
