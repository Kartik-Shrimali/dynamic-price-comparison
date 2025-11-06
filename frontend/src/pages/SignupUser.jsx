import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_BASE_URL } from '../config';
import { useState } from "react"

export function SignupUser() {
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function handleSignup() {
        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstname: firstname,
                    email: email.trim(),
                    password: password
                })
            })

            let data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signup successful")
                
                navigate("/dashboard/user")
            }
            else {
                alert(data.msg || "Signup failed! Please try again.")
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

                <input type = "text" placeholder = "Enter your firstname" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setFirstname(e.target.value)
                }}></input>
                <input type = "text" placeholder = "Enter your email" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setEmail(e.target.value)
                }}></input>
                <input type = "text" placeholder = "Enter your password" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setPassword(e.target.value)
                }}></input>
                <button className={`bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`} onClick={handleSignup}>Signup</button>

                <Link to="/signin/user">
                    <button className={`bg-green-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`}>Already have an account ? Signin</button>
                </Link>

            </div>

        </div>
    )
}