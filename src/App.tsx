import './App.css';
import ArtificialLive from './artificial-live/components/ArtificialLive';
import ProgramBoardEditor from './artificial-live/components/ProgramBoardEditor';
import Program from './artificial-live/program/Program';

function App() {
    return (
        <div className="App">
            <ArtificialLive />
            <ProgramBoardEditor program={new Program()} debugFlag={true} />
        </div>
    );
  }

export default App;
