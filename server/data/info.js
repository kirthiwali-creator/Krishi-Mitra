const sources = [
  {
    id: 'icar',
    url: 'https://icar.org.in',
    type: 'research',
    name: {
      en: 'Indian Council of Agricultural Research (ICAR)',
      kn: 'ಭಾರತೀಯ ಕೃಷಿ ಸಂಶೋಧನಾ ಪರಿಷತ್ (ICAR)',
      hi: 'भारतीय कृषि अनुसंधान परिषद (ICAR)'
    },
    desc: {
      en: 'National research body publishing crop varieties, farming practices and new technologies.',
      kn: 'ಬೆಳೆ ತಳಿಗಳು, ಕೃಷಿ ಪದ್ಧತಿಗಳು ಮತ್ತು ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳ ಮಾಹಿತಿ ನೀಡುವ ರಾಷ್ಟ್ರೀಯ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ.',
      hi: 'फसल किस्मों, खेती की पद्धतियों और नई तकनीकों की जानकारी देने वाली राष्ट्रीय अनुसंधान संस्था।'
    }
  },
  {
    id: 'uas',
    url: 'https://www.uasbangalore.edu.in',
    type: 'research',
    name: {
      en: 'University of Agricultural Sciences, Bengaluru',
      kn: 'ಕೃಷಿ ವಿಜ್ಞಾನಗಳ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಬೆಂಗಳೂರು',
      hi: 'कृषि विज्ञान विश्वविद्यालय, बेंगलुरु'
    },
    desc: {
      en: 'Karnataka university with research, training and package of practices for local crops.',
      kn: 'ಕರ್ನಾಟಕದ ಸ್ಥಳೀಯ ಬೆಳೆಗಳಿಗೆ ಸಂಶೋಧನೆ, ತರಬೇತಿ ಮತ್ತು ಬೇಸಾಯ ಕ್ರಮಗಳ ಮಾಹಿತಿ ನೀಡುವ ವಿಶ್ವವಿದ್ಯಾಲಯ.',
      hi: 'कर्नाटक की स्थानीय फसलों के लिए अनुसंधान, प्रशिक्षण और खेती की सिफारिशें देने वाला विश्वविद्यालय।'
    }
  },
  {
    id: 'ksda',
    url: 'https://agri.karnataka.gov.in',
    type: 'government',
    name: {
      en: 'Department of Agriculture, Karnataka',
      kn: 'ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ',
      hi: 'कर्नाटक कृषि विभाग'
    },
    desc: {
      en: 'State schemes, subsidies and advisories delivered through Raitha Samparka Kendras.',
      kn: 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರಗಳ ಮೂಲಕ ರಾಜ್ಯದ ಯೋಜನೆಗಳು, ಸಹಾಯಧನ ಮತ್ತು ಸಲಹೆಗಳು.',
      hi: 'रैयत संपर्क केंद्रों के माध्यम से राज्य की योजनाएं, सब्सिडी और सलाह।'
    }
  },
  {
    id: 'agmarknet',
    url: 'https://agmarknet.gov.in',
    type: 'market',
    name: {
      en: 'Agmarknet - Mandi Prices',
      kn: 'ಅಗ್ಮಾರ್ಕ್‌ನೆಟ್ - ಮಂಡಿ ಬೆಲೆಗಳು',
      hi: 'एगमार्कनेट - मंडी भाव'
    },
    desc: {
      en: 'Daily wholesale market prices and arrivals, useful for setting a fair price.',
      kn: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ನಿಗದಿಪಡಿಸಲು ಸಹಾಯವಾಗುವ ದೈನಂದಿನ ಸಗಟು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮತ್ತು ಆವಕ.',
      hi: 'उचित मूल्य तय करने में मददगार दैनिक थोक बाजार भाव और आवक।'
    }
  },
  {
    id: 'enam',
    url: 'https://enam.gov.in',
    type: 'market',
    name: {
      en: 'e-NAM (National Agriculture Market)',
      kn: 'ಇ-ನಾಮ್ (ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ)',
      hi: 'ई-नाम (राष्ट्रीय कृषि बाजार)'
    },
    desc: {
      en: 'Government online trading platform linking regulated mandis across India.',
      kn: 'ಭಾರತದ ನಿಯಂತ್ರಿತ ಮಂಡಿಗಳನ್ನು ಸಂಪರ್ಕಿಸುವ ಸರ್ಕಾರಿ ಆನ್‌ಲೈನ್ ವ್ಯಾಪಾರ ವೇದಿಕೆ.',
      hi: 'देशभर की विनियमित मंडियों को जोड़ने वाला सरकारी ऑनलाइन व्यापार मंच।'
    }
  },
  {
    id: 'imd',
    url: 'https://mausam.imd.gov.in',
    type: 'weather',
    name: {
      en: 'India Meteorological Department (IMD)',
      kn: 'ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆ (IMD)',
      hi: 'भारत मौसम विज्ञान विभाग (IMD)'
    },
    desc: {
      en: 'Official weather forecasts, rainfall data and agro-meteorological advisories.',
      kn: 'ಅಧಿಕೃತ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಮಳೆ ಮಾಹಿತಿ ಮತ್ತು ಕೃಷಿ ಹವಾಮಾನ ಸಲಹೆಗಳು.',
      hi: 'आधिकारिक मौसम पूर्वानुमान, वर्षा आंकड़े और कृषि मौसम सलाह।'
    }
  },
  {
    id: 'shc',
    url: 'https://soilhealth.dac.gov.in',
    type: 'government',
    name: {
      en: 'Soil Health Card Portal',
      kn: 'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋರ್ಟಲ್',
      hi: 'मृदा स्वास्थ्य कार्ड पोर्टल'
    },
    desc: {
      en: 'Soil test based nutrient recommendations to choose crops and fertiliser wisely.',
      kn: 'ಬೆಳೆ ಮತ್ತು ಗೊಬ್ಬರ ಆಯ್ಕೆಗೆ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಆಧಾರಿತ ಪೋಷಕಾಂಶ ಶಿಫಾರಸುಗಳು.',
      hi: 'फसल और उर्वरक के चुनाव के लिए मिट्टी जांच आधारित पोषक तत्व सिफारिशें।'
    }
  },
  {
    id: 'pmkisan',
    url: 'https://pmkisan.gov.in',
    type: 'government',
    name: {
      en: 'PM-KISAN',
      kn: 'ಪಿಎಂ-ಕಿಸಾನ್',
      hi: 'पीएम-किसान'
    },
    desc: {
      en: 'Central income support scheme for farmer families, with registration and status check.',
      kn: 'ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಕೇಂದ್ರದ ಆದಾಯ ಬೆಂಬಲ ಯೋಜನೆ; ನೋಂದಣಿ ಮತ್ತು ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ.',
      hi: 'किसान परिवारों के लिए केंद्र की आय सहायता योजना, पंजीकरण और स्थिति जांच सहित।'
    }
  },
  {
    id: 'farmer',
    url: 'https://farmer.gov.in',
    type: 'government',
    name: {
      en: 'Farmers Portal (Government of India)',
      kn: 'ರೈತರ ಪೋರ್ಟಲ್ (ಭಾರತ ಸರ್ಕಾರ)',
      hi: 'किसान पोर्टल (भारत सरकार)'
    },
    desc: {
      en: 'One place for crop, scheme, seed, fertiliser and market information from the Government of India.',
      kn: 'ಭಾರತ ಸರ್ಕಾರದ ಬೆಳೆ, ಯೋಜನೆ, ಬೀಜ, ಗೊಬ್ಬರ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಒಂದೇ ಕಡೆ.',
      hi: 'भारत सरकार की फसल, योजना, बीज, उर्वरक और बाजार की जानकारी एक ही जगह।'
    }
  }
];

const guides = [
  {
    id: 'ragi',
    icon: '🌾',
    name: { en: 'Ragi (Finger Millet)', kn: 'ರಾಗಿ', hi: 'रागी (मडुआ)' },
    season: {
      en: 'Mainly kharif, sown with the monsoon (June to July)',
      kn: 'ಮುಖ್ಯವಾಗಿ ಮುಂಗಾರು, ಮಳೆಯೊಂದಿಗೆ ಬಿತ್ತನೆ (ಜೂನ್-ಜುಲೈ)',
      hi: 'मुख्यतः खरीफ, मानसून के साथ बुवाई (जून-जुलाई)'
    },
    soil: {
      en: 'Well drained red or loamy soils',
      kn: 'ನೀರು ಬಸಿದುಹೋಗುವ ಕೆಂಪು ಅಥವಾ ಲೋಮ್ ಮಣ್ಣು',
      hi: 'अच्छी जल निकासी वाली लाल या दोमट मिट्टी'
    },
    water: {
      en: 'Low; suited to rainfed farming',
      kn: 'ಕಡಿಮೆ; ಮಳೆಯಾಶ್ರಿತ ಬೇಸಾಯಕ್ಕೆ ಸೂಕ್ತ',
      hi: 'कम; वर्षा आधारित खेती के लिए उपयुक्त'
    },
    duration: {
      en: 'About 3.5 to 4.5 months depending on variety',
      kn: 'ತಳಿಯನ್ನು ಅವಲಂಬಿಸಿ ಸುಮಾರು 3.5 ರಿಂದ 4.5 ತಿಂಗಳು',
      hi: 'किस्म के अनुसार लगभग 3.5 से 4.5 महीने'
    },
    tips: {
      en: 'Sow in lines, weed on time and harvest when the earheads turn brown.',
      kn: 'ಸಾಲಿನಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ, ಸಕಾಲದಲ್ಲಿ ಕಳೆ ತೆಗೆಯಿರಿ ಮತ್ತು ತೆನೆ ಕಂದು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದಾಗ ಕೊಯ್ಲು ಮಾಡಿ.',
      hi: 'पंक्तियों में बुवाई करें, समय पर निराई करें और बालियां भूरी होने पर कटाई करें।'
    }
  },
  {
    id: 'paddy',
    icon: '🌾',
    name: { en: 'Paddy (Rice)', kn: 'ಭತ್ತ', hi: 'धान' },
    season: {
      en: 'Kharif (June to July); irrigated crop also in rabi or summer',
      kn: 'ಮುಂಗಾರು (ಜೂನ್-ಜುಲೈ); ನೀರಾವರಿ ಇದ್ದಲ್ಲಿ ಹಿಂಗಾರು ಅಥವಾ ಬೇಸಿಗೆಯಲ್ಲೂ',
      hi: 'खरीफ (जून-जुलाई); सिंचाई होने पर रबी या गर्मी में भी'
    },
    soil: {
      en: 'Clay or clay loam that holds water',
      kn: 'ನೀರು ಹಿಡಿದಿಡುವ ಜೇಡಿ ಅಥವಾ ಜೇಡಿ ಲೋಮ್ ಮಣ್ಣು',
      hi: 'पानी रोकने वाली चिकनी या चिकनी दोमट मिट्टी'
    },
    water: {
      en: 'High; alternate wetting and drying can save water',
      kn: 'ಹೆಚ್ಚು; ಒಂದು ಬಾರಿ ನೀರು ನಿಲ್ಲಿಸಿ ಒಣಗಿಸುವ ಪದ್ಧತಿಯಿಂದ ನೀರು ಉಳಿತಾಯ',
      hi: 'अधिक; बारी-बारी से पानी भरने और सुखाने से पानी की बचत'
    },
    duration: {
      en: 'About 3.5 to 5 months depending on variety',
      kn: 'ತಳಿಯನ್ನು ಅವಲಂಬಿಸಿ ಸುಮಾರು 3.5 ರಿಂದ 5 ತಿಂಗಳು',
      hi: 'किस्म के अनुसार लगभग 3.5 से 5 महीने'
    },
    tips: {
      en: 'Use certified seed and treat it before sowing; drain the field before harvest.',
      kn: 'ಪ್ರಮಾಣೀಕೃತ ಬೀಜ ಬಳಸಿ, ಬಿತ್ತನೆಗೆ ಮೊದಲು ಬೀಜೋಪಚಾರ ಮಾಡಿ; ಕೊಯ್ಲಿಗೆ ಮೊದಲು ಗದ್ದೆಯ ನೀರು ತೆಗೆಯಿರಿ.',
      hi: 'प्रमाणित बीज का उपयोग करें और बुवाई से पहले उपचारित करें; कटाई से पहले खेत का पानी निकाल दें।'
    }
  },
  {
    id: 'tomato',
    icon: '🍅',
    name: { en: 'Tomato', kn: 'ಟೊಮೆಟೊ', hi: 'टमाटर' },
    season: {
      en: 'Can be grown through the year with irrigation; avoid peak heavy rain',
      kn: 'ನೀರಾವರಿಯೊಂದಿಗೆ ವರ್ಷವಿಡೀ ಬೆಳೆಯಬಹುದು; ಭಾರಿ ಮಳೆಯ ಅವಧಿ ತಪ್ಪಿಸಿ',
      hi: 'सिंचाई के साथ साल भर उगाया जा सकता है; भारी बारिश के समय से बचें'
    },
    soil: {
      en: 'Well drained loam with a near neutral pH',
      kn: 'ತಟಸ್ಥ ಪಿಎಚ್ ಇರುವ ನೀರು ಬಸಿದುಹೋಗುವ ಲೋಮ್ ಮಣ್ಣು',
      hi: 'सामान्य के पास पीएच वाली अच्छी जल निकासी की दोमट मिट्टी'
    },
    water: {
      en: 'Regular, even moisture; drip irrigation works well',
      kn: 'ನಿಯಮಿತ, ಸಮಾನ ತೇವಾಂಶ; ಹನಿ ನೀರಾವರಿ ಉತ್ತಮ',
      hi: 'नियमित और समान नमी; टपक सिंचाई उपयोगी'
    },
    duration: {
      en: 'First picking about 2 to 3 months after transplanting',
      kn: 'ನಾಟಿ ಮಾಡಿದ ಸುಮಾರು 2 ರಿಂದ 3 ತಿಂಗಳ ನಂತರ ಮೊದಲ ಕೊಯ್ಲು',
      hi: 'रोपाई के लगभग 2 से 3 महीने बाद पहली तुड़ाई'
    },
    tips: {
      en: 'Stake the plants, avoid waterlogging and rotate with non-solanaceous crops.',
      kn: 'ಗಿಡಗಳಿಗೆ ಕೋಲು ಕಟ್ಟಿ, ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿ ಮತ್ತು ಬೇರೆ ಕುಟುಂಬದ ಬೆಳೆಗಳೊಂದಿಗೆ ಬೆಳೆ ಬದಲಾವಣೆ ಮಾಡಿ.',
      hi: 'पौधों को सहारा दें, जलभराव से बचें और अन्य कुल की फसलों के साथ फसल चक्र अपनाएं।'
    }
  },
  {
    id: 'onion',
    icon: '🧅',
    name: { en: 'Onion', kn: 'ಈರುಳ್ಳಿ', hi: 'प्याज' },
    season: {
      en: 'Kharif and rabi seasons, depending on the region',
      kn: 'ಪ್ರದೇಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಮುಂಗಾರು ಮತ್ತು ಹಿಂಗಾರು ಹಂಗಾಮು',
      hi: 'क्षेत्र के अनुसार खरीफ और रबी मौसम'
    },
    soil: {
      en: 'Well drained loam; avoid heavy, waterlogged soil',
      kn: 'ನೀರು ಬಸಿದುಹೋಗುವ ಲೋಮ್ ಮಣ್ಣು; ಭಾರವಾದ, ನೀರು ನಿಲ್ಲುವ ಮಣ್ಣು ಬೇಡ',
      hi: 'अच्छी जल निकासी वाली दोमट मिट्टी; भारी जलभराव वाली मिट्टी से बचें'
    },
    water: {
      en: 'Light, frequent irrigation; reduce it before harvest',
      kn: 'ಹಗುರ, ಆಗಾಗ್ಗೆ ನೀರಾವರಿ; ಕೊಯ್ಲಿಗೆ ಮೊದಲು ಕಡಿಮೆ ಮಾಡಿ',
      hi: 'हल्की और बार-बार सिंचाई; कटाई से पहले कम करें'
    },
    duration: {
      en: 'About 3.5 to 5 months',
      kn: 'ಸುಮಾರು 3.5 ರಿಂದ 5 ತಿಂಗಳು',
      hi: 'लगभग 3.5 से 5 महीने'
    },
    tips: {
      en: 'Dry (cure) the bulbs well before storage to reduce rotting.',
      kn: 'ಕೊಳೆಯುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸಂಗ್ರಹಕ್ಕೆ ಮೊದಲು ಗಡ್ಡೆಗಳನ್ನು ಚೆನ್ನಾಗಿ ಒಣಗಿಸಿ.',
      hi: 'सड़न कम करने के लिए भंडारण से पहले कंदों को अच्छी तरह सुखाएं।'
    }
  },
  {
    id: 'tur',
    icon: '🫘',
    name: { en: 'Tur (Pigeon Pea)', kn: 'ತೊಗರಿ', hi: 'अरहर (तुअर)' },
    season: {
      en: 'Kharif, sown June to July',
      kn: 'ಮುಂಗಾರು, ಜೂನ್-ಜುಲೈ ಬಿತ್ತನೆ',
      hi: 'खरीफ, जून-जुलाई में बुवाई'
    },
    soil: {
      en: 'Medium to deep, well drained soils',
      kn: 'ನೀರು ಬಸಿದುಹೋಗುವ ಮಧ್ಯಮ ಅಥವಾ ಆಳವಾದ ಮಣ್ಣು',
      hi: 'मध्यम से गहरी, अच्छी जल निकासी वाली मिट्टी'
    },
    water: {
      en: 'Mostly rainfed; avoid waterlogging',
      kn: 'ಹೆಚ್ಚಾಗಿ ಮಳೆಯಾಶ್ರಿತ; ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿ',
      hi: 'अधिकतर वर्षा आधारित; जलभराव से बचें'
    },
    duration: {
      en: 'About 5 to 6 months',
      kn: 'ಸುಮಾರು 5 ರಿಂದ 6 ತಿಂಗಳು',
      hi: 'लगभग 5 से 6 महीने'
    },
    tips: {
      en: 'Can be intercropped with cereals; watch for pod borer during flowering.',
      kn: 'ಧಾನ್ಯ ಬೆಳೆಗಳೊಂದಿಗೆ ಅಂತರ ಬೆಳೆಯಾಗಿ ಬೆಳೆಯಬಹುದು; ಹೂ ಬಿಡುವ ಹಂತದಲ್ಲಿ ಕಾಯಿಕೊರಕದ ಮೇಲೆ ಗಮನವಿರಲಿ.',
      hi: 'अनाज वाली फसलों के साथ अंतरफसल ली जा सकती है; फूल आने पर फली छेदक पर नजर रखें।'
    }
  },
  {
    id: 'groundnut',
    icon: '🥜',
    name: { en: 'Groundnut', kn: 'ಕಡಲೆಕಾಯಿ', hi: 'मूंगफली' },
    season: {
      en: 'Kharif (June to July) and summer or rabi with irrigation',
      kn: 'ಮುಂಗಾರು (ಜೂನ್-ಜುಲೈ) ಮತ್ತು ನೀರಾವರಿಯೊಂದಿಗೆ ಬೇಸಿಗೆ ಅಥವಾ ಹಿಂಗಾರು',
      hi: 'खरीफ (जून-जुलाई) और सिंचाई के साथ गर्मी या रबी'
    },
    soil: {
      en: 'Light, well drained sandy loam',
      kn: 'ಹಗುರ, ನೀರು ಬಸಿದುಹೋಗುವ ಮರಳು ಲೋಮ್ ಮಣ್ಣು',
      hi: 'हल्की, अच्छी जल निकासी वाली बलुई दोमट मिट्टी'
    },
    water: {
      en: 'Moderate; avoid dry stress at flowering and pod filling',
      kn: 'ಮಧ್ಯಮ; ಹೂ ಬಿಡುವ ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತದಲ್ಲಿ ನೀರಿನ ಕೊರತೆ ಆಗದಿರಲಿ',
      hi: 'मध्यम; फूल आने और फली भरने के समय पानी की कमी न होने दें'
    },
    duration: {
      en: 'About 3.5 to 4.5 months depending on variety',
      kn: 'ತಳಿಯನ್ನು ಅವಲಂಬಿಸಿ ಸುಮಾರು 3.5 ರಿಂದ 4.5 ತಿಂಗಳು',
      hi: 'किस्म के अनुसार लगभग 3.5 से 4.5 महीने'
    },
    tips: {
      en: 'Treat seed before sowing and dry pods well before storage to avoid moulds.',
      kn: 'ಬಿತ್ತನೆಗೆ ಮೊದಲು ಬೀಜೋಪಚಾರ ಮಾಡಿ; ಶಿಲೀಂಧ್ರ ತಪ್ಪಿಸಲು ಸಂಗ್ರಹಕ್ಕೆ ಮೊದಲು ಕಾಯಿಗಳನ್ನು ಚೆನ್ನಾಗಿ ಒಣಗಿಸಿ.',
      hi: 'बुवाई से पहले बीज उपचार करें और फफूंद से बचने के लिए भंडारण से पहले फलियों को अच्छी तरह सुखाएं।'
    }
  }
];

module.exports = { sources, guides };
