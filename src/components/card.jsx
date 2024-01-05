
const Card = ({playerCards, handleHit, handleStand, value}) => {

    return ( <>
    <div className="flex items-center">
    <div className="pb-4 ">
            <h1 className="font-bold text-white font-sans text-lg">Player: {value}</h1>
    </div>
      <div className="flex scale-[60%] flex-row">
        {playerCards.map((card, index) => (
            <img className="mr-4" src={card.image} key={index} alt="" />
        ))}
      </div>
    </div>
    <div className="">
      <button className="mr-5 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" onClick={handleHit}>hit</button>
      <button className="ml-5 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" onClick={handleStand}>stand</button>
    </div>
    </> 
    );
}
 
export default Card;