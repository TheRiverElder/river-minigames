export default {
    "resource_type.empty": "<空>",
    "resource_type.water": "水",
    "resource_type.wood": "木材",
    "resource_type.coal": "煤炭",
    "resource_type.rock": "岩石",
    "resource_type.iron_ore": "铁矿",
    "resource_type.iron": "铁",
    "resource_type.copper_ore": "铜矿",
    "resource_type.copper": "铜",
    "resource_type.gold_ore": "金矿",
    "resource_type.gold": "金",
    "resource_type.uranium_ore": "铀矿",
    "resource_type.core_lava": "地心熔浆",

    "item.miner.name": "挖矿姬",
    "item.miner.description": "规模：{size}，能源：{energy}/{max_energy}，可采集：{mineable_resource_type}, 容量：{total}/{capacity}",
    "item.orb_mining_liscence.name": "星球开采证：{orb_name}#{orb_uid}",
    "item.orb_mining_liscence.description": "正经的星球开采证，使用它可以宣称对星球【{orb_name}#{orb_uid}】的开采权力",
    "item.resource.name": "资源",
    "item.miner_part.name": "挖矿姬部件",
    "item.test.name": "测试物品",

    "miner_part.frame.name": "框架",
    "miner_part.frame.description": "规模：{size}，能源：{energy}/{max_energy}",
    "miner_part.collector.name": "采集器",
    "miner_part.collector.description": "可以挖掘：{mineable_resource_type}",
    "miner_part.main_control.name": "主控",
    "miner_part.main_control.description": "控制行进与逻辑",
    "miner_part.cargo.name": "货舱",
    "miner_part.cargo.description": "货重：{total}/{capacity}",
    "miner_part.addition.name": "附加部件",
    "miner_part.addition.description": "可以提供额外的功能",

    "technology.shunting_by_density": "密度分流",
    "technology.high_temeperature_storage": "高温存储",
    "technology.cooling": "高效冷却",
    "technology.reduction": "还原反应",
    "technology.uranium_processing": "铀处理",
    "technology.space_folding": "空间压缩",

    "recipe.miner.name": "挖矿姬",
    "recipe.miner.hint.missing_part": "缺少以下组件：{missing_part_types}",
    "recipe.miner.hint.can_assemble": "未发现问题，可以组装！",
    // "recipe.miner.message.missing_part": "挖矿姬组装失败：部件缺失，请检查部件！",

    "ui.shop.title": "商店",
    "ui.shop.empty_hint": "商店里没有东西卖了，稍后再来吧！",

    "ui.warehouse.title": "总仓库",
    "ui.warehouse.empty_hint": "总仓库空空如也，快去发掘资源吧！",

    "ui.assembler.title": "组装车间",
    "ui.assembler.text.choose_recipe": "请选择配方：",
    "ui.assembler.message.transfering_error": "挖矿姬组装失败：调货出错，请检查总货舱物品是否缺失！",
    "ui.assembler.message.succeeded": "挖矿姬组装成功",
    "ui.assembler.button.append": "挂载",
    "ui.assembler.button.unappend": "移除",
    "ui.assembler.button.assemble": "组装",
    "ui.assembler.hint.succeeded": "组装成功！",
    "ui.assembler.hint.can_assemble": "未发现问题，可以组装！",
    "ui.assembler.hint.no_recipe_selected": "未选择合成表",

    "ui.main.button.shop": "商店",
    "ui.main.button.warehouse": "总仓库",
    "ui.main.button.assembler": "组装车间",
    "ui.main.button.deployment": "部署",
    "ui.main.button.development_center": "研发中心",
    "ui.main.button.back": "返回",

    "game.shop.message.bought_item": "【{buyer}】购买了{amount}个【{item}】！",
    "game.game.message.discovered_orb": "宇宙探索中心：发现星球【{name}#{uid}】",
    "game.game.message.used_item": "【{user}】使用了{amount}个【{item}】",
    "game.game.message.unlocked_technology": "【{user}】研发了【{technology} lvl.{level}】",
    "game.game.message.retrived_miner_resource": "采集了{total}单位资源",
    "game.game.message.refilled_miner_energy": "补充了{energy}单位能源",
    "game.game.message.recall_miner": "已召回【{miner}】至总仓库",
    "game.game.message.restart_miner": "【{miner}】开始新一轮工作",
    "game.game.message.miner_not_deployed": "挖矿姬未部署",
    "game.game.message.miner_not_on_surface": "挖矿姬不在地表，不可操作",

    "game.actions.message.claimed_orb": "【{user}】宣称了【{orb_name}#{orb_uid}】的采矿权",
    "game.actions.message.deployed_miners_to_orb": "【{user}】部署了{miner_amount}个挖矿姬到【{orb_name}#{orb_uid}】",
    
    "ui.orb_info.title.properties": "属性",
    "ui.orb_info.title.resources": "资源（{kind_amount}种）",
    "ui.orb_info.title.miners": "挖矿姬（{miner_amount}只）",
    "ui.orb_info.text.no_owner": "无",
    "ui.orb_info.property.name": "名称",
    "ui.orb_info.property.owner": "主人",
    "ui.orb_info.property.radius": "半径",
    "ui.orb_info.property.color": "颜色",
    "ui.orb_info.property.position": "位置",
    "ui.orb_info.property.rotation_angle": "自转角",
    "ui.orb_info.property.rotation_period": "自传周期",
    "ui.orb_info.property.revolution_period": "公转周期",
    "ui.orb_info.property.estimated_value": "预估价值",
    "ui.orb_info.button.recall": "召回",
    "ui.orb_info.button.restart": "重整",

    "ui.deployment.title.select_orb": "请选择一个星球",
    "ui.deployment.title.select_miners": "请选择至少一辆挖矿姬",
    "ui.deployment.button.append": "添加",
    "ui.deployment.button.unappend": "移除",
    "ui.deployment.button.deploy": "部署",

    "ui.development_center.button.unlock": "解锁",
    "ui.development_center.text.unlocked": "已解锁",
};