import { useState } from "react";
import { useEffect } from "react";

const useCards = () => {
    const [cards, setCards] = useState()
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('https://www.deckofcardsapi.com/api/deck/new/draw/?count=2');
              
              if (!response.ok) {
                throw new Error('Network response was not ok.');
              }
              const result = await response.json();
              setCards(result);
            } catch (error) {
              setError(error);
            }
          };
      
          fetchData();
    }, [])
    
    return { cards, error};
}
 
export default useCards;