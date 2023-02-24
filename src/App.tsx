import './App.css';
import ArtificialLive from './artificial-live/components/ArtificialLive';
import ProgramEditor from './artificial-live/components/ProgramEditor';
import Program from './artificial-live/program/Program';

function App() {
    return (
        <div className="App">
            <ArtificialLive />
            <ProgramEditor program={new Program()} />
        </div>
    );
  }

export default App;
