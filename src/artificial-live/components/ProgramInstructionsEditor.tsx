import { Component, ReactNode } from "react";
import Instruction from "../program/Instruction";
import Program from "../program/Program";

export interface ProgramInstructionsEditorProps {
    program: Program;
}

interface ProgramInstructionsEditorState {
    instructions: Array<Instruction>;
}

export default class ProgramInstructionsEditor extends Component<ProgramInstructionsEditorProps, ProgramInstructionsEditorState> {

    constructor(props: ProgramInstructionsEditorProps) {
        super(props);
        this.state = {
            instructions: props.program.instructions,
        };
    }

    render(): ReactNode {
        return (
            <div>
                {this.state.instructions.map((instruction, index) => this.renderInstruction(instruction, index))}
            </div>
        )
    }

    renderInstruction(instruction: Instruction, index: number): ReactNode {
        return (
            <div key={index}>
                {index} {String(instruction)}
            </div>
        );
    }
}