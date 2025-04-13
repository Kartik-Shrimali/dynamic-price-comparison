import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SigninUser() {
    const [email, setEmail] = useState(""); //change to username later on
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
                    email: email.trim(),
                    password: password
                })
            })

            let data = await response.json();
            console.log(data)

            if (data.token) {
                console.log("data reached here")
                localStorage.setItem("token", data.token);
                alert("Signin successful")
                navigate("/dashboard/user")
            }
            else {
                alert(data.msg|| "Signin failed! Please try again.")
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
                <input type = "text" placeholder = "Enter your email" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setEmail(e.target.value)
                }} ></input>
                <input type = "text" placeholder = "Enter your password" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setPassword(e.target.value)
                }}></input>                
                <button className={`bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`} onClick={handleSignin}>Signin</button>

                <Link to="/signup/user">
                    <button className={`bg-green-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`}>Don't have an account ? Signup</button>
                </Link>
            </div>

        </div>
    )
}