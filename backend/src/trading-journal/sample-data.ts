import { PrismaClient } from '@prisma/client';

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
    status: 'RUNNING',
  },
  {
    pair: 'GBPJPY',
    type: 'SELL',
    time: new Date('2024-10-21T14:15:00Z'),
    chartLink: 'https://tradingview.com/chart/GBPJPY',
    riskPercent: 1.5,
    notes: 'Bearish divergence on RSI. Rejection at key resistance 195.50.',
    status: 'RUNNING',
  },
  
  // Winning trades
  {
    pair: 'USDJPY',
    type: 'BUY',
    time: new Date('2024-10-18T08:00:00Z'),
    chartLink: 'https://tradingview.com/chart/USDJPY',
    riskPercent: 2.5,
    notes: 'Strong bullish momentum after NFP data. Clean breakout above 149.50.',
    profit: 245.50,
    status: 'WIN',
  },
  {
    pair: 'AUDUSD',
    type: 'BUY',
    time: new Date('2024-10-17T22:30:00Z'),
    chartLink: 'https://tradingview.com/chart/AUDUSD',
    riskPercent: 1.8,
    notes: 'Bullish hammer at support level 0.6650. Good risk-reward setup.',
    profit: 180.25,
    status: 'WIN',
  },
  {
    pair: 'EURGBP',
    type: 'SELL',
    time: new Date('2024-10-16T12:45:00Z'),
    chartLink: 'https://tradingview.com/chart/EURGBP',
    riskPercent: 1.2,
    notes: 'Bearish flag pattern completion. Clean entry at flag resistance.',
    profit: 95.75,
    status: 'WIN',
  },
  
  // Losing trades
  {
    pair: 'USDCHF',
    type: 'SELL',
    time: new Date('2024-10-15T16:20:00Z'),
    chartLink: 'https://tradingview.com/chart/USDCHF',
    riskPercent: 2.0,
    notes: 'Expected bearish reversal but got stopped out by news spike.',
    profit: -96.20,
    status: 'LOSS',
  },
  {
    pair: 'GBPUSD',
    type: 'BUY',
    time: new Date('2024-10-14T11:10:00Z'),
    chartLink: 'https://tradingview.com/chart/GBPUSD',
    riskPercent: 1.5,
    notes: 'False breakout above 1.3050. Market quickly reversed.',
    profit: -73.50,
    status: 'LOSS',
  },
  
  // More winning trades for better statistics
  {
    pair: 'NZDUSD',
    type: 'BUY',
    time: new Date('2024-10-13T05:30:00Z'),
    chartLink: 'https://tradingview.com/chart/NZDUSD',
    riskPercent: 2.2,
    notes: 'Strong bullish momentum after RBNZ hawkish comments.',
    profit: 132.40,
    status: 'WIN',
  },
  
  // Breakeven trade
  {
    pair: 'CADCHF',
    type: 'SELL',
    time: new Date('2024-10-11T09:15:00Z'),
    chartLink: 'https://tradingview.com/chart/CADCHF',
    riskPercent: 1.0,
    notes: 'Market moved sideways, closed at breakeven to avoid overnight risk.',
    profit: 0,
    status: 'BREAKEVEN',
  },
  {
    pair: 'EURJPY',
    type: 'SELL',
    time: new Date('2024-10-12T13:25:00Z'),
    chartLink: 'https://tradingview.com/chart/EURJPY',
    riskPercent: 1.8,
    notes: 'Bearish engulfing at resistance 162.80. Clean reversal signal.',
    profit: 167.85,
    status: 'WIN',
  },
  {
    pair: 'USDCAD',
    type: 'SELL',
    time: new Date('2024-10-11T19:15:00Z'),
    chartLink: 'https://tradingview.com/chart/USDCAD',
    riskPercent: 1.6,
    notes: 'Oil price spike supporting CAD. Technical breakdown confirmed.',
    profit: 89.30,
    status: 'WIN',
  },
  
  // One more loss for realistic win rate
  {
    pair: 'CHFJPY',
    type: 'BUY',
    time: new Date('2024-10-10T07:45:00Z'),
    chartLink: 'https://tradingview.com/chart/CHFJPY',
    riskPercent: 2.1,
    notes: 'Breakout failed, got whipsawed in ranging market.',
    profit: -108.75,
    status: 'LOSS',
  },
];

export async function createSampleTrades(userId: number) {
  try {
    console.log('Creating sample trades for user:', userId);
    
    // First, create a sample trading account
    const tradingAccount = await prisma.tradingAccount.create({
      data: {
        userId,
        name: 'Sample Trading Account',
        startingBalance: 10000.0,
        currentBalance: 11250.0,
        description: 'Demo account with sample trading data',
      },
    });
    
    console.log('Created sample trading account:', tradingAccount.name);
    
    // Now create trades with the account reference
    for (const tradeData of sampleTrades) {
      await prisma.trade.create({
        data: {
          ...tradeData,
          userId,
          accountId: tradingAccount.id,
        },
      });
    }
    
    console.log(`Created ${sampleTrades.length} sample trades successfully!`);
    
    // Calculate some statistics
    const closedTrades = sampleTrades.filter(t => t.status !== 'RUNNING');
    const winningTrades = closedTrades.filter(t => t.status === 'WIN');
    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winRate = (winningTrades.length / closedTrades.length) * 100;
    
    console.log('Sample Data Statistics:');
    console.log(`- Total trades: ${sampleTrades.length}`);
    console.log(`- Closed trades: ${closedTrades.length}`);
    console.log(`- Running trades: ${sampleTrades.length - closedTrades.length}`);
    console.log(`- Win rate: ${winRate.toFixed(1)}%`);
    console.log(`- Total P&L: $${totalProfit.toFixed(2)}`);
    
  } catch (error) {
    console.error('Error creating sample trades:', error);
    throw error;
  }
}

// Script to run sample data creation
async function main() {
  // You can change this userId to match a real user in your database
  const userId = 1; // Adjust this to a valid user ID
  
  await createSampleTrades(userId);
  await prisma.$disconnect();
}

// Uncomment to run: node -r ts-node/register sample-data.ts
// main().catch(console.error);
