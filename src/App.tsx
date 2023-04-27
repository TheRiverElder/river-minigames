import './App.css';
import BirminghamGameView from './birmingham/components/BirminghamGameView';
import { initializeBirmingham } from './birmingham/test';

function App() {

    const [game, player] = initializeBirmingham();

    return (
        <div className="App">
            {/* <ArtificialLive /> */}
            <BirminghamGameView game={game} player={player}/>
        </div>
    );
  }

export default App;
