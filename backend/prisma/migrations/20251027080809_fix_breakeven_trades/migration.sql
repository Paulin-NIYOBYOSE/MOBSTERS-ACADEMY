-- Fix incorrectly classified BREAKEVEN trades
-- BREAKEVEN trades should only have profit = 0 or very close to 0

-- Convert BREAKEVEN trades with positive profit to WIN
UPDATE "Trade" 
SET status = 'WIN' 
WHERE status = 'BREAKEVEN' AND profit > 5;

-- Convert BREAKEVEN trades with negative profit to LOSS  
UPDATE "Trade" 
SET status = 'LOSS' 
WHERE status = 'BREAKEVEN' AND profit < -5;

-- Set profit to 0 for remaining true BREAKEVEN trades (profit between -5 and 5)
UPDATE "Trade" 
SET profit = 0 
WHERE status = 'BREAKEVEN' AND profit BETWEEN -5 AND 5;