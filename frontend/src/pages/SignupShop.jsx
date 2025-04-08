import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function SignupShop() {

    const [shopname, setShopname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rating, setRating] = useState("");
    const [delivery_time_days, setDelivery_time_days] = useState("");
    const navigate = useNavigate();

    async function handleSignup() {

        try {
            let response = fetch("http://localhost:3000/api/v1/shopkeeper/signup", {
                method: "POST",
                body: JSON.stringify({
                    shopname: shopname,
                    email: email,
                    password: password,
                    rating: rating,
                    delivery_time_days: delivery_time_days
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            let data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Signup successful")
                navigate("/dashboard/store")
            }
            else {
                alert(data.message || "Signup failed! Please try again.")
            }
        } catch (err) {
            alert("Network error! Please check your connection.")
            console.log(err)
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="bg-white drop-shadow-md w-6/12 flex justify-center items-center flex-col p-6 rounded-lg">
                <div className="text-3xl font-bold m-3">Sign Up as Storekeeper</div>
                <Input placeholder="Enter your shop name" onChange={(e) => {
                    setShopname(e.target.value);
                }}></Input>
                <Input placeholder="Enter your email" onChange={(e) => {
                    setEmail(e.target.value);
                }}></Input>
                <Input placeholder="Enter your password" onChange={(e) => {
                    setPassword(e.target.value);
                }}></Input>
                <Input placeholder="Enter your rating" onChange={(e) => {
                    setRating(e.target.value);
                }}></Input>
                <Input placeholder="Enter your delivery time in days" onChange={(e) => {
                    setDelivery_time_days(e.target.value);
                }}></Input>

                <Button input="Signup" color="blue" onClick={handleSignup}></Button>

                <Link to="/signin/store">
                    <Button input="Already have an account ? Signin" color="green"></Button>
                </Link>
            </div>
        </div>
    )
}