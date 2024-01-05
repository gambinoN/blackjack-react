
const Card = ({playerCards, handleHit, handleStand, value, isStanding}) => {

    return ( <>
    <div className="flex items-center flex-col-reverse md:flex-row max-h-[60%]">
    <div className="md:mr-20 mb-4 fixed md:static">
            <h1 className="font-bold text-white font-sans text-lg">Player: {value}</h1>
    </div>
      <div className="flex flex-row flex-wrap justify-center py-20">
        {playerCards.map((card, index) => (
            <img className="w-[100px] aspect-auto mr-4 mb-4" src={card.image} key={index} alt="" />
        ))}
      </div>
    </div>
    {!isStanding ? (
      <div className="">
        <button className="mr-5 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" onClick={handleHit}>hit</button>
        <button className="ml-5 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" onClick={handleStand}>stand</button>
      </div>
    ) : (
      <>
      </>
    )}
    
    </> 
    );
}
 
export default Card;