import Card from './components/card'
import DealerCards from './components/dealer-cards'
import { useState, useEffect } from 'react'
import useCards from './hooks/get-cards'
import DealerWinScreen from './components/dealer-win-screen';
import PlayerWonScreen from './components/player-win-screen';

function App() {
  const { cards: initialCards } = useCards();
  const [playerCards, setPlayerCards] = useState([]);
  const [deckId, setDeckId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStanding, setIsStanding] = useState(false)
  const [isBlackJack, setIsBlackJack] = useState(false)
  const [isDealersBlackJack, setIsDealersBlackJack] = useState(false)
  const [drawCard, setDrawCard] = useState(false)

  const [playerValue, setPlayerValue] = useState(0)
  const [dealerValue, setDealerValue] = useState(0)
  const [playerLost, setPlayerLost] = useState(false)
  const [playerWin, setPlayerWin] = useState(false)

  //Setting the players cards and deckId value to the ones of the deck that we have got
  //Reason because of setting deckId is so that we can reuse it later to draw cards from the same deck
  //We avoid getting two same cards

  useEffect(() => {
    if (initialCards) {
      setPlayerCards(initialCards.cards || []);
      setDeckId(initialCards.deck_id || null);
    }
  }, [initialCards]);

  //In this function we calculate the value of player cards

  function calculatePlayerValue(cards) {
    let totalValue = cards.reduce((acc, card) => {
      if (card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING') {
        return acc + 10;
      } else if (card.value === 'ACE') {
        return acc + 11;
      } else {
        return acc + parseInt(card.value);
      }
    }, 0);
  
    // This part of code is for making ACE worth as 1 instead of 11 when the total value goes over 21

    let aceCount = cards.filter((card) => card.value === 'ACE').length;
    while (totalValue > 21 && aceCount > 0) {
      totalValue -= 10; 
      aceCount--;
    }
    return totalValue;
  }

  //We handle the data recieved from the child, and assign the dealers cards value to data

  const handleReceivedDealerValue = (value) => {
    setDealerValue(value)
  }
  
  //We handle pressing the start game button 

  const handleStart = () => {
    setIsPlaying(!isPlaying)
    const value = calculatePlayerValue(playerCards)
    setPlayerValue(value);
  }

  //Handling pressing the stand button and implementing the game logic

  const handleStand = () => {
    setIsStanding(prevIsStanding => !prevIsStanding);
    setDrawCard(prevDrawCard => !prevDrawCard);
  };

  //useEffect hook running when player is standing to check who won the game

  const checkGameOutcome = () => {
     if (playerValue > 21) {
      setPlayerLost(true);
    } else if (dealerValue === 21) {
      setIsDealersBlackJack(true);
      setPlayerLost(true);
    } else if (dealerValue > 21) {
      setPlayerWin(true);
    } else if (isStanding) {
      if (dealerValue > playerValue) {
        setPlayerLost(true);
      } else if (dealerValue === playerValue) {
        setPlayerLost(true);
      } else if (playerValue === 21) {
        setIsBlackJack(true);
        setPlayerWin(true);
      } else {
        setPlayerWin(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkGameOutcome()
    }, 3000)

    return () => clearTimeout(timer);
  }, [playerValue, dealerValue, isStanding]);

  //Handling pressing the hit button and implementing the player busting function

  const handleHit = async () => {
    if (deckId) {
      try {
        const response = await fetch(
          `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const result = await response.json();
        if (result && result.cards && result.cards.length > 0) {
          const updatedCards = [...playerCards, result.cards[0]];
          setPlayerCards(updatedCards)
        }
      } catch (error) {
        console.error("Error fetching card:", error);
      }
    }

    
  };

  useEffect(() => {
    const value = calculatePlayerValue(playerCards);
    setPlayerValue(value);    
  }, [playerCards]);


// Use the fetched initial cards and deck ID in the play again 
const handlePlayAgainClick = async () => {
    try { setPlayerCards([]);
    setDeckId(null);
    setIsPlaying(false);
    setIsStanding(false);
    setIsBlackJack(false);
    setIsDealersBlackJack(false);
    setDrawCard(false);
    setPlayerLost(false);
    setPlayerWin(false);

    setDeckId(initialCards.deck_id || null);

    const deckResponse = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        if (!deckResponse.ok) {
            throw new Error('Failed to fetch new deck');
        }
        const deckData = await deckResponse.json();
        if (!deckData || !deckData.deck_id) {
            throw new Error('Invalid deck data');
        }
        setDeckId(deckData.deck_id);

        const initialCardsResponse = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
        if (!initialCardsResponse.ok) {
            throw new Error('Failed to fetch initial cards');
        }
        const initialCardsData = await initialCardsResponse.json();
        if (!initialCardsData || !initialCardsData.cards) {
            throw new Error('Invalid initial cards data');
        }
        setPlayerCards(initialCardsData.cards);

        handleStart();
    } catch (error) {
        console.error('Error in handlePlayAgainClick:', error);
    }
};

  return (
    <>
      { playerLost ? (
        <DealerWinScreen onPlayAgain={handlePlayAgainClick} isDealersBlackJack={isDealersBlackJack} />
      ) : playerWin ? (
        <PlayerWonScreen onPlayAgain={handlePlayAgainClick} isBlackJack={isBlackJack} />
      ) : initialCards && isPlaying ? (
        <div id="main" className="container flex xl:max-w-full md:justify-center items-center flex-col bg-cover h-screen">
          <div className='flex flex-col items-center justify-center h-full'>
            <Card handleStand={handleStand} handleHit={handleHit} isStanding={isStanding} playerCards={playerCards} value={playerValue}/>
            <DealerCards isStanding={isStanding} playerValue={playerValue} drawCard={drawCard} isPlaying={isPlaying} deckId={deckId} sendDealerValueToParent={handleReceivedDealerValue}/>
          </div>
        </div> 
        ) : (
        initialCards ? (
          <div id='start' className='h-screen flex justify-center items-center flex-col bg-cover'>
            <div className="p-8 text-center bg-black flex flex-col justify-center items-center w-[80%] md:w-[50%] bg-opacity-35 rounded-md">
              <p className='font-bold font-sans text-md text-white'>🃏 Are you ready to test out your luck? 🃏</p>
              <h1 className="font-bold text-3xl font-sans text-white mt-10">PLAY THE GAME OF BLACKJACK</h1>
            </div>
          <button className="mr-5 mt-10 py-2 px-6 bg-black-300 text-xl hover:text-white hover:bg-yellow-600 text-yellow-400 uppercase font-bold font-sans rounded-lg" onClick={handleStart}>Start Game</button>
          </div>
        ) : (
          <p>Loading...</p>
        )
      )}
    </>
  )
}

export default App
