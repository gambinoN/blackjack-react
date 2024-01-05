import { useState, useEffect } from "react";

const useValue = (cardsSet) => {
    const [value, setValue] = useState(0)

    //This custom hook is made for calculating the value of the dealers hand 
    //It works by taking the first letter of Card Code which represents its value, then turns it to number and adds it up to the sum

    useEffect(() => {
        if (cardsSet.length > 0) {
          let sum = cardsSet.reduce((acc, card) => {
            const cardValue = (() => {
              const firstChar = card.code.charAt(0);
              if (['J', 'Q', 'K', '0'].includes(firstChar)) {
                return 10;
              } else if (firstChar === 'A') {
                return 11;
              } else {
                return parseInt(firstChar);
              }
            })();
            return acc + cardValue;
          }, 0);

          // This part of code is for making ACE worth as 1 instead of 11 when the total value goes over 21

          let aceCount = cardsSet.filter((card) => card.value === 'ACE').length;
          while (sum > 21 && aceCount > 0) {
            sum -= 10; 
            aceCount--;
          }
  
          setValue(sum)
        } else {
          setValue(0)
        }
      }, [cardsSet])
      

    return { value };
}
 
export default useValue;