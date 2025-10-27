const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleTrades = [
  // Running trades
  {
    pair: 'EURUSD',
    type: 'BUY',
    time: new Date('2024-10-20T09:30:00Z'),
    chartLink: 'https://tradingview.com/chart/EURUSD',
    riskPercent: 2.0,
    notes: 'Bullish breakout above resistance at 1.0850. Good volume confirmation.',
    currentBalance: 10000,
    comment: 'Waiting for target at 1.0920',
    status: 'RUNNING',
  },
  {
    pair: 'GBPJPY',
    type: 'SELL',
    time: new Date('2024-10-21T14:15:00Z'),
    chartLink: 'https://tradingview.com/chart/GBPJPY',
    riskPercent: 1.5,
    notes: 'Bearish divergence on RSI. Rejection at key resistance 195.50.',
    currentBalance: 10000,
    comment: 'Short-term reversal play',
    status: 'RUNNING',
  },
  
  // Closed winning trades
  {
    pair: 'USDJPY',
    type: 'BUY',
    time: new Date('2024-10-18T08:00:00Z'),
    chartLink: 'https://tradingview.com/chart/USDJPY',
    riskPercent: 2.5,
    result: 'WIN',
    notes: 'Strong bullish momentum after NFP data. Clean breakout above 149.50.',
    currentBalance: 9800,
    comment: 'Perfect execution, hit target exactly',
    profit: 245.50,
    status: 'CLOSED',
  },
  {
    pair: 'AUDUSD',
    type: 'BUY',
    time: new Date('2024-10-17T22:30:00Z'),
    chartLink: 'https://tradingview.com/chart/AUDUSD',
    riskPercent: 1.8,
    result: 'WIN',
    notes: 'Bullish hammer at support level 0.6650. Good risk-reward setup.',
    currentBalance: 9550,
    comment: 'Nice bounce from support as expected',
    profit: 180.25,
    status: 'CLOSED',
  },
  {
    pair: 'EURGBP',
    type: 'SELL',
    time: new Date('2024-10-16T12:45:00Z'),
    chartLink: 'https://tradingview.com/chart/EURGBP',
    riskPercent: 1.2,
    result: 'WIN',
    notes: 'Bearish flag pattern completion. Clean entry at flag resistance.',
    currentBalance: 9370,
    comment: 'Textbook pattern trade',
    profit: 95.75,
    status: 'CLOSED',
  },
  
  // Closed losing trades
  {
    pair: 'USDCHF',
    type: 'SELL',
    time: new Date('2024-10-15T16:20:00Z'),
    chartLink: 'https://tradingview.com/chart/USDCHF',
    riskPercent: 2.0,
    result: 'LOSS',
    notes: 'Expected bearish reversal but got stopped out by news spike.',
    currentBalance: 9274,
    comment: 'Should have checked news calendar',
    profit: -96.20,
    status: 'CLOSED',
  },
  {
    pair: 'GBPUSD',
    type: 'BUY',
    time: new Date('2024-10-14T11:10:00Z'),
    chartLink: 'https://tradingview.com/chart/GBPUSD',
    riskPercent: 1.5,
    result: 'LOSS',
    notes: 'False breakout above 1.3050. Market quickly reversed.',
    currentBalance: 9370,
    comment: 'Need to wait for better confirmation',
    profit: -73.50,
    status: 'CLOSED',
  },
];

async function addSampleTrades() {
  try {
    console.log('Adding sample trades...');
    
    // Find the first user (you can change this to a specific user ID)
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }
    
    console.log(`Adding trades for user: ${user.email}`);
    
    for (const tradeData of sampleTrades) {
      await prisma.trade.create({
        data: {
          ...tradeData,
          userId: user.id,
        },
      });
    }
    
    console.log(`Successfully added ${sampleTrades.length} sample trades!`);
    
    // Calculate some statistics
    const closedTrades = sampleTrades.filter(t => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter(t => t.result === 'WIN');
    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winRate = (winningTrades.length / closedTrades.length) * 100;
    
    console.log('\nSample Data Statistics:');
    console.log(`- Total trades: ${sampleTrades.length}`);
    console.log(`- Closed trades: ${closedTrades.length}`);
    console.log(`- Running trades: ${sampleTrades.length - closedTrades.length}`);
    console.log(`- Win rate: ${winRate.toFixed(1)}%`);
    console.log(`- Total P&L: $${totalProfit.toFixed(2)}`);
    
  } catch (error) {
    console.error('Error adding sample trades:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleTrades();
