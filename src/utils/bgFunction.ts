export const readConditionAndCal = (condition: string, width: number, height: number): number => {
    if (condition === "") {
        return 0;
    }
    condition = condition.toString();
    // Thay thế các biến 'w' và 'h' trong chuỗi điều kiện với các giá trị thực tế
    const conditionWithValues = condition.replace(/w/g, width.toString()).replace(/h/g, height.toString());
    try {
        const result = eval(conditionWithValues);
        return result;
    } catch (error) {
        console.error("Có lỗi khi tính toán: ", error);
        return -411;
    }
}

export const checkCondition = (count: number, condition: string): boolean => {
    const operator = condition.charAt(0);
    const value = parseInt(condition.slice(1));
    switch (operator) {
        case '<':
            return count < value;
        case '>':
            return count > value;
        case '=':
            return count === value;
        default:
            return false;
    }
}

export const readLowPercentCondition = (lowPercentCondition: any, lowestPercent: number, totQuan: number): number => {
    let arrNum = lowPercentCondition.split(",");
    if (arrNum.length === 3) {
        if (totQuan < 10) {
            return parseFloat(arrNum[0]);
        }
        else if (totQuan < 20) {
            return parseFloat(arrNum[1]);
        }
        else if (totQuan < 30) {
            return parseFloat(arrNum[2]);
        }
        else {
            return lowestPercent;
        }
    }
    else{
        return lowestPercent;
    }
}