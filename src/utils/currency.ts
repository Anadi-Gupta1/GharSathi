export class CurrencyService {
  private static readonly CURRENCY_SYMBOL = '₹';
  private static readonly DECIMAL_PLACES = 2;

  // Format amount in Indian Rupees
  static formatAmount(amount: number, showSymbol: boolean = true): string {
    if (isNaN(amount) || amount < 0) return showSymbol ? '₹0' : '0';
    
    const formatted = amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return showSymbol ? `₹${formatted}` : formatted;
  }

  // Format amount with symbol always
  static formatPrice(amount: number): string {
    return this.formatAmount(amount, true);
  }

  // Parse string amount to number
  static parseAmount(amountString: string): number {
    if (!amountString) return 0;
    
    // Remove currency symbols, spaces, and commas
    const cleanAmount = amountString
      .replace(/[₹$,\s]/g, '')
      .trim();
    
    const parsed = parseFloat(cleanAmount);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Calculate discount amount
  static calculateDiscount(originalPrice: number, discountPercentage: number): {
    discountAmount: number;
    finalPrice: number;
    savings: number;
  } {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    return {
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      savings: Math.round(discountAmount * 100) / 100,
    };
  }

  // Calculate tax amount
  static calculateTax(amount: number, taxPercentage: number): {
    taxAmount: number;
    totalAmount: number;
  } {
    const taxAmount = (amount * taxPercentage) / 100;
    const totalAmount = amount + taxAmount;
    
    return {
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }

  // Calculate service fee
  static calculateServiceFee(amount: number, feePercentage: number = 5): {
    serviceFee: number;
    totalAmount: number;
  } {
    const serviceFee = (amount * feePercentage) / 100;
    const totalAmount = amount + serviceFee;
    
    return {
      serviceFee: Math.round(serviceFee * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }

  // Calculate platform commission
  static calculateCommission(amount: number, commissionPercentage: number): {
    commission: number;
    providerEarning: number;
  } {
    const commission = (amount * commissionPercentage) / 100;
    const providerEarning = amount - commission;
    
    return {
      commission: Math.round(commission * 100) / 100,
      providerEarning: Math.round(providerEarning * 100) / 100,
    };
  }

  // Get payment breakdown
  static getPaymentBreakdown(
    baseAmount: number,
    discountPercentage: number = 0,
    taxPercentage: number = 18,
    serviceFeePercentage: number = 5
  ): {
    baseAmount: number;
    discount: number;
    serviceFee: number;
    tax: number;
    totalAmount: number;
    breakdown: Array<{
      label: string;
      amount: number;
      type: 'positive' | 'negative' | 'neutral';
    }>;
  } {
    const discountCalculation = this.calculateDiscount(baseAmount, discountPercentage);
    const amountAfterDiscount = discountCalculation.finalPrice;
    
    const serviceFeeCalculation = this.calculateServiceFee(amountAfterDiscount, serviceFeePercentage);
    const serviceFee = serviceFeeCalculation.serviceFee;
    
    const taxableAmount = amountAfterDiscount + serviceFee;
    const taxCalculation = this.calculateTax(taxableAmount, taxPercentage);
    const tax = taxCalculation.taxAmount;
    
    const totalAmount = amountAfterDiscount + serviceFee + tax;

    const breakdown: Array<{
      label: string;
      amount: number;
      type: 'positive' | 'negative' | 'neutral';
    }> = [
      {
        label: 'Service Amount',
        amount: baseAmount,
        type: 'neutral',
      },
    ];

    if (discountPercentage > 0) {
      breakdown.push({
        label: `Discount (${discountPercentage}%)`,
        amount: -discountCalculation.discountAmount,
        type: 'negative',
      });
    }

    breakdown.push({
      label: `Service Fee (${serviceFeePercentage}%)`,
      amount: serviceFee,
      type: 'positive',
    });

    breakdown.push({
      label: `GST (${taxPercentage}%)`,
      amount: tax,
      type: 'positive',
    });

    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      discount: Math.round(discountCalculation.discountAmount * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown,
    };
  }

  // Format payment breakdown for display
  static formatPaymentBreakdown(breakdown: ReturnType<typeof CurrencyService.getPaymentBreakdown>): {
    items: Array<{
      label: string;
      value: string;
      isTotal?: boolean;
      isDiscount?: boolean;
    }>;
    total: string;
  } {
    const items: Array<{
      label: string;
      value: string;
      isTotal?: boolean;
      isDiscount?: boolean;
    }> = breakdown.breakdown.map(item => ({
      label: item.label,
      value: item.type === 'negative' 
        ? `-${this.formatPrice(Math.abs(item.amount))}`
        : this.formatPrice(item.amount),
      isDiscount: item.type === 'negative',
    }));

    items.push({
      label: 'Total Amount',
      value: this.formatPrice(breakdown.totalAmount),
      isTotal: true,
    });

    return {
      items,
      total: this.formatPrice(breakdown.totalAmount),
    };
  }

  // Convert paisa to rupees
  static paisaToRupees(paisa: number): number {
    return paisa / 100;
  }

  // Convert rupees to paisa
  static rupeesToPaisa(rupees: number): number {
    return Math.round(rupees * 100);
  }

  // Format amount for payment gateway (in paisa)
  static formatForPaymentGateway(amount: number): number {
    return this.rupeesToPaisa(amount);
  }

  // Validate amount
  static validateAmount(amount: number, minAmount: number = 1, maxAmount: number = 100000): {
    isValid: boolean;
    error?: string;
  } {
    if (isNaN(amount) || amount <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }

    if (amount < minAmount) {
      return { isValid: false, error: `Minimum amount is ${this.formatPrice(minAmount)}` };
    }

    if (amount > maxAmount) {
      return { isValid: false, error: `Maximum amount is ${this.formatPrice(maxAmount)}` };
    }

    return { isValid: true };
  }

  // Get currency symbol
  static getCurrencySymbol(): string {
    return this.CURRENCY_SYMBOL;
  }

  // Format large amounts with K, L, Cr suffixes
  static formatLargeAmount(amount: number): string {
    if (amount >= 10000000) { // 1 Crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 Thousand
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return this.formatPrice(amount);
    }
  }

  // Calculate tip amount suggestions
  static getTipSuggestions(amount: number): number[] {
    const basePercentages = [5, 10, 15, 20];
    return basePercentages.map(percentage => {
      const tipAmount = (amount * percentage) / 100;
      return Math.round(tipAmount);
    }).filter(tip => tip > 0);
  }

  // Calculate split bill amount
  static splitBill(totalAmount: number, numberOfPeople: number): {
    amountPerPerson: number;
    remainder: number;
    formattedAmountPerPerson: string;
  } {
    if (numberOfPeople <= 0) {
      return {
        amountPerPerson: totalAmount,
        remainder: 0,
        formattedAmountPerPerson: this.formatPrice(totalAmount),
      };
    }

    const amountPerPerson = Math.floor((totalAmount * 100) / numberOfPeople) / 100;
    const remainder = totalAmount - (amountPerPerson * numberOfPeople);

    return {
      amountPerPerson,
      remainder: Math.round(remainder * 100) / 100,
      formattedAmountPerPerson: this.formatPrice(amountPerPerson),
    };
  }
}

export default CurrencyService;
