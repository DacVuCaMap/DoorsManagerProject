import PriceReport from "./PriceReport";

class DataReport {
    priceReport: PriceReport;
    isShowDetails: boolean;
    status: boolean;
    constructor(
      priceReport: PriceReport,
      isShowDetails: boolean,
      status: boolean
    ) {
      this.priceReport = priceReport;
      this.isShowDetails = isShowDetails;
      this.status = status;
    }
  
  }
  export default DataReport;