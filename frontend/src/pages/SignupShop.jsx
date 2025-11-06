import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BACKEND_API_BASE_URL } from './config';

export function SignupShop() {

    const [shopname, setShopname] = useState("");
    const [password, setPassword] = useState("");
    const [rating, setRating] = useState(1);
    const [delivery_time_days, setDelivery_time_days] = useState(1);
    const navigate = useNavigate();

    async function handleSignup() {

        try {
            let response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/shopkeeper/signup`, {
                method: "POST",
                body: JSON.stringify({
                    shopname: shopname,
                    password: password,
                    rating: rating,
                    delivery_time_days: delivery_time_days
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            let data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signup successful")
                navigate("/dashboard/store")
            }
            else {
                alert(data.message || "Signup failed! Please try again. " + data.errors.message)
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
                <input type = "text" placeholder = "Enter your shop name" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setShopname(e.target.value);
                }}></input>

                <input type = "text" placeholder = "Enter your password" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    setPassword(e.target.value);
                }}></input>                
                <input type = "text" placeholder = "Enter your rating" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    
                    setRating(parseFloat(e.target.value));
                }}></input>                
                <input type = "text" placeholder = "Enter your delivery time in days" className = "p-3 m-2 rounded-lg w-full border-gray-300 border-2 " onChange={(e) => {
                    
                    setDelivery_time_days(parseInt(e.target.value));
                }}></input>                

                <button className={`bg-blue-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`} onClick={handleSignup}>Signup</button>                

                <Link to="/signin/store">
                    <button className={`bg-green-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`}>Already have an account ? Signin</button>                
                </Link>
            </div>
        </div>
    )
}