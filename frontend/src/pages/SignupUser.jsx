import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useState } from "react"

export function SignupUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function handleSignup() {
        try {
            let response = await fetch("http://localhost:3000/api/v1/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })

            let data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Signup successful")
                
                navigate("/dashboard/user")
            }
            else {
                alert(data.message || "Signup failed! Please try again.")
            }
        } catch (error) {
            alert("Network error! Please check your connection.")
            console.log(error)
        }

    }

    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">

            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up as User</div>

                <Input placeholder="Enter your name" onChange={(e) => {
                    setName(e.target.value)
                }}></Input>
                <Input placeholder="Enter your email" onChange={(e) => {
                    setEmail(e.target.value)
                }}></Input>
                <Input placeholder="Enter your password" onChange={(e) => {
                    setPassword(e.target.value)
                }}></Input>
                <Button input="Signup" color="blue" onClick={handleSignup}></Button>

                <Link to="/signin/user">
                    <Button input="Already have an account ? Signin" color="green"></Button>
                </Link>

            </div>

        </div>
    )
}