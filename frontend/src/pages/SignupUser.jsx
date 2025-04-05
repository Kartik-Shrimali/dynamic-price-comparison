import { Link } from "react-router-dom"
import { Button } from "../components/Button"
import { Input } from "../components/Input"

export function SignupUser() {
    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">

            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up as User</div>

                <Input placeholder="Enter your name"></Input>
                <Input placeholder="Enter your email"></Input>
                <Input placeholder="Enter your password"></Input>
                <Link to="/dashboard/user">
                    <Button input="Signup" color="blue"></Button>
                </Link>
                <Link to="/signin/user">
                    <Button input="Already have an account ? Signin" color="green"></Button>
                </Link>

            </div>

        </div>
    )
}