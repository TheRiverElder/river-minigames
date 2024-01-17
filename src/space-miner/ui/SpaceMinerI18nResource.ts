const Res = {
    "resource_type.empty": "<空>",
    "resource_type.water": "水",
    "resource_type.electrucity": "电力",
    "resource_type.live_support": "维生资源",
    "resource_type.shield": "护盾",
    "resource_type.wood": "木材",
    "resource_type.biomass": "生物质",
    "resource_type.coal": "煤炭",
    "resource_type.rock": "岩石",
    "resource_type.iron_ore": "铁矿",
    "resource_type.iron": "铁",
    "resource_type.copper_ore": "铜矿",
    "resource_type.copper": "铜",
    "resource_type.gold_ore": "金矿",
    "resource_type.gold": "金",
    "resource_type.structium_ore": "构金矿",
    "resource_type.structium": "构金",
    "resource_type.silver_ore": "银矿",
    "resource_type.silver": "银",
    "resource_type.uranium_ore": "铀矿",
    "resource_type.uranium_238": "铀238",
    "resource_type.uranium_235": "铀235",
    "resource_type.polymer": "聚合物",
    "resource_type.resonating_crystal": "共振水晶",
    "resource_type.core_lava": "地心熔浆",
    "resource_type.plasma_lava": "等离子熔浆",
    "resource_type.metallic_hydrogen": "金属氢",
    "resource_type.neutron": "中子素",
    "resource_type.black_hole": "人造黑洞",
    "resource_type.macro_cpu": "粗制CPU",
    "resource_type.micro_cpu": "微型CPU",
    "resource_type.quantem_cpu": "量子CPU",
    "resource_type.primative_shell_modulo": "初级外壳模块",
    "resource_type.advanced_shell_modulo": "高级外壳模块",
    "resource_type.drop_shell_modulo": "水滴外壳模块",
    "resource_type.ore_processing_machine": "矿物处理姬",
    "resource_type.collapsing_machine": "探索姬",
    "resource_type.assembling_machine": "组装姬",
    "resource_type.stablizing_machine": "稳定姬",

    "item_type.miner.name": "挖矿姬",
    "item_type.miner_part.name": "挖矿姬部件",
    "item_type.orb_mining_licence.name": "星球开采许可",
    "item_type.resource.name": "资源",

    "item.miner.name": "挖矿姬",
    "item.miner.description": "规模：{size}，能源：{energy}/{max_energy}，硬度：{harness}, 容量：{total}/{capacity}",
    "item.orb_mining_licence.name": "星球开采证：{orb_name}#{orb_uid}",
    "item.orb_mining_licence.description": "正经的星球开采证，使用它可以宣称对星球【{orb_name}#{orb_uid}】的开采权力",
    "item.resource.name": "资源",
    "item.miner_part.name": "挖矿姬部件",
    "item.test.name": "测试物品",
    "item.smelting_machine.name": "熔融姬",
    "item.assembling_machine.name": "组装姬",
    "item.stablizing_machine.name": "稳定器",
    "item.black_hole.name": "人造黑洞",
    "item.bonus_pack.name": "奖励包",
    "item.bonus_pack.description": "使用励包，获取奖励",

    "miner_part.frame.name": "框架",
    "miner_part.frame.description": "规模：{size}，能源：{energy}/{max_energy}",
    "miner_part.collector.name": "采集器",
    "miner_part.collector.description": "硬度：{hardness}，可受温度：{temperature}℃，可采掘：{tags}",
    "miner_part.main_control.name": "主控",
    "miner_part.main_control.description": "控制行进与逻辑",
    "miner_part.cargo.name": "货舱",
    "miner_part.cargo.description": "货重：{total}/{capacity}",
    "miner_part.addition.name": "附加部件",
    "miner_part.addition.description": "可以提供额外的功能",

    "technology.shunting_by_density.name": "密度分流",
    "technology.shunting_by_density.description": "将不同密度的物体分离开，可以筛选一些珍贵物质",
    "technology.high_temeperature_storage.name": "高温存储",
    "technology.high_temeperature_storage.description": "用于存储超高温的资源",
    "technology.cooling.name": "高效冷却",
    "technology.cooling.description": "让挖矿姬能承受更高的环境温度",
    "technology.reduction.name": "还原反应",
    "technology.reduction.description": "精练部分矿物，一般会减少量并增加价值",
    "technology.uranium_processing.name": "铀处理",
    "technology.uranium_processing.description": "安全地对铀进行加工",
    "technology.space_folding.name": "空间压缩",
    "technology.space_folding.description": "增加存储空间",
    "technology.nuclear_fuel_rod.name": "核燃料棒",
    "technology.nuclear_fuel_rod.description": "可以组装蕴含巨大能量的核燃料棒",

    "recipe.miner.name": "挖矿姬",
    "recipe.miner.hint.missing_part": "缺少以下组件：{missing_part_types}",
    "recipe.miner.hint.can_assemble": "未发现问题，可以组装！",
    // "recipe.miner.message.missing_part": "挖矿姬组装失败：部件缺失，请检查部件！",
    "recipe.simple.name": "简单配方",
    "recipe.simple.hint.missing_materials": "缺少以下材料：{missing_materials}",
    "recipe.simple.hint.can_assemble": "未发现问题，可以组装！",
    "recipe.gold.name": "黄金提取",
    "recipe.iron.name": "冶铁",
    "recipe.copper.name": "冶铜",


    "ui.warehouse.text.title": "总仓库",
    "ui.warehouse.text.empty_hint": "总仓库空空如也，快去发掘资源吧！",
    "ui.warehouse.button.use": "使用",

    "ui.assembler.title.product": "产物",
    "ui.assembler.title.materials": "原料",
    "ui.assembler.title.preparing_area": "准备区",
    "ui.assembler.title.inventory": "仓库",
    "ui.assembler.text.title": "组装车间",
    "ui.assembler.text.choose_recipe": "请选择配方：",
    "ui.assembler.text.consumable": "不消耗",
    "ui.assembler.message.transfering_error": "挖矿姬组装失败：调货出错，请检查总货舱物品是否缺失！",
    "ui.assembler.message.succeeded": "挖矿姬组装成功",
    "ui.assembler.button.append": "挂载",
    "ui.assembler.button.unappend": "移除",
    "ui.assembler.button.assemble": "组装",
    "ui.assembler.hint.succeeded": "组装成功！",
    "ui.assembler.message.failed.no_enough_materials": "组装失败：没有足够的材料！",
    "ui.assembler.hint.can_assemble": "未发现问题，可以组装！",
    "ui.assembler.hint.no_recipe_selected": "未选择合成表",

    "game.shop.message.bought_item": "【{buyer}】购买了【{item}】×{amount}！",
    "game.shop.message.sold_item": "【{seller}】卖出了【{item}】×{amount}！",
    "game.game.message.discovered_orb": "宇宙探索中心：发现星球【{name}#{uid}】",
    "game.game.message.used_item": "【{user}】使用了【{item}】×{amount}",
    "game.game.message.unlocked_technology": "【{user}】研发了【{technology} lvl.{level}】",
    "game.game.message.retrived_miner_resource": "采集了{total}单位资源",
    "game.game.message.refilled_miner_energy": "补充了{energy}单位能源",
    "game.game.message.recall_miner": "已召回【{miner}】至总仓库",
    "game.game.message.restart_miner": "【{miner}】开始新一轮工作",
    "game.game.message.miner_not_deployed": "挖矿姬未部署",
    "game.game.message.miner_not_on_surface": "挖矿姬不在地表，不可操作",

    "game.actions.message.claimed_orb": "【{user}】宣称了【{orb_name}#{orb_uid}】的采矿权",
    "game.actions.message.deployed_miners_to_orb": "【{user}】部署了{facility_amount}个挖矿姬到【{orb_name}#{orb_uid}】",
    
    "goal.money_amount.name": "收集金钱",
    "goal.money_amount.description": "收集指定数量的金钱以完成目标",

    "ui.main_menu.logo": "星际矿业",
    "ui.main_menu.button.start_test_game": "开始测试",

    "ui.dialog.loading": "载入中……",

    "ui.game.top_bar.name": "名字",
    "ui.game.top_bar.account": "余额",
    "ui.game.top_bar.time": "时间",
    "ui.game.top_bar.time_speed": "时间流速",

    "ui.simple_tab_window.button.close": "关闭",

    "ui.shop.text.title": "商店",
    "ui.shop.button.buy": "购买",
    "ui.shop.button.sell": "卖出",
    "ui.shop.text.empty_hint": "商店里没有东西卖了，稍后再来吧！",

    "ui.orb_info.title.properties": "属性",
    "ui.orb_info.title.resources": "资源（{kind_amount}种）",
    "ui.orb_info.title.facilities": "设施（{facility_amount}座）",
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
    "ui.orb_info.button.full_panel": "全面板",
    
    "ui.orb_full_panel.title.main_title": "星球全面板：{name}",
    "ui.orb_full_panel.title.resources": "资源储备",
    "ui.orb_full_panel.title.facilities": "设施总览",
    "ui.orb_full_panel.title.facility_detail": "设施详情：{name}",
    "ui.orb_full_panel.button.harvest": "采收",

    "ui.deployment.text.title": "部署",
    "ui.deployment.title.select_orb": "请选择一个星球",
    "ui.deployment.title.select_miners": "请选择至少一辆挖矿姬",
    "ui.deployment.button.append": "添加",
    "ui.deployment.button.unappend": "移除",
    "ui.deployment.button.deploy": "部署",

    "ui.development_center.text.title": "研发中心",
    "ui.development_center.button.unlock": "解锁",
    "ui.development_center.text.unlocked": "已解锁",

    "ui.config_view.text.title": "配置：{name}",
    "ui.config_view.efficiency": "效率",
    "ui.config_view.active": "启用",
    "ui.config_view.population": "人口",
    "ui.config_view.solar_plane_amount": "太阳能板数量",
    "ui.config_view.resonating_source_amount": "共振源数量",

    "ui.facility.button.config": "配置",
    "ui.facility.button.open_config": "⚙",
    "ui.facility.button.close_config": "⚙",
    "ui.facility.button.move_up": "▲",
    "ui.facility.button.move_down": "▼",
    "ui.facility.button.maintain": "保养",
    "ui.facility.button.repair": "维修",

    "ui.miner.status.resting": "休整",
    "ui.miner.status.digging": "挖掘",
    "ui.miner.status.retreating": "撤退",

    "tag.biomass": "生物质",
    "tag.fluid": "流体",
    "tag.solid": "固体",
    "tag.structure": "结构",
    "tag.radiation": "放射性",
    "tag.flammable": "可燃",
    "tag.fussion_fuel": "核燃料",

    "facility.primary_colony.name": "初级殖民地",
    "facility.primary_colony.description": "可以自给自足的营地，甚至有些盈余，但是和专用设备比起来还是逊色不少",
    "facility.manual_mine.name": "手动矿场",
    "facility.manual_mine.description": "初期使用的矿场，按一下操作按钮才能有产出，好处是不耗电",
    "facility.manual_mine.tool.operate": "操作",
    "facility.manual_mine.tool.harvest": "采收",
    "facility.tranditional_mine.name": "传统矿井",
    "facility.tranditional_mine.description": "传统的矿井，通过工人工作，只能挖掘浅表资源",
    "facility.drill_well.name": "矿井",
    "facility.drill_well.description": "为挖矿姬提供运行基础，挖矿姬可以独立运行，但是电源与货舱都是自带的，不与世界共享",
    "facility.resonating_power_plant.name": "共振发电姬",
    "facility.resonating_power_plant.description": "使用稀有的共振水晶发电，由于其特性，它的能源是无限的，而且同时存在越多，效率越高，但是稳定性也越差",
    "facility.solar_power_plant.name": "太阳能发电姬",
    "facility.solar_power_plant.description": "用太阳能发电，由于全球分布，所以电力是源源不断生成的均值，不用再计算白天与黑夜的问题",
    "facility.residential_complex.name": "居住综合体",
    "facility.residential_complex.description": "产生维生所需粮食、氧气、温度、大气等的设施",

    "ui.dialog.cancel": "取消",
    "ui.dialog.confirm": "确认",

    "libs.ui.config_view.button.reset": "重置",
    "libs.ui.config_view.button.apply": "应用",
};

export default Res;