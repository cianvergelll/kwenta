import { PlusIcon } from "@heroicons/react/24/solid";

export default function Home() {
    return (
        <div className="h-screen w-screen border border-red-500 flex flex-row">
            {/* Left Panel */}
            <div className="h-full w-1/5 border border-red-400 mr-11"></div>

            {/* Button & Today's History */}
            <div className="h-full w-1/3 border border-red-400 mr-11 flex flex-col">
                
                {/* Button */}
                <div className="w-full h-20 my-6 bg-green-500 rounded-3xl flex items-center justify-end">
                    <button className="w-12 h-12 bg-white text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition mr-5">
                        <PlusIcon className="w-6 h-6 text-green-400 hover:text-white" />
                    </button>
                </div>

                {/* Today's History */}
                <div className="w-full h-5/6 border border-red-400">


                </div>
            </div>

            {/* Chart & Expense Summary */}
            <div className="h-full w-1/3 border border-red-400">
            
                {/* Chart */}
                <div className="w-full h-1/2 border border-red-400 mt-6 mb-10"></div>

                {/* Expense Summary */}
                <div className="w-full h-2/5 border border-red-400"></div>
            </div>

        </div>
    );
}
