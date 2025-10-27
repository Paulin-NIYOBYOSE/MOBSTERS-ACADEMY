-- Update existing trades to use new status system
-- Only update if result column exists
DO $$
BEGIN
    -- Check if result column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Trade' AND column_name = 'result') THEN
        -- Convert CLOSED + WIN result to WIN status
        UPDATE "Trade" 
        SET status = 'WIN' 
        WHERE status = 'CLOSED' AND result = 'WIN';

        -- Convert CLOSED + LOSS result to LOSS status  
        UPDATE "Trade" 
        SET status = 'LOSS' 
        WHERE status = 'CLOSED' AND result = 'LOSS';

        -- Convert any remaining CLOSED trades to BREAKEVEN
        UPDATE "Trade" 
        SET status = 'BREAKEVEN' 
        WHERE status = 'CLOSED' AND result IS NULL;

        -- Remove the result column
        ALTER TABLE "Trade" DROP COLUMN "result";
    END IF;
    
    -- Convert any remaining CLOSED trades (without result column) to BREAKEVEN
    UPDATE "Trade" 
    SET status = 'BREAKEVEN' 
    WHERE status = 'CLOSED';
END $$;