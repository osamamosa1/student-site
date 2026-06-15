import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle, Globe, Mail, Settings, User, CheckCircle2 } from 'lucide-react';

const DeleteAccountSteps = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar'); // Default to Arabic as requested by the user's base

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
  };

  const isAr = lang === 'ar';

  const stepsAr = [
    {
      num: '١',
      title: 'افتح التطبيق وسجّل الدخول',
      desc: 'تأكد من تسجيل الدخول إلى حسابك على تطبيق MPS Platform بحساب طالب أو معلم.',
      badge: '📱 فتح التطبيق'
    },
    {
      num: '٢',
      title: 'انتقل إلى الإعدادات',
      desc: 'اضغط على أيقونة القائمة أو التبويب السفلي للوصول إلى الإعدادات.',
      badge: '⚙️ الإعدادات'
    },
    {
      num: '٣',
      title: 'اختر "ملفي الشخصي" أو "تعديل الملف"',
      desc: 'اضغط على "ملفي الشخصي" من قائمة الإعدادات للانتقال إلى شاشة تعديل الملف الشخصي.',
      badge: '👤 تعديل الملف الشخصي'
    },
    {
      num: '٤',
      title: 'اضغط على زر "حذف الحساب"',
      desc: 'في أسفل شاشة تعديل الملف الشخصي، ستجد زر "حذف الحساب" باللون الأحمر. اضغط عليه.',
      badge: '🗑️ حذف الحساب'
    },
    {
      num: '٥',
      title: 'قم بتأكيد الحذف في مربع الحوار',
      desc: 'سيظهر لك مربع حوار للتأكيد. اضغط على "نعم، احذف حسابي" لإتمام الحذف النهائي. سيتم تسجيل خروجك تلقائيًا وبشكل فوري.',
      badge: '⚠️ تأكيد نهائي'
    }
  ];

  const stepsEn = [
    {
      num: '1',
      title: 'Open the App & Sign In',
      desc: 'Make sure you are logged in to your MPS Platform account as a student or teacher.',
      badge: '📱 Open App'
    },
    {
      num: '2',
      title: 'Navigate to Settings',
      desc: 'Tap the menu icon or the bottom navigation tab to reach Settings.',
      badge: '⚙️ Settings'
    },
    {
      num: '3',
      title: 'Select "My Profile" or "Edit Profile"',
      desc: 'Tap "My Profile" from the settings list to navigate to the Edit Profile screen.',
      badge: '👤 Edit Profile'
    },
    {
      num: '4',
      title: 'Tap the "Delete Account" Button',
      desc: 'At the bottom of the Edit Profile screen, you will find the red "Delete Account" button. Tap it.',
      badge: '🗑️ Delete Account'
    },
    {
      num: '5',
      title: 'Confirm Deletion in the Dialog',
      desc: 'A confirmation dialog will appear. Tap "Yes, Delete My Account" to permanently delete your account. You will be signed out automatically.',
      badge: '⚠️ Final Confirm'
    }
  ];

  const steps = isAr ? stepsAr : stepsEn;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem 1.5rem', color: 'var(--text-main)', fontFamily: 'Cairo, Inter, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation & Language Header */}
        <header className="space-between" style={{ marginBottom: '2.5rem', gap: '1rem', display: 'flex', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} className="btn btn-outline centered" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
            <ArrowLeft size={20} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          </button>
          
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', padding: '4px', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => handleLanguageChange('ar')} 
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: 'none',
                background: isAr ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              العربية
            </button>
            <button 
              onClick={() => handleLanguageChange('en')} 
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: 'none',
                background: !isAr ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              English
            </button>
          </div>
        </header>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="centered" style={{ display: 'inline-flex', width: '60px', height: '60px', borderRadius: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f43f5e', marginBottom: '1.5rem' }}>
            <Trash2 size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            {isAr ? 'طلب حذف الحساب' : 'Account Deletion Request'}
          </h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {isAr 
              ? 'يمكنك حذف حسابك وكل بياناتك بشكل نهائي من داخل التطبيق. يرجى اتباع الخطوات التالية بعناية.' 
              : 'You can permanently delete your account and all associated data from within the app. Please follow the instructions below carefully.'}
          </p>
        </div>

        {/* Warning Alert */}
        <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #f43f5e', borderRight: isAr ? '4px solid #f43f5e' : 'none', background: 'rgba(239, 68, 68, 0.03)', marginBottom: '2.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} style={{ color: '#f43f5e', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ color: '#fda4af', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {isAr ? 'تحذير: هذا الإجراء لا يمكن التراجع عنه' : 'Warning: This action is irreversible'}
            </h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {isAr 
                ? 'عند إتمام حذف الحساب، سيتم إزالة كافة بيانات ملفك الشخصي ودرجات الامتحانات وسجلات الأنشطة بشكل نهائي. لن تتمكن من الدخول إلى الحساب مرة أخرى.' 
                : 'Once account deletion is finalized, all your profile data, exam scores, and activity records will be permanently removed. You will not be able to access the account again.'}
            </p>
          </div>
        </div>

        {/* Steps Title */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>{isAr ? '🪜 خطوات حذف الحساب من داخل التطبيق:' : '🪜 Steps to delete your account inside the app:'}</span>
        </h2>

        {/* Steps List */}
        <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '3rem' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '1.75rem', 
                background: 'var(--bg-card)', 
                display: 'flex', 
                gap: '1.5rem', 
                alignItems: 'flex-start',
                transition: 'all 0.3s'
              }}
            >
              <div className="centered" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{step.desc}</p>
                <span style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  {step.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="glass" style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.01)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
            {isAr ? 'هل تحتاج إلى مساعدة؟' : 'Need help or support?'}
          </h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.925rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            {isAr 
              ? 'إذا واجهت أي صعوبة في حذف حسابك أو ترغب في تقديم طلب يدوي للحذف، يرجى التواصل معنا عبر البريد الإلكتروني.' 
              : 'If you experience any issues deleting your account or wish to submit a manual deletion request, please reach out to us.'}
          </p>
          <a href="mailto:support@mr-abdelrahman.com" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Mail size={18} />
            <span>{isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default DeleteAccountSteps;
