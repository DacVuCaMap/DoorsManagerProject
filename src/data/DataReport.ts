import Accessories from "@/Model/Accessories";
import FireTestCondition from "@/Model/FireTestCondition";
import PriceReport from "@/Model/PriceReport";

class DataReport {
  priceReport: PriceReport;
  isShowDetails: boolean;
  status: boolean;
  fireTestCondition: FireTestCondition;
  mainAccessory: Accessories | null;
  constructor(
    priceReport: PriceReport,
    fireTestCondition: FireTestCondition,
    mainAccessory: Accessories,
    isShowDetails: boolean,
    status: boolean
  ) {
    this.priceReport = priceReport;
    this.fireTestCondition = fireTestCondition;
    this.mainAccessory = mainAccessory;
    this.isShowDetails = isShowDetails;
    this.status = status;
  }

}
export default DataReport;