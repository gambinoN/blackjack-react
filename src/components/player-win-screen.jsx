const PlayerWonScreen = ({isBlackJack, onPlayAgain}) => {

    const handlePlayAgain = () => {
        if (typeof onPlayAgain === 'function') {
          onPlayAgain();
        }
    };

    return ( 
        <>
        {isBlackJack ? ( 
            <div id="main" className="container h-screen xl:max-w-full flex flex-col justify-center items-center bg-cover">
            <div className="p-8 bg-black flex flex-col justify-center items-center bg-opacity-35 rounded-md">
                <h1 className="font-bold text-3xl font-sans text-white mb-10">🃏 Congratulations: You have won by BlackJack! 🃏</h1>
                <p className="font-bold font-sans text-md text-white">Good job, you have won this round!</p>
                <p className="font-sans text-md text-white">Test your luck again. Ready to try again?</p>
            </div>
            <button onClick={handlePlayAgain} className="mr-5 mt-10 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" >Play Again</button>
        </div> 
        ) : ( 
            <div id="main" className="container h-screen xl:max-w-full flex flex-col justify-center items-center bg-cover">
                <div className="p-8 bg-black flex flex-col justify-center items-center bg-opacity-35 rounded-md">
                    <h1 className="font-bold text-3xl font-sans text-white mb-10">🃏 Congratulations: You Win! 🃏</h1>
                    <p className="font-bold font-sans text-md text-white">Good job, you have won this round!</p>
                    <p className="font-sans text-md text-white">Test your luck again. Ready to try again?</p>
                </div>
                <button onClick={handlePlayAgain} className="mr-5 mt-10 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" >Play Again</button>
            </div> 
        )}
        </>
    );
}
 
export default PlayerWonScreen;