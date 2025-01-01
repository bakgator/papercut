import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalculationState {
  baseRate: number;
  hoursWorked: number;
  editingRate: number;
  editingHours: number;
  additionalServices: number;
  equipmentCosts: number;
  travelExpenses: number;
  vatRate: number;
}

export const VideoProductionCalculator = () => {
  const [state, setState] = useState<CalculationState>({
    baseRate: 100,
    hoursWorked: 8,
    editingRate: 50,
    editingHours: 5,
    additionalServices: 500,
    equipmentCosts: 200,
    travelExpenses: 150,
    vatRate: 25,
  });

  const [totals, setTotals] = useState({
    baseCost: 0,
    editingCost: 0,
    subtotal: 0,
    vatAmount: 0,
    total: 0,
  });

  useEffect(() => {
    const baseCost = state.baseRate * state.hoursWorked;
    const editingCost = state.editingRate * state.editingHours;
    const subtotal = 
      baseCost + 
      editingCost + 
      state.additionalServices + 
      state.equipmentCosts + 
      state.travelExpenses;
    const vatAmount = subtotal * (state.vatRate / 100);
    const total = subtotal + vatAmount;

    setTotals({
      baseCost,
      editingCost,
      subtotal,
      vatAmount,
      total,
    });
  }, [state]);

  const handleInputChange = (field: keyof CalculationState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: parseFloat(e.target.value) || 0,
    }));
  };

  const handleVatChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      vatRate: parseFloat(value),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Filming Costs</h2>
          <div className="space-y-4">
            <div>
              <Label>Base Rate (per hour)</Label>
              <Input
                type="number"
                value={state.baseRate}
                onChange={handleInputChange("baseRate")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Hours Worked</Label>
              <Input
                type="number"
                value={state.hoursWorked}
                onChange={handleInputChange("hoursWorked")}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Editing Costs</h2>
          <div className="space-y-4">
            <div>
              <Label>Editing Rate (per hour)</Label>
              <Input
                type="number"
                value={state.editingRate}
                onChange={handleInputChange("editingRate")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Editing Hours</Label>
              <Input
                type="number"
                value={state.editingHours}
                onChange={handleInputChange("editingHours")}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Costs</h2>
          <div className="space-y-4">
            <div>
              <Label>Additional Services</Label>
              <Input
                type="number"
                value={state.additionalServices}
                onChange={handleInputChange("additionalServices")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Equipment Costs</Label>
              <Input
                type="number"
                value={state.equipmentCosts}
                onChange={handleInputChange("equipmentCosts")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Travel Expenses</Label>
              <Input
                type="number"
                value={state.travelExpenses}
                onChange={handleInputChange("travelExpenses")}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-6">Cost Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Base Cost:</span>
              <span className="font-mono">${totals.baseCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Editing Cost:</span>
              <span className="font-mono">${totals.editingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Additional Services:</span>
              <span className="font-mono">${state.additionalServices.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Equipment Costs:</span>
              <span className="font-mono">${state.equipmentCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Travel Expenses:</span>
              <span className="font-mono">${state.travelExpenses.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>VAT Rate:</span>
                <Select
                  value={state.vatRate.toString()}
                  onValueChange={handleVatChange}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="6">6%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="font-mono">${totals.vatAmount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="font-mono">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};