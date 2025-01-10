export const readConditionAndCal = (condition: string, width: number, height: number) : number=> {
    // Thay thế các biến 'w' và 'h' trong chuỗi điều kiện với các giá trị thực tế
    const conditionWithValues = condition.replace(/w/g, width.toString()).replace(/h/g, height.toString());
    try {
        const result = eval(conditionWithValues);
        return result;
    } catch (error) {
        console.error("Có lỗi khi tính toán: ", error);
        return 0;
    }
}