import { Input } from "../components/Input";
import { Button } from "../components/Button"
import {Link } from "react-router-dom"
export function SigninShop() {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">

            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign In as Shopkeeper</div>
                <Input placeholder="Enter your email"></Input>
                <Input placeholder="Enter your password"></Input>
                <Link to="/dashboard/store">
                    <Button input="Signin" color="blue"></Button>
                </Link>

                <Link to="/signup/store">
                    <Button input="Don't have an account ? Signup" color="green"></Button>
                </Link>
            </div>

        </div>
    )
}