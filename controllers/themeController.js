const ThemeSetting = require('../models/ThemeSetting');

// Helper: map old activeTheme to granular defaults for backward compatibility
const mapLegacyTheme = (activeTheme) => {
  switch (activeTheme) {
    case 'dark':
      return { sidebarTheme: 'black', headerTheme: 'black' };
    case 'softBlue':
      return { sidebarTheme: 'blue', headerTheme: 'white' };
    case 'default':
    default:
      return { sidebarTheme: 'white', headerTheme: 'white' };
  }
};

// Get current theme setting (single global document)
exports.getTheme = async (req, res, next) => {
  try {
    let setting = await ThemeSetting.findOne();
    if (!setting) {
      const mapped = mapLegacyTheme('default');
      setting = await ThemeSetting.create({ activeTheme: 'default', ...mapped });
    }
    // Ensure granular fields exist even for old documents
    const patch = {};
    if (!setting.sidebarTheme || !setting.headerTheme || !setting.sidebarTextColor || !setting.headerTextColor) {
      const mapped = mapLegacyTheme(setting.activeTheme || 'default');
      if (!setting.sidebarTheme) patch.sidebarTheme = mapped.sidebarTheme;
      if (!setting.headerTheme) patch.headerTheme = mapped.headerTheme;
      if (!setting.sidebarTextColor) patch.sidebarTextColor = mapped.sidebarTextColor;
      if (!setting.headerTextColor) patch.headerTextColor = mapped.headerTextColor;
      if (Object.keys(patch).length) {
        setting = await ThemeSetting.findOneAndUpdate({}, patch, { new: true });
      }
    }
    res.status(200).json({
      success: true,
      data: {
        activeTheme: setting.activeTheme,
        sidebarTheme: setting.sidebarTheme,
        headerTheme: setting.headerTheme,
        sidebarTextColor: setting.sidebarTextColor,
        headerTextColor: setting.headerTextColor,
        hideMainHero: !!setting.hideMainHero,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update global theme setting
exports.updateTheme = async (req, res, next) => {
  try {
    const {
      activeTheme,
      sidebarTheme,
      headerTheme,
      sidebarTextColor,
      headerTextColor,
      hideMainHero,
    } = req.body || {};

    if (
      activeTheme &&
      !['default', 'dark', 'softBlue'].includes(activeTheme)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid activeTheme value',
      });
    }

    const validPalette = [
      'white',
      'black',
      'blue',
      'yellow',
      'gray',
      'green',
      'purple',
      'orange',
      'grayD1D5DB',
      'gray9CA3AF',
      'gray6B7280',
      'gray4B5563',
      'gray374151',
      'gray1F2937',
      'gray111827',
      'grayE5E7EB',
      'grayF3F4F6',
      'grayF9FAFB',
      'red7F1D1D',
      'red991B1B',
      'redB91C1C',
      'redDC2626',
      'redEF4444',
      'redF87171',
      'redFCA5A5',
      'purple4C1D95',
      'purple5B21B6',
      'purple6D28D9',
      'purple7C3AED',
      'purple8B5CF6',
      'purpleA78BFA',
      'purpleC4B5FD',
      'blue1E3A8A',
      'blue1D4ED8',
      'blue2563EB',
      'blue3B82F6',
      'blue60A5FA',
      'blue93C5FD',
      'blueBFDBFE',
      'cyan164E63',
      'cyan0E7490',
      'cyan0891B2',
      'cyan06B6D4',
      'cyan22D3EE',
      'cyan67E8F9',
      'cyanCFFAFE',
      'green14532D',
      'green166534',
      'green15803D',
      'green16A34A',
      'green22C55E',
      'green4ADE80',
      'green86EFAC',
      'yellow713F12',
      'yellow854D0E',
      'yellowA16207',
      'yellowCA8A04',
      'yellowEAB308',
      'yellowFACC15',
      'yellowFDE047',
      'orange7C2D12',
      'orange9A3412',
      'orangeC2410C',
      'orangeEA580C',
      'orangeF97316',
      'orangeFB923C',
      'orangeFDBA74',
      'brown451A03',
      'brown78350F',
      'brown92400E',
      'brownB45309',
      'brownD97706',
      'brownF59E0B',
      'brownFBBF24',
      // legacy ids yang pernah dipakai
      'softWhite',
      'gray100',
      'gray200',
      'gray300',
      'blueBlack',
      'gray800',
      'navyDark',
      'blueDark',
      'skyBlue',
      'skySoft',
      'greenSoft',
      'limeSoft',
      'cream',
      'orangeSoft',
      'peach',
      'pinkSoft',
      'indigo',
      'cyanSoft',
    ];
    if (sidebarTheme && !validPalette.includes(sidebarTheme)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sidebarTheme value',
      });
    }
    if (headerTheme && !validPalette.includes(headerTheme)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid headerTheme value',
      });
    }
    const validText = ['black', 'white'];
    if (sidebarTextColor && !validText.includes(sidebarTextColor)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sidebarTextColor value',
      });
    }
    if (headerTextColor && !validText.includes(headerTextColor)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid headerTextColor value',
      });
    }
    if (hideMainHero !== undefined && typeof hideMainHero !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'hideMainHero must be a boolean',
      });
    }

    const updateDoc = {};
    if (activeTheme) updateDoc.activeTheme = activeTheme;
    if (sidebarTheme) updateDoc.sidebarTheme = sidebarTheme;
    if (headerTheme) updateDoc.headerTheme = headerTheme;
    if (sidebarTextColor) updateDoc.sidebarTextColor = sidebarTextColor;
    if (headerTextColor) updateDoc.headerTextColor = headerTextColor;
    if (typeof hideMainHero === 'boolean') updateDoc.hideMainHero = hideMainHero;

    const updated = await ThemeSetting.findOneAndUpdate({}, updateDoc, {
      new: true,
      upsert: true,
    });

    res.status(200).json({
      success: true,
      data: {
        activeTheme: updated.activeTheme,
        sidebarTheme: updated.sidebarTheme,
        headerTheme: updated.headerTheme,
        sidebarTextColor: updated.sidebarTextColor,
        headerTextColor: updated.headerTextColor,
        hideMainHero: !!updated.hideMainHero,
      },
    });
  } catch (error) {
    next(error);
  }
};

