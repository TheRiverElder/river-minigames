import React, { Component, MouseEvent } from "react";
import Array2D from "../../libs/lang/Array2D";
import Program from "../program/Program";
import Tile from "../program/Tile";
import "./ProgramEditor.scss";
import { int } from "../../libs/CommonTypes";
import GrowTile from "../instances/neublumen/tiles/GrowTile";
import { TILE_TYPE_COMMON } from "../instances/neublumen/tiles/TileTypes";
import Cell from "../program/Cell";
import Vector2 from "../../libs/math/Vector2";

interface ProgramEditorProps {
    program: Program
}

interface ProgramEditorState {
    board: Array2D<Cell>;
    inventory: Array<Tile>;
    draggingItemIndex: int | null;
    draggingItemPosition: Vector2;
}

class ProgramEditor extends Component<ProgramEditorProps, ProgramEditorState> {
    constructor(props: ProgramEditorProps) {
        super(props);
        this.state = {
            board: props.program.board,
            inventory: [
                new GrowTile(TILE_TYPE_COMMON),
                new GrowTile(TILE_TYPE_COMMON),
            ],
            draggingItemIndex: null,
            draggingItemPosition: Vector2.INVALID_VECTOR2,
        };
    }

    private editorRef = React.createRef<HTMLDivElement>();

    render() {
        return (
            <div 
                className="ProgramEditor" 
                ref={this.editorRef}
                onMouseMove={e => this.dragMove(e)}
                onMouseUp={e => this.dragEnd(e)}
                onMouseLeave={e => this.dragEnd(e)}
            >
                {this.renderSpace()}
                {this.renderBoard()}
                {this.renderSpace()}
                {this.renderInventory()}
                {this.renderDraggingItem()}
            </div>
        );
    }

    renderBoard() {
        return (
            <div className="board">
                {this.state.board.getRows().map((row, y) => (
                    <div className="row" key={y}>
                        {row.map((cell, x) => this.renderCell(cell, x, y))}
                    </div>
                ))}
            </div>
        );
    }

    renderCell(cell: Cell, x: int, y: int) {
        const tile = cell.tile;
        return (
            <div 
                className="cell" 
                key={x}
                onMouseUp={e => this.dragEnd(e, cell)}
            >
                {tile? this.renderTile(tile, x) : null}
                <div className="border" />
            </div>
        )
    }

    renderInventory() {
        return (
            <div className="inventory">
                {this.state.inventory.map((tile, index) => (
                    <div 
                        className="inventory-slot"
                        onMouseDown={e => this.dragPrepare(e, index)}
                    >
                        {this.renderTile(tile, index)}
                    </div>
                ))}
            </div>
        );
    }

    renderTile(tile: Tile, key: string | number) {
        const ref = React.createRef<HTMLCanvasElement>();
        this.renderCanvasEventDispatcher.add(() => {
            const g = ref.current?.getContext("2d");
            if (!g) return;
            g.save();
            g.scale(g.canvas.width, g.canvas.height);
            tile.render(g);
            g.restore()
        });
        return (
            <div className="tile" key={key}>
                <canvas ref={ref} />
            </div>
        )
    }

    renderDraggingItem() {
        const s = this.state;
        if (s.draggingItemIndex === null) return null;
        const item = s.inventory[s.draggingItemIndex];
        if (!item) return null;

        const { x, y } = s.draggingItemPosition;

        return (
            <div className="dragging-item" style={{
                left: x + "px",
                top: y + "px",
            }}>
                {this.renderTile(item, -1)}
            </div>
        );
    }

    renderSpace() {
        return (
            <div className="space" />
        );
    }

    private dragOffset: Vector2 = Vector2.INVALID_VECTOR2;
    private dragStartMousePosition: Vector2 = Vector2.INVALID_VECTOR2;
    private prepareDraggingItemIndex: number | null = null;

    dragPrepare(event: MouseEvent, index: number) {
        const editor = this.editorRef.current;
        if (!editor) return;

        const rect = editor.getBoundingClientRect();

        const mousePosition = new Vector2(event.clientX, event.clientY);
        this.dragOffset = mousePosition.sub(new Vector2(rect.x, rect.y));
        this.dragStartMousePosition = mousePosition;
        this.prepareDraggingItemIndex = index;
    }

    dragStart() {
        this.setState(() => ({ draggingItemIndex: this.prepareDraggingItemIndex }));
    }

    dragMove(event: MouseEvent) {
        if (this.prepareDraggingItemIndex === null) return;

        if (this.state.draggingItemIndex === null) {
            this.dragStart();
        }

        const mousePosition = new Vector2(event.clientX, event.clientY);
        this.setState(() => ({ draggingItemPosition: this.dragOffset.add(mousePosition.sub(this.dragStartMousePosition)) }));
    }

    dragEnd(event: MouseEvent, cell: Cell | null = null) {
        if (this.state.draggingItemIndex === null) return;

        if (cell) {
            event.stopPropagation();
            const draggingItem = this.state.inventory[this.state.draggingItemIndex];
            if (draggingItem) {
                const oldItem = cell.tile;
                cell.tile = draggingItem
                if (oldItem) {
                    this.state.inventory.splice(this.state.draggingItemIndex, 1, oldItem);
                } else {
                    this.state.inventory.splice(this.state.draggingItemIndex, 1);
                }
            }
        }
        this.setState(() => ({ draggingItemIndex: null, draggingItemPosition: Vector2.INVALID_VECTOR2 }));
        this.dragOffset = Vector2.INVALID_VECTOR2;
        this.dragStartMousePosition = Vector2.INVALID_VECTOR2;
        this.prepareDraggingItemIndex = null;
    }

    private renderCanvasEventDispatcher = new Set<() => void>();

    componentDidMount() {
        this.renderCanvasEventDispatcher.forEach(l => l());
        this.renderCanvasEventDispatcher.clear();
    }

    componentDidUpdate() {
        this.renderCanvasEventDispatcher.forEach(l => l());
        this.renderCanvasEventDispatcher.clear();
    }
}

export default ProgramEditor;