import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Plus, X, Link, DollarSign, Percent } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '../../lib/utils';
import { CreateTradeDto, UpdateTradeDto, Trade, tradingJournalService } from '../../services/tradingJournalService';

const tradeSchema = z.object({
  pair: z.string().min(1, 'Pair is required').max(10, 'Pair too long'),
  type: z.enum(['BUY', 'SELL']),
  time: z.date(),
  chartLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  riskPercent: z.number().min(0).max(100).optional(),
  result: z.enum(['WIN', 'LOSS']).optional(),
  accountIds: z.array(z.number()).min(1, 'Please select at least one account'),
  profit: z.number().optional(),
  status: z.enum(['RUNNING', 'CLOSED']).optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

interface SimpleTradeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trade?: Trade | null;
  mode: 'create' | 'edit';
}

const COMMON_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD', 'CHFJPY', 'GBPCHF',
  'AUDCAD', 'AUDCHF', 'CADCHF', 'CADJPY', 'EURCHF', 'EURCAD', 'GBPAUD',
  'GBPCAD', 'NZDJPY', 'AUDNZD'
];

export const SimpleTradeForm: React.FC<SimpleTradeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  trade,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      pair: '',
      type: 'BUY',
      time: new Date(),
      chartLink: '',
      riskPercent: 1,
      notes: '',
      currentBalance: 1000,
      comment: '',
      status: 'RUNNING',
    },
  });

  useEffect(() => {
    if (trade && mode === 'edit') {
      form.reset({
        pair: trade.pair,
        type: trade.type,
        time: new Date(trade.time),
        chartLink: trade.chartLink || '',
        riskPercent: trade.riskPercent,
        result: trade.result,
        notes: trade.notes || '',
        currentBalance: trade.currentBalance,
        comment: trade.comment || '',
        profit: trade.profit,
        status: trade.status,
      });
    } else {
      form.reset({
        pair: '',
        type: 'BUY',
        time: new Date(),
        chartLink: '',
        riskPercent: 1,
        notes: '',
        currentBalance: 1000,
        comment: '',
        status: 'RUNNING',
      });
    }
  }, [trade, mode, form]);

  const onSubmit = async (data: TradeFormData) => {
    setLoading(true);
    try {
      const tradeData = {
        ...data,
        time: data.time.toISOString(),
        chartLink: data.chartLink || undefined,
      };

      if (mode === 'create') {
        await tradingJournalService.createTrade(tradeData as CreateTradeDto);
        toast({
          title: 'Success',
          description: 'Trade created successfully',
        });
      } else if (trade) {
        await tradingJournalService.updateTrade(trade.id, tradeData as UpdateTradeDto);
        toast({
          title: 'Success',
          description: 'Trade updated successfully',
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save trade',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Trade' : 'Edit Trade'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Enter the essential details of your trade. You can update results later when the trade closes.'
              : 'Update the trade information and results'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pair */}
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Pair</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pair" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMMON_PAIRS.map((pair) => (
                          <SelectItem key={pair} value={pair}>
                            {pair}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BUY">BUY (Long)</SelectItem>
                        <SelectItem value="SELL">SELL (Short)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Trade Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Risk Percent */}
              <FormField
                control={form.control}
                name="riskPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk %</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="1.0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                        <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Balance */}
              <FormField
                control={form.control}
                name="currentBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Balance</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="1000.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                        <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RUNNING">Running</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Chart Link */}
            <FormField
              control={form.control}
              name="chartLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart Link (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://tradingview.com/chart/..."
                        {...field}
                      />
                      <Link className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Result and Profit (for closed trades) */}
            {form.watch('status') === 'CLOSED' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Result</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WIN">WIN</SelectItem>
                          <SelectItem value="LOSS">LOSS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit/Loss ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why did you take this trade? What was your setup?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional thoughts or lessons learned..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : mode === 'create' ? 'Create Trade' : 'Update Trade'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
