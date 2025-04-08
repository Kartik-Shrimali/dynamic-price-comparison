import { Input } from "../components/Input";
import { Button } from "../components/Button"
import { Link } from "react-router-dom"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SigninUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    async function handleSignin() {
        try {
            let response = await fetch("http://localhost:3000/api/v1/users/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            let data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Signin successful")
                navigate("/dashboard/user")
            }
            else {
                alert(data.message || "Signin failed! Please try again.")
            }
        } catch (error) {
            alert("Network error! Please check your connection.")
            console.log(error)
        }

    }


    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">

            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign In as User</div>
                <Input placeholder="Enter your email" onChange={(e => {
                    setEmail(e.target.value)
                })}></Input>
                <Input placeholder="Enter your password" onChange={(e => {
                    setPassword(e.target.value)
                })}></Input>
                <Button input="Signin" color="blue" onClick={handleSignin}></Button>

                <Link to="/signup/user">
                    <Button input="Don't have an account ? Signup" color="green"></Button>
                </Link>
            </div>

        </div>
    )
}