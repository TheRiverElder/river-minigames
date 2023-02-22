import { Component } from "react";
import Array2D from "../../libs/lang/MultiDimensionArray";
import Program from "../program/Program";
import Tile from "../program/Tile";

interface ProgramEditorProps {
    program: Program
}
 
interface ProgramEditorState {
    board: Array2D<Tile | null>;
}
 
class ProgramEditor extends Component<ProgramEditorProps, ProgramEditorState> {
    constructor(props: ProgramEditorProps) {
        super(props);
        this.state = { board: new Array2D(props.program.board.width, props.program.board.width) };
    }

    render() { 
        return (
            <div className="ProgramEditor">
                {this.state.board.getRows().map(row => (
                    <div>
                        {row.map(tile => (
                            <div className="tile">
                                {tile?.type.id || ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
 
export default ProgramEditor;