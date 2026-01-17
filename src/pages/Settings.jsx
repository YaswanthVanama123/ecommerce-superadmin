import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  getSystemSettings,
  updateGeneralSettings,
  updateEmailSettings,
  updatePaymentSettings,
  updateShippingSettings,
  updateSecuritySettings,
  updateAppearanceSettings,
  testEmailConnection,
  uploadLogo
} from '../api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [settings, setSettings] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSystemSettings();
      setSettings(response);

      // Reset form with fetched data based on active tab
      resetFormForTab(activeTab, response);

      if (response.appearance?.logoUrl) {
        setLogoPreview(response.appearance.logoUrl);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      // Set default empty settings
      setSettings({
        general: {},
        email: {},
        payment: {},
        shipping: {},
        security: {},
        appearance: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFormForTab = (tab, data = settings) => {
    if (!data) return;

    switch(tab) {
      case 'general':
        reset({
          siteName: data.general?.siteName || '',
          siteDescription: data.general?.siteDescription || '',
          contactEmail: data.general?.contactEmail || '',
          supportEmail: data.general?.supportEmail || '',
          phoneNumber: data.general?.phoneNumber || '',
          address: data.general?.address || '',
          timezone: data.general?.timezone || 'UTC',
          currency: data.general?.currency || 'USD',
          language: data.general?.language || 'en'
        });
        break;
      case 'email':
        reset({
          smtpHost: data.email?.smtpHost || '',
          smtpPort: data.email?.smtpPort || 587,
          smtpUser: data.email?.smtpUser || '',
          smtpPassword: data.email?.smtpPassword || '',
          smtpSecure: data.email?.smtpSecure || false,
          fromEmail: data.email?.fromEmail || '',
          fromName: data.email?.fromName || ''
        });
        break;
      case 'payment':
        reset({
          stripeEnabled: data.payment?.stripeEnabled || false,
          stripePublicKey: data.payment?.stripePublicKey || '',
          stripeSecretKey: data.payment?.stripeSecretKey || '',
          paypalEnabled: data.payment?.paypalEnabled || false,
          paypalClientId: data.payment?.paypalClientId || '',
          paypalSecretKey: data.payment?.paypalSecretKey || '',
          paypalMode: data.payment?.paypalMode || 'sandbox',
          taxRate: data.payment?.taxRate || 0,
          taxEnabled: data.payment?.taxEnabled || false
        });
        break;
      case 'shipping':
        reset({
          shippingEnabled: data.shipping?.shippingEnabled || false,
          freeShippingThreshold: data.shipping?.freeShippingThreshold || 0,
          flatRate: data.shipping?.flatRate || 0,
          localDeliveryEnabled: data.shipping?.localDeliveryEnabled || false,
          internationalShippingEnabled: data.shipping?.internationalShippingEnabled || false,
          processingDays: data.shipping?.processingDays || 2,
          trackingEnabled: data.shipping?.trackingEnabled || false
        });
        break;
      case 'security':
        reset({
          twoFactorEnabled: data.security?.twoFactorEnabled || false,
          twoFactorRequired: data.security?.twoFactorRequired || false,
          passwordMinLength: data.security?.passwordMinLength || 8,
          passwordRequireUppercase: data.security?.passwordRequireUppercase || true,
          passwordRequireNumbers: data.security?.passwordRequireNumbers || true,
          passwordRequireSpecialChars: data.security?.passwordRequireSpecialChars || true,
          sessionTimeout: data.security?.sessionTimeout || 30,
          maxLoginAttempts: data.security?.maxLoginAttempts || 5,
          lockoutDuration: data.security?.lockoutDuration || 15,
          ipWhitelistEnabled: data.security?.ipWhitelistEnabled || false,
          ipWhitelist: data.security?.ipWhitelist || ''
        });
        break;
      case 'appearance':
        reset({
          primaryColor: data.appearance?.primaryColor || '#3B82F6',
          secondaryColor: data.appearance?.secondaryColor || '#10B981',
          accentColor: data.appearance?.accentColor || '#F59E0B',
          theme: data.appearance?.theme || 'light',
          customCSS: data.appearance?.customCSS || '',
          faviconUrl: data.appearance?.faviconUrl || ''
        });
        break;
    }
  };

  useEffect(() => {
    resetFormForTab(activeTab);
  }, [activeTab]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let response;

      switch(activeTab) {
        case 'general':
          response = await updateGeneralSettings(data);
          break;
        case 'email':
          response = await updateEmailSettings(data);
          break;
        case 'payment':
          response = await updatePaymentSettings({
            ...data,
            taxRate: parseFloat(data.taxRate)
          });
          break;
        case 'shipping':
          response = await updateShippingSettings({
            ...data,
            freeShippingThreshold: parseFloat(data.freeShippingThreshold),
            flatRate: parseFloat(data.flatRate),
            processingDays: parseInt(data.processingDays)
          });
          break;
        case 'security':
          response = await updateSecuritySettings({
            ...data,
            passwordMinLength: parseInt(data.passwordMinLength),
            sessionTimeout: parseInt(data.sessionTimeout),
            maxLoginAttempts: parseInt(data.maxLoginAttempts),
            lockoutDuration: parseInt(data.lockoutDuration)
          });
          break;
        case 'appearance':
          response = await updateAppearanceSettings(data);
          break;
      }

      setSettings(prev => ({
        ...prev,
        [activeTab]: response[activeTab] || response
      }));

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      await testEmailConnection();
      toast.success('Email connection test successful! Check your inbox.');
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error(error.response?.data?.message || 'Email connection test failed');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await uploadLogo(formData);
      setLogoPreview(response.logoUrl);
      setValue('logoUrl', response.logoUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'shipping', name: 'Shipping', icon: '🚚' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application configuration</p>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('siteName', { required: 'Site name is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="My Awesome Store"
                      />
                      {errors.siteName && (
                        <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('contactEmail', {
                          required: 'Contact email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@example.com"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      {...register('siteDescription')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your site"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        {...register('supportEmail', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="support@example.com"
                      />
                      {errors.supportEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.supportEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('phoneNumber')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        {...register('timezone')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Shanghai">Shanghai</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        {...register('currency')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        {...register('language')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('smtpHost', { required: 'SMTP host is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="smtp.gmail.com"
                      />
                      {errors.smtpHost && (
                        <p className="mt-1 text-sm text-red-600">{errors.smtpHost.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register('smtpPort', { required: 'SMTP port is required', min: 1, max: 65535 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="587"
                      />
                      {errors.smtpPort && (
                        <p className="mt-1 text-sm text-red-600">{errors.smtpPort.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('smtpUser', { required: 'SMTP username is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="user@gmail.com"
                      />
                      {errors.smtpUser && (
                        <p className="mt-1 text-sm text-red-600">{errors.smtpUser.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        {...register('smtpPassword', { required: 'SMTP password is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                      {errors.smtpPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.smtpPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('smtpSecure')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Use SSL/TLS</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('fromEmail', {
                          required: 'From email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="noreply@example.com"
                      />
                      {errors.fromEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.fromEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('fromName', { required: 'From name is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="My Store"
                      />
                      {errors.fromName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fromName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testingEmail ? 'Testing...' : 'Test Email Connection'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Stripe */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Stripe</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('stripeEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Stripe</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publishable Key
                      </label>
                      <input
                        type="text"
                        {...register('stripePublicKey')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="pk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        {...register('stripeSecretKey')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">PayPal</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('paypalEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable PayPal</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client ID
                      </label>
                      <input
                        type="text"
                        {...register('paypalClientId')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="AXx..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        {...register('paypalSecretKey')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="EX..."
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode
                    </label>
                    <select
                      {...register('paypalMode')}
                      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                  </div>
                </div>

                {/* Tax Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('taxEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Tax Calculation</span>
                    </label>
                  </div>

                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('taxRate', { min: 0, max: 100 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {errors.taxRate && (
                      <p className="mt-1 text-sm text-red-600">{errors.taxRate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Configuration</h3>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('shippingEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Shipping</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('localDeliveryEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Local Delivery</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('internationalShippingEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable International Shipping</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('trackingEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Order Tracking</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flat Rate Shipping ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('flatRate', { min: 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('freeShippingThreshold', { min: 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      <p className="mt-1 text-xs text-gray-500">Orders above this amount get free shipping</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processing Days
                      </label>
                      <input
                        type="number"
                        {...register('processingDays', { min: 0, max: 30 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2"
                      />
                      <p className="mt-1 text-xs text-gray-500">Days to process orders before shipping</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('twoFactorEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable 2FA for all users</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('twoFactorRequired')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require 2FA for all admin users</span>
                    </label>
                  </div>
                </div>

                {/* Password Policy */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        {...register('passwordMinLength', { min: 6, max: 128 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('passwordRequireUppercase')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('passwordRequireNumbers')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require numbers</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('passwordRequireSpecialChars')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                    </label>
                  </div>
                </div>

                {/* Session & Login Security */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Session & Login Security</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        {...register('sessionTimeout', { min: 5, max: 1440 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        {...register('maxLoginAttempts', { min: 3, max: 10 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        {...register('lockoutDuration', { min: 5, max: 1440 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>

                {/* IP Whitelist */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">IP Whitelist</h3>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('ipWhitelistEnabled')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable IP Whitelist</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed IP Addresses
                    </label>
                    <textarea
                      {...register('ipWhitelist')}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter one IP address or CIDR range per line</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>

                  {/* Logo Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="w-24 h-24 border-2 border-gray-300 rounded-lg overflow-hidden">
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer inline-block ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG or SVG. Max 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      {...register('faviconUrl')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          {...register('primaryColor')}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          {...register('primaryColor')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          {...register('secondaryColor')}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          {...register('secondaryColor')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          {...register('accentColor')}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          {...register('accentColor')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#F59E0B"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Theme
                    </label>
                    <select
                      {...register('theme')}
                      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System Preference)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional CSS
                    </label>
                    <textarea
                      {...register('customCSS')}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder=".custom-class { color: #333; }"
                    />
                    <p className="mt-1 text-xs text-gray-500">Add custom CSS to override default styles</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {saving && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
