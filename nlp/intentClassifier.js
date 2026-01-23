
export function classifyIntent(text){
    const query = text.toLowerCase();

    if(
        query.includes("balance") ||
    query.includes("how much money") ||
    query.includes("wallet amount")
    ){
        return "CHECK_BALANCE";
  }

  return "UNKNOWN";
    }
