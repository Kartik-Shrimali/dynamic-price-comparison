import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faRightFromBracket, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


export function DashboardStore() {
    return (
        <div className="bg-gray-100 h-screen flex">
            <div className="bg-white shadow-lg w-1/5 flex flex-col mb-5">{/* sidebar*/}
                <div className=" font-bold m-3 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUser} className="border-4 border-gray-800 rounded-full p-2 text-xl" />
                    <div className="m-5 text-2xl">Welcome User</div>
                </div>

                <div className="flex justify-center items-center m-5">
                    <button className="w-full p-3 text-xl text-left text-gray-700 font-semibold hover:bg-gray-200 rounded-lg flex justify-center items-center gap-2">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <div>
                            Logout
                        </div>
                    </button>
                </div>

            </div>

            <div className="flex-1 p-8">

                <div className="flex items-center bg-white shadow p-3 rounded-lg mb-6">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
                    <input type="text" placeholder="Search for products..." className="ml-3 w-full p-2 outline-none" />
                </div>

                <h2 className="text-xl font-bold mb-4">Manage Your Products</h2>
                <div className="bg-white shadow p-4 rounded-lg">
                    <p>No products available. (This section will display shopkeeper's products.)</p>
                </div>

            </div>
        </div>
    )
}
