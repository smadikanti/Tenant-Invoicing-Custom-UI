import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TenantInvoiceUI = () => {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(new Date());
  const [waterPumpBill, setWaterPumpBill] = useState('');
  const [powerBills, setPowerBills] = useState({
    'Laxmana Chary': '',
    'Nagaraju': '',
    'Nagesh': '',
    'Sujith': '',
    'Anvesh': ''
  });
  const [advancePaid, setAdvancePaid] = useState({
    'Laxmana Chary': '',
    'Nagaraju': '',
    'Nagesh': '',
    'Sujith': '',
    'Anvesh': ''
  });
  const [rents] = useState({
    'Laxmana Chary': 4000,
    'Nagaraju': 4000,
    'Nagesh': 3800,
    'Sujith': 5000,
    'Anvesh': 5300
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);
  const cardRef = useRef(null);

  const tenantOrder = ['Laxmana Chary', 'Nagaraju', 'Nagesh', 'Sujith', 'Anvesh'];

  useEffect(() => {
    const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(lastMonth);
  }, []);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 75) {
        // Swipe left
        handleNextCard();
      } else if (touchEndX - touchStartX > 75) {
        // Swipe right
        handlePrevCard();
      }
    };

    const currentCard = cardRef.current;
    if (currentCard && step > 6) {
      currentCard.addEventListener('touchstart', handleTouchStart);
      currentCard.addEventListener('touchmove', handleTouchMove);
      currentCard.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (currentCard) {
        currentCard.removeEventListener('touchstart', handleTouchStart);
        currentCard.removeEventListener('touchmove', handleTouchMove);
        currentCard.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [step, currentCardIndex]);

  const handleNextStep = () => {
    if (step >= 2 && step <= 6) {
      const currentTenant = tenantOrder[step - 2];
      if (!powerBills[currentTenant]) {
        setError('Please enter the power bill amount before proceeding.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePowerBillChange = (tenant, value) => {
    setPowerBills({ ...powerBills, [tenant]: value });
    setError('');
  };

  const handleAdvancePaidChange = (tenant, value) => {
    setAdvancePaid({ ...advancePaid, [tenant]: value });
  };

  const getBorePowerBillSplit = () => {
    return Math.ceil(parseFloat(waterPumpBill || '0') / 6);
  };

  const getLastMonthString = () => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev < tenantOrder.length ? prev + 1 : 0));
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : tenantOrder.length));
  };

  const renderPrompt = () => {
    return (
      <Card className="w-full max-w-[350px] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            {step === 0 ? (
              <>Creating invoices for month:</>
            ) : step === 1 ? (
              "Water Pump Bill"
            ) : (
              `${tenantOrder[step - 2]}'s Details`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold mb-4">{getLastMonthString()}</p>
              <Button onClick={handleNextStep} className="w-full sm:w-auto">Yes, proceed</Button>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                ref={firstInputRef}
                type="number"
                inputMode="numeric"
                value={waterPumpBill}
                onChange={(e) => setWaterPumpBill(e.target.value)}
                placeholder="Enter water pump bill"
              />
              <div className="flex justify-end">
                <Button onClick={handleNextStep} className="w-full sm:w-auto">Next</Button>
              </div>
            </div>
          )}
          {step >= 2 && step <= 6 && (
            <div className="space-y-4">
              <div className="text-right text-sm text-gray-600">
                Monthly Rent: ₹{rents[tenantOrder[step - 2]]}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Power Bill
                </label>
                <Input
                  ref={firstInputRef}
                  type="number"
                  inputMode="numeric"
                  value={powerBills[tenantOrder[step - 2]]}
                  onChange={(e) => handlePowerBillChange(tenantOrder[step - 2], e.target.value)}
                  placeholder="Enter power bill amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advance Paid
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={advancePaid[tenantOrder[step - 2]]}
                  onChange={(e) => handleAdvancePaidChange(tenantOrder[step - 2], e.target.value)}
                  placeholder="Enter advance paid amount"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end">
                <Button onClick={handleNextStep} className="w-full sm:w-auto">
                  {step === 6 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderInvoiceCard = (tenant) => {
    const powerBillValue = parseFloat(powerBills[tenant] || '0');
    const advancePaidValue = parseFloat(advancePaid[tenant] || '0');
    const totalDue = rents[tenant] + powerBillValue + getBorePowerBillSplit() - advancePaidValue;
    return (
      <Card key={tenant} className="w-full max-w-[350px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">{tenant}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600">Rent for <span className="font-bold">{getLastMonthString()}</span></span>
            <span className="font-semibold">₹{rents[tenant]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600">Power Bill</span>
            <span className="font-semibold">₹{powerBillValue}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600">Bore Power Bill Split</span>
            <span className="font-semibold">₹{getBorePowerBillSplit()}</span>
          </div>
          {advancePaidValue > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">Advance Paid</span>
              <span className="font-semibold text-green-600">₹{advancePaidValue}</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg sm:text-xl font-bold text-gray-800">Total Due</span>
              <span className="text-xl sm:text-2xl font-bold text-red-600">₹{totalDue.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center w-full">
            Please pay the full amount before <span className="font-bold italic">July 10th</span>
          </p>
        </CardFooter>
      </Card>
    );
  };

  const renderSummaryCard = () => {
    return (
      <Card className="w-full max-w-[350px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Summary - {getLastMonthString()}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {tenantOrder.map((tenant) => {
            const powerBillValue = parseFloat(powerBills[tenant] || '0');
            const advancePaidValue = parseFloat(advancePaid[tenant] || '0');
            const totalDue = rents[tenant] + powerBillValue + getBorePowerBillSplit() - advancePaidValue;
            return (
              <div key={tenant} className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">{tenant}</span>
                <span className="text-sm sm:text-base font-semibold text-red-600">₹{totalDue.toFixed(2)}</span>
              </div>
            );
          })}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg sm:text-xl font-bold text-gray-800">Total Due</span>
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                ₹{tenantOrder.reduce((sum, tenant) => {
                  const powerBillValue = parseFloat(powerBills[tenant] || '0');
                  const advancePaidValue = parseFloat(advancePaid[tenant] || '0');
                  return sum + rents[tenant] + powerBillValue + getBorePowerBillSplit() - advancePaidValue;
                }, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCardSlider = () => {
    const cards = [...tenantOrder.map(renderInvoiceCard), renderSummaryCard()];
    return (
      <div className="relative flex flex-col items-center" ref={cardRef}>
        <div className="w-full flex items-center justify-center">
          {cards[currentCardIndex]}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">Swipe left or right to navigate</p>
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {step <= 6 ? renderPrompt() : renderCardSlider()}
      {step <= 6 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 w-full sm:w-auto">Settings</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div>
              {/* Add settings fields here */}
              <p>Tenant name settings would go here</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TenantInvoiceUI;
