import React from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-2xl font-medium">#0123</p>
        </div>

        {/* Customer and Date Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold uppercase mb-1">DATE:</h2>
            <input
              type="date"
              className="border-b border-gray-300 focus:border-gray-500 outline-none"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase mb-1">CUSTOMER:</h2>
            <div className="space-y-1">
              <p>BAKGATOR AB</p>
              <p>FERSENS VÄG 12</p>
              <p>MALMÖ</p>
              <p>0725432110</p>
              <p>KARL@INDE.SE</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 text-sm font-semibold uppercase">Item</th>
                <th className="text-left py-2 text-sm font-semibold uppercase">Qty</th>
                <th className="text-right py-2 text-sm font-semibold uppercase">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">FOTO</td>
                <td className="py-2">2H</td>
                <td className="text-right py-2"></td>
              </tr>
              <tr>
                <td className="py-2">FILM</td>
                <td className="py-2">5H</td>
                <td className="text-right py-2"></td>
              </tr>
              <tr>
                <td className="py-2">REDIGERING</td>
                <td className="py-2">2H</td>
                <td className="text-right py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-end space-y-2">
            <table className="w-48">
              <tr>
                <td className="py-1">delsumma</td>
                <td className="text-right py-1">8000</td>
              </tr>
              <tr>
                <td className="py-1">moms</td>
                <td className="text-right py-1">2000</td>
              </tr>
              <tr className="font-semibold border-t border-gray-300">
                <td className="py-1">TOTALT</td>
                <td className="text-right py-1">10 000</td>
              </tr>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-semibold uppercase mb-1">SENDER:</h2>
              <div className="space-y-1">
                <p>BAKGATOR AB</p>
                <p>ORG NR: 123456789</p>
                <p>FERSENS VÄG 12</p>
                <p>MALMÖ</p>
                <p>0725432110</p>
                <p>KARL@INDE.SE</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold uppercase mb-1">BANKGIRO:</h2>
                <p>123456789</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase mb-1">GODKÄND FÖR F-SKATT</h2>
                <p>SE12345678901</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;