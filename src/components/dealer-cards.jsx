import { useState, useEffect } from "react"
import useValue from "../hooks/get-value";

const DealerCards = ({isPlaying, deckId, sendDealerValueToParent, isStanding, drawCard, playerValue}) => {
    const [cards, setCards] = useState({})
    const [error, setError] = useState(null)
    const [dealerHandValue, setDealerHandValue] = useState(0)

    //Fetching the data from API, and updating our state with them

    useEffect(() => {
      if (deckId) {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
            );
  
            if (!response.ok) {
              throw new Error("Network response was not ok.");
            }
            const result = await response.json();
            setCards(result);
          } catch (error) {
            setError(error);
            console.log(error)
          }
        };
  
        fetchData();
      }
    }, [deckId]);

    //Checking if cards are being processed properly and if there are cards setting dealerCards to that array
    //Otherwise setting dealerCards to an empty array
    
    const dealerCards = cards && cards.cards ? cards.cards : []

    //Getting the dealers hand value from custom hook that I made, and destructuring it

    const dealerHandValueFromHook = useValue(dealerCards);
    const { value } = dealerHandValueFromHook;

      //Setting the dealers hand value to the value that we have recieved

    useEffect(() => {
      setDealerHandValue(value);
    }, [value]);

    //Function that enables us drawing card for dealer when the player is standing
    //It is being called upon isStanding, and will be called until the dealer or player wins

    const drawCardOnStand = async () => {
      if (deckId) {
        try {
          const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          const result = await response.json();
          setCards(prevState => ({ ...prevState, cards: [...prevState.cards, ...result.cards] }));
        } catch (error) {
          setError(error);
        }
      }
    };

    //Invoking the function drawCardOnStand if isStanding is set to true, and if dealers hand is smaller than players

    useEffect(() => {
      if (isStanding && dealerHandValue < 21 && dealerHandValue < playerValue) {
        setTimeout(() => {
          drawCardOnStand();
        }, 1000)
      }
    }, [isStanding, dealerHandValue, playerValue]);

    //Sending the value of dealers hand to parent so we can process the logic of the game

    useEffect(() => {
        sendDealerValueToParent(dealerHandValue);
    }, [dealerHandValue, sendDealerValueToParent]);

    return ( 
    <>
    {isPlaying && !isStanding && !drawCard && dealerCards.length > 0 ? (
        <div className="flex items-center">
        <div className="pt-4 ">
            <h1 className="font-bold text-white font-sans text-lg">Dealer:</h1>
        </div>
            <div className="scale-[60%] flex flex-row" >
                <img className="mr-4" src={dealerCards[0].image} alt="" />
                <img className="mr-4" src="https://www.deckofcardsapi.com/static/img/back.png" alt="" />
            </div>
      
      </div>
      ) : isStanding ? (
        <div className="flex items-center">
          <div className="p-4">
            <h1 className="font-bold text-white font-sans text-lg">Dealer: {value}</h1>
          </div>
          <div className="scale-[60%] flex flex-row" >
            {dealerCards.map((card, index) => (
              <img className="mr-4" src={card.image} key={index} alt="" />
            ))}
          </div>
        </div>
      ) : null
    }
    </> );
}
 
export default DealerCards;