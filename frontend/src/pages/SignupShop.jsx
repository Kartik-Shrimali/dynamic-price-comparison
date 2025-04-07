import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export function SignupShop() {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up as Storekeeper</div>
                <Input placeholder="Enter your shop name"></Input>
                <Input placeholder="Enter your email"></Input>
                <Input placeholder="Enter your password"></Input>
                <Input placeholder="Enter your rating"></Input>
                <Input placeholder="Enter your delivery time in days"></Input>
                <Link to="/dashboard/store">
                    <Button input="Signup" color="blue"></Button>
                </Link>
                <Link to="/signin/store">
                    <Button input="Already have an account ? Signin" color="green"></Button>
                </Link>
            </div>
        </div>
    )
}