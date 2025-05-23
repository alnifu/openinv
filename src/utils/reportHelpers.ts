import { getItems, getSoldItems, Item, SoldItem } from './storage';

// Helper: Format a Date to YYYY-MM-DD in local time
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getReportData = async () => {
  const items: Item[] = await getItems();
  const soldItems: SoldItem[] = await getSoldItems();

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 6); // includes today

  const pastWeekSales: { [date: string]: number } = {};
  const topSelling: { [itemName: string]: number } = {};
  const categoryCounts: { [category: string]: number } = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(oneWeekAgo);
    date.setDate(oneWeekAgo.getDate() + i);
    const key = formatLocalDate(date); // use local date
    pastWeekSales[key] = 0;
  }

  soldItems.forEach(sold => {
    const soldDate = formatLocalDate(new Date(sold.dateSold)); // local date string
    if (pastWeekSales[soldDate] !== undefined) {
      pastWeekSales[soldDate] += sold.priceSold;
    }

    // Top selling
    if (!topSelling[sold.itemName]) topSelling[sold.itemName] = 0;
    topSelling[sold.itemName] += sold.quantitySold;
  });

  // Stock levels by category
  items.forEach(item => {
    if (!categoryCounts[item.category]) categoryCounts[item.category] = 0;
    categoryCounts[item.category] += item.quantity;
  });

  const lowStockItems = items.filter(item => item.quantity <= 5); // threshold can be customized

  return {
    salesTrend: pastWeekSales,
    topSelling: Object.entries(topSelling).sort((a, b) => b[1] - a[1]).slice(0, 5),
    categoryDistribution: categoryCounts,
    stockLevels: items,
    lowStockItems
  };
};
