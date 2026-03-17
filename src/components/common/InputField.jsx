import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({ label, icon, error, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FontAwesomeIcon icon={icon} className="text-red-600" />
        {label}
      </label>
      <input
          className={`w-full border-2 rounded-lg px-4 py-3 transition-colors focus:outline-none focus:border-red-600 ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          {...props}
      />
      {error && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
      )}
    </div>
);

export default InputField;
