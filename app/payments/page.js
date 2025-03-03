export default function Payments() {
    return (
        <div className="h-screen w-screen border border-red-500 flex flex-row">

            {/* Left Panel */}
            <div className="h-full w-1/5 border border-red-400 mr-6"></div>

            {/* Right Container */}
            <div className="h-full w-4/5 border border-red-500">

                {/* Calendar */}
                <div className="w-full h-1/4 bg-green-900 my-6 rounded-2xl"></div>

                {/* Payment Details & Payment History */}
                <div className="w-full h-2/3 border border-green-500 mt-3 flex flex-row">

                    {/* Payment Details */}
                    <div className="h-full w-1/2 border border-red-500"></div>

                    {/* Payment History */}
                    <div className="h-full w-1/2 border border-red-500"></div>
                </div>
            </div>


            <div></div>
        </div>
    );
}