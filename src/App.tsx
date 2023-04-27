import './App.css';
import BirminghamGameView from './birmingham/components/BirminghamGameView';
import { initializeBirmingham } from './birmingham/test';

function App() {

    const game = initializeBirmingham(1);

    return (
        <div className="App">
            {/* <ArtificialLive /> */}
            <BirminghamGameView game={game} player={game.players[0]}/>
        </div>
    );
  }

export default App;
