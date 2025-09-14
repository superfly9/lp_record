export function getConditionText(condition: string) {
  switch (condition) {
    case "excellent":
      return "최상급";
    case "good":
      return "양호";
    case "fair":
      return "보통";
    case "poor":
      return "불량";
    default:
      return condition;
  }
}

