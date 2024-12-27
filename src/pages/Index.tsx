import React from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-normal tracking-tight">INVOICE</h1>
          <p className="text-lg font-normal">#0123</p>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Top Section */}
          <div className="grid grid-cols-[1fr,2fr,1fr] gap-4">
            <div>
              <p className="text-xs font-normal uppercase mb-1">DATE:</p>
              <input
                type="date"
                className="border-none p-0 text-sm focus:ring-0"
              />
            </div>
            <div>
              <p className="text-xs font-normal uppercase mb-1">CUSTOMER:</p>
              <div className="text-sm space-y-0.5">
                <p>BAKGATOR AB</p>
                <p>FERSENS VÄG 12</p>
                <p>MALMÖ</p>
                <p>0725432110</p>
                <p>KARL@INDE.SE</p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-black">
                <th className="py-1 text-left font-normal text-xs uppercase">ITEM</th>
                <th className="py-1 text-left font-normal text-xs uppercase">QTY</th>
                <th className="py-1 text-right font-normal text-xs uppercase">PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">FOTO</td>
                <td className="py-1">2H</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1">FILM</td>
                <td className="py-1">5H</td>
                <td className="py-1 text-right"></td>
              </tr>
              <tr>
                <td className="py-1">REDIGERING</td>
                <td className="py-1">2H</td>
                <td className="py-1 text-right"></td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-32">
              <div className="flex justify-between text-sm">
                <span>delsumma</span>
                <span>8000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>moms</span>
                <span>2000</span>
              </div>
              <div className="flex justify-between text-sm border-t border-black pt-1">
                <span>TOTALT</span>
                <span>10 000</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <p className="text-xs font-normal uppercase mb-1">SENDER:</p>
              <div className="text-sm space-y-0.5">
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
                <p className="text-sm">BANKGIRO: 123456789</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase">GODKÄND FÖR F-SKATT</p>
                <p className="text-sm">SE12345678901</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;