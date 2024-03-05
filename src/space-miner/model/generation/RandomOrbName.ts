import { randOne } from "../../../libs/math/Mathmatics";
import NativeRandom from "../../../libs/math/NativeRandom";
import Random from "../../../libs/math/Random";


export function randomOrbName(random: Random = NativeRandom.INSTANCE): string {
    const prefix = randOne(PREFIXES, random);
    const obj = randOne(OBJECTS, random);
    const suffix = (random.nextFloat(0, 1) > 0.1) ? randOne(SUFFIXED, random) : null;
    return prefix + obj + (suffix ? ("之" + suffix) : "");
}

const PREFIXES = [
    "蓝色", "猩红", "冰蓝", "紫色", "华彩", "祖母绿", "朱红", "天蓝", "米黄", "五彩", "深蓝", "苍白", "幽暗",
    "深邃", "无尽", "浅薄", "大智慧", "愚钝", "广阔", "狭小", "逼仄", "恶臭", "虚无", "震撼", "木讷", "新鲜", "腐朽", "空洞",
];

const OBJECTS = [
    "深渊", "舞蹈", "偏微分", "眼", "口",
    "山", "谷", "海", "洋", "木", "森", "沼", "泽", "丘",
    "羔羊", "匕首", "刀", "月", "刃", "影", "光", "球", "超立方",
    "宫殿", "王座", "酋长", "冠", "珠", "柱",
];

const SUFFIXED = [
    "怒", "咆哮", "沉默", "目光", "触",
];