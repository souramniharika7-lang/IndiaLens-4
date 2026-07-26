const Country = require('../models/Country');
const Category = require('../models/Category');
const Indicator = require('../models/Indicator');
const Ranking = require('../models/Ranking');
const HistoricalData = require('../models/HistoricalData');
const News = require('../models/News');
const AIInsightsCache = require('../models/AIInsightsCache');
const User = require('../models/User');

const countries = [
  { name: 'India', code: 'IND', region: 'South Asia', flagUrl: 'https://flagcdn.com/in.svg' },
  { name: 'United States', code: 'USA', region: 'North America', flagUrl: 'https://flagcdn.com/us.svg' },
  { name: 'China', code: 'CHN', region: 'East Asia', flagUrl: 'https://flagcdn.com/cn.svg' },
  { name: 'Germany', code: 'DEU', region: 'Europe', flagUrl: 'https://flagcdn.com/de.svg' },
  { name: 'Japan', code: 'JPN', region: 'East Asia', flagUrl: 'https://flagcdn.com/jp.svg' },
  { name: 'United Kingdom', code: 'GBR', region: 'Europe', flagUrl: 'https://flagcdn.com/gb.svg' },
  { name: 'France', code: 'FRA', region: 'Europe', flagUrl: 'https://flagcdn.com/fr.svg' },
  { name: 'Brazil', code: 'BRA', region: 'South America', flagUrl: 'https://flagcdn.com/br.svg' },
  { name: 'Australia', code: 'AUS', region: 'Oceania', flagUrl: 'https://flagcdn.com/au.svg' },
  { name: 'Canada', code: 'CAN', region: 'North America', flagUrl: 'https://flagcdn.com/ca.svg' }
];

const categories = [
  { name: 'Economy', slug: 'economy', description: 'Economic indicators including GDP, inflation and employment', icon: '💹' },
  { name: 'Society', slug: 'society', description: 'Social well-being, happiness and human development', icon: '🤝' },
  { name: 'Governance', slug: 'governance', description: 'Government effectiveness, transparency and e-governance', icon: '⚖️' },
  { name: 'Technology', slug: 'technology', description: 'Innovation, AI readiness and digital transformation', icon: '💡' },
  { name: 'Education', slug: 'education', description: 'Literacy, enrollment and quality of education', icon: '📚' },
  { name: 'Healthcare', slug: 'healthcare', description: 'Health outcomes, infrastructure and access', icon: '🏥' },
  { name: 'Environment', slug: 'environment', description: 'Environmental performance and sustainability', icon: '🌿' },
  { name: 'Safety', slug: 'safety', description: 'Peace, security and rule of law', icon: '🛡️' },
  { name: 'Equality', slug: 'equality', description: 'Gender equality and social inclusion', icon: '⚖️' }
];

// Indicator definitions with realistic India data
const getIndicators = (cats) => {
  const econ = cats.find(c => c.slug === 'economy')._id;
  const soc = cats.find(c => c.slug === 'society')._id;
  const gov = cats.find(c => c.slug === 'governance')._id;
  const tech = cats.find(c => c.slug === 'technology')._id;
  const edu = cats.find(c => c.slug === 'education')._id;
  const health = cats.find(c => c.slug === 'healthcare')._id;
  const env = cats.find(c => c.slug === 'environment')._id;
  const safety = cats.find(c => c.slug === 'safety')._id;
  const equality = cats.find(c => c.slug === 'equality')._id;

  return [
    { name: 'GDP Rank', slug: 'gdp-rank', description: 'Gross Domestic Product ranking by nominal GDP in USD.', methodology: 'Based on IMF World Economic Outlook data measuring total economic output.', category: econ, source: { name: 'World Bank', url: 'https://worldbank.org' }, unit: 'rank', higherIsBetter: false },
    { name: 'GDP per Capita', slug: 'gdp-per-capita', description: 'GDP divided by total population, measuring average economic output per person.', methodology: 'IMF data: Nominal GDP / Population.', category: econ, source: { name: 'IMF', url: 'https://imf.org' }, unit: 'USD', higherIsBetter: true },
    { name: 'GDP Growth Rate', slug: 'gdp-growth-rate', description: 'Annual percentage growth rate of GDP at market prices.', methodology: 'World Bank national accounts data. Year-on-year percentage change.', category: econ, source: { name: 'World Bank', url: 'https://worldbank.org' }, unit: '%', higherIsBetter: true },
    { name: 'Inflation Rate', slug: 'inflation-rate', description: 'Consumer price index inflation rate, measuring cost of living changes.', methodology: 'IMF CPI data. Annual average % change.', category: econ, source: { name: 'IMF', url: 'https://imf.org' }, unit: '%', higherIsBetter: false },
    { name: 'Unemployment Rate', slug: 'unemployment-rate', description: 'Percentage of labor force that is jobless and actively seeking employment.', methodology: 'ILO modeled estimates based on national labor force surveys.', category: econ, source: { name: 'ILO', url: 'https://ilo.org' }, unit: '%', higherIsBetter: false },
    { name: 'Human Development Index', slug: 'hdi', description: 'Composite index of life expectancy, education, and per capita income.', methodology: 'UNDP geometric mean of normalized life expectancy, education, and GNI indices.', category: soc, source: { name: 'UNDP', url: 'https://undp.org' }, unit: 'index', higherIsBetter: true },
    { name: 'Happiness Index', slug: 'happiness-index', description: 'World Happiness Report score based on life evaluations and wellbeing.', methodology: 'Gallup World Poll: Cantril ladder question averaged over 3 years.', category: soc, source: { name: 'UN Sustainable Development Solutions Network', url: 'https://worldhappiness.report' }, unit: 'score', higherIsBetter: true },
    { name: 'Education Index', slug: 'education-index', description: 'Composite measure of mean years of schooling and expected years of schooling.', methodology: 'UNDP education component of HDI. Normalized 0-1.', category: edu, source: { name: 'UNDP', url: 'https://undp.org' }, unit: 'index', higherIsBetter: true },
    { name: 'Healthcare Index', slug: 'healthcare-index', description: 'Measures healthcare infrastructure, physicians, and health outcomes.', methodology: 'Numbeo Healthcare Index based on surveys covering quality, doctors, and equipment.', category: health, source: { name: 'Numbeo', url: 'https://numbeo.com' }, unit: 'score', higherIsBetter: true },
    { name: 'Global Innovation Index', slug: 'global-innovation-index', description: 'Measures innovation capacity and outputs across 81 indicators.', methodology: 'WIPO composite of innovation inputs (institutions, human capital, infrastructure) and outputs.', category: tech, source: { name: 'WIPO', url: 'https://wipo.int' }, unit: 'score', higherIsBetter: true },
    { name: 'AI Readiness Index', slug: 'ai-readiness-index', description: 'Measures country readiness for AI adoption across government and economy.', methodology: 'Oxford Insights: Government Vision, Technology Sector, Data & Infrastructure, Government Capacity.', category: tech, source: { name: 'Oxford Insights', url: 'https://oxfordinsights.com' }, unit: 'score', higherIsBetter: true },
    { name: 'Corruption Perception Index', slug: 'corruption-perception-index', description: 'Measures perceived levels of public sector corruption.', methodology: 'Transparency International: composite of 13 expert assessments and business surveys.', category: gov, source: { name: 'Transparency International', url: 'https://transparency.org' }, unit: 'score', higherIsBetter: true },
    { name: 'E-Government Development Index', slug: 'e-government-development-index', description: 'Measures readiness and use of ICT in public administration.', methodology: 'UN DESA: composite of Online Service Index, Telecom Infrastructure, and Human Capital.', category: gov, source: { name: 'UN DESA', url: 'https://publicadministration.un.org' }, unit: 'index', higherIsBetter: true },
    { name: 'Environmental Performance Index', slug: 'environmental-performance-index', description: 'Quantitative gauge of a nation\'s environmental health and ecosystem vitality.', methodology: 'Yale University: 40 performance indicators across 11 issue categories.', category: env, source: { name: 'Yale University', url: 'https://epi.yale.edu' }, unit: 'score', higherIsBetter: true },
    { name: 'Global Peace Index', slug: 'global-peace-index', description: 'Measures the relative peacefulness of countries.', methodology: 'IEP: 23 qualitative and quantitative indicators. Lower score = more peaceful.', category: safety, source: { name: 'Institute for Economics & Peace', url: 'https://visionofhumanity.org' }, unit: 'score', higherIsBetter: false },
    { name: 'Gender Gap Index', slug: 'gender-gap-index', description: 'Measures gender parity across economic, educational, health, and political dimensions.', methodology: 'WEF: four sub-indexes averaged. Score 0 (inequality) to 1 (parity).', category: equality, source: { name: 'World Economic Forum', url: 'https://weforum.org' }, unit: 'index', higherIsBetter: true },
    { name: 'Press Freedom Index', slug: 'press-freedom-index', description: 'Evaluates press freedom conditions worldwide.', methodology: 'Reporters Without Borders: quantitative scoring based on pluralism, independence, safety.', category: gov, source: { name: 'Reporters Without Borders', url: 'https://rsf.org' }, unit: 'score', higherIsBetter: true }
  ];
};

// Country ranking data per indicator [rank, score] for 2023
const rankingData = {
  'gdp-rank':                    { IND:[5,3500],  USA:[1,27360], CHN:[2,17700], DEU:[3,4430], JPN:[4,4230], GBR:[6,3090], FRA:[7,2920], BRA:[8,2130], AUS:[12,1690], CAN:[9,2120] },
  'gdp-per-capita':              { IND:[130,2392], USA:[5,80030], CHN:[70,12720], DEU:[16,52820], JPN:[30,34017], GBR:[22,46125], FRA:[24,43659], BRA:[85,10296], AUS:[10,64491], CAN:[14,55522] },
  'gdp-growth-rate':             { IND:[6,7.2],  USA:[32,2.5], CHN:[25,5.2], DEU:[89,0.1], JPN:[72,1.9], GBR:[65,0.4], FRA:[45,0.9], BRA:[40,2.9], AUS:[37,2.0], CAN:[35,1.2] },
  'inflation-rate':              { IND:[95,5.4], USA:[60,4.1], CHN:[8,0.2],  DEU:[75,5.9], JPN:[62,3.1], GBR:[80,6.8], FRA:[68,4.9], BRA:[90,4.6], AUS:[55,4.4], CAN:[58,3.9] },
  'unemployment-rate':           { IND:[67,7.8], USA:[10,3.7], CHN:[5,5.1],  DEU:[22,3.0], JPN:[12,2.5], GBR:[18,4.2], FRA:[40,7.4], BRA:[55,7.8], AUS:[15,3.7], CAN:[25,5.7] },
  'hdi':                         { IND:[134,0.644], USA:[21,0.927], CHN:[79,0.788], DEU:[9,0.942], JPN:[19,0.920], GBR:[15,0.940], FRA:[28,0.903], BRA:[87,0.760], AUS:[10,0.946], CAN:[18,0.935] },
  'happiness-index':             { IND:[126,4.054], USA:[23,6.894], CHN:[60,5.818], DEU:[16,7.034], JPN:[47,6.129], GBR:[19,6.796], FRA:[24,6.661], BRA:[49,6.125], AUS:[12,7.095], CAN:[15,7.010] },
  'education-index':             { IND:[145,0.556], USA:[8,0.900], CHN:[85,0.706], DEU:[5,0.940], JPN:[15,0.880], GBR:[10,0.898], FRA:[20,0.867], BRA:[75,0.732], AUS:[6,0.929], CAN:[7,0.918] },
  'healthcare-index':            { IND:[112,41.2], USA:[30,69.5], CHN:[55,57.3], DEU:[7,81.6], JPN:[12,80.4], GBR:[18,75.0], FRA:[10,80.9], BRA:[62,52.1], AUS:[8,80.5], CAN:[22,71.3] },
  'global-innovation-index':     { IND:[40,38.5], USA:[3,64.2], CHN:[12,53.3], DEU:[9,58.2], JPN:[13,53.0], GBR:[4,60.0], FRA:[11,54.9], BRA:[49,33.1], AUS:[25,46.9], CAN:[15,52.1] },
  'ai-readiness-index':          { IND:[40,55.1], USA:[1,85.5], CHN:[5,72.1], DEU:[8,71.0], JPN:[11,68.9], GBR:[2,80.1], FRA:[6,71.7], BRA:[30,58.9], AUS:[7,71.5], CAN:[4,78.3] },
  'corruption-perception-index': { IND:[93,39],  USA:[24,69],  CHN:[76,42],  DEU:[9,78],   JPN:[18,73],  GBR:[20,71],  FRA:[21,71],  BRA:[104,36], AUS:[13,75],  CAN:[12,76] },
  'e-government-development-index': { IND:[105,0.589], USA:[10,0.910], CHN:[43,0.792], DEU:[15,0.880], JPN:[17,0.868], GBR:[7,0.940], FRA:[11,0.908], BRA:[50,0.773], AUS:[5,0.951], CAN:[6,0.942] },
  'environmental-performance-index': { IND:[176,18.9], USA:[43,51.1], CHN:[160,28.4], DEU:[13,77.2], JPN:[25,64.5], GBR:[11,77.7], FRA:[12,77.4], BRA:[34,54.1], AUS:[17,73.2], CAN:[49,51.0] },
  'global-peace-index':          { IND:[126,2.314], USA:[131,2.440], CHN:[80,1.988], DEU:[16,1.435], JPN:[9,1.336], GBR:[34,1.555], FRA:[67,1.849], BRA:[113,2.154], AUS:[22,1.512], CAN:[11,1.389] },
  'gender-gap-index':            { IND:[127,0.629], USA:[43,0.748], CHN:[107,0.678], DEU:[6,0.815], JPN:[125,0.647], GBR:[15,0.792], FRA:[40,0.756], BRA:[57,0.730], AUS:[26,0.772], CAN:[30,0.770] },
  'press-freedom-index':         { IND:[161,31.4], USA:[45,66.7], CHN:[179,23.8], DEU:[5,88.2], JPN:[68,55.6], GBR:[24,77.7], FRA:[26,77.1], BRA:[92,54.3], AUS:[27,77.0], CAN:[18,82.7] }
};

// Historical trend data (slight variation across 5 years)
const getHistoricalVariation = (base, isRank, year) => {
  const yearOffset = year - 2023;
  if (isRank) {
    // ranks improve (decrease) over years for India
    return Math.max(1, Math.round(base + yearOffset * (base > 50 ? -2 : -1)));
  }
  // scores improve slightly over years
  return parseFloat((base + yearOffset * base * 0.01).toFixed(3));
};

const years = [2019, 2020, 2021, 2022, 2023];

const aiInsights = [
  {
    scope: 'global',
    content: `India stands at a pivotal crossroads in global rankings. As the world's fifth-largest economy and most populous democracy, India demonstrates remarkable strengths in technology and economic growth while facing significant challenges in social development and environmental sustainability.\n\nIndia's GDP growth rate of 7.2% places it among the world's fastest-growing major economies, reflecting robust domestic consumption, digital transformation, and manufacturing expansion under the PLI scheme. The Global Innovation Index rank of 40th reflects India's growing tech ecosystem, with Bengaluru and Hyderabad emerging as global startup hubs.\n\nHowever, India's Human Development Index rank of 134th, Happiness Index rank of 126th, and Environmental Performance Index rank of 176th highlight urgent areas needing policy attention. Income inequality, healthcare access, and environmental degradation remain core challenges.`,
    recommendations: [
      'Accelerate investment in primary healthcare infrastructure to improve the Healthcare Index from rank 112 to top 80 within 5 years.',
      'Implement comprehensive environmental regulations targeting air quality, water management, and renewable energy transition to improve EPI rank from 176.',
      'Strengthen anti-corruption measures and judicial reforms to improve the Corruption Perception Index from rank 93.',
      'Bridge the gender gap through targeted policies in workforce participation and political representation to improve the Gender Gap Index.',
      'Expand social safety nets and rural development programs to uplift HDI from rank 134 toward top 100.'
    ]
  },
  { scope: 'economy', content: 'India\'s economy is the world\'s 5th largest by nominal GDP and 3rd by PPP. With a GDP growth rate of 7.2%, India leads among G20 nations. However, high inflation (5.4%) and unemployment (7.8%) remain concerns. The services sector, especially IT, drives growth while manufacturing is expanding under Make in India initiatives.', recommendations: ['Reduce inflation through monetary tightening and supply-side reforms.', 'Create 10 million formal jobs annually through PLI scheme expansion.', 'Diversify exports beyond IT services to manufacturing and pharmaceuticals.', 'Improve ease of doing business to attract FDI and boost GDP per capita.'] },
  { scope: 'society', content: 'India\'s Human Development Index of 0.644 (rank 134) reflects improvements in life expectancy and literacy, but income inequality and poverty remain barriers. The Happiness Index score of 4.054 (rank 126) indicates dissatisfaction driven by economic stress and social inequality.', recommendations: ['Launch universal basic income pilots in high-poverty districts.', 'Expand MGNREGS and PM-KISAN to improve rural livelihoods.', 'Invest in mental health infrastructure and social support systems.'] },
  { scope: 'governance', content: 'India\'s governance indicators present a mixed picture. The CPI rank of 93rd highlights corruption challenges while the E-Government rank of 105th reflects growing digital governance. Press freedom at rank 161 is a concern for democratic health.', recommendations: ['Strengthen independent anti-corruption agencies with prosecutorial power.', 'Accelerate Digital India e-governance services to improve EGDI rank.', 'Protect media freedom and repeal restrictive press regulations.'] },
  { scope: 'technology', content: 'India\'s Global Innovation Index rank of 40th and AI Readiness rank of 40th reflect a strong tech sector. India produces the most engineering graduates globally and has the world\'s third-largest startup ecosystem. UPI\'s success showcases digital infrastructure excellence.', recommendations: ['Increase R&D spending from 0.7% to 2% of GDP to match innovation leaders.', 'Establish National AI Mission with dedicated compute infrastructure.', 'Expand startup incubators beyond metros to tier-2 cities.'] },
  { scope: 'education', content: 'The Education Index rank of 145th reflects gaps in learning outcomes despite high enrollment. The NEP 2020 aims to transform the system, but teacher quality, infrastructure, and dropout rates remain challenges especially in rural areas.', recommendations: ['Implement NEP 2020 fully with focus on foundational literacy by 2025.', 'Increase education budget from 3% to 6% of GDP.', 'Deploy EdTech solutions to reach 250 million students in rural areas.'] },
  { scope: 'healthcare', content: 'India\'s Healthcare Index rank of 112th highlights underfunding and access disparities. Public health spending at 1.2% of GDP is among the lowest globally. Ayushman Bharat is a positive step but implementation gaps persist.', recommendations: ['Increase public health spending to 2.5% of GDP by 2025.', 'Build 150,000 Health and Wellness Centres under Ayushman Bharat.', 'Expand telemedicine infrastructure for rural healthcare access.'] },
  { scope: 'environment', content: 'India\'s Environmental Performance Index rank of 176th is alarming. Air quality in major cities is among the world\'s worst. However, India has made significant renewable energy commitments with 500GW target by 2030.', recommendations: ['Accelerate coal phase-out and renewable energy deployment.', 'Implement strict vehicle emission standards and promote EVs.', 'Restore degraded forest cover under Green India Mission.'] },
  { scope: 'safety', content: 'India\'s Global Peace Index rank of 126th reflects internal conflict concerns, border tensions, and crime rates. However, large-scale terrorism has decreased significantly. Internal security spending remains high.', recommendations: ['Invest in conflict resolution in northeastern states and J&K.', 'Modernize police forces with community policing models.', 'Strengthen bilateral peace initiatives with neighboring countries.'] },
  { scope: 'equality', content: 'India\'s Gender Gap Index rank of 127th reflects persistent inequality in labor force participation (20% for women), political representation (15%), and healthcare. However, girl child education enrollment has improved significantly.', recommendations: ['Introduce 33% women\'s reservation in parliament and state legislatures.', 'Launch national childcare infrastructure to enable female workforce participation.', 'Enforce equal pay legislation with corporate compliance audits.'] }
];

const newsData = [
  { headline: 'India Climbs to 40th in Global Innovation Index 2023', summary: 'India has made significant strides in innovation, moving up from 81st in 2015 to 40th in 2023, driven by its thriving startup ecosystem and digital infrastructure.', content: 'India\'s rise in the Global Innovation Index reflects massive investments in digital infrastructure, education, and the startup ecosystem. With over 100 unicorns and the world\'s second-largest internet user base, India is increasingly recognized as a global innovation powerhouse.', sourceName: 'WIPO', sourceUrl: 'https://wipo.int', publishedAt: new Date('2023-09-27') },
  { headline: 'India GDP Growth at 7.2% – Fastest Among G20 Nations', summary: 'India continues to lead global growth with a 7.2% GDP expansion in FY2023-24, outpacing all other G20 economies amid global slowdown.', content: 'The World Bank and IMF both project India as the fastest-growing large economy in 2023-24. Services exports, domestic consumption, and government capital expenditure are key drivers.', sourceName: 'World Bank', sourceUrl: 'https://worldbank.org', publishedAt: new Date('2023-11-15') },
  { headline: 'India Ranks 176th on Environmental Performance Index – Urgent Action Needed', summary: 'Yale\'s Environmental Performance Index 2022 places India at 176th, with poor scores on air quality and water management calling for immediate environmental reforms.', content: 'India\'s EPI rank highlights severe air pollution challenges, deforestation, and water stress. Experts call for accelerating the renewable energy transition and enforcing environmental regulations more strictly.', sourceName: 'Yale EPI', sourceUrl: 'https://epi.yale.edu', publishedAt: new Date('2023-08-10') },
  { headline: 'India\'s HDI Improves to 0.644 but Rank Stays at 134', summary: 'India\'s Human Development Index improved for the 30th consecutive year but global ranking stagnation reflects faster progress in peer nations.', content: 'UNDP\'s Human Development Report shows India\'s HDI reaching 0.644, reflecting improvements in life expectancy (67.2 years) and education. However, income inequality remains a key drag on ranking progress.', sourceName: 'UNDP', sourceUrl: 'https://undp.org', publishedAt: new Date('2023-09-13') },
  { headline: 'UPI Transactions Cross 10 Billion Monthly – India Leads Digital Payments Globally', summary: 'India\'s Unified Payments Interface processed over 10 billion transactions in October 2023, cementing India\'s position as the global leader in real-time digital payments.', content: 'UPI\'s success is a model for financial inclusion globally. Over 300 million Indians now use digital payments daily. The government\'s push to internationalize UPI is gaining momentum across Southeast Asia and the Gulf.', sourceName: 'NPCI', sourceUrl: 'https://npci.org.in', publishedAt: new Date('2023-11-01') },
  { headline: 'India\'s Gender Gap Index Rank at 127 – Progress Needed in Labour Participation', summary: 'WEF\'s Gender Gap Report 2023 ranks India 127th, with female labour force participation at 20% remaining a critical barrier to closing the gender gap.', content: 'India has improved in political empowerment sub-index following the Women\'s Reservation Bill passage, but economic participation remains the weakest dimension. Childcare infrastructure and skill training are identified as priority interventions.', sourceName: 'World Economic Forum', sourceUrl: 'https://weforum.org', publishedAt: new Date('2023-06-20') },
  { headline: 'India Moves Up in AI Government Readiness Index to 40th Place', summary: 'Oxford Insights ranks India 40th in Government AI Readiness, reflecting growing investments in AI policy, digital infrastructure, and talent development.', content: 'India\'s National AI Strategy and INDIAai platform are driving government AI readiness. Investments in compute infrastructure, AI skilling through NASSCOM, and regulatory frameworks position India for further improvements.', sourceName: 'Oxford Insights', sourceUrl: 'https://oxfordinsights.com', publishedAt: new Date('2023-10-05') }
];

/**
 * Seed the database with initial data.
 * Only runs if collections are empty.
 */
const seedDB = async () => {
  try {
    const [cCount, catCount, indCount] = await Promise.all([
      Country.countDocuments(),
      Category.countDocuments(),
      Indicator.countDocuments()
    ]);

    if (cCount > 0 && catCount > 0 && indCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Clear existing data
    await Promise.all([
      Country.deleteMany({}), Category.deleteMany({}), Indicator.deleteMany({}),
      Ranking.deleteMany({}), HistoricalData.deleteMany({}), News.deleteMany({}),
      AIInsightsCache.deleteMany({}), User.deleteMany({})
    ]);

    // Insert countries and categories
    const insertedCountries = await Country.insertMany(countries);
    const insertedCategories = await Category.insertMany(categories);

    // Insert indicators
    const indicatorDefs = getIndicators(insertedCategories);
    const insertedIndicators = await Indicator.insertMany(indicatorDefs);

    // Build lookup maps
    const countryMap = {};
    insertedCountries.forEach(c => { countryMap[c.code] = c._id; });
    const indicatorMap = {};
    insertedIndicators.forEach(i => { indicatorMap[i.slug] = i._id; });

    // Insert rankings and historical data
    const rankingDocs = [];
    const historicalDocs = [];

    for (const [slug, countryData] of Object.entries(rankingData)) {
      const indicatorId = indicatorMap[slug];
      if (!indicatorId) continue;

      for (const [code, [rank, score]] of Object.entries(countryData)) {
        const countryId = countryMap[code];
        if (!countryId) continue;

        // Latest year ranking
        rankingDocs.push({
          indicator: indicatorId, country: countryId, year: 2023,
          rank, score, totalCountries: 195
        });

        // Historical data points
        const dataPoints = years.map(year => ({
          year,
          rank: getHistoricalVariation(rank, true, year),
          score: getHistoricalVariation(score, false, year)
        }));

        historicalDocs.push({ indicator: indicatorId, country: countryId, dataPoints });
      }
    }

    await Ranking.insertMany(rankingDocs, { ordered: false }).catch(() => {});
    await HistoricalData.insertMany(historicalDocs, { ordered: false }).catch(() => {});

    // Insert news
    await News.insertMany(newsData);

    // Insert AI insights cache (valid for 30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await AIInsightsCache.insertMany(
      aiInsights.map(a => ({ ...a, generatedAt: new Date(), expiresAt }))
    );

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@indialens.in',
      password: 'Admin@2026',
      role: 'admin'
    });
    await admin.save();

    // Create sample user
    const user = new User({
      username: 'demo',
      email: 'demo@indialens.in',
      password: 'Demo@2026',
      role: 'user'
    });
    await user.save();

    console.log(`✅ Database seeded: ${insertedCountries.length} countries, ${insertedCategories.length} categories, ${insertedIndicators.length} indicators`);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedDB;
