import React from "react";

export function Button({input , color}){
    return (
        <div>
            <button className={`bg-${color}-600 w-full m-2 rounded-lg p-3 text-white font-bold text-xl`}>
                {input}
            </button>
        </div>
    )
}