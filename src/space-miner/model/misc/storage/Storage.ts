import { double, Pair, int } from "../../../../libs/CommonTypes";
import { Nullable } from "../../../../libs/lang/Optional";
import Item from "../../item/Item";

export default interface Storage {

    /**
     * 是否是满的
     */
    get full(): boolean;

    /**
     * 是否是空的
     */
    get empty(): boolean;

    /**
     * 所存放的物品
     */
    get content(): Array<Item>;

    /**
     * 存入物品
     * @param newItem 存入的物品及数量
     * @return 返回剩余的数量，即没存入的数量，数量可能为0
     */
    add(newItem: Item): double;

    /**
     * 存入物品
     * @param newItem 存入的物品及数量
     * @return 返回剩余的数量，即没存入的数量，数量可能为0
     */
    addAll(newItems: Array<Item>): Array<Item>;

    /**
     * 会尽可能移除物品，哪怕不够
     * @param queryItem 需求的物品及数量
     * @return 返回成功取走的物品，数量可能为0
     */
    remove(queryItem: Item): Item;

    /**
     * 会尽可能移除物品，哪怕不够
     * @param queryItems 需求的物品及数量
     * @return 返回成功取走的物品，数量可能为0
     */
    removeAll(queryItems: Array<Item>): Array<Item>;

    /**
     * 移除确切数量，否则不移除
     * @param query 需求的物品及数量
     * @return 返回成功取走的物品，要么为0，要么和需求相同
     */
    removeExact(query: Item): Item;

    /**
     * 所有的都移除确切数量，否则全部不移除
     * @param query 需求的物品及数量
     * @return 返回成功取走的物品，要么为0，要么和需求相同
     */
    removeExactAll(queries: Array<Item>): Array<Item>;

    /**
     * 清除所有物品
     * @return 返回所有被清除的物品
     */
    clear(): Array<Item>;

    /**
     * 去除amount为0的物品，堆叠可堆叠物品
     */
    cleanUp(): void;

    /**
     * 匹配物品，若匹配成功，则可以：堆叠，取走
     * @param item 查找的物品
     * @return 返回是否匹配
     */
    findMatched(item: Item): Nullable<Pair<int, Item>>;
}