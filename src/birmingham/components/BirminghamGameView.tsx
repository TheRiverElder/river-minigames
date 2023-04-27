import { Component } from "react";
import { groupBy } from "../../libs/lang/Collections";
import Game from "../Game";
import Player from "../Player";
import "./BirminghamGameView.scss";

export interface BirminghamGameViewProps {
    game: Game;
    player: Player;
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
}
 
class BirminghamGameView extends Component<BirminghamGameViewProps, BirminghamGameViewState> {

    readonly game: Game;
    readonly player: Player;

    constructor(props: BirminghamGameViewProps) {
        super(props);
        this.game = props.game;
        this.player = props.player;

        this.state = {
            // income: this.player.income,
            // account: this.player.account,
            // score: this.player.score,
        };
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
        return (
            <div className="BirminghamGameView">
                {/* 内场地图 */}
                <div className="game-map" style={this.game.map.size.toSizeCss()}>
                    {this.game.map.traffics.map(traffic => (
                        <div className="traffic" style={traffic.position.toPositionCss()}>
                            <span>{traffic.type.name}（{traffic.owner ? `建造者：${traffic.owner.name}` : "未建成"}）</span>
                        </div>
                    ))}
                    {this.game.map.cities.map(city => (
                        <div className="city" style={city.position.toPositionCss()}>
                            <div className="industry-slots">
                                {city.industrySlots.map(industrySlot => (
                                    <div className="industry-slot">
                                        
                                    </div>
                                ))}
                            </div>
                            <p>{city.name}</p>
                        </div>
                    ))}
                </div>

                {/* 玩家数据 */}
                <div className="profile">
                    <p>你好，{this.player.name}！</p>
                    <p>账户余额：￡{this.player.account}</p>
                    <p>收入水平：￡{this.player.income}/回合</p>
                    <p>累积得分：{this.player.score}（不包含未结算分）</p>
                </div>

                {/* 市场 */}
                <div className="markets">
                    {Array.from(this.game.markets.values()).map(market => (
                        <div>
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
                    {Array.from(groupBy(this.player.factorySlots, fs => fs.industry).values()).map(group => (
                        <div>
                            {group.map(slot => (
                                <div>
                                    <p>类型：{slot.industry.name}</p>
                                    <p>消耗：{Array.from(slot.cost.entries(), ([type, amount]) => `${type.name}：${amount}`).join("、")}</p>
                                    <p>奖励：{Array.from(slot.award.entries(), ([type, amount]) => `${type.name}：${amount}`).join("、")}</p>
                                    <p>剩余：{slot.factories.length}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* 行动 */}
                <div>

                </div>
            </div>
        );
    }
}
 
export default BirminghamGameView;