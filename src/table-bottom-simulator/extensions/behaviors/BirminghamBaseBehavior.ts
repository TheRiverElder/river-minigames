import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import BirminghamExtension from "../BirminghamExtension";

export default abstract class BirminghamBaseBehavior extends BehaviorAdaptor {

    protected birminghamExtension!: BirminghamExtension;
    clickable: boolean =  false;
    selected: boolean =  false;

    override onInitialize(): void {
        const birminghamExtension = this.simulator.extensions.get("birmingham").orNull();
        if (!birminghamExtension || !(birminghamExtension instanceof BirminghamExtension)) return;
        this.birminghamExtension = birminghamExtension;
        
        birminghamExtension.objects.add(this);
    }

    override onDestroy(): void {
        this.birminghamExtension.objects.remove(this);
    }

    freshUiState() {
        const action = this.birminghamExtension.action;
        if (action) {
            this.selected = action.hasSelected(this);
            if (!this.selected) {
                this.clickable = action.canClick(this);
            }
        }
        this.host.onUiUpdateListeners.emit();
    }

    override getTags(): Array<string> {
        const result: Array<string> = [];
        if (this.selected) result.push("selected");
        else if (this.clickable) result.push("clickable");
        return result;
    }
}