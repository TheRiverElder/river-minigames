import { double, int } from "../../../libs/CommonTypes";

export default class ColonyCommunity {

    public population: int = 0; // 社区的人口数量，人口越多，生产越快，但消耗的资源也越多
    public quality: int = 0; // 社区的质量，过低的质量会让生产效率下降
    public resources: double = 0; // 社区的维生资源，如食物、水等

}