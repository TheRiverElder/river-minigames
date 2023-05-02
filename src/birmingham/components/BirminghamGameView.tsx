import classNames from "classnames";
import { Component } from "react";
import { Consumer, double, int, Predicator } from "../../libs/CommonTypes";
import { createArray, groupBy } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Action from "../action/Action";
import { CARD_EMPTY } from "../Card";
import Game from "../Game";
import Player from "../Player";
import { RESOURCES } from "../Resources";
import "./BirminghamGameView.scss";
import Res, { createObjectResourceLoader } from "./Res";

export interface BirminghamGameViewProps {
    game: Game;
    playerUid: int;
}

// interface MarketViewData {
//     type: ResourceType;
//     capacityLevel: int;
//     amount: int;
//     nextPrice: int;
//     nextPayback: int;
// }
 
export interface BirminghamGameViewState {
    // // 内场地图
    // industrySlots: Array<IndustrySlot>;
    // traffic: Array<>;
    // // 市场
    // markets: Array<MarketViewData>;
    // // 准备区

    // // 个人面板
    // income: int;
    // account: int;
    // score: int;

    mapScalar: double;
    preparingAreaCollapsed: boolean;
    action: Nullable<Action>;
}
 
class BirminghamGameView extends Component<BirminghamGameViewProps, BirminghamGameViewState> {

    readonly game: Game;
    readonly playerUid: int;
    get player(): Nullable<Player> {
        return this.game.players.get(this.playerUid).orNull();
    }

    constructor(props: BirminghamGameViewProps) {
        super(props);
        this.game = props.game;
        this.playerUid = props.playerUid;

        this.state = {
            // income: this.player.income,
            // account: this.player.account,
            // score: this.player.score,
            mapScalar: 1.0,
            preparingAreaCollapsed: true,
            action: null,
        };
    }

    resetLayout = () => {
        let mapScalar = Math.min(window.innerWidth, 1600) / this.game.map.size.x;
        if (!Number.isFinite(mapScalar) || Number.isNaN(mapScalar)) {
            mapScalar = 1.0;
        }
        this.setState(() => ({ mapScalar }));
    }

    uiListener = () => {
        this.resetLayout();
    }

    componentDidMount(): void {
        this.game.uiUpdateListeners.add(this.uiListener);
        window.addEventListener("resize", this.resetLayout);
        this.resetLayout();
    }

    componentWillUnmount(): void {
        this.game.uiUpdateListeners.delete(this.uiListener);
        window.removeEventListener("resize", this.resetLayout);
    }

    updateBySelf() {
        // this.setState(() => ({    
        //     income: this.player.income,
        //     account: this.player.account,
        //     score: this.player.score,
        // }));
        this.forceUpdate();
    }

    render() { 
        const mapScalar = this.state.mapScalar;
        const game = this.game;
        const self = this.player;
        const action = this.state.action;

        const fillBlock = (amount: int) => createArray(2, (i) => i < amount ? "■" : "□").join("");

        Res.resourceLoader = createObjectResourceLoader(RESOURCES);

        const makeOnClick = (fn: Consumer<Action>) => () => {
            if (action && action.isCardUsed()) fn(action);
            this.forceUpdate();
        };
        const makeOperateClass = (canOperate: Predicator<Action>, hasSelected: Predicator<Action>) => 
            (action && action.isCardUsed() && [canOperate(action) && "selectable", hasSelected(action) && "selected"]);

        return (
            <div className="BirminghamGameView">
                {/* 内场地图 */}
                <div className="game-map" style={game.map.size.mul(mapScalar).toSizeCss()}>
                    {this.game.map.traffics.filter(traffic => traffic.type.era === game.era).map(traffic => (
                        <div 
                            className={classNames("traffic", makeOperateClass(a => a.canOperateTraffic(traffic), a => a.hasSelectedTraffic(traffic)))} 
                            style={{
                                ...traffic.position.mul(mapScalar).toPositionCss(),
                                transform: `
                                    translate(-50%, -50%) 
                                    rotate(${traffic.tail.centerPosition.sub(traffic.head.centerPosition).angle()}rad) 
                                `
                            }}
                            onClick={makeOnClick(a => a.canOperateTraffic(traffic) && a.operateTraffic(traffic))}    
                        >
                            <span>{traffic.owner ? `建造者：${traffic.owner.name}` : "未建成"}</span>
                        </div>
                    ))}
                    {this.game.map.cities.values().flatMap(city => city.industrySlots).map(industrySlot => (
                        <div 
                            className={classNames("industry-slot", makeOperateClass(a => a.canOperateIndustrySlot(industrySlot), a => a.hasSelectedIndustrySlot(industrySlot)))} 
                            style={{
                                ...industrySlot.position.mul(mapScalar).toPositionCss(),
                                ...this.game.map.industrySlotSize.mul(mapScalar).toSizeCss(),
                            }}
                            onClick={makeOnClick(a => a.canOperateIndustrySlot(industrySlot) && a.operateIndustrySlot(industrySlot))}    
                        >
                            {Array.from(industrySlot.industries.values()).map(i => i.name).join()} 
                        </div>
                    ))}
                </div>

                {/* 玩家数据 */}
                <div className="profiles">
                    {game.playersInOrder.map((player, i) => (
                        <div className="profile">
                            <h2 className="title">{player.name}{player === self ? `（这是你）` : ``}</h2>
                            <p>顺次：{i + 1} {i === game.turnIndex ? `（当前行动）` : ``}</p>
                            <p>账户余额：￡{player.account}</p>
                            <p>收入水平：￡{player.income}/回合</p>
                            <p>累积得分：{player.score}（不包含未结算分）</p>
                            <p>手牌数量：{player.cards.length}</p>
                        </div>
                    ))}
                </div>

                {/* 市场 */}
                <div className="markets">
                    {Array.from(this.game.markets.values()).map(market => (
                        <div className="market">
                            <h2 className="title">{market.resourceType.name}市场</h2>
                            <div>
                                {createArray(market.capacityLevel, (i) => market.capacityLevel - i).map((price, i) => (
                                    <div>
                                        <span>￡{price}：</span>
                                        <span>{i === 0 ? " ∞ " : fillBlock(Math.min(2, market.amount - (i - 1) * 2))}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 手牌 */}
                <div className="cards">
                    <h2 className="title">手牌</h2>
                    {self ? self.cards.map(card => (
                        <div 
                            className={classNames("card", makeOperateClass(a => a.canOperateCard(card), a => a.hasSelectedCard(card)))}
                            onClick={makeOnClick(a => a.canOperateCard(card) && a.operateCard(card))}    
                        >
                            {card.name}
                        </div>
                    )) : null}
                </div>

                {/* 准备区：未使用的工厂槽 */}
                <div className="preparing-area">
                    <h2 className="title">准备区<button onClick={() => this.setState(s => ({ preparingAreaCollapsed: !s.preparingAreaCollapsed }))}>展开/收起</button></h2>
                    {self ? Array.from(groupBy(self?.factorySlots, fs => fs.industry).entries()).map(([industry, group]) => [
                        <h3 className="title">{Res.resourceLoader(`string.industry.${industry.name}`)}</h3>,
                        <div className="factory-slot-group">
                            {!this.state.preparingAreaCollapsed ? group.map(slot => (
                                <div className="factory-slot">
                                    <div className="factory-slot-info">
                                        <ul>
                                            {slot.cost.map(([type, amount]) => (<li className="resource"><Res name={`icon.${type.name}`}/>×{amount}</li>))}
                                        </ul>
                                        <div>👉</div>
                                        <ul>
                                            {slot.award.map(([type, amount]) => (<li className="resource"><Res name={`icon.${type.name}`}/>×{amount}</li>))}
                                        </ul>
                                    </div>
                                    <div className="factories">
                                        {slot.factories.map((factory, i) => (
                                            <div 
                                                className={classNames("factory", makeOperateClass(a => a.canOperateFactory(factory), a => a.hasSelectedFactory(factory)))}
                                                onClick={makeOnClick(a => a.canOperateFactory(factory) && a.operateFactory(factory))}    
                                            >
                                                <span>{i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : null}
                        </div>
                    ]) : null}
                </div>

                {/* 行动 */}
                <div className="action-panel">
                    <button onClick={() => this.setState(() => ({ action: null }))}>重置行动</button>
                    {this.renderActionPanel()}
                    {action && action.canAct() && (
                        <button disabled={!action.canAct()} onClick={() => console.log(action)}>提交行动</button>
                    )}
                </div>
            </div>
        );
    }

    renderActionPanel() {
        const game = this.game;
        const self = this.player;
        if (!self) return null;
        const action = this.state.action;
        if (!action) return (
            <div className="action-types">
                <h3>请选择一项行动：</h3>
                {game.actionTypes.values().map(actionType => (
                    <p className="action-type" onClick={() => this.setState(() => ({ action: actionType.create(self) }))}>
                        {actionType.name}
                    </p>
                ))}
            </div>
        );
        if (!action.card || action.card === CARD_EMPTY) return (
            <div className="action-types">
                <h3>请选择一张手牌：</h3>
                {self.cards.map(card => (
                    <p className="card" onClick={() => {
                        action.card = card;
                        this.setState(() => ({ action }));
                    }}>
                        {card.name}
                    </p>
                ))}
            </div>
        );
        return (
            <div className="action-types">
                {action.getHint()}
            </div>
        )
    }
}
 
export default BirminghamGameView;