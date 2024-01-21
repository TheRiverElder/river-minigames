import classNames from "classnames";
import { Component, ReactNode } from "react";
import { Productor, Supplier } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import "./TaggedTabsPanel.scss";

export interface TaggedTabsPanelProps<TTag, TItem> {
    getTags: Supplier<Array<TTag>>;
    getItems: Supplier<Array<TItem>>;
    itemHasTag: (item: TItem, tag: TTag) => boolean;
    renderTag: Productor<TTag, string>;
    renderItem: Productor<TItem, ReactNode>;
}

export interface TaggedTabsPanelState<TTag> {
    selectedTag: Nullable<TTag>;
}

export default class TaggedTabsPanel<TTag, TItem> extends Component<TaggedTabsPanelProps<TTag, TItem>, TaggedTabsPanelState<TTag>> {

    constructor(props: TaggedTabsPanelProps<TTag, TItem>) {
        super(props);
        this.state = {
            selectedTag: null,
        };
    }

    override render(): ReactNode {
        const { getItems, getTags, itemHasTag, renderItem, renderTag } = this.props;
        const { selectedTag } = this.state;

        let items = getItems();
        if (selectedTag !== null) items = items.filter(it => itemHasTag(it, selectedTag));

        return (
            <div className="TaggedTabsPanel">
                <div className="tag-filter">
                    {getTags().map((tag, index) => (
                        <span 
                            key={index}
                            className={classNames("tag", { selected: tag === selectedTag })}
                            onClick={() => this.onClickTag(tag)}
                        >{renderTag(tag)}</span>
                    ))}
                </div>
                <div className="tab">
                    {items.map(item => (
                        <div className="item">{renderItem(item)}</div>
                    ))}
                </div>
            </div>
        );
    }

    onClickTag(tag: TTag) {
        if (this.state.selectedTag === tag) this.setState({ selectedTag: null });
        else this.setState({ selectedTag: tag });
    }
}