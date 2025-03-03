export default function Payments() {
    return (
        <div className="h-screen w-screen border border-red-500 flex flex-row">

            {/* Left Panel */}
            <div className="h-full w-1/5 border border-red-400 mr-6"></div>

            {/* Right Container */}
            <div className="h-full w-4/5 border border-red-500">

                {/* Calendar */}
                <div className="w-full h-1/4 border border-red-500 my-6"></div>

                {/* Payment Details & Payment History */}
                <div className="w-full h-2/3 border border-green-500 mt-3"></div>
            </div>


            <div></div>
        </div>
    );
}