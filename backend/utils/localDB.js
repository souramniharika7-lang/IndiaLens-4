/**
 * Local JSON-based data store — used when MongoDB is unavailable.
 * All seed data is stored in memory and served directly.
 */

const categories = [
  { _id: 'cat1', name: 'Economy', slug: 'economy', description: 'Economic indicators including GDP, inflation and employment', icon: '💹' },
  { _id: 'cat2', name: 'Society', slug: 'society', description: 'Social well-being, happiness and human development', icon: '🤝' },
  { _id: 'cat3', name: 'Governance', slug: 'governance', description: 'Government effectiveness, transparency and e-governance', icon: '⚖️' },
  { _id: 'cat4', name: 'Technology', slug: 'technology', description: 'Innovation, AI readiness and digital transformation', icon: '💡' },
  { _id: 'cat5', name: 'Education', slug: 'education', description: 'Literacy, enrollment and quality of education', icon: '📚' },
  { _id: 'cat6', name: 'Healthcare', slug: 'healthcare', description: 'Health outcomes, infrastructure and access', icon: '🏥' },
  { _id: 'cat7', name: 'Environment', slug: 'environment', description: 'Environmental performance and sustainability', icon: '🌿' },
  { _id: 'cat8', name: 'Safety', slug: 'safety', description: 'Peace, security and rule of law', icon: '🛡️' },
  { _id: 'cat9', name: 'Equality', slug: 'equality', description: 'Gender equality and social inclusion', icon: '⚖️' }
];

const countries = [
  { _id: 'c1', name: 'India', code: 'IND', region: 'South Asia', flagUrl: 'https://flagcdn.com/in.svg' },
  { _id: 'c2', name: 'United States', code: 'USA', region: 'North America', flagUrl: 'https://flagcdn.com/us.svg' },
  { _id: 'c3', name: 'China', code: 'CHN', region: 'East Asia', flagUrl: 'https://flagcdn.com/cn.svg' },
  { _id: 'c4', name: 'Germany', code: 'DEU', region: 'Europe', flagUrl: 'https://flagcdn.com/de.svg' },
  { _id: 'c5', name: 'Japan', code: 'JPN', region: 'East Asia', flagUrl: 'https://flagcdn.com/jp.svg' },
  { _id: 'c6', name: 'United Kingdom', code: 'GBR', region: 'Europe', flagUrl: 'https://flagcdn.com/gb.svg' },
  { _id: 'c7', name: 'France', code: 'FRA', region: 'Europe', flagUrl: 'https://flagcdn.com/fr.svg' },
  { _id: 'c8', name: 'Brazil', code: 'BRA', region: 'South America', flagUrl: 'https://flagcdn.com/br.svg' },
  { _id: 'c9', name: 'Australia', code: 'AUS', region: 'Oceania', flagUrl: 'https://flagcdn.com/au.svg' },
  { _id: 'c10', name: 'Canada', code: 'CAN', region: 'North America', flagUrl: 'https://flagcdn.com/ca.svg' }
];

const indicators = [
  { _id: 'i1', name: 'GDP Rank', slug: 'gdp-rank', description: 'Gross Domestic Product ranking by nominal GDP.', methodology: 'Based on IMF World Economic Outlook data.', category: { _id: 'cat1', name: 'Economy', slug: 'economy' }, source: { name: 'World Bank', url: 'https://worldbank.org' }, unit: 'rank', higherIsBetter: false },
  { _id: 'i2', name: 'GDP per Capita', slug: 'gdp-per-capita', description: 'GDP divided by total population, measuring average economic output per person.', methodology: 'IMF data: Nominal GDP / Population.', category: { _id: 'cat1', name: 'Economy', slug: 'economy' }, source: { name: 'IMF', url: 'https://imf.org' }, unit: 'USD', higherIsBetter: true },
  { _id: 'i3', name: 'GDP Growth Rate', slug: 'gdp-growth-rate', description: 'Annual percentage growth rate of GDP at market prices.', methodology: 'World Bank national accounts data.', category: { _id: 'cat1', name: 'Economy', slug: 'economy' }, source: { name: 'World Bank', url: 'https://worldbank.org' }, unit: '%', higherIsBetter: true },
  { _id: 'i4', name: 'Inflation Rate', slug: 'inflation-rate', description: 'Consumer price index inflation rate, measuring cost of living changes.', methodology: 'IMF CPI data. Annual average % change.', category: { _id: 'cat1', name: 'Economy', slug: 'economy' }, source: { name: 'IMF', url: 'https://imf.org' }, unit: '%', higherIsBetter: false },
  { _id: 'i5', name: 'Unemployment Rate', slug: 'unemployment-rate', description: 'Percentage of labor force that is jobless and actively seeking employment.', methodology: 'ILO modeled estimates.', category: { _id: 'cat1', name: 'Economy', slug: 'economy' }, source: { name: 'ILO', url: 'https://ilo.org' }, unit: '%', higherIsBetter: false },
  { _id: 'i6', name: 'Human Development Index', slug: 'hdi', description: 'Composite index of life expectancy, education, and per capita income.', methodology: 'UNDP geometric mean of normalized indices.', category: { _id: 'cat2', name: 'Society', slug: 'society' }, source: { name: 'UNDP', url: 'https://undp.org' }, unit: 'index', higherIsBetter: true },
  { _id: 'i7', name: 'Happiness Index', slug: 'happiness-index', description: 'World Happiness Report score based on life evaluations.', methodology: 'Gallup World Poll: Cantril ladder question.', category: { _id: 'cat2', name: 'Society', slug: 'society' }, source: { name: 'UN SDSN', url: 'https://worldhappiness.report' }, unit: 'score', higherIsBetter: true },
  { _id: 'i8', name: 'Education Index', slug: 'education-index', description: 'Composite measure of mean years of schooling and expected years of schooling.', methodology: 'UNDP education component of HDI.', category: { _id: 'cat5', name: 'Education', slug: 'education' }, source: { name: 'UNDP', url: 'https://undp.org' }, unit: 'index', higherIsBetter: true },
  { _id: 'i9', name: 'Healthcare Index', slug: 'healthcare-index', description: 'Measures healthcare infrastructure, physicians, and health outcomes.', methodology: 'Numbeo Healthcare Index based on surveys.', category: { _id: 'cat6', name: 'Healthcare', slug: 'healthcare' }, source: { name: 'Numbeo', url: 'https://numbeo.com' }, unit: 'score', higherIsBetter: true },
  { _id: 'i10', name: 'Global Innovation Index', slug: 'global-innovation-index', description: 'Measures innovation capacity and outputs across 81 indicators.', methodology: 'WIPO composite of innovation inputs and outputs.', category: { _id: 'cat4', name: 'Technology', slug: 'technology' }, source: { name: 'WIPO', url: 'https://wipo.int' }, unit: 'score', higherIsBetter: true },
  { _id: 'i11', name: 'AI Readiness Index', slug: 'ai-readiness-index', description: 'Measures country readiness for AI adoption across government and economy.', methodology: 'Oxford Insights composite score.', category: { _id: 'cat4', name: 'Technology', slug: 'technology' }, source: { name: 'Oxford Insights', url: 'https://oxfordinsights.com' }, unit: 'score', higherIsBetter: true },
  { _id: 'i12', name: 'Corruption Perception Index', slug: 'corruption-perception-index', description: 'Measures perceived levels of public sector corruption.', methodology: 'Transparency International composite of 13 expert assessments.', category: { _id: 'cat3', name: 'Governance', slug: 'governance' }, source: { name: 'Transparency International', url: 'https://transparency.org' }, unit: 'score', higherIsBetter: true },
  { _id: 'i13', name: 'E-Government Development Index', slug: 'e-government-development-index', description: 'Measures readiness and use of ICT in public administration.', methodology: 'UN DESA composite index.', category: { _id: 'cat3', name: 'Governance', slug: 'governance' }, source: { name: 'UN DESA', url: 'https://publicadministration.un.org' }, unit: 'index', higherIsBetter: true },
  { _id: 'i14', name: 'Environmental Performance Index', slug: 'environmental-performance-index', description: "Quantitative gauge of a nation's environmental health.", methodology: 'Yale University: 40 performance indicators.', category: { _id: 'cat7', name: 'Environment', slug: 'environment' }, source: { name: 'Yale University', url: 'https://epi.yale.edu' }, unit: 'score', higherIsBetter: true },
  { _id: 'i15', name: 'Global Peace Index', slug: 'global-peace-index', description: 'Measures the relative peacefulness of countries.', methodology: 'IEP: 23 qualitative and quantitative indicators.', category: { _id: 'cat8', name: 'Safety', slug: 'safety' }, source: { name: 'IEP', url: 'https://visionofhumanity.org' }, unit: 'score', higherIsBetter: false },
  { _id: 'i16', name: 'Gender Gap Index', slug: 'gender-gap-index', description: 'Measures gender parity across economic, educational, health, and political dimensions.', methodology: 'WEF: four sub-indexes averaged.', category: { _id: 'cat9', name: 'Equality', slug: 'equality' }, source: { name: 'World Economic Forum', url: 'https://weforum.org' }, unit: 'index', higherIsBetter: true },
  { _id: 'i17', name: 'Press Freedom Index', slug: 'press-freedom-index', description: 'Evaluates press freedom conditions worldwide.', methodology: 'RSF quantitative scoring.', category: { _id: 'cat3', name: 'Governance', slug: 'governance' }, source: { name: 'RSF', url: 'https://rsf.org' }, unit: 'score', higherIsBetter: true }
];

// India's rankings for 2026 (latest year)
const indiaRankings2023 = {
  'i1':  { rank: 4,   score: 3890,  totalCountries: 195 },
  'i2':  { rank: 126, score: 2701,  totalCountries: 195 },
  'i3':  { rank: 5,   score: 7.8,   totalCountries: 195 },
  'i4':  { rank: 88,  score: 4.9,   totalCountries: 195 },
  'i5':  { rank: 62,  score: 7.2,   totalCountries: 195 },
  'i6':  { rank: 130, score: 0.660, totalCountries: 195 },
  'i7':  { rank: 118, score: 4.389, totalCountries: 195 },
  'i8':  { rank: 140, score: 0.572, totalCountries: 195 },
  'i9':  { rank: 108, score: 43.5,  totalCountries: 195 },
  'i10': { rank: 38,  score: 40.1,  totalCountries: 195 },
  'i11': { rank: 36,  score: 57.4,  totalCountries: 195 },
  'i12': { rank: 90,  score: 40,    totalCountries: 195 },
  'i13': { rank: 100, score: 0.612, totalCountries: 195 },
  'i14': { rank: 172, score: 20.1,  totalCountries: 195 },
  'i15': { rank: 122, score: 2.280, totalCountries: 195 },
  'i16': { rank: 124, score: 0.641, totalCountries: 195 },
  'i17': { rank: 158, score: 33.1,  totalCountries: 195 }
};

// All countries rankings for 2026 (latest year)
const allRankingsData = {
  'i1':  { c1:[4,3890], c2:[1,28780], c3:[2,18500], c4:[3,4680], c5:[5,4320], c6:[6,3200], c7:[7,3050], c8:[8,2240], c9:[12,1780], c10:[9,2260] },
  'i6':  { c1:[130,0.660], c2:[20,0.932], c3:[77,0.796], c4:[8,0.948], c5:[18,0.925], c6:[14,0.944], c7:[27,0.910], c8:[85,0.768], c9:[9,0.951], c10:[17,0.940] },
  'i10': { c1:[38,40.1], c2:[3,65.8], c3:[11,54.9], c4:[8,59.7], c5:[12,54.2], c6:[4,61.5], c7:[10,56.3], c8:[47,34.8], c9:[24,48.2], c10:[14,53.6] },
  'i15': { c1:[122,2.280], c2:[130,2.420], c3:[78,1.968], c4:[15,1.412], c5:[8,1.318], c6:[33,1.535], c7:[65,1.829], c8:[110,2.130], c9:[21,1.492], c10:[10,1.368] },
  'i16': { c1:[124,0.641], c2:[40,0.756], c3:[105,0.685], c4:[5,0.822], c5:[123,0.655], c6:[14,0.798], c7:[38,0.762], c8:[55,0.738], c9:[25,0.779], c10:[28,0.778] }
};

// Historical data for India (2021-2026)
const indiaHistorical = {
  'i1':  [{ year:2021,rank:6,score:3180 }, { year:2022,rank:5,score:3390 }, { year:2023,rank:5,score:3500 }, { year:2024,rank:5,score:3650 }, { year:2025,rank:4,score:3780 }, { year:2026,rank:4,score:3890 }],
  'i6':  [{ year:2021,rank:132,score:0.633 }, { year:2022,rank:132,score:0.633 }, { year:2023,rank:134,score:0.644 }, { year:2024,rank:133,score:0.650 }, { year:2025,rank:131,score:0.655 }, { year:2026,rank:130,score:0.660 }],
  'i7':  [{ year:2021,rank:139,score:3.819 }, { year:2022,rank:136,score:3.777 }, { year:2023,rank:126,score:4.054 }, { year:2024,rank:124,score:4.180 }, { year:2025,rank:121,score:4.280 }, { year:2026,rank:118,score:4.389 }],
  'i10': [{ year:2021,rank:46,score:35.6 }, { year:2022,rank:40,score:36.6 }, { year:2023,rank:40,score:38.5 }, { year:2024,rank:39,score:39.0 }, { year:2025,rank:38,score:39.5 }, { year:2026,rank:38,score:40.1 }],
  'i12': [{ year:2021,rank:85,score:40 }, { year:2022,rank:85,score:40 }, { year:2023,rank:93,score:39 }, { year:2024,rank:92,score:39 }, { year:2025,rank:91,score:40 }, { year:2026,rank:90,score:40 }],
  'i14': [{ year:2021,rank:168,score:27.6 }, { year:2022,rank:180,score:18.9 }, { year:2023,rank:176,score:18.9 }, { year:2024,rank:175,score:19.3 }, { year:2025,rank:174,score:19.7 }, { year:2026,rank:172,score:20.1 }],
  'i16': [{ year:2021,rank:140,score:0.625 }, { year:2022,rank:135,score:0.629 }, { year:2023,rank:127,score:0.629 }, { year:2024,rank:126,score:0.634 }, { year:2025,rank:125,score:0.638 }, { year:2026,rank:124,score:0.641 }]
};

const news = [
  { _id: 'n1', headline: 'India Rises to 38th in Global Innovation Index 2026', summary: 'India has made significant strides in innovation, moving up from 81st in 2015 to 38th in 2026, driven by its thriving startup ecosystem and digital infrastructure.', content: "India's rise in the Global Innovation Index 2026 reflects massive investments in digital infrastructure, AI, and the startup ecosystem. With over 150 unicorns and the world's second-largest internet user base, India is increasingly recognized as a global innovation powerhouse.", sourceName: 'WIPO', sourceUrl: 'https://wipo.int', category: { _id: 'cat4', name: 'Technology' }, publishedAt: new Date('2026-06-15') },
  { _id: 'n2', headline: 'India GDP Growth at 7.8% – Fastest Among G20 Nations in 2026', summary: 'India continues to lead global growth with a 7.8% GDP expansion in FY2025-26, outpacing all other G20 economies.', content: 'The World Bank and IMF both project India as the fastest-growing large economy in 2025-26. Services exports, domestic consumption, and government capital expenditure under Viksit Bharat are key drivers.', sourceName: 'World Bank', sourceUrl: 'https://worldbank.org', category: { _id: 'cat1', name: 'Economy' }, publishedAt: new Date('2026-05-20') },
  { _id: 'n3', headline: 'India Improves to 172nd on Environmental Performance Index 2026', summary: 'India shows gradual improvement in the EPI 2026, climbing from 176th to 172nd, with better scores on renewable energy deployment.', content: "India's EPI improvement reflects accelerated solar energy deployment and stricter emission standards. However, air quality in major cities remains a critical challenge requiring urgent action.", sourceName: 'Yale EPI', sourceUrl: 'https://epi.yale.edu', category: { _id: 'cat7', name: 'Environment' }, publishedAt: new Date('2026-04-12') },
  { _id: 'n4', headline: "India's HDI Reaches 0.660 – Rank Improves to 130th in 2026", summary: "India's Human Development Index crossed 0.660 in 2026 as life expectancy and education outcomes improve steadily under Viksit Bharat mission.", content: "UNDP's Human Development Report 2026 shows India's HDI reaching 0.660, reflecting improvements in life expectancy (69.8 years) and mean years of schooling. Income inequality reduction remains a priority.", sourceName: 'UNDP', sourceUrl: 'https://undp.org', category: { _id: 'cat2', name: 'Society' }, publishedAt: new Date('2026-03-18') },
  { _id: 'n5', headline: 'UPI Processes 15 Billion Monthly Transactions in 2026 – New Record', summary: "India's UPI platform set a new global record with 15 billion transactions in March 2026, with international expansion to 30+ countries.", content: "UPI's global expansion is reshaping digital payments worldwide. The system now operates in UAE, Singapore, UK, France, and 26 other countries, showcasing India's fintech leadership.", sourceName: 'NPCI', sourceUrl: 'https://npci.org.in', category: { _id: 'cat4', name: 'Technology' }, publishedAt: new Date('2026-04-01') },
  { _id: 'n6', headline: "India's Gender Gap Index Improves to 124th in 2026 After Reservation Bill", summary: "WEF's Gender Gap Report 2026 ranks India 124th, with political empowerment improving significantly after the Women's Reservation Act implementation.", content: "India's Gender Gap Index improved following the Women's Reservation Act implementation in 2024 elections, increasing female political representation to 33%. Economic participation and healthcare remain areas for improvement.", sourceName: 'World Economic Forum', sourceUrl: 'https://weforum.org', category: { _id: 'cat9', name: 'Equality' }, publishedAt: new Date('2026-06-05') },
  { _id: 'n7', headline: 'India AI Readiness Index Jumps to 36th – IndiaAI Mission Delivers Results', summary: 'Oxford Insights ranks India 36th in Government AI Readiness in 2026, with the IndiaAI Mission infrastructure deployment showing strong results.', content: "India's National AI Mission with ₹10,372 crore investment has positioned India as a leading AI nation. Compute infrastructure, AI skilling, and regulatory frameworks are cited as key strength areas.", sourceName: 'Oxford Insights', sourceUrl: 'https://oxfordinsights.com', category: { _id: 'cat4', name: 'Technology' }, publishedAt: new Date('2026-05-08') }
];

const aiInsights = {
  global: {
    _id: 'ai_global', scope: 'global',
    content: `India stands at a pivotal crossroads in global rankings. As the world's fifth-largest economy and most populous democracy, India demonstrates remarkable strengths in technology and economic growth while facing significant challenges in social development and environmental sustainability.\n\nIndia's GDP growth rate of 7.2% places it among the world's fastest-growing major economies, reflecting robust domestic consumption, digital transformation, and manufacturing expansion. The Global Innovation Index rank of 40th reflects India's growing tech ecosystem, with Bengaluru and Hyderabad emerging as global startup hubs.\n\nHowever, India's Human Development Index rank of 134th, Happiness Index rank of 126th, and Environmental Performance Index rank of 176th highlight urgent areas needing policy attention.`,
    recommendations: [
      'Accelerate investment in primary healthcare infrastructure to improve the Healthcare Index from rank 112 to top 80 within 5 years.',
      'Implement comprehensive environmental regulations targeting air quality, water management, and renewable energy transition to improve EPI rank from 176.',
      'Strengthen anti-corruption measures and judicial reforms to improve the Corruption Perception Index from rank 93.',
      'Bridge the gender gap through targeted policies in workforce participation and political representation.',
      'Expand social safety nets and rural development programs to uplift HDI from rank 134 toward top 100.'
    ],
    generatedAt: new Date('2026-07-01'),
    expiresAt: new Date('2027-12-31')
  }
};

// Add per-category insights
['economy', 'society', 'governance', 'technology', 'education', 'healthcare', 'environment', 'safety', 'equality'].forEach(slug => {
  const contents = {
    economy: "India's economy is the world's 5th largest by nominal GDP and 3rd by PPP. With a GDP growth rate of 7.2%, India leads among G20 nations. However, high inflation (5.4%) and unemployment (7.8%) remain concerns.",
    society: "India's Human Development Index of 0.644 (rank 134) reflects improvements in life expectancy and literacy, but income inequality and poverty remain barriers. The Happiness Index score of 4.054 (rank 126) indicates dissatisfaction driven by economic stress.",
    governance: "India's governance indicators present a mixed picture. The CPI rank of 93rd highlights corruption challenges while the E-Government rank of 105th reflects growing digital governance.",
    technology: "India's Global Innovation Index rank of 40th and AI Readiness rank of 40th reflect a strong tech sector. India produces the most engineering graduates globally and has the world's third-largest startup ecosystem.",
    education: "The Education Index rank of 145th reflects gaps in learning outcomes despite high enrollment. The NEP 2020 aims to transform the system.",
    healthcare: "India's Healthcare Index rank of 112th highlights underfunding and access disparities. Public health spending at 1.2% of GDP is among the lowest globally.",
    environment: "India's Environmental Performance Index rank of 176th is alarming. Air quality in major cities is among the world's worst. However, India has made significant renewable energy commitments.",
    safety: "India's Global Peace Index rank of 126th reflects internal conflict concerns and border tensions. However, large-scale terrorism has decreased significantly.",
    equality: "India's Gender Gap Index rank of 127th reflects persistent inequality in labor force participation (20% for women), political representation (15%), and healthcare."
  };
  const recs = {
    economy: ['Reduce inflation through monetary tightening.', 'Create 10 million formal jobs annually.', 'Diversify exports beyond IT services.'],
    society: ['Launch universal basic income pilots.', 'Expand MGNREGS and PM-KISAN.', 'Invest in mental health infrastructure.'],
    governance: ['Strengthen independent anti-corruption agencies.', 'Accelerate Digital India e-governance.', 'Protect media freedom.'],
    technology: ['Increase R&D spending from 0.7% to 2% of GDP.', 'Establish National AI Mission.', 'Expand startup incubators to tier-2 cities.'],
    education: ['Implement NEP 2020 fully.', 'Increase education budget to 6% of GDP.', 'Deploy EdTech solutions for rural areas.'],
    healthcare: ['Increase public health spending to 2.5% of GDP.', 'Build 150,000 Health and Wellness Centres.', 'Expand telemedicine infrastructure.'],
    environment: ['Accelerate coal phase-out and renewable energy deployment.', 'Implement strict vehicle emission standards.', 'Restore degraded forest cover.'],
    safety: ['Invest in conflict resolution.', 'Modernize police with community policing.', 'Strengthen bilateral peace initiatives.'],
    equality: ['Introduce 33% women\'s reservation in parliament.', 'Launch national childcare infrastructure.', 'Enforce equal pay legislation.']
  };
  aiInsights[slug] = {
    _id: `ai_${slug}`, scope: slug,
    content: contents[slug],
    recommendations: recs[slug],
    generatedAt: new Date('2026-07-01'),
    expiresAt: new Date('2027-12-31')
  };
});

// In-memory user store
const users = [
  { _id: 'u1', username: 'admin', email: 'admin@indialens.in', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lTFC', role: 'admin', favorites: [], watchlists: [], createdAt: new Date() },
  { _id: 'u2', username: 'demo', email: 'demo@indialens.in', password: '$2a$10$rS0mWf5xKFPXSqIkFp3eZ.7H.6C9DdRwFHN3MIi6CK27Ga6V7BCVW', role: 'user', favorites: [], watchlists: [], createdAt: new Date() }
];
// Note: u1 password = Admin@2026, u2 password = Demo@2026 (pre-hashed)

module.exports = { categories, countries, indicators, indiaRankings2023, allRankingsData, indiaHistorical, news, aiInsights, users };
