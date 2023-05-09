import React, { Component, DOMAttributes, MouseEvent } from "react";
import Array2D from "../../libs/lang/Array2D";
import Program from "../program/Program";
import Tile from "../program/Tile";
import "./ProgramBoardEditor.scss";
import { int } from "../../libs/CommonTypes";
import GrowTile from "../instances/neublumen/tiles/GrowTile";
import { TILE_TYPE_COMMON } from "../instances/neublumen/tiles/TileTypes";
import Cell from "../program/Cell";
import Vector2 from "../../libs/math/Vector2";
import { requireNonNull } from "../../libs/lang/Objects";
import Optional from "../../libs/lang/Optional";
// import classNames from "classnames";
import DecadeTile from "../instances/neublumen/tiles/DecadeTile";
import Direction from "../program/Direction";
import ConveyorTile from "../instances/neublumen/tiles/ConveyorTile";
import SensorTile from "../instances/neublumen/tiles/SensorTile";
import classNames from "classnames";

interface ProgramBoardEditorProps {
    program: Program;
    debugFlag?: boolean;
}

interface ProgramBoardEditorState {
    board: Array2D<Cell>;
    inventory: Array<Tile>;
    draggableSource: Draggable<Tile> | null;
    draggingItemPosition: Vector2;
    hoveringCell: Cell | null;
}

class ProgramBoardEditor extends Component<ProgramBoardEditorProps, ProgramBoardEditorState> {

    private get isDebug() {
        return this.props.debugFlag === true;
    }

    constructor(props: ProgramBoardEditorProps) {
        super(props);
        this.state = {
            board: props.program.board,
            inventory: [
                new GrowTile(TILE_TYPE_COMMON),
                new DecadeTile(TILE_TYPE_COMMON),
                new ConveyorTile(TILE_TYPE_COMMON, Direction.RIGHT),
                new SensorTile(TILE_TYPE_COMMON, Direction.RIGHT),
            ],
            draggableSource: null,
            draggingItemPosition: Vector2.INVALID_VECTOR2,
            hoveringCell: null,
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
            <div 
                className="board"
                onMouseLeave={() => this.setState(() => ({ hoveringCell: null }))}
            >
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
                key={x}
                {...PREVENT_DRAG_EVENTS}
                className={classNames("cell", tile && "with-content")}
                onMouseUp={e => this.dragEnd(e, new CellDraggable(cell))}
                onMouseDown={e => Optional.ofNullable(tile).ifPresent(() => this.dragPrepare(e, new CellDraggable(cell)))}
                onMouseEnter={() => this.setState(() => ({ hoveringCell: cell }))}
            >
                {tile ? this.renderTile(tile, x) : null}
                <div className="border" draggable={false} />
            </div>
        )
    }

    renderInventory() {
        return (
            <div className="inventory">
                {this.state.inventory.map((tile, index) => (
                    <div
                        key={index}
                        {...PREVENT_DRAG_EVENTS}
                        className="inventory-slot"
                        onMouseUp={e => this.dragEnd(e, new InventorySlotAddDraggable(this.state.inventory, index))}
                        onMouseDown={e => this.dragPrepare(e, new InventorySlotDraggable(this.state.inventory, index))}
                    >
                        {this.renderTile(tile, index)}
                    </div>
                ))}
                <div
                    {...PREVENT_DRAG_EVENTS}
                    className="inventory-slot placeholder"
                    onMouseUp={e => this.dragEnd(e, new InventorySlotDraggable(this.state.inventory, this.state.inventory.length))}
                >
                    <span>+</span>
                </div>
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
                <canvas ref={ref} draggable={false} />
            </div>
        )
    }

    renderDraggingItem() {
        const s = this.state;
        if (s.draggableSource === null) return null;
        const item = s.draggableSource.get();
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
    private preparedDraggableSource: Draggable<Tile> | null = null;

    dragPrepare(event: MouseEvent, draggingSource: Draggable<Tile>) {
        const editor = this.editorRef.current;
        if (!editor) return;

        const rect = editor.getBoundingClientRect();

        const mousePosition = new Vector2(event.clientX, event.clientY);
        this.dragOffset = mousePosition.sub(new Vector2(rect.x, rect.y));
        this.dragStartMousePosition = mousePosition;
        this.preparedDraggableSource = draggingSource;
    }

    dragStart() {
        this.setState(() => ({ draggableSource: this.preparedDraggableSource }));
    }

    dragMove(event: MouseEvent) {
        if (this.preparedDraggableSource === null) return;

        if (this.state.draggableSource === null) {
            this.dragStart();
        }

        event.stopPropagation();

        const mousePosition = new Vector2(event.clientX, event.clientY);
        this.setState(() => ({ draggingItemPosition: this.dragOffset.add(mousePosition.sub(this.dragStartMousePosition)) }));
    }

    dragEnd(event: MouseEvent, draggableTarget: Draggable<Tile> | null = null) {

        const draggableSource = this.state.draggableSource;
        if (draggableSource === null) {
            this.resetDragging();
            return;
        }

        if (draggableTarget) {
            event.stopPropagation();
            const draggingItem = draggableSource.take();
            if (draggingItem) {
                const old = draggableTarget.set(draggingItem);
                if (old) {
                    draggableSource.add(old);
                }
            }
        }
        this.resetDragging();
    }

    resetDragging() {
        this.setState(() => ({
            draggableSource: null,
            draggingItemPosition: Vector2.INVALID_VECTOR2,
        }));
        this.dragOffset = Vector2.INVALID_VECTOR2;
        this.dragStartMousePosition = Vector2.INVALID_VECTOR2;
        this.preparedDraggableSource = null;
    }

    onWindowKeyDown = (event: KeyboardEvent) => {
        const tile = this.state.hoveringCell?.tile;
        if (!tile) return;
        if (event.key === "r") {
            tile.rotate(false);
            this.forceUpdate();
        } else if (event.key === "R") {
            tile.rotate(true);
            this.forceUpdate();
        } else if (event.key === "c" && this.isDebug) {
            const newTile = tile.copy();
            this.state.inventory.push(newTile);
            this.forceUpdate();
        }
    }

    private renderCanvasEventDispatcher = new Set<() => void>();
    private renderCanvas() {
        this.renderCanvasEventDispatcher.forEach(l => l());
        this.renderCanvasEventDispatcher.clear();
    }

    componentDidMount() {
        this.resetDragging();
        this.renderCanvas();
        window.addEventListener("keydown", this.onWindowKeyDown);
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    componentWillUnmount(): void {
        this.renderCanvasEventDispatcher.clear();
        window.removeEventListener("keydown", this.onWindowKeyDown);
    }
}

export default ProgramBoardEditor;


const PREVENT_DRAG_EVENTS: DOMAttributes<HTMLElement> = {
    onDrag: preventDragEvents,
    onDragStart: preventDragEvents,
    onDragEnd: preventDragEvents,
    onDragOver: preventDragEvents,
    onDragEnter: preventDragEvents,
    onDragLeave: preventDragEvents,
    onDragExit: preventDragEvents,
    onDrop: preventDragEvents,
}

function preventDragEvents(event: MouseEvent) {
    event.preventDefault();
}

interface Draggable<T> {
    get(): T;
    set(value: T): T | null;
    add(value: T): boolean;
    take(): T;
}

class InventorySlotDraggable implements Draggable<Tile> {

    readonly inventory: Array<Tile>;
    readonly index: int;

    constructor(inventory: Array<Tile>, index: int) {
        this.inventory = inventory;
        this.index = index;
    }

    get(): Tile {
        return requireNonNull(this.inventory[this.index]);
    }

    set(value: Tile): Tile | null {
        const old = this.inventory[this.index] || null;
        this.inventory[this.index] = value;
        return old;
    }

    add(value: Tile): boolean {
        this.inventory.splice(this.index, 0, value);
        return true;
    }

    take(): Tile {
        const old = requireNonNull(this.inventory[this.index]);
        this.inventory.splice(this.index, 1);
        return old;
    }

}

class InventorySlotAddDraggable extends InventorySlotDraggable {
    set(value: Tile): Tile | null {
        this.add(value);
        return null;
    }
}

class CellDraggable implements Draggable<Tile> {

    readonly cell: Cell;

    constructor(cell: Cell) {
        this.cell = cell;
    }

    get(): Tile {
        return this.cell.tile!!;
    }

    set(value: Tile): Tile | null {
        const old = this.cell.tile || null;
        this.cell.tile = value;
        return old;
    }

    add(value: Tile): boolean {
        if (this.cell.tile) return false;
        this.cell.tile = value;
        return true;
    }

    take(): Tile {
        const old = requireNonNull(this.cell.tile);
        this.cell.tile = null;
        return old;
    }

}