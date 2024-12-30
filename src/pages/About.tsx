import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">About BAKGATOR AB</h1>
          <div className="prose">
            <p className="text-gray-600 mb-4">
              BAKGATOR AB is committed to providing exceptional services and solutions to our clients.
            </p>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                <p className="text-gray-600">
                  Address: FERSENS VÄG 12, MALMÖ<br />
                  Phone: 0725432110<br />
                  Email: KARL@INDE.SE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;