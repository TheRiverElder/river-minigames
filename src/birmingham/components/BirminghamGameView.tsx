import { Component } from "react";
import { double, int } from "../../libs/CommonTypes";
import { groupBy } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Player from "../Player";
import "./BirminghamGameView.scss";

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
        const player = this.player;
        console.log("industrySlots", game.map.cities.values().flatMap(city => city.industrySlots));

        return (
            <div className="BirminghamGameView">
                {/* 内场地图 */}
                <div className="game-map" style={game.map.size.mul(mapScalar).toSizeCss()}>
                    {this.game.map.traffics.filter(traffic => traffic.type.era === game.era).map(traffic => (
                        <div className="traffic" style={{
                            ...traffic.position.mul(mapScalar).toPositionCss(),
                            transform: `
                                translate(-50%, -50%) 
                                rotate(${traffic.tail.centerPosition.sub(traffic.head.centerPosition).angle()}rad) 
                            `
                        }}>
                            <span>{traffic.owner ? `建造者：${traffic.owner.name}` : "未建成"}</span>
                        </div>
                    ))}
                    {this.game.map.cities.values().flatMap(city => city.industrySlots).map(industrySlot => (
                        <div className="industry-slot" style={{
                            ...industrySlot.position.mul(mapScalar).toPositionCss(),
                            ...this.game.map.industrySlotSize.mul(mapScalar).toSizeCss(),
                        }}>
                            {Array.from(industrySlot.industries.values()).map(i => i.name).join()} 
                        </div>
                    ))}
                </div>

                {/* 玩家数据 */}
                <div className="profile">
                    <h2 className="title">个人面板</h2>
                    {player ? [
                        <p>你好，{player.name}！</p>,
                        <p>账户余额：￡{player.account}</p>,
                        <p>收入水平：￡{player.income}/回合</p>,
                        <p>累积得分：{player.score}（不包含未结算分）</p>,
                    ] : (
                        <p>未入座！</p>
                    )}
                </div>

                {/* 市场 */}
                <div className="markets">
                    {Array.from(this.game.markets.values()).map(market => (
                        <div className="market">
                            <h2 className="title">市场</h2>
                            <p>资源类型：{market.resourceType.name}</p>
                            <p>容量等级：{market.capacityLevel}</p>
                            <p>当前数量：{market.amount}/{(market.capacityLevel - 1) * 2}</p>
                            <p>下次买价：￡{market.getNextPrice()}/个</p>
                            <p>下次卖价：￡{market.getNextPayback()}/个</p>
                        </div>
                    ))}
                </div>

                {/* 准备区：未使用的工厂槽 */}
                <div className="preparing-area">
                    <h2 className="title">准备区</h2>
                    {player ? Array.from(groupBy(player?.factorySlots, fs => fs.industry).values()).map(group => (
                        <div className="factory-slot-group">
                            {group.map(slot => (
                                <div className="factory-slot">
                                    <p>类型：{slot.industry.name}</p>
                                    <p>消耗：</p>
                                    {slot.cost.map(([type, amount]) => (<p className="resource">{type.name}：{amount}</p>))}
                                    <p>奖励：</p>
                                    {slot.award.map(([type, amount]) => (<p className="resource">{type.name}：{amount}</p>))}
                                    <p>剩余：{slot.factories.length}</p>
                                </div>
                            ))}
                        </div>
                    )) : null}
                </div>

                {/* 行动 */}
                <div>

                </div>
            </div>
        );
    }
}
 
export default BirminghamGameView;