import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import InputField from './common/InputField';

const ContactForm = ({ formData, setFormData, errors }) => {
  const { firstName, lastName, email, phoneNumber, street, local, note } = formData;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontaktdaten</h2>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
              label="Vorname*"
              icon={faUser}
              placeholder="Max"
              type="text"
              value={firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
          />
          <InputField
              label="Nachname*"
              icon={faUser}
              placeholder="Mustermann"
              type="text"
              value={lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
          />
        </div>

        <InputField
            label="Email*"
            icon={faEnvelope}
            placeholder="max@beispiel.de"
            type="email"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
        />

        <InputField
            label="Telefonnummer*"
            icon={faPhone}
            placeholder="+49 123 456789"
            type="text"
            value={phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
        />

        <InputField
            label="Straße + Hausnummer*"
            icon={faMapMarkerAlt}
            placeholder="Musterstraße 123"
            type="text"
            value={street}
            onChange={(e) => handleChange('street', e.target.value)}
            error={errors.street}
        />

        <InputField
            label="Postleitzahl + Ort*"
            icon={faMapMarkerAlt}
            placeholder="12345 Musterstadt"
            type="text"
            value={local}
            onChange={(e) => handleChange('local', e.target.value)}
            error={errors.local}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FontAwesomeIcon icon={faNoteSticky} className="text-red-600" />
            Weitere Anmerkungen (optional)
          </label>
          <textarea
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 transition-colors focus:outline-none focus:border-red-600 hover:border-gray-300 min-h-[100px]"
              placeholder="Besondere Wünsche oder Anmerkungen..."
              value={note}
              onChange={(e) => handleChange('note', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
